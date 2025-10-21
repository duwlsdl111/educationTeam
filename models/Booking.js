// models/Booking.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const BookingSchema = new Schema({
  farmId:   { type: String, required: true, index: true },
  farmName: { type: String, default: '' },
  date:     { type: Date,   required: true, index: true }, // 체험일(자정)
  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  adults:   { type: Number, default: 0 },
  kids:     { type: Number, default: 0 },
  memo:     { type: String, default: '' },
  userId:   { type: String, default: '' },
}, { timestamps: true });

// 같은 농장 + 같은 날짜 + 같은 이름 중복 방지(원하면 유지)
BookingSchema.index({ farmId: 1, date: 1, name: 1 }, { unique: true });

export const Booking =
  mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
