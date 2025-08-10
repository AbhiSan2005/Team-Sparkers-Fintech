from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import logging
import time
import requests
import torch
from faster_whisper import WhisperModel
import whisper

# =========================
# In-memory storage for all queries
# =========================
transcript_queries = []  # List of dicts: {timestamp, text}

def store_transcript_query(text):
    """Store transcript in memory with timestamp, keep last 100"""
    transcript_queries.append({
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "text": text
    })
    if len(transcript_queries) > 100:
        transcript_queries.pop(0)

# =========================
# Logging setup
# =========================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Allow frontend requests (adjust in production)

# =========================
# Local Rasa configuration
# =========================
RASA_URL = "http://localhost:5005/webhooks/rest/webhook"  # REST endpoint
RASA_SENDER_ID = "voice-user"  # Any constant or session-based ID

def send_to_rasa(text):
    """Send transcription text directly to locally running Rasa bot"""
    try:
        payload = {"sender": RASA_SENDER_ID, "message": text}
        logger.info(f"Sending to Rasa: {payload}")
        resp = requests.post(RASA_URL, json=payload, timeout=5)
        if resp.status_code == 200:
            rasa_response = resp.json()
            logger.info(f"Rasa reply: {rasa_response}")
            return rasa_response
        else:
            err_msg = f"Error from Rasa ({resp.status_code}): {resp.text}"
            logger.error(err_msg)
            return [{"text": err_msg}]
    except Exception as e:
        err_msg = f"Error contacting Rasa: {e}"
        logger.error(err_msg)
        return [{"text": err_msg}]

# =========================
# Whisper speech-to-text backend
# =========================
class WhisperBackend:
    def __init__(self):
        self.model_type = "faster-whisper"  # or "whisper"
        self.model_size = "small"  # adjust as needed
        self.device = self._get_optimal_device()
        self.supported_languages = self._load_supported_languages()
        self.model = None
        self._load_model()

    def _get_optimal_device(self):
        if torch.cuda.is_available():
            return "cuda"
        elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
            return "mps"
        else:
            return "cpu"

    def _load_supported_languages(self):
        return {
            'en': 'English', 'zh': 'Chinese', 'de': 'German', 'es': 'Spanish',
            'ru': 'Russian', 'ko': 'Korean', 'fr': 'French', 'ja': 'Japanese',
            'pt': 'Portuguese', 'tr': 'Turkish', 'pl': 'Polish', 'ca': 'Catalan',
            'nl': 'Dutch', 'ar': 'Arabic', 'sv': 'Swedish', 'it': 'Italian',
            'id': 'Indonesian', 'hi': 'Hindi', 'fi': 'Finnish', 'vi': 'Vietnamese'
        }

    def _load_model(self):
        try:
            logger.info(f"Loading {self.model_type} model '{self.model_size}' on {self.device}")
            if self.model_type == "faster-whisper":
                compute_type = "float16" if self.device == "cuda" else "int8"
                self.model = WhisperModel(
                    self.model_size,
                    device=self.device,
                    compute_type=compute_type,
                    cpu_threads=4
                )
            else:
                self.model = whisper.load_model(self.model_size, device=self.device)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            self.model = None

    def transcribe_audio(self, audio_path, language=None, task="transcribe",
                         temperature=0.0, word_timestamps=False, prompt=None):
        """Transcribe audio file and return structured data"""
        try:
            start_time = time.time()
            if self.model_type == "faster-whisper":
                segments, info = self.model.transcribe(
                    audio_path,
                    language=language,
                    task=task,
                    temperature=temperature,
                    word_timestamps=word_timestamps,
                    initial_prompt=prompt,
                    vad_filter=True,
                    vad_parameters=dict(min_silence_duration_ms=500)
                )
                text = " ".join([seg.text for seg in segments])
                language_detected = info.language
                confidence = info.language_probability
            else:
                result = self.model.transcribe(
                    audio_path,
                    language=language,
                    task=task,
                    temperature=temperature,
                    word_timestamps=word_timestamps,
                    initial_prompt=prompt
                )
                text = result['text']
                language_detected = result['language']
                confidence = 0.0

            elapsed = round(time.time() - start_time, 2)
            return {
                "success": True,
                "text": text.strip(),
                "language": language_detected,
                "language_name": self.supported_languages.get(language_detected, "Unknown"),
                "confidence": confidence,
                "task": task,
                "processing_time": elapsed
            }
        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            return {"success": False, "error": str(e)}

# =========================
# Initialize backend
# =========================
whisper_backend = WhisperBackend()

# =========================
# Routes
# =========================
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy" if whisper_backend.model is not None else "unhealthy",
        "model_loaded": whisper_backend.model is not None,
        "model_size": whisper_backend.model_size,
        "device": whisper_backend.device,
        "supported_languages_count": len(whisper_backend.supported_languages)
    })

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    logger.info("=== TRANSCRIBE REQUEST START ===")
    try:
        if whisper_backend.model is None:
            return jsonify({"success": False, "error": "Whisper model not loaded"}), 500

        if "audio" not in request.files:
            return jsonify({"success": False, "error": "No audio file provided"}), 400

        audio_file = request.files["audio"]
        target_language = request.form.get("language", None)
        task = request.form.get("task", "transcribe")
        word_timestamps = request.form.get("word_timestamps", "false").lower() == "true"
        prompt = request.form.get("prompt", None)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_filename = temp_file.name
            audio_file.save(temp_filename)
            logger.info(f"Saved audio: {os.path.getsize(temp_filename)} bytes")

        try:
            # Step 1: Transcribe locally
            result = whisper_backend.transcribe_audio(
                temp_filename,
                language=target_language,
                task=task,
                word_timestamps=word_timestamps,
                prompt=prompt
            )

            # Step 2: Send to Rasa if transcription succeeded
            if result.get("success") and result.get("text"):
                store_transcript_query(result["text"])
                rasa_reply = send_to_rasa(result["text"])
                result["rasa_reply"] = rasa_reply

            return jsonify(result)
        finally:
            if os.path.exists(temp_filename):
                os.unlink(temp_filename)

    except Exception as e:
        logger.error(f"Error in /transcribe: {e}")
        return jsonify({"success": False, "error": f"Server error: {e}"}), 500
    finally:
        logger.info("=== TRANSCRIBE REQUEST END ===")

@app.route("/recent_queries", methods=["GET"])
def get_recent_queries():
    return jsonify({"success": True, "queries": transcript_queries[-10:][::-1]})

@app.route("/last_query", methods=["GET"])
def get_last_query():
    if transcript_queries:
        return jsonify({"success": True, "query": transcript_queries[-1]})
    else:
        return jsonify({"success": False, "error": "No queries found"}), 404

# =========================
# Run Local Flask App
# =========================
if __name__ == "__main__":
    logger.info("Starting local voice backend with direct Rasa integration...")
    logger.info(f"Device: {whisper_backend.device}")
    app.run(host="localhost", port=5001, debug=True, threaded=True)
