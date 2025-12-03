const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
        amount: Number,
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        status: { type: String, default: "pending" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
