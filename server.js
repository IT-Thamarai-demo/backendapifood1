const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors()); // ✅ Enable CORS for all origins
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
    res.send("Food Delivery Service API is running");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

// Start Server
app.listen(5000, () => console.log("Server running on port 5000   ..."));
