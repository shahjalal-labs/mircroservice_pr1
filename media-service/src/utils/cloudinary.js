const logger = require("./logger");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//w: (start)╭──────────── uploadMediaToCloudinary ────────────╮
const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (err, result) => {
        if (err) {
          logger.error("Error while uploading media to cloudinary", err);
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(file.buffer);
  });
};
//w: (end)  ╰──────────── uploadMediaToCloudinary ────────────╯

//w: (start)╭──────────── deleteMediaFromClouInary ────────────╮
const deleteMediaFromClouInary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("Media deleted successfuly from cloud stroage", publicId);
    return result;
  } catch (error) {
    logger.error("Error deleting media from cludinary", error);
    throw error;
  }
};
//w: (end)  ╰──────────── deleteMediaFromClouInary ────────────╯

module.exports = { uploadMediaToCloudinary, deleteMediaFromClouInary };
