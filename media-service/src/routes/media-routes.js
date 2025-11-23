const express = require("express");
const router = express.Router();

// middleware -> this will tell if the user is an auth user or not

const logger = require("../utils/logger");
const multer = require("multer");
const { authenticateRequest } = require("../middleware/authMiddleware");
const { uploadMedia } = require("../controllers/media-controller");

// configure multer for file upload

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

router.post(
  "/upload",

  authenticateRequest,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        logger.error("Multer error while uploading:", err);
        return res.status(400).json({
          message: "Multer error while uploading:",
          error: err.message,
          stack: err.stack,
        });
      } else if (err) {
        logger.error("Unknown error occured while uploading:", err);
        next(err);
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file found!",
        });
      }
      next();
    });
  },
  uploadMedia,
);

router.get("/get", authenticateRequest);

module.exports = router;
