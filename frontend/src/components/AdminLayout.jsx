import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Package, ShoppingCart, LayoutDashboard } from "lucide-react";
import { useUser } from "../context/UserContext";

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useUser();

  // Use user from context instead of separate API call
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Access Denied</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className="w-64 shadow-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="p-6">
          <h1 className="text-optic-heading text-2xl font-bold mb-8" style={{
            backgroundColor: 'var(--text-heading)',
            color: 'var(--bg-primary)',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem'
          }}
          >Admin</h1>
          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: location.pathname === "/admin/dashboard" ? 'var(--text-heading)' : 'transparent',
                color: location.pathname === "/admin/dashboard" ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
            >
              <LayoutDashboard className="w-5 h-5" style={{ color: location.pathname === "/admin/dashboard" ? 'var(--bg-primary)' : 'var(--text-primary)' }} />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: location.pathname === "/admin/products" ? 'var(--text-heading)' : 'transparent',
                color: location.pathname === "/admin/products" ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
            >
              <Package className="w-5 h-5" style={{ color: location.pathname === "/admin/products" ? 'var(--bg-primary)' : 'var(--text-primary)' }} />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: location.pathname === "/admin/orders" ? 'var(--text-heading)' : 'transparent',
                color: location.pathname === "/admin/orders" ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
            >
              <ShoppingCart className="w-5 h-5" style={{ color: location.pathname === "/admin/orders" ? 'var(--bg-primary)' : 'var(--text-primary)' }} />
              Orders
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
