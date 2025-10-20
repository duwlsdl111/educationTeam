import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public/videos/video.mp4");

  if (!fs.existsSync(filePath)) {
    return new Response("File not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="video.mp4"');
  headers.append("Content-Type", "video/mp4");

  return new Response(fileBuffer, { headers });
}
