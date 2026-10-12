const jwt = require("jsonwebtoken");
const User = require("../models/User");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookie(res, userId) {
  const token = jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId.toString(),
    expiresIn: "7d",
  });
  res.cookie("token", token, cookieOptions);
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "メールアドレスとパスワードは必須です。" });
    if (password.length < 8) return res.status(400).json({ error: "パスワードは8文字以上にしてください。" });

    const user = await User.create({ name, email, password });
    setAuthCookie(res, user._id);
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "このメールアドレスは登録済みです。" });
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "メールアドレスとパスワードは必須です。" });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "メールアドレスまたはパスワードが正しくありません。" });
    }

    setAuthCookie(res, user._id);
    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return next(error);
  }
}

function logout(_req, res) {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
  return res.json({ message: "ログアウトしました。" });
}

function currentUser(req, res) {
  return res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
}

module.exports = { register, login, logout, currentUser };
