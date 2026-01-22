const express = require("express");
const { generateImage, getPosts, deletePost, getUserPosts, createPost, likePost } = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generateImage);
router.post("/create", protect, createPost);
router.get("/", protect, getPosts);
router.put("/:id/like", protect, likePost);
router.get("/user/:id", protect, getUserPosts);
router.get("/user", protect, getUserPosts);
router.delete("/:id", protect, deletePost);

module.exports = router;
