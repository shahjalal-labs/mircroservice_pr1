//
const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const logger = require("../utils/logger");

const uploadMedia = async (req, res, next) => {
  logger.info("Starting media upload");
  if (!req.file) {
    logger.error("No file found. Please add a file and try again!");
    return res.status(400).json({
      success: false,
      message: "No file found. Please add a file and try again!",
    });
  }

  const { originalname, mimetype, buffer } = req.file;

  const userId = req.user.userId;
  logger.info(`File details: name=${originalname}, type=${mimetype}`);
  logger.info("Uploading to cloudinary starting...");
  const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
  logger.info(
    `Cloudinary upload successfully. Public Id: - ${cloudinaryUploadResult.public_id}`,
  );
  try {
    const newlyCreatedMedia = new Media();
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadMedia };
