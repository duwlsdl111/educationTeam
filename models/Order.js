import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            id: String,
            name: String,      // ✅ item → name
            qty: Number,       // ✅ quantity → qty
            price: Number,
            img: String,       // ✅ image → img
        },
    ],
    payment: Number,
    form: {
        receiver: String,
        addr1: String,
        addr2: String,
        phone: String,
        memo: String,
    },
    status: { type: String, default: "결제완료" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
