import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// Send email to admin when user places an order
export const sendOrderNotificationToAdmin = async (orderData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - Order #${orderData._id?.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="background: linear-gradient(to right, #374151, #111827); color: white; padding: 20px; text-align: center;">
            New Order Notification
          </h2>
          <div style="padding: 20px; background-color: #f9fafb;">
            <h3 style="color: #111827;">Order Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Order ID:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">#${orderData._id?.toString().slice(-8)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Product:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.product.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Quantity:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">৳${orderData.total}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Status:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.status}</td>
              </tr>
            </table>
            
            <h3 style="color: #111827; margin-top: 20px;">Customer Information:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.customerInfo.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.customerInfo.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.customerInfo.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.customerInfo.address}</td>
              </tr>
            </table>
            
            <p style="margin-top: 20px; color: #6b7280;">
              Please process this order as soon as possible.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order notification sent to admin");
  } catch (error) {
    console.error("Error sending email to admin:", error);
  }
};

// Send email to admin when user cancels an order
export const sendCancellationNotificationToAdmin = async (orderData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Order Cancelled - Order #${orderData._id?.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="background: linear-gradient(to right, #dc2626, #991b1b); color: white; padding: 20px; text-align: center;">
            Order Cancellation Notice
          </h2>
          <div style="padding: 20px; background-color: #fef2f2;">
            <h3 style="color: #991b1b;">Order Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Order ID:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;">#${orderData._id?.toString().slice(-8)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Product:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;">${orderData.product.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Quantity:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;">${orderData.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;">৳${orderData.total}</td>
              </tr>
            </table>
            
            <h3 style="color: #991b1b; margin-top: 20px;">Customer Information:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Name:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;">${orderData.customerInfo.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Email:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;">${orderData.customerInfo.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Phone:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #fecaca;">${orderData.customerInfo.phone}</td>
              </tr>
            </table>
            
            <p style="margin-top: 20px; color: #991b1b;">
              <strong>This order has been cancelled by the customer. Product stock has been restored.</strong>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Cancellation notification sent to admin");
  } catch (error) {
    console.error("Error sending cancellation email to admin:", error);
  }
};

// Send email to user when admin changes order status
export const sendStatusUpdateToUser = async (orderData, newStatus) => {
  try {
    const statusMessages = {
      pending: "Your order has been received and is pending confirmation.",
      confirmed: "Your order has been confirmed and will be processed soon.",
      processing: "Your order is being processed and prepared for shipment.",
      shipped: "Your order has been shipped and is on its way to you.",
      delivered: "Your order has been delivered successfully. Thank you for shopping with us!",
      cancelled: "Your order has been cancelled.",
    };

    const statusColors = {
      pending: "#eab308",
      confirmed: "#06b6d4",
      processing: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: orderData.customerInfo.email,
      subject: `Order Status Update - Order #${orderData._id?.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="background: linear-gradient(to right, #374151, #111827); color: white; padding: 20px; text-align: center;">
            Order Status Updated
          </h2>
          <div style="padding: 20px; background-color: #f9fafb;">
            <div style="background-color: ${statusColors[newStatus]}; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <h3 style="margin: 0;">Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</h3>
              <p style="margin: 10px 0 0 0;">${statusMessages[newStatus]}</p>
            </div>
            
            <h3 style="color: #111827;">Order Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Order ID:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">#${orderData._id?.toString().slice(-8)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Product:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.product.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Quantity:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">৳${orderData.total}</td>
              </tr>
            </table>
            
            <h3 style="color: #111827; margin-top: 20px;">Delivery Address:</h3>
            <p style="padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
              ${orderData.customerInfo.address}
            </p>
            
            <p style="margin-top: 20px; color: #6b7280;">
              If you have any questions about your order, please contact our customer support.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Status update email sent to user");
  } catch (error) {
    console.error("Error sending status update email to user:", error);
  }
};

// Send inventory alert email to admin
export const sendInventoryAlert = async (productData, alertType) => {
  try {
    const alertColors = {
      critical: "#dc2626",
      low: "#f59e0b",
      outOfStock: "#991b1b",
    };

    const alertMessages = {
      critical: "Critical Stock Level - Immediate Action Required!",
      low: "Low Stock Alert - Reorder Recommended",
      outOfStock: "Out of Stock - Product Unavailable",
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `⚠️ Inventory Alert: ${productData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="background: linear-gradient(to right, ${alertColors[alertType]}, #991b1b); color: white; padding: 20px; text-align: center;">
            ${alertMessages[alertType]}
          </h2>
          <div style="padding: 20px; background-color: #fef2f2;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #991b1b; margin-top: 0;">Product Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Product Name:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #fecaca;">${productData.title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Current Stock:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #fecaca; color: ${alertColors[alertType]}; font-weight: bold; font-size: 18px;">
                    ${productData.quantity} units
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Category:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #fecaca;">${productData.category}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #fecaca;"><strong>Price:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #fecaca;">৳${productData.price}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: ${alertType === 'outOfStock' ? '#fee2e2' : '#fef3c7'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${alertColors[alertType]};">
              <h4 style="margin-top: 0; color: ${alertColors[alertType]};">Recommended Action:</h4>
              <ul style="margin: 10px 0;">
                ${alertType === 'outOfStock' 
                  ? '<li>Product is currently out of stock and unavailable for purchase</li><li>Contact suppliers immediately for restock</li><li>Consider removing from featured products</li>'
                  : alertType === 'critical'
                  ? '<li>Stock level is critically low (less than 5 units)</li><li>Place urgent reorder to prevent stockout</li><li>Consider increasing safety stock levels</li>'
                  : '<li>Stock level is below threshold (less than 10 units)</li><li>Review sales velocity and plan reorder</li><li>Monitor closely to avoid stockout</li>'
                }
              </ul>
            </div>
            
            <p style="margin-top: 20px; color: #991b1b; font-weight: bold;">
              Please take immediate action to ensure product availability and customer satisfaction.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Inventory alert (${alertType}) sent to admin for product: ${productData.title}`);
  } catch (error) {
    console.error("Error sending inventory alert email:", error);
  }
};

export default transporter;
