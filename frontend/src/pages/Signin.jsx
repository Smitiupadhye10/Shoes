import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AuthPage = () => {
  const [mode, setMode] = useState("signup"); // 'signup' | 'signin'
  const navigate = useNavigate();
  const { login } = useUser();

  // signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
  const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }
      if (data.token) localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error || "Sign in failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[28rem]">
        <div className="flex justify-center gap-6 mb-6">
          <button
            className={`${mode === "signup" ? "font-bold" : "text-gray-500"}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
          <button
            className={`${mode === "signin" ? "font-bold" : "text-gray-500"}`}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {mode === "signup" ? (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Create Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignin} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
