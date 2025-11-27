//
const Search = require("../models/Search");
const logger = require("../utils/logger");

//
//w: (start)╭──────────── handlePostCreated ────────────╮
async function handlePostCreated(event) {
  try {
    const { postId, userId, content, createdAt } = event;
    const newSearchPost = new Search({
      postId,
      userId,
      content,
      createdAt,
    });
    await newSearchPost.save();
    logger.info(
      `Search post created: ${postId}, ${newSearchPost._id.toString()}`,
    );
  } catch (error) {
    logger.error(error, "Error handling post creation event");
  }
}
//w: (end)  ╰──────────── handlePostCreated ────────────╯

module.exports = { handlePostCreated };
