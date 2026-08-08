import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import orderRoutes from "./routes/orders.js";
import wishlistRoutes from "./routes/wishlist.js";
import contactRoutes from "./routes/contact.js";
import profileRoutes from "./routes/profile.js";
import chatbotRoutes from "./routes/chatbot.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://cartify-frontend-liard.vercel.app",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Export getDB for route files
export { getDB };

// Auth Routes
app.use("/api/auth", authRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// Category Routes
app.use("/api/categories", categoryRoutes);

// Order Routes
app.use("/api/orders", orderRoutes);

// Wishlist Routes
app.use("/api/wishlist", wishlistRoutes);

// Contact Routes
app.use("/api/contact", contactRoutes);

// Profile Routes
app.use("/api/profile", profileRoutes);

// Chatbot Routes
app.use("/api/chatbot", chatbotRoutes);

// Basic Routes
app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce API Server",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      categories: "/api/categories",
      users: "/api/users",
      orders: "/api/orders",
    },
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database: db ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Products Routes (Example)
app.get("/api/products", async (req, res) => {
  try {
    const products = await db.collection("products").find({}).toArray();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const result = await db.collection("products").insertOne(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const { ObjectId } = await import("mongodb");
    const product = await db.collection("products").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Users Routes (Example)
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.collection("users").find({}).toArray();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Orders Routes (Example)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await db.collection("orders").find({}).toArray();
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n⚠️  Closing MongoDB connection...");
  await client.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});

// Start the application
startServer();
