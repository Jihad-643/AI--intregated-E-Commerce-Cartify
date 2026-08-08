import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { getDB } from "../config/db.js";

const router = express.Router();

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce/users" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

// Register with email/password and image upload
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { name, email, phone, uid, role } = req.body;
    const db = await getDB();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { uid }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = cloudinaryResult.secure_url;
    }

    // Create user object
    const newUser = {
      uid,
      name,
      email,
      phone,
      photoURL: imageUrl,
      role: role || "user",
      provider: "email",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user into database
    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: result.insertedId,
        uid: newUser.uid,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        photoURL: newUser.photoURL,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Registration failed",
    });
  }
});

// Social login (Google/GitHub)
router.post("/social-login", async (req, res) => {
  try {
    const { uid, name, email, photoURL, role, provider } = req.body;
    const db = await getDB();

    // Check if user exists
    let user = await db.collection("users").findOne({ uid });

    if (user) {
      // Update existing user
      await db.collection("users").updateOne(
        { uid },
        {
          $set: {
            name,
            email,
            photoURL,
            updatedAt: new Date(),
          },
        },
      );
    } else {
      // Create new user
      const newUser = {
        uid,
        name,
        email,
        photoURL,
        role: role || "user",
        provider: provider || "google",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("users").insertOne(newUser);
      user = newUser;
    }

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      data: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Social login error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Authentication failed",
    });
  }
});

// Get user by UID
router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const db = await getDB();

    const user = await db.collection("users").findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photoURL: user.photoURL,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch user",
    });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const db = await getDB();
    const users = await db.collection("users").find({}).toArray();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch users",
    });
  }
});

export default router;
