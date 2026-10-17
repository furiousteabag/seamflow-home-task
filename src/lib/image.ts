// Client-side image prep: downscale before upload, plus a tiny thumbnail for offline history

async function draw(file: Blob, maxSide: number) {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas;
}

export async function prepareImage(file: Blob) {
  const full = await draw(file, 1280);
  const blob = await new Promise<Blob>((resolve, reject) =>
    full.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encoding failed"))),
      "image/jpeg",
      0.85,
    ),
  );
  const thumbnail = (await draw(file, 160)).toDataURL("image/jpeg", 0.7);
  return { blob, thumbnail, previewUrl: URL.createObjectURL(blob) };
}
