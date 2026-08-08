import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, isDBConnected } from "../config/db.js";
import authRoutes from "../routes/auth.js";
import productRoutes from "../routes/products.js";
import categoryRoutes from "../routes/categories.js";
import orderRoutes from "../routes/orders.js";
import wishlistRoutes from "../routes/wishlist.js";
import contactRoutes from "../routes/contact.js";
import profileRoutes from "../routes/profile.js";
import chatbotRoutes from "../routes/chatbot.js";

// Load environment variables
dotenv.config();

const app = express();

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

// Initialize DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    const hasUri = !!process.env.MONGODB_URI;
    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
      hasUri: hasUri,
    });
  }
});

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
      orders: "/api/orders",
      wishlist: "/api/wishlist",
      contact: "/api/contact",
      profile: "/api/profile",
    },
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "E-Commerce API Server",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      categories: "/api/categories",
      orders: "/api/orders",
      wishlist: "/api/wishlist",
      contact: "/api/contact",
      profile: "/api/profile",
    },
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database: isDBConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
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

// Export for Vercel serverless
export default app;
