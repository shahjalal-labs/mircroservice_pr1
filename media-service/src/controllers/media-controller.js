const Post = require("../models/Post");
const { log } = require("../utils/consoleLog");
const logger = require("../utils/logger");
const { validateCreatePost } = require("../utils/validation");

const { stringify, parse } = JSON;

//w: (start)╭──────────── invalidatePostKey ────────────╮
const invalidatePostKey = async (req, input) => {
  const cachedKey = "post:" + input;
  await req.redisClient.del(cachedKey);

  const keys = await req.redisClient.keys("posts:*");

  if (keys.length) {
    await req.redisClient.del(keys);
  }
};
//w: (end)  ╰──────────── invalidatePostKey ────────────╯

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

    await invalidatePostKey(req, newlyCreatedPost._id.toString());

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newlyCreatedPost,
    });
  } catch (e) {
    logger.error("Error creating post", e);
    next(e);
  }
};
//w: (end)  ╰──────────── createPost ────────────╯

//w: (start)╭──────────── getAllPosts ────────────╮
const getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find({})
      .sort({
        createdAt: -1,
      })
      .skip(startIndex)
      .limit(limit);

    const totalNoOfPosts = await Post.countDocuments();

    const result = {
      posts,
      currentpage: page,
      totalPages: Math.ceil(totalNoOfPosts / limit),
      totalPosts: totalNoOfPosts,
    };
    //p: save posts in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    res.json(result);
  } catch (e) {
    logger.error("Error fetching posts", e);
    next(e);
  }
};
//w: (end)  ╰──────────── getAllPosts ────────────╯

//w: (start)╭──────────── getPost ────────────╮
const getPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const cacheKey = `post:${postId}`;
    const cachedPost = await req.redisClient.get(cacheKey);
    if (cachedPost) {
      return res.json(parse(cachedPost));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await req.redisClient.setex(cacheKey, 3600, stringify(post));

    res.json(post);
  } catch (error) {
    logger.error("Error fetching post", error);
    next(error);
  }
};

//w: (end)  ╰──────────── getPost ────────────╯

//w: (start)╭──────────── deletePost ────────────╮
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const post = await Post.deleteOne({
      _id: postId,
      user: req.user.userId,
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    await invalidatePostKey(req, postId);
    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting post", error);
    next(error);
  }
};
//w: (end)  ╰──────────── deletePost ────────────╯

module.exports = { createPost, getAllPosts, getPost, deletePost };
