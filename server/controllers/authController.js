const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../config/mailer");
const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRY });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

// POST /api/auth/register
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      accessToken: signAccessToken(admin._id),
      refreshToken: signRefreshToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      accessToken: signAccessToken(admin._id),
      refreshToken: signRefreshToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/refresh
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }
    res.json({
      accessToken: signAccessToken(admin._id),
      refreshToken: signRefreshToken(admin._id),
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.admin);
};
// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    // Always respond OK, even if no admin exists (prevents email enumeration)
    if (!admin) {
      return res.json({
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    // Generate a secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await admin.save();

    const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail(admin.email, admin.name, resetUrl);
    } catch (mailErr) {
      console.error("Email send failed:", mailErr.message);
      return res
        .status(500)
        .json({ message: "Failed to send reset email. Check server config." });
    }

    res.json({ message: "If that email is registered, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({ message: "Password updated. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  registerAdmin,
  loginAdmin,
  refreshAccessToken,
  getMe,
  forgotPassword,      // ← add
  resetPassword,       // ← add
};