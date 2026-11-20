import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
  quiet: true,
});

export class GeminiServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "GeminiServiceError";
    this.statusCode = statusCode;
  }
}

export const createGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new GeminiServiceError(
      "Gemini is not configured. Set GEMINI_API_KEY to a Gemini API key.",
      503,
    );
  }

  if (/^Bearer\s+/i.test(apiKey) || /^ya29\./i.test(apiKey)) {
    throw new GeminiServiceError(
      "GEMINI_API_KEY must contain a Gemini API key, not an OAuth access token or Bearer token.",
      503,
    );
  }

  return new GoogleGenAI({ apiKey });
};
