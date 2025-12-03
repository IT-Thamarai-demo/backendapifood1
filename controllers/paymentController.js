const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------------------------------------------------------
// 📌 CREATE RAZORPAY ORDER
// ---------------------------------------------------------
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, orderId, userId } = req.body;

        if (!amount || !orderId || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Amount should be in paise
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${orderId}`,
        };

        const order = await razorpay.orders.create(options);

        // Store payment record
        await Payment.create({
            user: userId,
            order: orderId,
            amount,
            razorpayOrderId: order.id,
            status: "pending",
        });

        res.json({
            success: true,
            orderId: order.id,
            amount: amount * 100,
            currency: "INR",
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ---------------------------------------------------------
// 📌 VERIFY PAYMENT SIGNATURE (VERY IMPORTANT)
// ---------------------------------------------------------
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            orderId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // Update Payment status → Paid
        await Payment.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "paid",
            }
        );

        // Update user order status → Confirmed
        await Order.findByIdAndUpdate(orderId, { status: "confirmed" });

        res.json({
            success: true,
            message: "Payment verified successfully",
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
