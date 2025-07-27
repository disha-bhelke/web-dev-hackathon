const express = require('express');
const axios = require('axios');
const router = express.Router();

const TRANSLATE_API = process.env.TRANSLATE_API || 'https://libretranslate.com/translate';

router.post('/', async (req, res) => {
  const { text, source, target } = req.body;

  if (!text || !source || !target) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const response = await axios({
      method: 'post',
      url: TRANSLATE_API,
      data: {
        q: text,
        source: source,
        target: target,
        format: 'text'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json({ translatedText: response.data.translatedText });
  } catch (err) {
    console.error('Translation error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Translation failed', details: err.response?.data });
  }
});

module.exports = router;
