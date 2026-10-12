const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function optionalAuth(req, _res, next) {
  const token = req.cookies?.token;
  if (!token) return next();

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_error) {
    return next();
  }

  try {
    req.user = await User.findById(payload.sub).select("name email");
    return next();
  } catch (error) {
    return next(error);
  }
}

async function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "ログインが必要です。" });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_error) {
    return res.status(401).json({ error: "認証情報が無効か、有効期限が切れています。" });
  }

  try {
    const user = await User.findById(payload.sub).select("name email");
    if (!user) return res.status(401).json({ error: "認証情報が無効です。" });
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { requireAuth, optionalAuth };
