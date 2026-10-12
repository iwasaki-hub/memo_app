const express = require("express");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");
const {
  listMemos,
  listPublicMemos,
  likePublicMemo,
  unlikePublicMemo,
  getMemo,
  createMemo,
  updateMemo,
  deleteMemo,
} = require("../controllers/memoController");

const router = express.Router();

router.get("/public", optionalAuth, listPublicMemos);
router.post("/public/:id/like", requireAuth, likePublicMemo);
router.delete("/public/:id/like", requireAuth, unlikePublicMemo);
router.use(requireAuth);

router.route("/").get(listMemos).post(createMemo);
router.route("/:id").get(getMemo).put(updateMemo).delete(deleteMemo);

module.exports = router;
