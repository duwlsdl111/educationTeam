import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    q:   { type: String, required: true }, // 제목
    a:   { type: String, required: true }, // 내용
    img: { type: String },                 // 이미지 URL 또는 dataURL
    cat: { type: String, default: "소개" },
    user:{ type: Boolean, default: true }, // 사용자 작성 글 표시
  },
  {
    timestamps: true,
    // 컬렉션 이름을 Atlas의 기존 'post'로 강제하려면 아래 줄 주석 해제
    // collection: "post",
  }
);

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
