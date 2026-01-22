const Post = require("../models/Post");
const axios = require("axios");

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt required" });

    const response = await axios.post(
      process.env.WORKER_URL,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.WORKER_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");
    res.json({ imageBase64: base64 });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Image generation failed" });
  }
};

const createPost = async (req, res) => {
  try {
    const { prompt, imageBase64 } = req.body;
    const post = await Post.create({
      user: req.user.id,
      prompt,
      imageBase64,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

const getPosts = async (req, res) => {
  const posts = await Post.find().populate("user", "name username").sort({ createdAt: -1 });
  res.json(posts);
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Unauthorized" });

  await post.deleteOne();
  res.json({ message: "Deleted" });
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id || req.user.id })
      .populate("user", "name username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(req.user.id);
    if (index === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
};

module.exports = { generateImage, getPosts, deletePost, getUserPosts, createPost, likePost };
