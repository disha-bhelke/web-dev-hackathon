import pyttsx3

engine = pyttsx3.init()
engine.setProperty('rate', 150)

samples = {
    "hindi": "नमस्ते, आप क्या खरीदना चाहते हैं?",
    "marathi": "नमस्कार, तुम्हाला काय खरेदी करायचे आहे?",
    "english": "Hello, what would you like to buy?"
}

for lang, text in samples.items():
    engine.save_to_file(text, f"sample_{lang}.wav")

engine.runAndWait()
