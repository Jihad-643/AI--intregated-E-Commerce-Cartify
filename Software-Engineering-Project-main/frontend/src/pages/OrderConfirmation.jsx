import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiCheck, HiHome, HiDownload } from "react-icons/hi";
import jsPDF from "jspdf";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/products", { replace: true });
    }
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const orderId = order.orderId || order._id || "N/A";
    const orderIdString = typeof orderId === "object" ? orderId.toString() : orderId;

    // Set font
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("Order Confirmation", 105, 20, { align: "center" });

    // Order ID
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Order ID: #" + orderIdString, 20, 40);
    doc.text("Date: " + new Date(order.orderDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }), 20, 50);

    // Product Details
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Product Details", 20, 70);
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text("Title: " + order.product.title, 20, 80);
    doc.text("Price: BDT " + order.product.price, 20, 88);
    doc.text("Quantity: " + order.quantity, 20, 96);
    doc.text("Category: " + order.product.category, 20, 104);

    // Customer Information
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Customer Information", 20, 124);
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text("Name: " + order.customerInfo.name, 20, 134);
    doc.text("Email: " + order.customerInfo.email, 20, 142);
    doc.text("Phone: " + order.customerInfo.phone, 20, 150);
    doc.text("Address: " + order.customerInfo.address, 20, 158);

    // Order Summary
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Order Summary", 20, 178);
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text("Subtotal (" + order.quantity + " items): BDT " + (order.product.price * order.quantity), 20, 188);
    doc.text("Delivery Fee: BDT " + order.deliveryFee, 20, 196);
    
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Total: BDT " + order.total, 20, 210);

    // Footer
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Thank you for your order!", 105, 270, { align: "center" });
    doc.text("Cartify - Your trusted shopping partner", 105, 280, { align: "center" });

    // Save PDF
    doc.save("Order_" + orderIdString + ".pdf");
  };

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <HiCheck className="text-white text-5xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-center">
            Thank you for your order. We'll process it shortly.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
        >
          {/* Order ID */}
          <div className="border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Order Details
            </h2>
            <p className="text-gray-600">
              Order ID:{" "}
              <span className="font-mono font-bold">
                #
                {typeof order.orderId === "object"
                  ? order.orderId.toString()
                  : order.orderId || order._id}
              </span>
            </p>
            <p className="text-gray-600 text-sm">
              Date:{" "}
              {new Date(order.orderDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Product Details */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Product</h3>
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <img
                src={order.product.imageUrl}
                alt={order.product.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">
                  {order.product.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  Quantity: {order.quantity}
                </p>
                <p className="text-gray-800 font-bold">
                  ৳{order.product.price} x {order.quantity}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-4">
              Customer Information
            </h3>
            <div className="space-y-2 bg-gray-50 rounded-xl p-4">
              <div>
                <span className="text-gray-600 text-sm">Name:</span>
                <p className="font-medium text-gray-800">
                  {order.customerInfo.name}
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Email:</span>
                <p className="font-medium text-gray-800">
                  {order.customerInfo.email}
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Phone:</span>
                <p className="font-medium text-gray-800">
                  {order.customerInfo.phone}
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Delivery Address:</span>
                <p className="font-medium text-gray-800">
                  {order.customerInfo.address}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({order.quantity} items)</span>
                <span>৳{order.product.price * order.quantity}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>৳{order.deliveryFee}</span>
              </div>
              <div className="border-t border-purple-200 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-gray-800">৳{order.total}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-800 text-gray-800 px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-gray-50 transition-all duration-300"
          >
            <HiDownload className="text-xl" />
            Download as PDF
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <HiHome className="text-xl" />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
