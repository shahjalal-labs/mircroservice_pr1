const express = require("express");
const router = express.Router();

// middleware -> this will tell if the user is an auth user or not

router.use(authenticateRequest);

const logger = require("../utils/logger");
const multer = require("multer");

// configure multer for file upload

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

router.post("/create-post");

module.exports = router;
