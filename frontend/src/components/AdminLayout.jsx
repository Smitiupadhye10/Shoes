import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Package, ShoppingCart, LayoutDashboard } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      try {
        const api = await import("../api/axios.js");
        const res = await api.default.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          if (res.data.isAdmin) {
            setIsAdmin(true);
          } else {
            alert("Admin access required");
            navigate("/home");
          }
        } else {
          navigate("/signin");
        }
      } catch (error) {
        navigate("/signin");
      }
    };
    checkAdmin();
  }, [navigate]);

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className="w-64 shadow-2xl" style={{ backgroundColor: 'var(--text-black)' }}>
        <div className="p-6">
          <h1 className="text-optic-heading text-2xl font-bold mb-8" style={{
            backgroundColor: location.pathname === "/admin/dashboard" ? 'var(--accent-yellow)' : 'transparent',
            color: 'black'
          }}
          >Admin</h1>
          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === "/admin/dashboard"
                  ? "bg-yellow-400 text-gray-900"
                  : "hover:bg-gray-700 text-gray-300"
                }`}
              style={{
                backgroundColor: location.pathname === "/admin/dashboard" ? 'var(--accent-yellow)' : 'transparent',
                color: 'black'
              }}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === "/admin/products"
                  ? "bg-yellow-400 text-gray-900"
                  : "hover:bg-gray-700 text-gray-300"
                }`}
              style={{
                backgroundColor: location.pathname === "/admin/products" ? 'var(--accent-yellow)' : 'transparent',
                color: 'black'
              }}
            >
              <Package className="w-5 h-5" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === "/admin/orders"
                  ? "bg-yellow-400 text-gray-900"
                  : "hover:bg-gray-700 text-gray-300"
                }`}
              style={{
                backgroundColor: location.pathname === "/admin/orders" ? 'var(--accent-yellow)' : 'transparent',
                color: 'black'
              }}
            >
              <ShoppingCart className="w-5 h-5" />
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
