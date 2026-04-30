from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time

# Try to import faster-whisper, fallback to regular whisper
try:
    from faster_whisper import WhisperModel
    USE_FASTER_WHISPER = True
    print("Using Faster-Whisper for better performance")
except ImportError:
    import whisper
    USE_FASTER_WHISPER = False
    print("Using standard Whisper (install faster-whisper for better performance)")

app = Flask(__name__)
CORS(app)

# Load model at startup
print("Loading Whisper model...")
if USE_FASTER_WHISPER:
    # Using Faster-Whisper
    model = WhisperModel("small", device="cpu", compute_type="int8")
    print("Faster-Whisper 'small' model loaded successfully!")
else:
    # Using standard Whisper
    model = whisper.load_model("small")
    print("Standard Whisper 'small' model loaded successfully!")

@app.route('/api/process', methods=['POST'])
def transcribe():
    start_time = time.time()
    
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save the uploaded audio file
        audio_path = "temp_audio.wav"
        audio_file.save(audio_path)
        print(f"Audio file saved: {audio_path}")
        
        # Transcribe using the appropriate model
        if USE_FASTER_WHISPER:
            segments, info = model.transcribe(audio_path, beam_size=5)
            transcript = " ".join(segment.text for segment in segments)
        else:
            result = model.transcribe(audio_path)
            transcript = result["text"]
        
        # Clean up the temp file
        try:
            os.remove(audio_path)
        except:
            pass
        
        processing_time = time.time() - start_time
        print(f"Transcription completed in {processing_time:.2f} seconds")
        print(f"Transcript: {transcript}")
        
        return jsonify({
         "source_text": transcript.strip(),
         "translated_text": transcript.strip(),  # temporary (same text)
        "audio_url": None
      })
        
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        return jsonify({'error': f'Transcription failed: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Flask backend is running!', 'model': 'whisper-small'})

if __name__ == "__main__":
    print("Starting Flask server on https://0.0.0.0:5001")
    print("Endpoints:")
    print("  POST /api/process - Upload audio for transcription")
    print("  GET  /health     - Check server status")
    app.run(host="0.0.0.0", port=5001, debug=True)
