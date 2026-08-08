import { Router } from "express";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import { getDB } from "../config/db.js";

const router = Router();

// Get user profile by email
router.get("/:email", async (req, res) => {
  try {
    const db = await getDB();
    const users = db.collection("users");

    const user = await users.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
});

// Update user profile
router.patch("/:email", async (req, res) => {
  try {
    const db = await getDB();
    const users = db.collection("users");

    const { name, phone } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const result = await users.updateOne(
      { email: req.params.email },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: error.message,
    });
  }
});

// Upload profile photo
router.post("/upload-photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_photos",
          resource_type: "image",
          transformation: [
            { width: 500, height: 500, crop: "fill", gravity: "face" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(req.file.buffer);
    });

    // Update user's photoURL in MongoDB
    const { email } = req.body;
    if (email) {
      const db = await getDB();
      const users = db.collection("users");
      await users.updateOne(
        { email: email },
        { $set: { photoURL: result.secure_url, updatedAt: new Date() } },
      );
    }

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      photoURL: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload photo",
      error: error.message,
    });
  }
});

export default router;
