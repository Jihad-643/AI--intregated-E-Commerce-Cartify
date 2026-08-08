import { useEffect, useState } from "react";
import {
  useNavigate,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import {
  HiPlus,
  HiViewGrid,
  HiShoppingCart,
  HiHome,
  HiLogout,
  HiMenu,
  HiHeart,
} from "react-icons/hi";
import Overview from "./admin/Overview";
import AddProduct from "./admin/AddProduct";
import AllProducts from "./admin/AllProducts";
import Orders from "./admin/Orders";
import MyOrders from "./user/MyOrders";
import Wishlist from "./user/Wishlist";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle window resize to show sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Check user role from backend
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/auth/user/${user.uid}`,
        );

        const role = response.data.data?.role || response.data.role;
        setUserRole(role);
        setLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  // Admin Dashboard with Sidebar
  if (userRole === "admin") {
    const adminLinks = [
      { name: "Overview", path: "/dashboard/admin/overview", icon: HiViewGrid },
      {
        name: "Add Product",
        path: "/dashboard/admin/add-product",
        icon: HiPlus,
      },
      {
        name: "All Products",
        path: "/dashboard/admin/all-products",
        icon: HiShoppingCart,
      },
      { name: "Orders", path: "/dashboard/admin/orders", icon: HiShoppingCart },
    ];

    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}

        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{
            x: isSidebarOpen ? 0 : -300,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-64 bg-white shadow-xl h-screen z-40 fixed flex flex-col lg:translate-x-0"
        >
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-600 mt-1">Cartify Dashboard</p>
          </div>

          <nav className="p-4 space-y-2 flex-1">
            {adminLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.button
                  key={link.name}
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    navigate(link.path);
                    // Only close sidebar on mobile
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg"
                      : "text-gray-700 hover:bg-purple-50"
                  }`}
                >
                  <link.icon className="text-xl" />
                  <span className="font-medium">{link.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 w-full h-screen overflow-y-auto lg:ml-64">
          {/* Mobile Menu Button - Inside Dashboard */}
          <div className="lg:hidden sticky top-0 z-20 bg-white shadow-md p-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <HiMenu className="text-2xl" />
            </button>
            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/admin/overview" element={<Overview />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/all-products" element={<AllProducts />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route
                path="*"
                element={<Navigate to="/dashboard/admin/overview" replace />}
              />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  // Regular User Dashboard
  const userLinks = [
    { name: "My Orders", path: "/dashboard/user/orders", icon: HiShoppingCart },
    { name: "Wishlist", path: "/dashboard/user/wishlist", icon: HiHeart },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -300,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-64 bg-white shadow-xl h-screen z-40 fixed flex flex-col lg:translate-x-0"
      >
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            User Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">Cartify</p>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {userLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.button
                key={link.name}
                whileHover={{ x: 5 }}
                onClick={() => {
                  navigate(link.path);
                  // Only close sidebar on mobile
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <link.icon className="text-xl" />
                <span className="font-medium">{link.name}</span>
              </motion.button>
            );
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 w-full h-screen overflow-y-auto lg:ml-64">
        {/* Mobile Menu Button - Inside Dashboard */}
        <div className="lg:hidden sticky top-0 z-20 bg-white shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <HiMenu className="text-2xl" />
          </button>
          <h2 className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            User Dashboard
          </h2>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/user/orders" element={<MyOrders />} />
            <Route path="/user/wishlist" element={<Wishlist />} />
            <Route
              path="*"
              element={<Navigate to="/dashboard/user/orders" replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
