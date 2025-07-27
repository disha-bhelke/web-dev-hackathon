const express = require('express');
const axios = require('axios');
const getAccessToken = require('../auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { audioContent } = req.body;

  if (!audioContent) {
    return res.status(400).json({ error: 'Missing audioContent (Base64)' });
  }

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      'https://speech.googleapis.com/v1/speech:recognize',
      {
        config: {
          encoding: 'LINEAR16',            // ✅ if you're using .wav
          sampleRateHertz: 16000,          // ✅ change if needed
          languageCode: 'hi-IN'            // ✅ Hindi speech recognition
        },
        audio: {
          content: audioContent            // ✅ actual base64 audio string
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const transcript = response.data.results
      ?.map(result => result.alternatives[0].transcript)
      .join(' ');

    res.json({ transcript: transcript || 'No speech recognized' });

  } catch (err) {
    res.status(500).json({
      error: 'STT failed',
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
