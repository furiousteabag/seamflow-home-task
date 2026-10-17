import "server-only";
import { ScanError } from "@/lib/scans";

export const ENHANCER_MODEL_ID = "google/gemini-3.1-flash-image";

export type EnhanceMode = "upgrade" | "hotdogify";

function buildPrompt(mode: EnhanceMode, improvements: string[]) {
  if (mode === "hotdogify") {
    return `Edit this photo by adding one delicious, realistic hot dog to it: a grilled sausage in a sliced bun with a zigzag of mustard.
Place it where it makes sense in the scene, at the right scale, perspective and lighting. If there is a person or animal, they can be holding or eating it; otherwise put it on a plate or nearby surface.
Keep everything else in the photo unchanged. Photorealistic. No text, logos or watermarks.`;
  }
  const changes = improvements.length
    ? improvements.map((i) => `- ${i}`).join("\n")
    : "- Make it look more appetizing and premium";
  return `Edit this photo of a hot dog to make it a better, more delicious-looking hot dog. Apply these improvements:
${changes}
Keep it clearly the same hot dog in the same scene: same camera angle, framing and setting. Photorealistic food photography, natural lighting. No text, logos or watermarks.`;
}

/**
 * Edits the photo with an image model (via OpenRouter): "upgrade" applies the
 * suggested improvements to a hot dog, "hotdogify" adds a hot dog to anything else.
 */
export async function enhanceImage(
  image: Uint8Array,
  mediaType: string,
  mode: EnhanceMode,
  improvements: string[] = [],
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new ScanError(
      "Image editing is not configured",
      503,
      "enhancer_unavailable",
    );
  }

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
              { type: "text", text: buildPrompt(mode, improvements) },
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
