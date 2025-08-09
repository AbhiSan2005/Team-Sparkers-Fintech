from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import pyaudio
import wave
import tempfile
import os
import threading
import time

app = Flask(__name__)
CORS(app)

# Load Whisper model once at startup
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Model loaded successfully!")

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
            audio_file.save(tmp_file.name)
            
            # Use faster model for real-time processing
            result = model.transcribe(
                tmp_file.name,
                fp16=False,  # Faster processing
                language='en',  # Skip language detection
                initial_prompt="Banking voice assistant"  # Context for better accuracy
            )
            text = result["text"].strip()
            
            os.unlink(tmp_file.name)
            
            return jsonify({
                'success': True,
                'text': text,
                'confidence': result.get('confidence', 0.9),
                'is_partial': len(text.split()) < 5
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Voice service running'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)