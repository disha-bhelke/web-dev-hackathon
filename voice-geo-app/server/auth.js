const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// 👇 Path to your downloaded service account key JSON
const keyFile = path.join(__dirname, './gemini-key.json');

// ✅ Define required scopes for STT, TTS, Translate, etc.
const scopes = [
  'https://www.googleapis.com/auth/cloud-platform',
  'https://www.googleapis.com/auth/cloud-speech'
];

const getAccessToken = async () => {
  try {
    const auth = new GoogleAuth({ keyFile, scopes });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token;
  } catch (err) {
    console.error('Failed to get token:', err.message);
    throw new Error('Could not refresh access token.');
  }
};

module.exports = getAccessToken;
