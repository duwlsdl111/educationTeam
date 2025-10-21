import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import { Post } from "../../../models/Post";

function detectCategory(text = "") {
  const t = text.toLowerCase();
  if (t.includes("씨앗") || t.includes("seed")) return "씨앗";
  if (t.includes("모종") || t.includes("seedling")) return "모종";
  if (t.includes("큰식기") || t.includes("큰 식기")) return "큰식기";
  return "소개";
}

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "50", 10);

  const query = cat && cat !== "전체" ? { cat } : {};
  const total = await Post.countDocuments(query);
  const items = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  let { q, a, img, cat } = body || {};

  if (!q || !a) {
    return NextResponse.json({ error: "q and a are required" }, { status: 400 });
  }
  if (!cat) cat = detectCategory(q);

  const doc = await Post.create({ q, a, img, cat, user: true });
  return NextResponse.json({ ok: true, item: doc });
}
