const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find user by primary key (id)
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Not an Admin" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Unauthorized: Account is deactivated" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;