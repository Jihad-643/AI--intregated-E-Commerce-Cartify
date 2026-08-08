import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

const router = Router();

// Get user's wishlist
router.get("/:userId", async (req, res) => {
  try {
    const database = await getDB();
    const wishlist = database.collection("wishlist");

    const userWishlist = await wishlist.findOne({ userId: req.params.userId });

    res.status(200).json({
      success: true,
      data: userWishlist ? userWishlist.products : [],
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message,
    });
  }
});

// Add product to wishlist
router.post("/", async (req, res) => {
  try {
    const database = await getDB();
    const wishlist = database.collection("wishlist");
    const { userId, product } = req.body;

    console.log("Add to wishlist request:", { userId, product });

    if (!userId || !product) {
      return res.status(400).json({
        success: false,
        message: "userId and product are required",
      });
    }

    // Check if user already has a wishlist
    const existingWishlist = await wishlist.findOne({ userId });

    if (existingWishlist) {
      // Check if product already exists in wishlist
      const productExists = existingWishlist.products.some(
        (item) => item._id === product._id,
      );

      if (productExists) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist",
        });
      }

      // Add product to existing wishlist
      await wishlist.updateOne(
        { userId },
        {
          $push: { products: product },
          $set: { updatedAt: new Date() },
        },
      );
    } else {
      // Create new wishlist for user
      await wishlist.insertOne({
        userId,
        products: [product],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
      error: error.message,
    });
  }
});

// Remove product from wishlist
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const database = await getDB();
    const wishlist = database.collection("wishlist");
    const { userId, productId } = req.params;

    await wishlist.updateOne(
      { userId },
      {
        $pull: { products: { _id: productId } },
        $set: { updatedAt: new Date() },
      },
    );

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
      error: error.message,
    });
  }
});

// Clear entire wishlist
router.delete("/:userId", async (req, res) => {
  try {
    const database = await getDB();
    const wishlist = database.collection("wishlist");

    await wishlist.deleteOne({ userId: req.params.userId });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
});

export default router;
