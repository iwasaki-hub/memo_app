const mongoose = require("mongoose");
const Memo = require("../models/Memo");

async function listMemos(req, res) {
  const memos = await Memo.find({ owner: req.user._id })
    .populate("owner", "name email")
    .sort({ isPinned: -1, updatedAt: -1 });
  res.json(memos);
}

async function listPublicMemos(req, res) {
  const memos = await Memo.find({ isPublic: true })
    .select("title content tags isPinned isPublic owner createdAt updatedAt +likes")
    .populate("owner", "name")
    .sort({ isPinned: -1, updatedAt: -1 });
  const response = memos.map((memo) => {
    const result = memo.toObject();
    const likedByMe = Boolean(req.user && memo.likes.some((userId) => userId.equals(req.user._id)));
    delete result.likes;
    delete result.__v;
    return { ...result, likeCount: memo.likes.length, likedByMe };
  });
  return res.json(response);
}

async function likePublicMemo(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid memo ID." });
  }

  const memo = await Memo.findOneAndUpdate(
    { _id: req.params.id, isPublic: true },
    { $addToSet: { likes: req.user._id } },
    { returnDocument: "after" },
  ).select("+likes");

  if (!memo) return res.status(404).json({ error: "Public memo not found." });
  return res.json({ likeCount: memo.likes.length, likedByMe: true });
}

async function unlikePublicMemo(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid memo ID." });
  }

  const memo = await Memo.findOneAndUpdate(
    { _id: req.params.id, isPublic: true },
    { $pull: { likes: req.user._id } },
    { returnDocument: "after" },
  ).select("+likes");

  if (!memo) return res.status(404).json({ error: "Public memo not found." });
  return res.json({ likeCount: memo.likes.length, likedByMe: false });
}

async function getMemo(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid memo ID." });
  }

  const memo = await Memo.findOne({ _id: req.params.id, owner: req.user._id })
    .populate("owner", "name email");
  if (!memo) {
    return res.status(404).json({ error: "Memo not found." });
  }

  return res.json(memo);
}

async function createMemo(req, res) {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
  const tags = normalizeTags(body.tags);
  if (!tags) return res.status(400).json({ error: "タグは30文字以内で、最大10個まで設定できます。" });
  if (body.isPublic !== undefined && typeof body.isPublic !== "boolean") {
    return res.status(400).json({ error: "isPublic must be a boolean." });
  }

  const memo = await Memo.create({
    owner: req.user._id,
    title: body.title,
    content: body.content,
    tags,
    isPublic: body.isPublic ?? false,
  });

  await memo.populate("owner", "name email");
  return res.status(201).json(memo);
}

async function updateMemo(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid memo ID." });
  }

  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
  const updates = {};
  if (Object.hasOwn(body, "title")) updates.title = body.title;
  if (Object.hasOwn(body, "content")) updates.content = body.content;
  if (Object.hasOwn(body, "tags")) {
    const tags = normalizeTags(body.tags);
    if (!tags) return res.status(400).json({ error: "タグは30文字以内で、最大10個まで設定できます。" });
    updates.tags = tags;
  }
  if (Object.hasOwn(body, "isPinned")) {
    if (typeof body.isPinned !== "boolean") return res.status(400).json({ error: "isPinned must be a boolean." });
    updates.isPinned = body.isPinned;
  }
  if (Object.hasOwn(body, "isPublic")) {
    if (typeof body.isPublic !== "boolean") return res.status(400).json({ error: "isPublic must be a boolean." });
    updates.isPublic = body.isPublic;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Provide a title, content, tags, pin state, or visibility to update." });
  }

  const memo = await Memo.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, updates, {
    returnDocument: "after",
    runValidators: true,
  }).populate("owner", "name email");

  if (!memo) {
    return res.status(404).json({ error: "Memo not found." });
  }

  return res.json(memo);
}

function normalizeTags(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;

  const tags = [...new Set(value.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean))];
  if (tags.length > 10 || tags.some((tag) => tag.length > 30)) return null;
  return tags;
}

async function deleteMemo(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid memo ID." });
  }

  const memo = await Memo.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!memo) {
    return res.status(404).json({ error: "Memo not found." });
  }

  return res.status(204).end();
}

module.exports = {
  listMemos,
  listPublicMemos,
  likePublicMemo,
  unlikePublicMemo,
  getMemo,
  createMemo,
  updateMemo,
  deleteMemo,
};
