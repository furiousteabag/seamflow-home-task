import "server-only";
import sharp from "sharp";

/** 160 px JPEG data URL, the same shape the web client sends for offline history. */
export async function makeThumbnail(image: Uint8Array) {
  const jpeg = await sharp(image)
    .rotate()
    .resize(160, 160, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 70 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}
