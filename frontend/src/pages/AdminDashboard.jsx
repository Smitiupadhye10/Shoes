import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  TrendingUp,
  Eye,
  DollarSign,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    contactLenses: 0,
    orders: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    completed: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // ✅ Fetch ALL products from admin endpoint (no pagination)
      const api = await import("../api/axios.js");
      const productsRes = await api.default.get("/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productData = productsRes.data;

      const productsArray = Array.isArray(productData)
        ? productData
        : Array.isArray(productData.products)
        ? productData.products
        : [];

      // ✅ Sort products by MongoDB ObjectId (descending → newest first)
      const sortedProducts = [...productsArray].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // ✅ Fetch all orders
      const ordersRes = await api.default.get("/admin/orders");
      const orderData = ordersRes.data;

      const ordersArray = Array.isArray(orderData)
        ? orderData
        : Array.isArray(orderData.orders)
        ? orderData.orders
        : [];

      // ✅ Calculate product stats
      const totalProducts = productsArray.length;
      const contactLenses = sortedProducts.filter(
        (p) => p.category === "Contact Lenses"
      ).length;

      // ✅ Calculate order stats
      const pending = ordersArray.filter((o) => o.status === "pending").length;
      const processing = ordersArray.filter((o) => o.status === "processing").length;
      const delivered = ordersArray.filter((o) => o.status === "delivered").length;
      const completed = delivered;

      const revenue = ordersArray
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // ✅ Update dashboard stats
      setStats({
        products: totalProducts,
        contactLenses,
        orders: ordersArray.length,
        pending,
        processing,
        delivered,
        completed,
        revenue,
      });

      // ✅ Show 10 most recent orders
      const recent = ordersArray
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setRecentOrders(recent);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: 'var(--accent-yellow)', text: 'var(--text-primary)', border: 'var(--accent-yellow)' };
      case "processing":
        return { bg: 'var(--bg-secondary)', text: 'var(--text-primary)', border: 'var(--border-color)' };
      case "delivered":
        return { bg: '#10b981', text: 'white', border: '#10b981' };
      case "cancel":
        return { bg: '#ef4444', text: 'white', border: '#ef4444' };
      default:
        return { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)', border: 'var(--border-color)' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 mx-auto mb-4" style={{ borderTop: '4px solid var(--accent-yellow)', borderRight: '4px solid transparent' }}></div>
          <p className="text-optic-body text-lg" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-optic p-6">
        <h1 className="text-optic-heading text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Products" value={stats.products} icon={Package} />
          <StatCard title="Contact Lenses" value={stats.contactLenses} icon={Eye} />
          <StatCard title="Orders" value={stats.orders} icon={ShoppingCart} />
          <StatCard title="Pending" value={stats.pending} icon={Clock} />
          <StatCard title="Processing" value={stats.processing} icon={TrendingUp} />
          <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} />
          <div className="card-optic p-6 hover:shadow-xl transition-shadow" style={{ backgroundColor: 'var(--accent-yellow)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Revenue</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>₹{stats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--text-primary)' }}>
                <DollarSign className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card-optic overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors" style={{ hoverBackgroundColor: 'var(--bg-secondary)' }}>
                      <td className="px-6 py-4 text-sm whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        ,{" "}
                        {new Date(order.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                        ₹{order.totalAmount?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold border"
                          style={{
                            backgroundColor: getStatusColor(order.status).bg,
                            color: getStatusColor(order.status).text,
                            borderColor: getStatusColor(order.status).border
                          }}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Stat Card
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="card-optic p-6 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      </div>
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
        <Icon style={{ color: 'var(--text-primary)' }} size={28} />
      </div>
    </div>
  </div>
);

export default AdminDashboard;
