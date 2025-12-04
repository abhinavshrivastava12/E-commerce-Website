const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { prompt, products } = req.body;

    // Use the official model name
   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chatPrompt = `
      You are an AI Shopping Assistant.
      User Query: "${prompt}"

      Product Catalog:
      ${JSON.stringify(products)}

      STRICT INSTRUCTION: 
      Return ONLY a raw JSON object. Do not wrap it in markdown (no \`\`\`json tags).
      
      Format:
      {
       "response": "A friendly text response answering the user",
       "products": [ { "id": 123, "name": "Product Name", "price": 100, "rating": 4.5 } ]
      }
    `;

    const result = await model.generateContent(chatPrompt);
    const response = await result.response;
    let text = response.text();

    // CLEANUP: Remove markdown code blocks if the AI adds them
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let output;
    try {
      output = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Fallback if AI returns malformed JSON
      output = { 
        response: text, 
        products: [] 
      };
    }

    res.json(output);

  } catch (err) {
    console.error("🔥 Gemini API Error:", err);
    res.status(500).json({
      error: "Gemini API Error",
      details: err.message,
    });
  }
});

module.exports = router;