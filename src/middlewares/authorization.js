const jwt = require("jsonwebtoken");
const { User, Session } = require("../../models");
const { Admin } = require("../../models/admin");

const UserAuthorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          code: "TOKEN_EXPIRED",
          message: "Token expired",
        });
      }

      return res.status(401).json({
        code: "INVALID_TOKEN",
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(decoded.user_id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Authorization error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const AdminAuthorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied, token missing." });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err || !decoded) {
        return res
          .status(403)
          .json({ message: "Access denied, invalid token." });
      }
      const admincheck = ["admin", "super-admin"];
      const checkDB = await Admin.findOne({ where: { email: decoded.email } });

      if (!checkDB || !admincheck.includes(checkDB.role.toLowerCase())) {
        return res
          .status(403)
          .json({ message: "Access denied, not an admin." });
      }

      req.admin = checkDB;
      // req.params.admin_id = checkDB.admin_id;
      // req.params.email = checkDB.email;

      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const blockSuspendedUsers = async (req, res, next) => {
  const userexist = await User.findOne({ where: { email: req.params.email } });
  if (userexist.is_active === false) {
    return res
      .status(403)
      .json({ message: "Your account is suspended, contact support" });
  }
  next();
};

module.exports = { UserAuthorization, AdminAuthorization, blockSuspendedUsers };
