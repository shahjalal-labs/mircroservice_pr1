const express = require("express");
const { authenticateRequest } = require("../middleware/authMiddleware");
const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
} = require("../controllers/post-controller");

const router = express.Router();

// middleware -> this will tell if the user is an auth user or not

router.use(authenticateRequest);

router.post("/create-post", createPost);
router.get("/", getAllPosts);

router.get("/:postId", getPost);

router.delete("/:id", deletePost);

module.exports = router;
