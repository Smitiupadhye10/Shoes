import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filterStatus === "all"
        ? "/admin/orders"
        : `/admin/orders?status=${filterStatus}`;
      
      const { data } = await api.get(url);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      alert("Order status updated!");
      fetchOrders();
    } catch (error) {
      alert("Error updating order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancel":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h1 className="text-optic-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>Order Management</h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 card-optic p-2 sm:p-3">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              filterStatus === "all"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={filterStatus !== "all" ? { color: 'var(--text-primary)' } : {}}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              filterStatus === "pending"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={filterStatus !== "pending" ? { color: 'var(--text-primary)' } : {}}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("processing")}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              filterStatus === "processing"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={filterStatus !== "processing" ? { color: 'var(--text-primary)' } : {}}
          >
            Processing
          </button>
          <button
            onClick={() => setFilterStatus("delivered")}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              filterStatus === "delivered"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={filterStatus !== "delivered" ? { color: 'var(--text-primary)' } : {}}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilterStatus("cancel")}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              filterStatus === "cancel"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={filterStatus !== "cancel" ? { color: 'var(--text-primary)' } : {}}
          >
            Cancelled
          </button>
        </div>

        {/* Orders List */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-optic-body text-lg sm:text-xl" style={{ color: 'var(--text-secondary)' }}>Loading orders...</div>
          </div>
        )}
        <div className="space-y-4 sm:space-y-6">
          {orders.length === 0 ? (
            <div className="card-optic p-8 sm:p-12 text-center">
              <p className="text-optic-body text-lg sm:text-xl" style={{ color: 'var(--text-secondary)' }}>No orders found</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="card-optic p-4 sm:p-6 hover:shadow-xl transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Customer: {order.userId?.name || order.userId?.email || "N/A"}
                    </p>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                      className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 transition-all w-full sm:w-auto"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancel">Cancel</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                  <h4 className="font-semibold mb-3 text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Order Items:</h4>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 pb-3 border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        {item.productId?.images && (
                          <img
                            src={Array.isArray(item.productId.images) ? item.productId.images[0] : item.productId.images?.image1 || "/placeholder.jpg"}
                            alt={item.productId?.title}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded border flex-shrink-0"
                            style={{ borderColor: 'var(--border-color)' }}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>{item.productId?.title || "Product"}</p>
                          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>Quantity: {item.quantity}</p>
                          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>Price: ₹{item.price}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t-2" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Total Amount:</span>
                    <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>₹{order.totalAmount?.toLocaleString() || 0}</span>
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Shipping Address:</h4>
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {order.shippingAddress.name}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

