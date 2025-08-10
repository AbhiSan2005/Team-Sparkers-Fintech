from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile
import logging
import torch
from faster_whisper import WhisperModel
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Enhanced model configuration
class WhisperBackend:
    def __init__(self):
        self.model = None
        self.model_type = "faster-whisper"  # Use faster-whisper for better performance
        self.model_size = "medium"  # Balance between speed and accuracy
        self.device = self._get_optimal_device()
        self.supported_languages = self._load_supported_languages()
        self._load_model()
    
    def _get_optimal_device(self):
        """Determine the best device for processing"""
        if torch.cuda.is_available():
            return "cuda"
        elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
            return "mps"  # Apple Silicon
        else:
            return "cpu"
    
    def _load_supported_languages(self):
        """Load supported languages list"""
        # Whisper's top supported languages with their codes
        return {
            'en': 'English', 'zh': 'Chinese', 'de': 'German', 'es': 'Spanish',
            'ru': 'Russian', 'ko': 'Korean', 'fr': 'French', 'ja': 'Japanese',
            'pt': 'Portuguese', 'tr': 'Turkish', 'pl': 'Polish', 'ca': 'Catalan',
            'nl': 'Dutch', 'ar': 'Arabic', 'sv': 'Swedish', 'it': 'Italian',
            'id': 'Indonesian', 'hi': 'Hindi', 'fi': 'Finnish', 'vi': 'Vietnamese'
        }
    
    def _load_model(self):
        """Load the Whisper model with optimizations"""
        try:
            logger.info(f"Loading {self.model_type} model '{self.model_size}' on {self.device}")
            
            if self.model_type == "faster-whisper":
                # Use faster-whisper for better performance
                compute_type = "float16" if self.device == "cuda" else "int8"
                self.model = WhisperModel(
                    self.model_size, 
                    device=self.device, 
                    compute_type=compute_type,
                    cpu_threads=4  # Optimize for CPU performance
                )
            else:
                # Fallback to standard whisper
                self.model = whisper.load_model(self.model_size, device=self.device)
                
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            self.model = None

    def transcribe_audio(self, audio_path, language=None, task="transcribe", 
                        temperature=0.0, word_timestamps=False, prompt=None):
        """
        Enhanced transcription with multiple options
        
        Args:
            audio_path: Path to audio file
            language: Target language code (auto-detect if None)
            task: "transcribe" or "translate" (to English)
            temperature: Controls randomness (0.0 = deterministic)
            word_timestamps: Include word-level timestamps
            prompt: Context prompt to improve accuracy
        """
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
                    vad_filter=True,  # Voice activity detection
                    vad_parameters=dict(min_silence_duration_ms=500)
                )
                
                # Extract results
                text = " ".join([segment.text for segment in segments])
                language_detected = info.language
                confidence = info.language_probability
                
            else:
                # Standard whisper
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
                confidence = 0.0  # Standard whisper doesn't provide confidence
            
            processing_time = time.time() - start_time
            
            return {
                'success': True,
                'text': text.strip(),
                'language': language_detected,
                'language_name': self.supported_languages.get(language_detected, 'Unknown'),
                'confidence': confidence,
                'task': task,
                'processing_time': round(processing_time, 2)
            }
            
        except Exception as e:
            logger.error(f"Transcription failed: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

# Initialize backend
whisper_backend = WhisperBackend()

@app.route('/health', methods=['GET'])
def health_check():
    """Enhanced health check with system info"""
    try:
        status = {
            'status': 'healthy' if whisper_backend.model is not None else 'unhealthy',
            'model_loaded': whisper_backend.model is not None,
            'model_size': whisper_backend.model_size,
            'device': whisper_backend.device,
            'supported_languages_count': len(whisper_backend.supported_languages),
            'cuda_available': torch.cuda.is_available(),
            'timestamp': str(time.time())
        }
        return jsonify(status)
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

@app.route('/languages', methods=['GET'])
def get_supported_languages():
    """Get list of supported languages"""
    return jsonify({
        'supported_languages': whisper_backend.supported_languages,
        'total_count': len(whisper_backend.supported_languages)
    })

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """Enhanced transcription endpoint with multiple options"""
    logger.info("=== TRANSCRIBE REQUEST START ===")
    
    try:
        if whisper_backend.model is None:
            return jsonify({
                'success': False,
                'error': 'Whisper model not loaded'
            }), 500
        
        if 'audio' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No audio file provided'
            }), 400
        
        audio_file = request.files['audio']
        
        # Get optional parameters
        target_language = request.form.get('language', None)  # Auto-detect if None
        task = request.form.get('task', 'transcribe')  # transcribe or translate
        word_timestamps = request.form.get('word_timestamps', 'false').lower() == 'true'
        prompt = request.form.get('prompt', None)  # Context prompt for better accuracy
        
        logger.info(f"Parameters: language={target_language}, task={task}, timestamps={word_timestamps}")
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            temp_filename = temp_file.name
            audio_file.save(temp_filename)
            logger.info(f"Audio saved: {os.path.getsize(temp_filename)} bytes")
        
        try:
            # Transcribe with enhanced options
            result = whisper_backend.transcribe_audio(
                temp_filename,
                language=target_language,
                task=task,
                word_timestamps=word_timestamps,
                prompt=prompt
            )
            
            logger.info(f"Transcription result: {result}")
            return jsonify(result)
            
        finally:
            # Clean up
            if os.path.exists(temp_filename):
                os.unlink(temp_filename)
    
    except Exception as e:
        logger.error(f"Error in transcribe_audio: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500
    
    finally:
        logger.info("=== TRANSCRIBE REQUEST END ===")

@app.route('/translate', methods=['POST'])
def translate_audio():
    """Dedicated endpoint for translation to English"""
    # Modify request to force translation task
    original_task = request.form.get('task')
    request.form = request.form.copy()
    request.form['task'] = 'translate'
    
    return transcribe_audio()

if __name__ == '__main__':
    logger.info("Starting enhanced multilingual voice backend...")
    logger.info(f"Device: {whisper_backend.device}")
    logger.info(f"Model: {whisper_backend.model_size}")
    logger.info(f"Supported languages: {len(whisper_backend.supported_languages)}")
    
    app.run(host='localhost', port=5001, debug=True, threaded=True)