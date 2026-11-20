import {
  createGeminiClient,
  GeminiServiceError,
} from "./utils/geminiClient.js";

try {
  const ai = createGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say Hello",
  });

  console.log(response.text);
} catch (err) {
  if (err instanceof GeminiServiceError) {
    console.error(err.message);
  } else {
    const status = Number(err?.status ?? err?.statusCode);
    const isAuthenticationFailure =
      status === 401 ||
      err?.code === "ACCESS_TOKEN_TYPE_UNSUPPORTED" ||
      err?.message?.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED");

    console.error(
      isAuthenticationFailure
        ? "Gemini authentication failed. Check that GEMINI_API_KEY is a Gemini API key."
        : "Gemini test request failed.",
      Number.isFinite(status) ? { status } : undefined,
    );
  }

  process.exitCode = 1;
}