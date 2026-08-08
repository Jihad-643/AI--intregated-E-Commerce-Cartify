import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  HiShoppingCart,
  HiArrowRight,
  HiChevronLeft,
  HiChevronRight,
  HiStar,
  HiMail,
  HiUser,
  HiChatAlt2,
  HiPhone,
} from "react-icons/hi";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const banners = [
    {
      id: 1,
      title: "Summer Collection 2026",
      subtitle: "Up to 50% OFF on All Items",
      description: "Discover the latest trends in fashion and accessories",
      cta: "Shop Now",
      bgGradient: "from-gray-700 via-gray-800 to-gray-900",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh Styles Just Dropped",
      description: "Be the first to grab our exclusive new collection",
      cta: "Explore Collection",
      bgGradient: "from-blue-600 via-indigo-500 to-purple-600",
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
    },
    {
      id: 3,
      title: "Tech Gadgets Sale",
      subtitle: "Amazing Deals on Electronics",
      description: "Latest gadgets at unbeatable prices",
      cta: "View Deals",
      bgGradient: "from-cyan-600 via-blue-500 to-indigo-600",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&q=80",
    },
    {
      id: 4,
      title: "Home & Living",
      subtitle: "Transform Your Space",
      description: "Beautiful home decor and furniture collection",
      cta: "Shop Home",
      bgGradient: "from-emerald-600 via-teal-500 to-cyan-600",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
    },
    {
      id: 5,
      title: "Exclusive Brands",
      subtitle: "Premium Quality Products",
      description: "Shop from the world's leading brands",
      cta: "Discover Brands",
      bgGradient: "from-rose-600 via-pink-500 to-purple-600",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}/api/products`,
        );
        const data = await response.json();
        if (data.success) {
          // Get only first 6 products
          setProducts(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateContactForm = () => {
    if (!contactForm.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!contactForm.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!contactForm.subject.trim()) {
      toast.error("Please enter a subject");
      return false;
    }
    if (!contactForm.message.trim()) {
      toast.error("Please enter your message");
      return false;
    }
    return true;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!validateContactForm()) {
      return;
    }

    setIsSubmittingContact(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setContactForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(
          data.message || "Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Hero Slider Section */}
      <div className="relative h-[450px] md:h-[550px] overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={banners[currentSlide].image}
                alt={banners[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="max-w-3xl"
                >
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg"
                  >
                    {banners[currentSlide].title}
                  </motion.h1>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-2xl md:text-4xl font-semibold text-white/90 mb-6 drop-shadow-md"
                  >
                    {banners[currentSlide].subtitle}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-lg md:text-xl text-white/80 mb-8 drop-shadow"
                  >
                    {banners[currentSlide].description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="flex flex-wrap gap-3"
                  >
                    <Link to="/products">
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 20px 60px rgba(255, 255, 255, 0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-gray-800 px-4 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 flex items-center space-x-1.5 md:space-x-2"
                      >
                        <HiShoppingCart className="text-lg md:text-2xl" />
                        <span>{banners[currentSlide].cta}</span>
                        <HiArrowRight className="text-base md:text-xl" />
                      </motion.button>
                    </Link>
                    <Link to="/about">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/20 backdrop-blur-md text-white border-2 border-white px-4 py-2.5 md:px-8 md:py-4 rounded-full font-semibold text-sm md:text-lg shadow-xl hover:bg-white/30 transition-all duration-300"
                      >
                        Learn More
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 z-10 group"
        >
          <HiChevronLeft className="text-3xl group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 z-10 group"
        >
          <HiChevronRight className="text-3xl group-hover:scale-110 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-12 h-3 bg-white"
                  : "w-3 h-3 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        ></motion.div>
      </div>

      {/* Featured Products Section */}
      <div className="py-8 md:py-12 -mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Featured Products
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Check out our hand-picked selection of trending items
            </p>
          </motion.div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-56 md:h-64 bg-gray-300"></div>
                  <div className="p-4 md:p-6 space-y-3">
                    <div className="h-6 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <Link to={`/products/${product._id}`}>
                      <div className="relative h-56 md:h-64 overflow-hidden bg-gray-100">
                        <img
                          src={
                            product.imageUrl ||
                            "https://via.placeholder.com/400x300?text=No+Image"
                          }
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                        {product.quantity < 10 && product.quantity > 0 && (
                          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                            Low Stock
                          </div>
                        )}
                        {product.quantity === 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                            Out of Stock
                          </div>
                        )}
                      </div>
                      <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            ${product.price?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2"
                  >
                    <span>View All Products</span>
                    <HiArrowRight className="text-xl md:text-2xl" />
                  </motion.button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Contact Form Section - Compact Version */}
      <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Get in Touch
            </h2>
            <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
              Have a question? Send us a message and we'll respond within 24
              hours!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiMail className="text-white text-xl" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm">Email Us</p>
                <p className="text-gray-600 text-sm truncate">
                  support@cartify.com
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiPhone className="text-white text-xl" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm">Call Us</p>
                <p className="text-gray-600 text-sm truncate">
                  +1 (555) 123-4567
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center justify-center lg:justify-start"
            >
              <Link to="/contact" className="w-full">
                <button className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  View Full Contact Page
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                  <HiChatAlt2 className="text-white text-xl" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  Quick Message
                </h3>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Name *
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Email *
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="tel"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Tell us more..."
                    required
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmittingContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto md:px-8 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-2.5 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmittingContact ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
