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
        const { data } = await api.get("/users/me");

        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          isAdmin: data.isAdmin || false,
        };

        setUser(userData);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      if (!data.token) throw new Error("No token received");

      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      const { data: profile } = await api.get("/users/me");

      const userObj = {
        id: profile._id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        isAdmin: profile.isAdmin || false,
      };

      setUser(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      console.error("❌ Login failed:", err);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
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
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
