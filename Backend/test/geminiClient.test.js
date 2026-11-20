import assert from "node:assert/strict";
import test from "node:test";
import {
  createGeminiClient,
  GeminiServiceError,
} from "../utils/geminiClient.js";

test("requires a Gemini API key and rejects OAuth bearer tokens", () => {
  const originalApiKey = process.env.GEMINI_API_KEY;

  try {
    delete process.env.GEMINI_API_KEY;
    assert.throws(
      () => createGeminiClient(),
      (error) =>
        error instanceof GeminiServiceError &&
        error.statusCode === 503 &&
        /GEMINI_API_KEY/.test(error.message),
    );

    for (const invalidCredential of [
      "Bearer sample-token",
      "ya29.sample-token",
    ]) {
      process.env.GEMINI_API_KEY = invalidCredential;
      assert.throws(
        () => createGeminiClient(),
        (error) =>
          error instanceof GeminiServiceError &&
          error.statusCode === 503 &&
          /OAuth access token/.test(error.message),
      );
    }
  } finally {
    if (originalApiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalApiKey;
    }
  }
});
