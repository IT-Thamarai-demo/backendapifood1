const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

app.use(cors());

const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Food Delivery Service API is running")
}
)
// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));



app.listen(5000, () => console.log("Server running on port 5000"));
