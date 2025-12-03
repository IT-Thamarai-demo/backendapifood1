const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Menu = require("../models/menu");
const mongoose = require("mongoose");

// CREATE ORDER (Checkout)
exports.createOrder = async (req, res) => {
  try {
    const { userId, address, paymentMethod } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      address,
      paymentMethod,
    });

    // Clear cart after order success
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ADMIN: GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// UPDATE ORDER STATUS (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
      .populate("user", "name email phone")
      .populate("items.product");

    res.json({ message: "Order status updated", updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
