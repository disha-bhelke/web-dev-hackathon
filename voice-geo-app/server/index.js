// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const geminiRoute = require('./routes/gemini');
// const sttRoute = require('./routes/stt');         // ✅ Add this
// const ttsRoute = require('./routes/tts');         // ✅ Add this
// const supplierRoute = require('./routes/suppliers'); // ✅ Add this

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // 👇 Mount all routes
// app.use('/api/gemini', geminiRoute);
// app.use('/api/stt', sttRoute);           // ✅ Speech-to-Text endpoint
// app.use('/api/tts', ttsRoute);           // ✅ Text-to-Speech endpoint
// app.use('/api/suppliers', supplierRoute); // ✅ Supplier filter endpoint

// app.get('/', (req, res) => {
//   res.send('Voice & Gemini API Server is running');
// });

// const sttUploadRoute = require('./routes/sttUpload');
// app.use('/api/stt-upload', sttUploadRoute);

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

//new code
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// //const connectDB = require('./db/mongo');
// //const mongoose = require('mongoose');

// // Load environment variables
// require('dotenv').config();

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// //connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Route Imports
// const geminiRoute = require('./routes/gemini');
// const sttRoute = require('./routes/stt');
// const ttsRoute = require('./routes/tts');
// const supplierRoute = require('./routes/suppliers');
// const sttUploadRoute = require('./routes/sttUpload');
// const vendorRoute = require('./routes/vendors'); // ✅ NEW

// //app.use('/api/vendors', vendorRoute);


// // Mount Routes
// app.use('/api/gemini', geminiRoute);
// app.use('/api/stt', sttRoute);
// app.use('/api/tts', ttsRoute);
// app.use('/api/suppliers', supplierRoute);
// app.use('/api/stt-upload', sttUploadRoute);
// app.use('/api/vendors', vendorRoute); // ✅ NEW

// // mongoose.connect(process.env.MONGO_URI)
// //   .then(() => console.log('✅ MongoDB Connected'))
// //   .catch((err) => console.error('❌ MongoDB connection failed:', err.message));


// // Root Route
// app.get('/', (req, res) => {
//   res.send('Voice & Gemini API Server is running 🚀');
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`✅ Server is listening on http://localhost:${PORT}`);
// });

// // index.js (Full End-to-End Voice + Gemini AI Backend with Fixes)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Translate } = require('@google-cloud/translate').v2;
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// Google Gemini + Translate Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const translate = new Translate({ projectId: process.env.GOOGLE_PROJECT_ID });

// ===== Routes Imports =====
const assistantRoute = require('./routes/assistant');
const sttRoute = require('./routes/stt');
const ttsRoute = require('./routes/tts');
const suppliersRoute = require('./routes/suppliers');
const sttUploadRoute = require('./routes/sttUpload');
const vendorRoute = require('./routes/vendors');

// ===== Mount Routes =====
app.use('/api/assistant', assistantRoute);
app.use('/api/stt', sttRoute);
app.use('/api/tts', ttsRoute);
app.use('/api/suppliers', suppliersRoute);
app.use('/api/stt-upload', sttUploadRoute);
app.use('/api/vendors', vendorRoute); // Nearby vendors route

// ===== Gemini Handler (direct route) =====
app.post('/api/gemini', async (req, res) => {
  try {
    const { transcript, lang } = req.body;

    // Translate to English if needed
    let translatedText = transcript;
    if (lang !== 'en' && lang !== 'en-US') {
      const [translation] = await translate.translate(transcript, 'en');
      translatedText = translation;
    }

    const prompt = `You are a multilingual street food assistant. A user said: "${translatedText}".
Based on this, identify what they want to sell and list the required raw materials and components.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.status(200).json({
      original: transcript,
      translated: translatedText,
      geminiOutput: response
    });
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    res.status(500).json({ error: 'Gemini or translation failed.' });
  }
});

// ===== Health Check Route =====
app.get('/', (req, res) => {
  res.send('🎙️ Full Voice + Geo + AI Backend is Running 🚀');
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

