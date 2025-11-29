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

//w: (start)╭──────────── handlePostDeleted ────────────╮
async function handlePostDeleted(event) {
  try {
    await Search.findOneAndDelete({ postId: event.postId });
    logger.info(`Search post deleted: ${event.postId}}`);
  } catch (error) {
    logger.error(error, "Error handling post deletion event");
  }
}
//w: (end)  ╰──────────── handlePostDeleted ────────────╯

module.exports = { handlePostCreated, handlePostDeleted };
