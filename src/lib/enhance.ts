import "server-only";
import { ScanError } from "@/lib/scans";

export const ENHANCER_MODEL_ID = "google/gemini-3.1-flash-image";

export type EnhanceMode = "upgrade" | "hotdogify";

function buildPrompt(mode: EnhanceMode, improvements: string[]) {
  if (mode === "hotdogify") {
    return `Edit this photo so it now clearly features a hot dog: a grilled sausage in a sliced bun with a zigzag of yellow mustard.

How to add it:
- If there is an animal in the photo, the animal must be eating the hot dog: holding it in its mouth or mid-bite, with the hot dog clearly visible.
- If there is a person, they must be holding the hot dog up or taking a bite of it.
- If there is food, swap the main dish for a hot dog or place a hot dog on the same plate.
- Otherwise, place the hot dog prominently in the foreground where it makes sense.

The hot dog must be fully inside the frame (not cut off by the edges), large enough to be the obvious focal point, and match the photo's perspective, lighting, shadows and depth of field so it looks real, not pasted on.
Keep everything else in the photo the same: framing, background, subject identity. Photorealistic. No text, logos or watermarks.`;
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
