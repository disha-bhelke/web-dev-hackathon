// convert-audio.js
const fs = require('fs');

const filePath = './hello.wav'; // or ./voice.flac

const audioBytes = fs.readFileSync(filePath).toString('base64');
console.log(audioBytes);
