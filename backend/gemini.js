const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractKeywordFromQuery(query) {
  try {
    // ✅ CORRECT MODEL NAME!
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    const result = await model.generateContent(
          `
You are a helpful assistant that extracts the most relevant grocery item keyword from a sentence.
Only return one keyword (in English), and nothing else. For example:

Input: "मैं चावल खरीदना चाहता हूँ"
Output: rice

Input: "show me some options for fresh milk suppliers"
Output: milk

Now extract keyword from this:
"${query}"
`

    );

    const response = await result.response;
    const keyword = response.text().trim().toLowerCase();

    console.log("🔑 Gemini extracted keyword:", keyword);
    return keyword;
  } catch (err) {
    console.error("❌ Gemini Keyword Extraction Failed:", err);
    return null;
  }
}

module.exports = extractKeywordFromQuery;
