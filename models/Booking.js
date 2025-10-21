import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    farmId: { type: String, required: true },         // 농장 식별자
    date: { type: Date, required: true },             // 예약 날짜(자정 기준으로 normalize)
    name: { type: String, required: true },
    phone: { type: String, required: true },
    adults: { type: Number, default: 0, min: 0 },
    kids: { type: Number, default: 0, min: 0 },
    memo: { type: String, default: "" },
    userId: { type: String, default: "" },            // 로그인 사용자 id(없어도 저장)
  },
  { timestamps: true }
);

// 같은 농장-같은 날짜 중복 예약 방지(동시성 안정)
BookingSchema.index({ farmId: 1, date: 1 }, { unique: true });

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
