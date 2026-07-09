import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for the given payload.
 * Reads `JWT_SECRET` and `JWT_EXPIRES_IN` from environment variables.
 *
 * @param {Object} payload - payload to include in token (e.g. { username })
 * @returns {string} signed JWT
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export default generateToken;
