import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      console.log("✅ Available Models for your Key:");
      const generateModels = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", ""));
        
      console.log(generateModels.join("\n"));
    } else {
      console.log("❌ Error:", data);
    }
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

listModels();