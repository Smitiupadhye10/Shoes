import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Footprints,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    mensShoes: 0,
    womensShoes: 0,
    kidsShoes: 0,
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

      // ✅ Calculate product stats by category - exact matches only
      const totalProducts = productsArray.length;
      const mensShoes = productsArray.filter((p) => 
        p.category === "Men's Shoes" || 
        p._type === 'mensShoe'
      ).length;
      const womensShoes = productsArray.filter((p) => 
        p.category === "Women's Shoes" || 
        p._type === 'womensShoe'
      ).length;
      const kidsShoes = productsArray.filter((p) => 
        p.category === "Kids Shoes" || 
        p._type === 'kidsShoe'
      ).length;

      // ✅ Calculate order stats
      const pending = ordersArray.filter((o) => o.status === "pending").length;
      const processing = ordersArray.filter((o) => o.status === "processing").length;
      const delivered = ordersArray.filter((o) => o.status === "delivered").length;
      const completed = delivered;

      const revenue = ordersArray
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + (o.totalAmount || o.totalPrice || 0), 0);

      // ✅ Update dashboard stats
      setStats({
        products: totalProducts,
        mensShoes,
        womensShoes,
        kidsShoes,
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
        return { bg: 'var(--text-heading)', text: 'var(--bg-primary)', border: 'var(--text-heading)' };
      case "processing":
        return { bg: 'var(--bg-secondary)', text: 'var(--text-primary)', border: 'var(--border-color)' };
      case "delivered":
        return { bg: '#10b981', text: 'white', border: '#10b981' };
      case "cancel":
        return { bg: '#ef4444', text: 'white', border: '#ef4444' };
      default:
        return { bg: 'var(--bg-secondary)', text: 'var(--text-primary)', border: 'var(--border-color)' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 mx-auto mb-4" style={{ borderTop: '4px solid var(--text-heading)', borderRight: '4px solid transparent' }}></div>
          <p className="text-optic-body text-lg" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Format revenue in Indian Rupees with proper formatting
  const formatRevenue = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }} className="min-h-screen">
      <div className="container-optic p-4 sm:p-6">
        <h1 className="text-optic-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard title="Total Products" value={stats.products} icon={Package} />
          <StatCard title="Men's Shoes" value={stats.mensShoes} icon={Footprints} />
          <StatCard title="Women's Shoes" value={stats.womensShoes} icon={Footprints} />
          <StatCard title="Kids Shoes" value={stats.kidsShoes} icon={Footprints} />
          <StatCard title="Total Orders" value={stats.orders} icon={ShoppingCart} />
          {stats.orders > 0 && (
            <>
              <StatCard title="Pending" value={stats.pending} icon={Clock} />
              <StatCard title="Processing" value={stats.processing} icon={TrendingUp} />
              <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} />
            </>
          )}
          <div className="card-optic p-4 sm:p-6 hover:shadow-xl transition-shadow col-span-1 sm:col-span-2 lg:col-span-1" style={{ backgroundColor: 'var(--text-heading)' }}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: 'var(--bg-primary)' }}>Revenue</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold truncate" style={{ color: 'var(--bg-primary)' }}>{formatRevenue(stats.revenue)}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ml-2 sm:ml-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <DollarSign className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card-optic overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-optic-heading text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 sm:px-6 py-12 sm:py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                        <p className="text-base sm:text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No orders yet</p>
                        <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Orders will appear here once customers start placing them</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors" style={{ hoverBackgroundColor: 'var(--bg-secondary)' }}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                          <span className="hidden sm:inline">,</span>
                          <span className="text-xs">
                            {new Date(order.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        }).format(order.totalAmount || 0)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border inline-block"
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
  <div className="card-optic p-4 sm:p-6 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        <p className="text-2xl sm:text-3xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>{value}</p>
      </div>
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ml-2 sm:ml-4" style={{ backgroundColor: 'var(--text-heading)' }}>
        <Icon style={{ color: 'var(--bg-primary)' }} className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    </div>
  </div>
);

export default AdminDashboard;
