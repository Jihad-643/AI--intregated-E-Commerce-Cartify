import express from "express";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const db = await getDB();
    const categories = await db.collection("categories").find({}).toArray();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch categories",
    });
  }
});

// Create new category
router.post("/", async (req, res) => {
  try {
    const db = await getDB();
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Category name is required",
      });
    }

    // Check if category already exists
    const existing = await db.collection("categories").findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Category already exists",
      });
    }

    const newCategory = {
      name,
      createdAt: new Date(),
    };

    const result = await db.collection("categories").insertOne(newCategory);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        _id: result.insertedId,
        ...newCategory,
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create category",
    });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;

    const result = await db
      .collection("categories")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete category",
    });
  }
});

export default router;
