import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce/products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

// Get all products or filter by category
router.get("/", async (req, res) => {
  try {
    const db = await getDB();
    const { category } = req.query;

    const filter = category ? { category } : {};
    const products = await db.collection("products").find(filter).toArray();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch products",
    });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch product",
    });
  }
});

// Create new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const db = await getDB();
    const { title, price, description, quantity, category } = req.body;

    // Upload image to Cloudinary
    let imageUrl = null;
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = cloudinaryResult.secure_url;
    }

    const newProduct = {
      title,
      price: parseFloat(price),
      description,
      quantity: parseInt(quantity),
      category,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(newProduct);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        _id: result.insertedId,
        ...newProduct,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create product",
    });
  }
});

// Update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;
    const { title, price, description, quantity, category } = req.body;

    const updateData = {
      title,
      price: parseFloat(price),
      description,
      quantity: parseInt(quantity),
      category,
      updatedAt: new Date(),
    };

    // Upload new image if provided
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      updateData.imageUrl = cloudinaryResult.secure_url;
    }

    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update product",
    });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;

    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete product",
    });
  }
});

// Add review to product
router.post("/:id/review", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;
    const { userEmail, userPhoto, rating, review, orderId } = req.body;

    // Validate input
    if (!userEmail || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "User email, rating, and review are required",
      });
    }

    // Get the product
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user has already reviewed this product
    const existingReviews = product.reviews || [];
    const hasReviewed = existingReviews.some((r) => r.userEmail === userEmail);

    if (hasReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Add new review
    const newReview = {
      userEmail,
      userPhoto,
      rating: parseInt(rating),
      review,
      date: new Date(),
    };

    await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $push: { reviews: newReview } });

    // Mark order as reviewed (add reviewed flag to order)
    if (orderId) {
      await db
        .collection("orders")
        .updateOne(
          { _id: new ObjectId(orderId) },
          { $set: { reviewed: true } },
        );
    }

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to add review",
    });
  }
});

export default router;
