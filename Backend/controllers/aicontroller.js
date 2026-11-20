// import { chatWithAI } from "../services/aiservice.js";

// export const askAI = async (req, res, next) => {
//   try {
//     const { question } = req.body;

//     if (!question || typeof question !== "string" || !question.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body must include a non-empty 'question' string.",
//       });
//     }

//     const answer = await chatWithAI(question.trim());

//     return res.status(200).json({
//       success: true,
//       answer,
//     });
//   } catch (error) {
//     console.error("AI controller error:", error?.message || error);
//     const message = error?.message || "Failed to get AI answer.";
//     // If OpenAI returned a 429 / quota error, forward 429 to client
//     const isQuotaOrRateLimit = /\b(429|quota|rate limit|exceeded)\b/i.test(
//       message,
//     );
//     const statusCode = isQuotaOrRateLimit ? 429 : 500;

//     return res.status(statusCode).json({
//       success: false,
//       message,
//     });
//   }
// };

import { chatWithAI } from "../services/aiservice.js";
import { GeminiServiceError } from "../utils/geminiClient.js";

export const askAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Request body must include a non-empty 'question' string.",
      });
    }

    const answer = await chatWithAI(question.trim());

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to get AI answer.",
    });
  }
};
