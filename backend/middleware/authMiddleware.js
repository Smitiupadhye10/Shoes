import jwt from "jsonwebtoken";

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // use your secret
    req.user = decoded; // attach decoded user info to request
    next(); // allow request to continue
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  const emails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  const okByRole = String(user.role || "").toLowerCase() === "admin";
  const okByEmail = user.email && emails.includes(String(user.email).toLowerCase());
  if (okByRole || okByEmail) return next();
  return res.status(403).json({ message: "Admin access required" });
};
