const router = require("express").Router();
const { createRazorpayOrder, verifyPayment } = require("../controllers/paymentController");

// Create Razorpay order
router.post("/create-order", createRazorpayOrder);

// Verify payment
router.post("/verify", verifyPayment);

module.exports = router;
