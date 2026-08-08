import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { HiShoppingCart, HiArrowLeft, HiCheck, HiX, HiStar, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user) {
      setOrderData({
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
        address: "",
      });
    }
  }, [user]);

  // Auto-slide reviews every 5 seconds
  useEffect(() => {
    if (product?.reviews && product.reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % product.reviews.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [product?.reviews?.length, currentReviewIndex]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/products/${id}`,
      );
      setProduct(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!orderData.phone || !orderData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (quantity > product.quantity) {
      toast.error(`Only ${product.quantity} items available in stock`);
      return;
    }

    const orderDetails = {
      userId: user.uid,
      product: {
        id: product._id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      },
      quantity,
      deliveryFee: 100,
      total: product.price * quantity + 100,
      customerInfo: orderData,
      orderDate: new Date().toISOString(),
    };

    try {
      // Save order to MongoDB
      const apiUrl = `${import.meta.env.VITE_URL}/api/orders`;
      console.log("API URL:", apiUrl);
      console.log("Order details:", orderDetails);

      const response = await axios.post(apiUrl, orderDetails);

      toast.success("Order placed successfully!");
      setShowCheckoutModal(false);
      navigate("/order-confirmation", { state: { order: response.data.data } });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <HiStar
        key={index}
        className={`text-xl ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Handle review slider navigation
  const nextReview = () => {
    if (product?.reviews) {
      setCurrentReviewIndex((prev) => (prev + 1) % product.reviews.length);
    }
  };

  const prevReview = () => {
    if (product?.reviews) {
      setCurrentReviewIndex(
        (prev) => (prev - 1 + product.reviews.length) % product.reviews.length
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-800"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-800 hover:text-gray-900 mb-6 font-medium"
        >
          <HiArrowLeft className="text-xl" />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-4">
              {/* Main Image */}
              <div className="w-full h-96 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Category Badge */}
            <span className="inline-block bg-gray-100 text-gray-800 text-sm px-4 py-1 rounded-full mb-4 w-fit">
              {product.category}
            </span>

            {/* Product Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              {product.title}
            </h1>

            {/* Price section */}
            <div className="mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                ৳{product.price}
              </span>
            </div>

            {/* Average Rating */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(calculateAverageRating())}
                </div>
                <span className="text-2xl font-bold text-gray-800">
                  {calculateAverageRating()}
                </span>
                <span className="text-gray-600">
                  ({product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.quantity > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <HiCheck className="text-xl" />
                  <span className="font-medium">
                    In Stock ({product.quantity} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <HiX className="text-xl" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Customer Reviews
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="relative">
                {/* Review Slider */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReviewIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row items-start md:items-center gap-6"
                  >
                    {/* User Photo */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.reviews[currentReviewIndex].userPhoto}
                        alt={product.reviews[currentReviewIndex].userEmail}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                      />
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 w-full">
                      {/* User Email */}
                      <p className="text-gray-800 font-semibold text-lg mb-2">
                        {product.reviews[currentReviewIndex].userEmail}
                      </p>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(product.reviews[currentReviewIndex].rating)}
                        <span className="ml-2 text-gray-600 font-medium">
                          {product.reviews[currentReviewIndex].rating}.0
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                        "{product.reviews[currentReviewIndex].review}"
                      </p>

                      {/* Review Date */}
                      <p className="text-gray-400 text-sm mt-3">
                        {new Date(product.reviews[currentReviewIndex].date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.reviews.length > 1 && (
                  <div className="flex justify-center md:justify-end gap-3 mt-6">
                    <button
                      onClick={prevReview}
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
                      aria-label="Previous review"
                    >
                      <HiChevronLeft className="text-2xl" />
                    </button>
                    <button
                      onClick={nextReview}
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
                      aria-label="Next review"
                    >
                      <HiChevronRight className="text-2xl" />
                    </button>
                  </div>
                )}

                {/* Review Indicator Dots */}
                {product.reviews.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {product.reviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentReviewIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentReviewIndex
                            ? "w-8 bg-gray-800"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to review ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Checkout Modal */}
        <AnimatePresence>
          {showCheckoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                      Checkout
                    </h2>
                    <button
                      onClick={() => setShowCheckoutModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <HiX className="text-2xl text-gray-600" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {product.title}
                      </h3>
                      <p className="text-gray-800 font-bold">
                        ৳{product.price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-gray-700"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1),
                          )
                        }
                        className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        min="1"
                      />
                      <button
                        onClick={() => {
                          if (quantity >= product.quantity) {
                            toast.error(
                              `Only ${product.quantity} items available in stock`,
                            );
                          } else {
                            setQuantity(quantity + 1);
                          }
                        }}
                        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={orderData.name}
                        onChange={(e) =>
                          setOrderData({ ...orderData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={orderData.email}
                        onChange={(e) =>
                          setOrderData({ ...orderData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={orderData.phone}
                        onChange={(e) =>
                          setOrderData({ ...orderData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        value={orderData.address}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full address"
                        rows="3"
                        required
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-gray-800 mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({quantity} items)</span>
                        <span>৳{product.price * quantity}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee</span>
                        <span>৳100</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-purple-600">
                          ৳{product.price * quantity + 100}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Place Order
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductDetails;
