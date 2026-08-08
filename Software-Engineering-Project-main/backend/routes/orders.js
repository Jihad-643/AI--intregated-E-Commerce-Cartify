import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import {
  sendOrderNotificationToAdmin,
  sendCancellationNotificationToAdmin,
  sendStatusUpdateToUser,
  sendInventoryAlert,
} from "../config/email.js";

const router = Router();

// Get all orders (Admin) - Must be before /:id route
router.get("/", async (req, res) => {
  try {
    const db = await getDB();
    const orders = db.collection("orders");

    const allOrders = await orders.find().sort({ createdAt: -1 }).toArray();

    res.status(200).json({
      success: true,
      data: allOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Create Order - POST route
router.post("/", async (req, res) => {
  try {
    const db = await getDB();
    const orders = db.collection("orders");
    const products = db.collection("products");

    const productId = req.body.product.id;
    const orderQuantity = req.body.quantity;

    // Validate ObjectId format
    if (!productId || !ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    // Check product stock
    const product = await products.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.quantity < orderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} items available in stock`,
      });
    }

    const orderData = {
      ...req.body,
      createdAt: new Date(),
      status: "pending",
    };

    // Create order
    const result = await orders.insertOne(orderData);

    // Update product stock
    await products.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { quantity: -orderQuantity } },
    );

    // Get updated product to check stock level
    const updatedProduct = await products.findOne({
      _id: new ObjectId(productId),
    });

    // Check inventory levels and send alerts
    if (updatedProduct) {
      if (updatedProduct.quantity === 0) {
        // Out of stock alert
        sendInventoryAlert(updatedProduct, "outOfStock").catch((err) =>
          console.error("Inventory alert failed:", err),
        );
      } else if (updatedProduct.quantity < 5) {
        // Critical stock alert
        sendInventoryAlert(updatedProduct, "critical").catch((err) =>
          console.error("Inventory alert failed:", err),
        );
      } else if (updatedProduct.quantity < 10) {
        // Low stock alert
        sendInventoryAlert(updatedProduct, "low").catch((err) =>
          console.error("Inventory alert failed:", err),
        );
      }
    }

    // Send email notification to admin
    const createdOrder = { _id: result.insertedId, ...orderData };
    sendOrderNotificationToAdmin(createdOrder).catch((err) =>
      console.error("Email notification failed:", err),
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: createdOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// Get all orders for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const db = await getDB();
    const orders = db.collection("orders");

    const userOrders = await orders
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Get single order by ID
router.get("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const orders = db.collection("orders");

    const order = await orders.findOne({ _id: new ObjectId(req.params.id) });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// Update order status (Admin)
router.patch("/:id/status", async (req, res) => {
  try {
    const db = await getDB();
    const orders = db.collection("orders");

    const { status } = req.body;

    // Get order details before updating
    const order = await orders.findOne({ _id: new ObjectId(req.params.id) });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const result = await orders.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Send email notification to user about status change
    const updatedOrder = { ...order, status };
    sendStatusUpdateToUser(updatedOrder, status).catch((err) =>
      console.error("Email notification failed:", err),
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const orders = db.collection("orders");
    const products = db.collection("products");

    // Get order details before deleting to restore stock
    const order = await orders.findOne({ _id: new ObjectId(req.params.id) });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Restore product stock
    await products.updateOne(
      { _id: new ObjectId(order.product.id) },
      { $inc: { quantity: order.quantity } },
    );

    // Send cancellation email to admin
    sendCancellationNotificationToAdmin(order).catch((err) =>
      console.error("Email notification failed:", err),
    );

    // Delete the order
    await orders.deleteOne({ _id: new ObjectId(req.params.id) });

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
});

export default router;
