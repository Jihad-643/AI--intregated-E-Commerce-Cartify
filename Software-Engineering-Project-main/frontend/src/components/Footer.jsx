import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiShoppingBag,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiHeart,
} from "react-icons/hi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const customerService = [
    { name: "Help Center", path: "#" },
    { name: "Shipping Info", path: "#" },
    { name: "Returns", path: "#" },
    { name: "Order Tracking", path: "#" },
    { name: "FAQ", path: "#" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebook,
      url: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: "https://twitter.com",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: "https://linkedin.com",
      color: "hover:text-blue-700",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      url: "https://youtube.com",
      color: "hover:text-red-600",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-lg flex items-center justify-center">
                <HiShoppingBag className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold">Cartify</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your trusted online shopping destination. Discover amazing
              products with unbeatable prices and exceptional service.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <HiMail className="text-gray-400" />
                <span>support@cartify.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiPhone className="text-gray-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiLocationMarker className="text-gray-400" />
                <span>123 E-Commerce Street, NY 10001</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service added */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">
              Stay Connected
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Subscribe to get special offers, updates and more!
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-white/10 border border-gray-500/50 focus:outline-none focus:border-gray-600 text-white placeholder-gray-400"
              />
              <button className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-2 rounded-r-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 font-semibold">
                Subscribe
              </button>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center ${social.color} transition-all duration-300 hover:bg-white/20`}
                  >
                    <social.icon className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-gray-300 text-sm"
            >
              &copy; {currentYear} Cartify. All rights reserved.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 text-sm flex items-center"
            >
              Made with <HiHeart className="text-red-500 mx-1" /> by Cartify
              Team
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex space-x-4 text-sm"
            >
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-gray-500">|</span>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
