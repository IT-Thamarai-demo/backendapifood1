const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// GET CART BY USER
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .populate("user", "name email phone");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ADD ITEM TO CART
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    const populatedCart = await cart.populate("items.product").execPopulate();

    res.status(200).json({ message: "Cart updated", cart: populatedCart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// UPDATE ITEM QUANTITY
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await cart.populate("items.product").execPopulate();
      return res.json({ message: "Cart updated", cart: populatedCart });
    }

    res.status(404).json({ message: "Product not found in cart" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// REMOVE ITEM FROM CART
exports.removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const populatedCart = await cart.populate("items.product").execPopulate();
    res.json({ message: "Item removed", cart: populatedCart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
