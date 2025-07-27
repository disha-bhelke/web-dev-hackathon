const express = require('express');
const axios = require('axios');
const getAccessToken = require('../auth');
const router = express.Router();

router.post('/', async (req, res) => {
  const { text, languageCode } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const token = await getAccessToken();

  try {
    const ttsRes = await axios.post(
      'https://texttospeech.googleapis.com/v1/text:synthesize',
      {
        input: { text },
        voice: { languageCode: languageCode || 'hi-IN', ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ audioContent: ttsRes.data.audioContent });
  } catch (err) {
    res.status(500).json({ error: 'TTS failed', details: err.response?.data || err.message });
  }
});

module.exports = router;
