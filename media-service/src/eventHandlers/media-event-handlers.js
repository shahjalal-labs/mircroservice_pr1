//
const handlePostDeleted = async (event) => {
  const { postId, mediaIds } = event;

  try {
  } catch (error) {
    logger.error(error, "Error occured while media deletion");
  }
};

module.exports = {
  handlePostDeleted,
};
