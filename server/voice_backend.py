from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile
import logging

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load Whisper model
logger.info("Loading Whisper model...")
try:
    model = whisper.load_model("base")
    logger.info("Whisper model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {str(e)}")
    model = None

@app.route('/health', methods=['GET'])
def health_check():
    logger.debug("Health check endpoint called")
    try:
        status = {
            'status': 'healthy',
            'whisper_model_loaded': model is not None,
            'timestamp': str(os.times())
        }
        logger.info(f"Health check response: {status}")
        return jsonify(status)
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    logger.info("=== TRANSCRIBE REQUEST START ===")
    
    try:
        # Debug request info
        logger.debug(f"Request method: {request.method}")
        logger.debug(f"Request headers: {dict(request.headers)}")
        logger.debug(f"Request files: {list(request.files.keys())}")
        logger.debug(f"Request form: {dict(request.form)}")
        
        # Check if model is loaded
        if model is None:
            logger.error("Whisper model not loaded")
            return jsonify({
                'success': False,
                'error': 'Whisper model not loaded'
            }), 500
        
        # Check if audio file is in request
        if 'audio' not in request.files:
            logger.error("No audio file in request")
            return jsonify({
                'success': False,
                'error': 'No audio file provided'
            }), 400
        
        audio_file = request.files['audio']
        logger.info(f"Received audio file: {audio_file.filename}")
        logger.debug(f"Audio file content type: {audio_file.content_type}")
        logger.debug(f"Audio file size: {len(audio_file.read())} bytes")
        audio_file.seek(0)  # Reset file pointer after reading size
        
        if audio_file.filename == '':
            logger.error("Empty filename in audio file")
            return jsonify({
                'success': False,
                'error': 'No audio file selected'
            }), 400
        
        # Save temporary file
        logger.debug("Creating temporary file...")
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            temp_filename = temp_file.name
            audio_file.save(temp_filename)
            logger.info(f"Audio saved to temporary file: {temp_filename}")
            logger.debug(f"Temp file size: {os.path.getsize(temp_filename)} bytes")
        
        try:
            # Transcribe audio
            logger.info("Starting transcription with Whisper...")
            result = model.transcribe(temp_filename)
            logger.info("Transcription completed successfully")
            
            # Debug transcription results
            logger.debug(f"Raw Whisper result keys: {result.keys()}")
            logger.debug(f"Transcribed text: '{result['text']}'")
            logger.debug(f"Language detected: {result.get('language', 'unknown')}")
            
            # Get confidence score (average of all segments)
            segments = result.get('segments', [])
            if segments:
                confidence = sum(segment.get('avg_logprob', 0) for segment in segments) / len(segments)
                confidence = max(0, min(1, (confidence + 1) / 2))  # Normalize to 0-1 range
                logger.debug(f"Calculated confidence: {confidence}")
            else:
                confidence = 0.0
                logger.warning("No segments found in transcription result")
            
            response_data = {
                'success': True,
                'text': result['text'].strip(),
                'confidence': confidence,
                'language': result.get('language', 'unknown'),
                'segments_count': len(segments)
            }
            
            logger.info(f"Transcription response: {response_data}")
            return jsonify(response_data)
            
        except Exception as transcription_error:
            logger.error(f"Transcription failed: {str(transcription_error)}")
            logger.error(f"Transcription error type: {type(transcription_error)}")
            return jsonify({
                'success': False,
                'error': f'Transcription failed: {str(transcription_error)}'
            }), 500
            
        finally:
            # Clean up temporary file
            try:
                if os.path.exists(temp_filename):
                    os.unlink(temp_filename)
                    logger.debug(f"Temporary file deleted: {temp_filename}")
            except Exception as cleanup_error:
                logger.warning(f"Failed to delete temporary file: {str(cleanup_error)}")
    
    except Exception as e:
        logger.error(f"General error in transcribe_audio: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500
    
    finally:
        logger.info("=== TRANSCRIBE REQUEST END ===\n")

@app.route('/debug/info', methods=['GET'])
def debug_info():
    """Debug endpoint to check server status"""
    logger.debug("Debug info endpoint called")
    try:
        import whisper
        available_models = whisper.available_models()
        
        info = {
            'whisper_available': True,
            'whisper_models': list(available_models),
            'current_model_loaded': model is not None,
            'temp_dir': tempfile.gettempdir(),
            'server_status': 'running'
        }
        logger.info(f"Debug info: {info}")
        return jsonify(info)
    except Exception as e:
        logger.error(f"Debug info failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask voice backend server...")
    logger.info("Server configuration:")
    logger.info("- Host: localhost")
    logger.info("- Port: 5001")
    logger.info("- Debug mode: True")
    logger.info("- CORS enabled for all origins")
    
    app.run(host='localhost', port=5001, debug=True)