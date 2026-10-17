import "server-only";
import { ScanError } from "@/lib/scans";

export const ENHANCER_MODEL_ID = "google/gemini-3.1-flash-image";

/** Asks an image model (via OpenRouter) to apply the suggested improvements to the photo. */
export async function enhanceHotDog(
  image: Uint8Array,
  mediaType: string,
  improvements: string[],
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new ScanError(
      "Level up is not configured",
      503,
      "enhancer_unavailable",
    );
  }

  const changes = improvements.length
    ? improvements.map((i) => `- ${i}`).join("\n")
    : "- Make it look more appetizing and premium";
  const prompt = `Edit this photo of a hot dog to make it a better, more delicious-looking hot dog. Apply these improvements:
${changes}
Keep it clearly the same hot dog in the same scene: same camera angle, framing and setting. Photorealistic food photography, natural lighting. No text, logos or watermarks.`;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://seefoodsystems.com",
        "X-Title": "SeeFood Enterprise",
      },
      body: JSON.stringify({
        model: ENHANCER_MODEL_ID,
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType};base64,${Buffer.from(image).toString("base64")}`,
                },
              },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(90_000),
    },
  );

  if (!response.ok) {
    console.error("enhancer failed", response.status, await response.text());
    throw new ScanError(
      "The image model is unavailable, try again",
      502,
      "enhancer_unavailable",
    );
  }

  const body = await response.json();
  const url: string | undefined =
    body.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  const match = url?.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) {
    console.error(
      "enhancer returned no image",
      JSON.stringify(body).slice(0, 500),
    );
    throw new ScanError(
      "The image model returned no image, try again",
      502,
      "enhancer_no_image",
    );
  }
  return {
    bytes: new Uint8Array(Buffer.from(match[2], "base64")),
    mediaType: match[1],
  };
}
