const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  try {
    // Try multiple LibreTranslate instances
    const libretranslateUrls = [
      'https://libretranslate.de/translate',
      'https://translate.argosopentech.com/translate',
      'https://libretranslate.com/translate'
    ];

    let lastError;
    
    for (const url of libretranslateUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body)
        });

        if (response.ok) {
          const result = await response.json();
          return res.json(result);
        }
      } catch (error) {
        lastError = error;
        continue;
      }
    }

    throw lastError || new Error('All LibreTranslate services failed');
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Translation failed',
      message: error.message 
    });
  }
});

app.listen(5000, () => {
  console.log('Translation proxy server running on port 5000');
});
