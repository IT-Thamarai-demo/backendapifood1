const router = require("express").Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// User: Create order (checkout)
router.post("/create", createOrder);

// User: Get all their orders
router.get("/user/:userId", getUserOrders);

// Admin: Get all orders
router.get("/all", getAllOrders);

// Admin: Update Order Status
router.put("/status/:orderId", updateOrderStatus);

module.exports = router;
