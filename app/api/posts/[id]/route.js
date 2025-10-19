import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import { Post } from "../../../../models/Post";
import mongoose from "mongoose";

export async function GET(_req, { params }) {
  await dbConnect();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const item = await Post.findById(id).lean();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = await req.json();
  const { q, a, img } = body || {};
  if (!q || !a) {
    return NextResponse.json({ error: "q and a are required" }, { status: 400 });
  }
  const item = await Post.findByIdAndUpdate(id, { q, a, img }, { new: true }).lean();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await Post.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
