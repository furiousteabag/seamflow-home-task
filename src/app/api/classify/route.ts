import {
  createScan,
  ScanError,
  serializeScan,
  validateImage,
} from "@/lib/scans";
import { getUser } from "@/lib/supabase/server";

const MAX_THUMBNAIL_CHARS = 40_000;

// Web app endpoint: session cookie auth, client sends a resized image + thumbnail
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return Response.json(
      { error: { code: "unauthorized", message: "Sign in first" } },
      { status: 401 },
    );
  }

  try {
    const form = await request.formData();
    const { bytes, mediaType } = await validateImage(form.get("image"));
    const thumbnail = form.get("thumbnail");
    const scan = await createScan({
      userId: user.id,
      bytes,
      mediaType,
      thumbnail:
        typeof thumbnail === "string" &&
        thumbnail.startsWith("data:image/") &&
        thumbnail.length <= MAX_THUMBNAIL_CHARS
          ? thumbnail
          : "",
      channel: "web",
    });
    return Response.json(serializeScan(scan));
  } catch (error) {
    if (error instanceof ScanError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }
    console.error(error);
    return Response.json(
      { error: { code: "internal", message: "Something went wrong" } },
      { status: 500 },
    );
  }
}
