import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiViewGrid,
  HiShoppingCart,
  HiLogout,
  HiHome,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const { logoutUser } = useAuth();

  const sidebarLinks = [
    { name: "Add Product", path: "/admin/add-product", icon: HiPlus },
    { name: "All Products", path: "/admin/all-products", icon: HiViewGrid },
    { name: "Orders", path: "/admin/orders", icon: HiShoppingCart },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-xl fixed h-full z-40"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-sm text-gray-500 mt-1">Cartify Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-purple-50"
                }`}
              >
                <link.icon className="text-xl" />
                <span className="font-medium">{link.name}</span>
              </motion.div>
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-200 space-y-2">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 transition-all duration-300"
              >
                <HiHome className="text-xl" />
                <span className="font-medium">Back to Home</span>
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={logoutUser}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 w-full"
            >
              <HiLogout className="text-xl" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
