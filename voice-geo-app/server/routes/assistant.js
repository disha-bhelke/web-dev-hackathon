// // routes/assistant.js
// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const { Translate } = require('@google-cloud/translate').v2;

// // Load Gemini and Translate APIs
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
// const translate = new Translate({
//   keyFilename: path.join(__dirname, '../gemini-key.json') // ✅ Use service account file
// });

// // Dummy Vendor Data (replace with real DB)
// const vendorDB = {
//   'potatoes': [{ name: 'A1 Veg Supplier', location: 'Katraj Market' }],
//   'flour': [{ name: 'Saras Grocery', location: 'Swargate' }],
//   'onions': [{ name: 'FreshMart', location: 'Kothrud' }],
//   'oil': [{ name: 'Bharat Oil Centre', location: 'Bibwewadi' }],
// };

// router.post('/', async (req, res) => {
//   try {
//     const { input, lang } = req.body;
//     let translated = input;

//     // Translate if input language isn't English
//     if (lang !== 'en' && lang !== 'en-US') {
//       const [translation] = await translate.translate(input, 'en');
//       translated = translation;
//     }

//     const prompt = `A user wants to sell a street food item and said: "${translated}".
// List the raw materials needed as a bullet list.`;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     // Extract bullet list items
//     const items = responseText.match(/- (.*)/g)?.map(i => i.replace('- ', '').trim()) || [];

//     const vendorMatches = items.map(item => ({
//       item,
//       vendors: vendorDB[item.toLowerCase()] || []
//     }));

//     res.status(200).json({
//       original: input,
//       translated,
//       materials: items,
//       vendorMatches
//     });
//   } catch (err) {
//     console.error('Assistant Error:', err.message);
//     res.status(500).json({ error: 'Something went wrong.' });
//   }
// });

// module.exports = router;


const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');

const router = express.Router();
require("dotenv").config();

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
console.log("Using Gemini API Key:", process.env.GEMINI_API_KEY);


// Translate setup
const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: path.join(__dirname, '../gemini-key.json'), // ✅ your service account file
});

// POST /api/assistant
router.post('/', async (req, res) => {
  const { input, lang } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Missing input' });
  }

  try {
    // Step 1: Translate input to English if language is not English
    let englishText = input;
    if (lang && lang !== 'en' && lang !== 'en-US') {
      const [translation] = await translate.translate(input, 'en');
      englishText = translation;
    }

    // Step 2: Prompt Gemini
    const prompt = `I am a street food vendor. I want to sell: "${englishText}". List all the raw materials or ingredients required in a simple comma-separated format only.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Step 3: Parse Gemini response into clean array
    const ingredients = responseText
      .replace(/\n/g, '')
      .split(',')
      .map((item) => item.trim().toLowerCase());

    return res.status(200).json({
      original: input,
      translated: englishText,
      materials: ingredients
    });
  } catch (err) {
    console.error('Assistant Error:', err.message);
    res.status(500).json({ error: 'Processing failed', detail: err.message });
  }
});

module.exports = router;
