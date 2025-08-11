#  Team-Sparkers-Fintech

A Web-App developed during the 36-hour Finspark Hackathon organized by Bank of Maharashtra.

##  Overview

A modern, multilingual fintech application tailored for the Bank of Maharashtra. Features include:

-  **Multilingual Support**: English, Hindi, Marathi, Bengali, Telugu, Tamil, Kannada  
-  **AI-Powered Voice Assistant**: Speech-to-text and text-to-speech functionality  
-  **Interactive Branch Locator**: Real-time maps showcasing 75+ Maharashtra branches  
-  **Intelligent Chat Support**: 24/7 AI-powered chatbot  
-  **Security & Accessibility**: Biometric authentication and WCAG-compliant UI

##  Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Leaflet
- **Backend**: Node.js & Express; Python Flask
- **Voice Tech**: OpenAI Whisper, Web Speech API

##  Local Development Setup

### Prerequisites
- Node.js
- npm
- Python 3.10
- Rasa

### 1. Clone the repo

```bash
git clone https://github.com/AbhiSan2005/Team-Sparkers-Fintech.git
cd Team-Sparkers-Fintech
```

### 2. Install dependencies
```bash
# Frontend
npm install
cd client
npm install

# Backend
cd ../server
npm install
pip install rasa
```

### 3. Train the Model
```bash
python -m venv rasa_env
rasa_env\Scripts\activate
rasa train
```

### 4. Run the services

## In separate terminals:
Keep the rasa terminal running

```bash
cd client
npm run dev

cd ../server
python voice_backend.py
```

##Team-Members: 
1. **[Karan Ahuja](https://github.com/Karan-30506)**
2. **[Dhruv Agarwal](https://github.com/MrPeculiar123)**
3. **[Abhiraj Sankpal](https://github.com/AbhiSan2005)**
4. **[Krishna Warfade](https://github.com/krishna-warfade)**

