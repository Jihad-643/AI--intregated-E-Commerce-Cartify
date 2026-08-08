import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import ChatBot from "./ChatBot";
import {
  HiMenu,
  HiX,
  HiHome,
  HiShoppingBag,
  HiInformationCircle,
  HiMail,
  HiViewGrid,
  HiChatAlt2,
  HiUser,
  HiLogout,
} from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logoutUser();
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate("/profile");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: HiHome },
    { name: "Products", path: "/products", icon: HiShoppingBag },
    { name: "About", path: "/about", icon: HiInformationCircle },
    { name: "Contact", path: "/contact", icon: HiMail },
    { name: "Dashboard", path: "/dashboard", icon: HiViewGrid },
  ];

  if (user) {
    navLinks.push({
      name: "Chatbot",
      icon: HiChatAlt2,
      action: () => setIsChatOpen((prev) => !prev),
      button: true,
    });
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-lg flex items-center justify-center"
              >
                <HiShoppingBag className="text-white text-2xl" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Cartify
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => {
              const isAction = link.button === true;
              const isActive =
                !isAction &&
                (location.pathname === link.path ||
                  (link.path === "/dashboard" &&
                    location.pathname.startsWith("/dashboard")));

              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {isAction ? (
                    <button
                      type="button"
                      onClick={link.action}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <link.icon className="text-xl transition-transform duration-300" />
                      <span className="font-medium">{link.name}</span>
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 group relative ${
                        isActive
                          ? "hover:bg-gray-100"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <link.icon className="text-xl group-hover:scale-110 transition-transform duration-300" />
                      <span
                        className={`font-medium ${
                          isActive ? "text-gray-900" : ""
                        }`}
                      >
                        {link.name}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* User Menu / Login Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center space-x-4"
          >
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <HiUser className="text-xl" />
                    </div>
                  )}
                  <span className="font-medium">
                    {user.displayName || "User"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 border border-gray-200"
                    >
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left"
                      >
                        <HiUser className="text-gray-800" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full transition-colors text-left"
                      >
                        <HiLogout />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 40px rgba(168, 85, 247, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-purple-600 focus:outline-none"
          >
            {isOpen ? (
              <HiX className="text-3xl" />
            ) : (
              <HiMenu className="text-3xl" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link, index) => {
                const isAction = link.button === true;
                const isActive =
                  !isAction &&
                  (location.pathname === link.path ||
                    (link.path === "/dashboard" &&
                      location.pathname.startsWith("/dashboard")));

                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {isAction ? (
                      <button
                        type="button"
                        onClick={() => {
                          link.action?.();
                          toggleMenu();
                        }}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                      >
                        <link.icon className="text-xl" />
                        <span className="font-medium">{link.name}</span>
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={toggleMenu}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative ${
                          isActive
                            ? "hover:bg-gray-100 border-l-4 border-gray-800"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <link.icon
                          className={`text-xl ${isActive ? "text-gray-900" : ""}`}
                        />
                        <span
                          className={`font-medium ${
                            isActive ? "text-gray-900" : ""
                          }`}
                        >
                          {link.name}
                        </span>
                      </Link>
                    )}
                  </motion.div>
                );
              })}

              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full border-2 border-gray-800"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
                        <HiUser className="text-white text-xl" />
                      </div>
                    )}
                    <span className="font-semibold text-gray-800">
                      {user.displayName || "User"}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={toggleMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <HiUser className="text-gray-800 text-xl" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 w-full transition-all"
                  >
                    <HiLogout className="text-xl" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t border-gray-200"
                >
                  <Link to="/login" onClick={toggleMenu}>
                    <button className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      Login
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating chatbot for logged-in users */}
      {user && (
        <ChatBot
          isOpen={isChatOpen}
          onOpenToggle={() => setIsChatOpen((v) => !v)}
        />
      )}
    </nav>
  );
};

export default Navbar;
