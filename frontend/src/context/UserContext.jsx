import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data } = await api.get("/auth/me");

        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          isAdmin: data.isAdmin || false,
        };

        setUser(userData);
      } catch (err) {
        // 403/401 are expected when user is not authenticated - don't log as error
        const status = err?.response?.status;
        if (status === 403 || status === 401) {
          // Silently clear invalid token
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
        } else {
          // Only log unexpected errors
          console.error("❌ Error fetching user:", err);
          localStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Login function
  const login = async (email, password) => {
  try {
    const res = await api.post("/auth/signin", { email, password });
    console.log("LOGIN RESPONSE:", res.data);

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return { success: true };
    }

    return { success: false, error: "Login failed" };
  } catch (err) {
    console.log("LOGIN ERROR:", err?.response || err);
    console.log("ERROR STATUS:", err?.response?.status);
    console.log("ERROR DATA:", err?.response?.data);
    console.log("REQUEST URL:", err?.config?.baseURL + err?.config?.url);

    return {
      success: false,
      error: err?.response?.data?.message || err.message || "Something went wrong",
    };
  }
};


  // 🔹 Google Login function
  const loginWithGoogle = async (token, userData) => {
    try {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // If userData is provided, use it directly, otherwise fetch from API
      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          isAdmin: userData.isAdmin || false,
        });
      } else {
        // Fetch user data from API
        const { data } = await api.get("/auth/me");
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin || false,
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      return {
        success: false,
        error: error?.response?.data?.message || error.message || "Google login failed",
      };
    }
  };

  // 🔹 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
