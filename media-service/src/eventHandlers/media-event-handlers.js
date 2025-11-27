const Media = require("../models/media");
const { deleteMediaFromClouInary } = require("../utils/cloudinary");
const logger = require("../utils/logger");

//
const handlePostDeleted = async (event) => {
  const { postId, mediaIds } = event;

  const mediaToDelete = await Media.find({
    _id: {
      $in: mediaIds,
    },
  });

  for (const media of mediaToDelete) {
    await deleteMediaFromClouInary(media.publicId);
    await Media.findByIdAndDelete(media._id);
  }

  logger.info(`Processed deletion of media for post id ${postId}`);

  try {
  } catch (error) {
    logger.error(error, "Error occured while media deletion");
  }
};

module.exports = {
  handlePostDeleted,
};
