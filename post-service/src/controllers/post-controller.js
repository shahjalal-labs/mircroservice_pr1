const Post = require("../models/Post");
const logger = require("../utils/logger");
const { validateCreatePost } = require("../utils/validation");

//w: (start)╭──────────── createPost ────────────╮
const createPost = async (req, res) => {
  logger.info("Create post endpoint hit");

  try {
    const { error } = validateCreatePost(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { content, mediaIds } = req.body;

    const newlyCreatedPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    await newlyCreatedPost.save();

    logger.info("Post created successfully", newlyCreatedPost);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newlyCreatedPost,
    });
  } catch (e) {
    logger.error("Error creating post", e);
    res.status(500).json({
      success: false,
      message: "Error creating post",
    });
  }
};
//w: (end)  ╰──────────── createPost ────────────╯

const getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.json({
        success: true,
        message: "Posts fetched successfully",
        data: JSON.parse(cachedPosts),
      });
    }

    const posts = await Post.find({})
      .sort({
        createdAt: -1,
      })
      .skip(startIndex)
      .limit(limit);

    const totalNoOfPosts = await Post.countDocuments();

     const result={
      posts,
      currentpage:page,
      totalPages:Math.ceil(totalNoOfPosts/limit),
      totalPosts:totalNoOfPosts
    }
    } ;
  } catch (e) {}
};

module.exports = { createPost };
