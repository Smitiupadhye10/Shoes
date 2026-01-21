import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Package, ShoppingCart, LayoutDashboard, Menu, X } from "lucide-react";
import { useUser } from "../context/UserContext";

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <h1 className="text-optic-heading text-xl font-bold" style={{
          backgroundColor: 'var(--text-heading)',
          color: 'var(--bg-primary)',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem'
        }}>Admin</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="p-4 md:p-6 h-full overflow-y-auto">
          {/* Desktop Admin Header */}
          <div className="hidden md:block mb-8">
            <h1 className="text-optic-heading text-2xl font-bold" style={{
              backgroundColor: 'var(--text-heading)',
              color: 'var(--bg-primary)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem'
            }}>Admin</h1>
          </div>
          
          {/* Mobile Close Button */}
          <div className="md:hidden flex items-center justify-between mb-6">
            <h1 className="text-optic-heading text-xl font-bold" style={{
              backgroundColor: 'var(--text-heading)',
              color: 'var(--bg-primary)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem'
            }}>Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
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
              onClick={() => setSidebarOpen(false)}
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
              onClick={() => setSidebarOpen(false)}
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        <div className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
