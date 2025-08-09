const express = require('express');
const cors = require('cors');
const path = require('path');
const { PythonShell } = require('python-shell');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/audio', express.static(path.join(__dirname, 'audio_output')));

// Ensure audio output directory exists
const audioDir = path.join(__dirname, 'audio_output');
fs.ensureDirSync(audioDir);

// TTS API endpoint
app.post('/api/tts', async (req, res) => {
    try {
        const { text, type = 'general', language = 'en' } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const audioId = uuidv4();
        const fileName = `banking_${type}_${audioId}.wav`;
        const outputPath = path.join(audioDir, fileName);

        // Python script options
        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: __dirname,
            args: [text, outputPath, type, language]
        };

        // Run Python TTS script
        PythonShell.run('tts_generator.py', options, (err, results) => {
            if (err) {
                console.error('Python script error:', err);
                return res.status(500).json({ error: 'TTS generation failed' });
            }

            res.json({
                success: true,
                audioId: audioId,
                audioUrl: `/audio/${fileName}`,
                fileName: fileName
            });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get banking-specific TTS templates
app.get('/api/tts/templates', (req, res) => {
    const templates = {
        balance: "Your {accountType} account balance is ${amount}",
        transaction: "You have successfully {action} ${amount} {details}",
        security: "Security alert: {message}. Please review your account.",
        welcome: "Welcome to {bankName}. How can we assist you today?",
        payment: "Payment of ${amount} to {recipient} has been processed successfully",
        transfer: "Transfer of ${amount} from {fromAccount} to {toAccount} completed"
    };
    
    res.json(templates);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', service: 'Banking TTS API' });
});

app.listen(PORT, () => {
    console.log(`Banking TTS Server running on port ${PORT}`);
});
