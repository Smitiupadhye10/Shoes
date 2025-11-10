import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from "../api/axios";

const AuthPage = () => {
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser();

  // 🔹 Handle Login or Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        // ---- Login ----
        const result = await login(email.trim().toLowerCase(), password);
        if (result?.success) {
          navigate("/home", { replace: true });
        } else {
          throw new Error(result.error || "Invalid credentials");
        }
      } else {
        // ---- Signup ----
        const { data } = await api.post("/users/register", {
          name: `${firstName} ${lastName}`,
          email: email.trim().toLowerCase(),
          password,
          phone,
        });

        if (!data.token) throw new Error("Signup failed: No token received");
        localStorage.setItem("token", data.token);

        // Auto-login after signup
        const result = await login(email.trim().toLowerCase(), password);
        if (result?.success) {
          navigate("/home", { replace: true });
        } else {
          throw new Error("Signup succeeded, but login failed");
        }
      }
    } catch (err) {
      console.error("❌ Auth Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border p-2 rounded w-1/2"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border p-2 rounded w-1/2"
                  required
                />
              </div>

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {mode === "signin" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
