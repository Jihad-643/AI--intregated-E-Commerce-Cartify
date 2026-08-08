import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  HiShoppingCart,
  HiUsers,
  HiCurrencyDollar,
  HiTrendingUp,
  HiChartBar,
  HiExclamationCircle,
} from "react-icons/hi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Overview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState({
    outOfStock: [],
    critical: [],
    low: [],
  });
  const [salesData, setSalesData] = useState({
    today: 0,
    week: 0,
    month: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products
        const productsRes = await axios.get(
          `${import.meta.env.VITE_URL}/api/products`,
        );

        // Fetch orders
        const ordersRes = await axios.get(
          `${import.meta.env.VITE_URL}/api/orders`,
        );

        // Fetch users
        const usersRes = await axios.get(
          `${import.meta.env.VITE_URL}/api/auth/users`,
        );

        const ordersData = ordersRes.data.data || [];
        setOrders(ordersData);

        const productsData = productsRes.data.data || productsRes.data || [];
        setProducts(productsData);

        // Categorize products by stock level
        const alerts = {
          outOfStock: productsData.filter((p) => p.quantity === 0),
          critical: productsData.filter((p) => p.quantity > 0 && p.quantity < 5),
          low: productsData.filter((p) => p.quantity >= 5 && p.quantity < 10),
        };
        setInventoryAlerts(alerts);

        // Calculate total revenue from orders
        const totalRevenue = ordersData.reduce(
          (sum, order) => sum + (order.total || 0),
          0,
        );

        // Calculate sales for different periods
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const weekStart = new Date(now.setDate(now.getDate() - 7));
        const monthStart = new Date(now.setDate(1));

        const todaySales = ordersData
          .filter((order) => new Date(order.orderDate) >= todayStart)
          .reduce((sum, order) => sum + order.total, 0);

        const weekSales = ordersData
          .filter((order) => new Date(order.orderDate) >= weekStart)
          .reduce((sum, order) => sum + order.total, 0);

        const monthSales = ordersData
          .filter((order) => new Date(order.orderDate) >= monthStart)
          .reduce((sum, order) => sum + order.total, 0);

        setSalesData({
          today: todaySales,
          week: weekSales,
          month: monthSales,
        });

        setStats({
          totalProducts: productsRes.data.data?.length || productsRes.data.length || 0,
          totalOrders: ordersData.length,
          totalUsers: usersRes.data.data?.length || 0,
          totalRevenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: HiShoppingCart,
      color: "from-gray-700 to-gray-900",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: HiChartBar,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: HiUsers,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: HiCurrencyDollar,
      color: "from-orange-500 to-orange-700",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  // Prepare chart data
  const orderStatusData = [
    {
      name: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      color: "#fbbf24",
    },
    {
      name: "Confirmed",
      value: orders.filter((o) => o.status === "confirmed").length,
      color: "#06b6d4",
    },
    {
      name: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length,
      color: "#10b981",
    },
    {
      name: "Cancelled",
      value: orders.filter((o) => o.status === "cancelled").length,
      color: "#ef4444",
    },
  ];

  // Last 7 days revenue data
  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const dayRevenue = orders
      .filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= dayStart && orderDate <= dayEnd;
      })
      .reduce((sum, order) => sum + order.total, 0);

    last7DaysData.push({
      name: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: dayRevenue,
      orders: orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= dayStart && orderDate <= dayEnd;
      }).length,
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <card.icon className={`text-2xl ${card.textColor}`} />
                </div>
                <HiTrendingUp className="text-green-500 text-xl" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inventory Alerts Section */}
      {(inventoryAlerts.outOfStock.length > 0 ||
        inventoryAlerts.critical.length > 0 ||
        inventoryAlerts.low.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 p-3 rounded-lg">
                  <HiExclamationCircle className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Inventory Alerts
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {inventoryAlerts.outOfStock.length +
                      inventoryAlerts.critical.length +
                      inventoryAlerts.low.length}{" "}
                    product(s) need attention
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Out of Stock */}
              {inventoryAlerts.outOfStock.length > 0 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-red-600">Out of Stock</h3>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                      {inventoryAlerts.outOfStock.length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {inventoryAlerts.outOfStock.slice(0, 5).map((product) => (
                      <Link
                        key={product._id}
                        to={`/admin/products`}
                        className="block text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-2 rounded transition-colors"
                      >
                        <div className="font-medium truncate">
                          {product.title}
                        </div>
                        <div className="text-xs text-red-600">
                          Stock: {product.quantity}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Critical Stock */}
              {inventoryAlerts.critical.length > 0 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-orange-600">
                      Critical ({"<"}5)
                    </h3>
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-bold">
                      {inventoryAlerts.critical.length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {inventoryAlerts.critical.slice(0, 5).map((product) => (
                      <Link
                        key={product._id}
                        to={`/admin/products`}
                        className="block text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-2 rounded transition-colors"
                      >
                        <div className="font-medium truncate">
                          {product.title}
                        </div>
                        <div className="text-xs text-orange-600">
                          Stock: {product.quantity}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Stock */}
              {inventoryAlerts.low.length > 0 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-yellow-600">
                      Low Stock ({"<"}10)
                    </h3>
                    <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full font-bold">
                      {inventoryAlerts.low.length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {inventoryAlerts.low.slice(0, 5).map((product) => (
                      <Link
                        key={product._id}
                        to={`/admin/products`}
                        className="block text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-2 rounded transition-colors"
                      >
                        <div className="font-medium truncate">
                          {product.title}
                        </div>
                        <div className="text-xs text-yellow-600">
                          Stock: {product.quantity}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Last 7 Days Revenue</h2>
            <HiChartBar className="text-gray-800 text-2xl" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#374151" name="Revenue (৳)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Order Status</h2>
            <HiChartBar className="text-gray-800 text-2xl" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Sales Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-md p-6 mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
          <HiCurrencyDollar className="text-green-600 text-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Today's Sales</span>
              <span className="font-bold text-gray-800">
                ৳{salesData.today.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gray-700 to-gray-900 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalRevenue > 0 ? (salesData.today / stats.totalRevenue) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">This Week</span>
              <span className="font-bold text-blue-600">
                ৳{salesData.week.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalRevenue > 0 ? (salesData.week / stats.totalRevenue) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">This Month</span>
              <span className="font-bold text-green-600">
                ৳{salesData.month.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalRevenue > 0 ? (salesData.month / stats.totalRevenue) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
