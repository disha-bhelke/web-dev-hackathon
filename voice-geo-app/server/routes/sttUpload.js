const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const getAccessToken = require('../auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('audio'), async (req, res) => {
  const languageCode = req.body.languageCode || 'en-IN';
  const allowedLanguages = ['hi-IN', 'mr-IN', 'en-IN', 'en-US'];

  if (!allowedLanguages.includes(languageCode)) {
    return res.status(400).json({ error: 'Unsupported language code' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  try {
    const filePath = path.join(__dirname, '..', req.file.path);
    const audioBytes = fs.readFileSync(filePath).toString('base64');


    // Detect file type by extension
const ext = path.extname(req.file.originalname).toLowerCase();

let encoding, sampleRate;

if (ext === '.mp3') {
  encoding = 'MP3';
  sampleRate = 22050; // optional for MP3
} else if (ext === '.wav') {
  encoding = 'LINEAR16';
  sampleRate = 22050; // or 22050 based on your actual WAV
} else {
  return res.status(400).json({ error: 'Unsupported file format. Use .mp3 or .wav' });
}


    const token = await getAccessToken();

    const sttRes = await axios.post(
      'https://speech.googleapis.com/v1/speech:recognize',
      {
        config: {
          encoding,
          sampleRateHertz: sampleRate,
          languageCode,
          enableAutomaticPunctuation: true,
          model: 'latest_long',
          useEnhanced: true
        },
        audio: {
          content: audioBytes
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    try { fs.unlinkSync(filePath); } catch (e) {}

    const transcript = sttRes.data.results
      ?.map(r => r.alternatives[0].transcript)
      .join(' ') || 'No speech recognized';

    res.json({ transcript });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: 'STT file upload failed',
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
