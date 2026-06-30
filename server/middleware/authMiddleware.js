import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded:", decoded);

      const user = await User.findById(decoded.id).select("-password");
      console.log("User:", user);

      req.user = user;

      return next();

    } catch (error) {
      console.log("JWT ERROR:", error);

      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "Not authorized, no token",
  });
};

export default protect;