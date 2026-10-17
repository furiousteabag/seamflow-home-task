import { authenticateApiKey } from "@/lib/api-keys";
import {
  createScan,
  ScanError,
  serializeScan,
  validateImage,
} from "@/lib/scans";

const error = (status: number, code: string, message: string) =>
  Response.json({ error: { code, message } }, { status });

/**
 * Public REST API. POST multipart/form-data with an `image` field.
 * Auth: Authorization: Bearer sf_live_…
 */
export async function POST(request: Request) {
  const key = await authenticateApiKey(request);
  if (!key) return error(401, "invalid_api_key", "Missing or invalid API key");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error(
      400,
      "invalid_body",
      "Send multipart/form-data with an `image` field",
    );
  }

  try {
    const { bytes, mediaType } = await validateImage(form.get("image"));
    const scan = await createScan({
      userId: key.userId,
      bytes,
      mediaType,
      thumbnail: "",
      channel: "api",
    });
    return Response.json(serializeScan(scan));
  } catch (e) {
    if (e instanceof ScanError) return error(e.status, e.code, e.message);
    console.error(e);
    return error(500, "internal", "Something went wrong");
  }
}
