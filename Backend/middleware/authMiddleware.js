import jwt from "jsonwebtoken";

/**
 * Admin authentication middleware.
 * Expects Authorization: Bearer <token>
 * Verifies token and attaches `req.admin = { username }` when valid.
 */
export const protectAdmin = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization || req.headers.Authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      res.status(401);
      return res.json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      return res.json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret);

    // attach admin info to request
    req.admin = { username: decoded.username };
    return next();
  } catch (error) {
    res.status(401);
    return res.json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }
};

export default protectAdmin;
