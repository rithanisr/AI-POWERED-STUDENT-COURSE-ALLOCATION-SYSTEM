import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

console.log("Key starts with:", process.env.GEMINI_API_KEY.substring(0, 5));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

try {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say Hello",
  });

  console.log(response.text);
} catch (err) {
  console.error(err);
}