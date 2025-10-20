import mongoose from "mongoose";

const socialUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: false, unique: false }, // ✅ required: false로 변경
    image: String,
    provider: String,
}, { timestamps: true });

// ✅ 컬렉션 이름 강제 지정: "social_users"
export default mongoose.models.SocialUser ||
    mongoose.model("SocialUser", socialUserSchema, "social_users");
