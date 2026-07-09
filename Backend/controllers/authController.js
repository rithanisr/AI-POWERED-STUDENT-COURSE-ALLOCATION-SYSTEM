import generateToken from "../utils/generateToken.js";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      res.status(400);
      return res.json({
        success: false,
        message: "Username and password are required",
      });
    }

    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      res.status(500);
      return res.json({
        success: false,
        message: "Admin credentials not configured",
      });
    }

    if (username !== adminUser || password !== adminPass) {
      res.status(401);
      return res.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = generateToken({ username: adminUser });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: { username: adminUser },
    });
  } catch (error) {
    next(error);
  }
};

export default { login };
