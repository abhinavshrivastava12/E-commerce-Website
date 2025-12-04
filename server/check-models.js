const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    console.log("🔍 Checking available models for your API Key...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const response = await axios.get(url);
    
    console.log("✅ SUCCESS! You have access to these models:");
    const models = response.data.models.map(m => m.name.replace("models/", ""));
    console.log(models);
    
    console.log("\n👇 USE ONE OF THESE EXACT NAMES IN YOUR CODE:");
    console.log(`const model = genAI.getGenerativeModel({ model: "${models[0]}" });`);
    
  } catch (error) {
    console.error("❌ ERROR:", error.response?.data || error.message);
    console.log("\n💡 TIP: If this failed, you likely need to ENABLE the 'Generative Language API' in Google Cloud Console.");
  }
}

listModels();