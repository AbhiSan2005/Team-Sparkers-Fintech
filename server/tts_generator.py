import sys
import torch
from TTS.api import TTS
import os
import re

class BankingTTSGenerator:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {self.device}")
        
        # Initialize TTS model
        try:
            self.tts = TTS("tts_models/en/ljspeech/fast_pitch").to(self.device)
        except Exception as e:
            print(f"Error initializing TTS: {e}")
            sys.exit(1)

    def format_banking_text(self, text, text_type):
        """Format text based on banking context"""
        
        # Currency formatting
        text = re.sub(r'\$(\d+\.?\d*)', r'\1 dollars', text)
        text = re.sub(r'(\d+\.\d{2})', r'\1', text)  # Keep decimal format
        
        # Account number formatting (speak digits separately)
        text = re.sub(r'(\d{4,})', lambda m: ' '.join(m.group(1)), text)
        
        # Banking-specific prefixes
        prefixes = {
            'balance': 'Account information: ',
            'transaction': 'Transaction update: ',
            'security': 'Important security notice: ',
            'payment': 'Payment confirmation: ',
            'transfer': 'Transfer confirmation: ',
            'welcome': '',
            'general': ''
        }
        
        prefix = prefixes.get(text_type, '')
        return prefix + text

    def generate_audio(self, text, output_path, text_type='general', language='en'):
        """Generate audio file from text"""
        try:
            # Format text for better speech
            formatted_text = self.format_banking_text(text, text_type)
            
            print(f"Generating audio for: {formatted_text}")
            print(f"Output path: {output_path}")
            
            # Generate audio
            self.tts.tts_to_file(text=formatted_text, file_path=output_path)
            
            print(f"Audio generated successfully: {output_path}")
            return True
            
        except Exception as e:
            print(f"Error generating audio: {e}")
            return False

def main():
    if len(sys.argv) < 3:
        print("Usage: python tts_generator.py <text> <output_path> [type] [language]")
        sys.exit(1)
    
    text = sys.argv[1]
    output_path = sys.argv[2]
    text_type = sys.argv[3] if len(sys.argv) > 3 else 'general'
    language = sys.argv[4] if len(sys.argv) > 4 else 'en'
    
    generator = BankingTTSGenerator()
    success = generator.generate_audio(text, output_path, text_type, language)
    
    if success:
        print("SUCCESS")
    else:
        print("FAILED")
        sys.exit(1)

if __name__ == "__main__":
    main()
