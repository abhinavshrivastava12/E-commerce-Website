// 📁 server/routes/gemini.js
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { prompt, products, userName } = req.body; // User name receive kiya

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chatPrompt = `
      You are a helpful and friendly AI Assistant for 'Abhi ShoppingZone'. 
      The user's name is: "${userName || "Guest"}".
      
      Your goals:
      1. If this is the start of the conversation, welcome the user warmly by their name.
      2. You have access to the Product Catalog below. If the user asks about product specifications, price, or details, provide accurate info from the catalog.
      3. If the user asks general questions (not about shopping), be helpful and answer them nicely (e.g., "How are you?", "Tell me a joke", etc.).
      4. DO NOT be restricted to just shopping. You are a smart assistant.

      Product Catalog:
      ${JSON.stringify(products)}

      STRICT OUTPUT FORMAT:
      You must ONLY return a raw JSON object. Do not use markdown formatting.
      
      Example Format:
      {
       "response": "Hello Abhinav! Welcome to Abhi ShoppingZone. How can I help you today?",
       "products": [ { "id": 123, "name": "Product Name", "price": 100 } ] 
      }
      
      (Note: 'products' array should only be filled if you are recommending specific items from the catalog based on the user's query. Otherwise keep it empty).

      User Query: "${prompt}"
    `;

    const result = await model.generateContent(chatPrompt);
    const response = await result.response;
    let text = response.text();

    // CLEANUP: Remove markdown code blocks if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let output;
    try {
      output = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Fallback plain text response
      output = { 
        response: text, 
        products: [] 
      };
    }

    res.json(output);

  } catch (err) {
    console.error("🔥 Gemini API Error:", err);
    // Agar API key invalid hai ya quota full hai
    res.status(500).json({
      response: "⚠️ My brain is currently offline (API Error). Please check the server console.",
      products: []
    });
  }
});

module.exports = router;