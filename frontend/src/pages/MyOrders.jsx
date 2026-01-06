import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../api/axios';
import { Package, Calendar, MapPin, Phone, Filter, Search, ArrowRight, Truck, CheckCircle, Clock, XCircle, RefreshCw, Eye } from 'lucide-react';

const MyOrders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/payment/my-orders');
        setOrders(data.orders || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.items?.some(item => {
                            const productName = (item.product?.title || item.product?.name || '').toLowerCase();
                            return productName.includes(searchTerm.toLowerCase());
                          });
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      processing: <RefreshCw className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Package className="w-4 h-4" />;
  };

  const getProgressPercentage = (status) => {
    const progress = {
      pending: 25,
      processing: 50,
      completed: 100,
      cancelled: 0
    };
    return progress[status] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 mx-auto mb-4" style={{ borderTop: '4px solid var(--text-heading)', borderRight: '4px solid transparent' }}></div>
          <p className="text-optic-body text-lg" style={{ color: 'var(--text-secondary)' }}>Loading your orders...</p>
          <p className="text-optic-body text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>This will only take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="card-optic p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--text-heading)' }}>
            <XCircle className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
          </div>
          <h2 className="text-optic-heading text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Error Loading Orders</h2>
          <p className="text-optic-body mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic py-8">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <Package className="w-12 h-12" style={{ color: 'var(--text-secondary)' }} />
            </div>
            <h1 className="text-optic-heading text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>No Orders Yet</h1>
            <p className="text-optic-body mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Link 
              to="/shop" 
              className="btn-primary"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-optic pt-0 pb-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-optic-heading text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>My Orders</h1>
          <p className="text-optic-body text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Track and manage your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="card-optic p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID or product name..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    focusRingColor: 'var(--text-heading)'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                className="px-4 py-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                style={{ 
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  focusRingColor: 'var(--text-heading)'
                }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {/* Order Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="text-center">
              <p className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{orders.length}</p>
              <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                {orders.filter(o => o.status === 'pending').length}
              </p>
              <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Pending</p>
            </div>
            <div className="text-center">
              <p className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {orders.filter(o => o.status === 'processing').length}
              </p>
              <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Processing</p>
            </div>
            <div className="text-center">
              <p className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                {orders.filter(o => o.status === 'completed').length}
              </p>
              <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Completed</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-4">
                      {/* Product Images Preview */}
                      <div className="flex gap-2 flex-shrink-0">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.product?.images?.[0] || item.product?.image || item.product?.thumbnail || '/placeholder.jpg'}
                            alt={item.product?.title || item.product?.name || 'Product'}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white rounded-lg p-2 border"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center border">
                            <span className="text-xs font-medium text-gray-600">+{order.items.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-mono text-sm text-gray-600">Order #{order._id.slice(-8)}</p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {order.items?.length || 0} items
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{order.totalAmount}</p>
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="mt-2 flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium text-xs sm:text-sm transition"
                      >
                        {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                        <ArrowRight className={`w-4 h-4 transition-transform ${expandedOrder === order._id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Order Progress</span>
                      <span>{getProgressPercentage(order.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(order.status)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                {expandedOrder === order._id && (
                  <div className="border-t border-gray-100">
                    {/* Order Items */}
                    <div className="p-4 sm:p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Order Items</h4>
                      <div className="space-y-3 sm:space-y-4">
                        {order.items?.map((item) => (
                          <div key={item._id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <img
                              src={item.product?.images?.[0] || item.product?.image || item.product?.thumbnail || '/placeholder.jpg'}
                              alt={item.product?.title || item.product?.name || 'Product'}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white rounded-lg p-2 border flex-shrink-0"
                              onError={(e) => {
                                e.target.src = '/placeholder.jpg';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.product?.title || item.product?.name || 'Product'}</h5>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                                <span>Qty: {item.quantity}</span>
                                <span>₹{item.price} each</span>
                              </div>
                              <p className="text-xs sm:text-sm font-semibold text-sky-600 mt-1">
                                ₹{item.quantity * item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Shipping Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress?.street}, {order.shippingAddress?.city}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-600">{order.shippingAddress?.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end">
                          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">
                            <Eye className="w-4 h-4" />
                            Track Order
                          </button>
                        </div>
                      </div>
                    </div>
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

export default MyOrders;