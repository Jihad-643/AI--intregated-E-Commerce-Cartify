import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { HiStar, HiX } from "react-icons/hi";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review: "",
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/orders/user/${user.uid}`,
      );
      setOrders(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_URL}/api/orders/${orderId}`);
      toast.success("Order cancelled successfully");
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const handleOpenReviewModal = (order) => {
    setSelectedOrder(order);
    setReviewData({ rating: 5, review: "" });
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedOrder(null);
    setReviewData({ rating: 5, review: "" });
  };

  const handleSubmitReview = async () => {
    if (!reviewData.review.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/products/${selectedOrder.product.id}/review`,
        {
          userEmail: user.email,
          userPhoto: user.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg",
          rating: reviewData.rating,
          review: reviewData.review,
          orderId: selectedOrder._id,
        }
      );
      toast.success("Review submitted successfully!");
      handleCloseReviewModal();
      fetchOrders(); // Refresh to update reviewed status
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.data?.message === "You have already reviewed this product") {
        toast.error("You have already reviewed this product");
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, index) => (
      <HiStar
        key={index}
        onClick={() => interactive && onStarClick && onStarClick(index + 1)}
        className={`text-2xl ${
          index < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
      />
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-cyan-100 text-cyan-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-gray-100 text-gray-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
          My Orders
        </h1>
        <p className="text-gray-600">
          {orders.length > 0
            ? `You have ${orders.length} order(s)`
            : "Track and manage your orders"}
        </p>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-12 text-center"
        >
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping now!
          </p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Delivery Address
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-900 font-mono">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.product.imageUrl}
                          alt={order.product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {order.product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            ৳{order.product.price}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                      ৳{order.total}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                      <p className="line-clamp-2">
                        {order.customerInfo.address}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {order.status === "pending" ? (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          Cancel Order
                        </button>
                      ) : order.status === "delivered" ? (
                        order.reviewed ? (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Reviewed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenReviewModal(order)}
                            className="text-xs bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:shadow-lg px-3 py-1.5 rounded-lg font-medium transition-all"
                          >
                            Write Review
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-gray-400">
                          {order.status === "cancelled"
                            ? "Cancelled"
                            : "Cannot Cancel"}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    Write a Review
                  </h2>
                  <button
                    onClick={handleCloseReviewModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <HiX className="text-2xl text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={selectedOrder.product.imageUrl}
                    alt={selectedOrder.product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      {selectedOrder.product.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Order #{selectedOrder._id.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {renderStars(reviewData.rating, true, (rating) =>
                      setReviewData({ ...reviewData, rating })
                    )}
                    <span className="ml-2 text-gray-600 font-medium">
                      {reviewData.rating}.0
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewData.review}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, review: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none"
                    placeholder="Share your experience with this product..."
                    rows="5"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
