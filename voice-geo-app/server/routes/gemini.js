const express = require('express');
const axios = require('axios');
const getAccessToken = require('../auth'); // use service account token

const router = express.Router();
//const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt missing' });

  try {
    const token = await getAccessToken();

    const geminiRes = await axios.post(
      GEMINI_URL,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = geminiRes.data.candidates[0].content.parts[0].text;
    res.json({ response: result });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Gemini API failed', details: err.response?.data });
  }
});

module.exports = router;
