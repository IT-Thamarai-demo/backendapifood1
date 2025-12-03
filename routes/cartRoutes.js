const router = require("express").Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cartController");

// Get cart by user
router.get("/:userId", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update item quantity
router.put("/update", updateCartItem);

// Remove item from cart
router.delete("/remove", removeCartItem);

// Clear cart
router.delete("/clear", clearCart);

module.exports = router;
