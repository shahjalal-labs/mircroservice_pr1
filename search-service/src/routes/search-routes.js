//
const express = require("express");
const { authenticateRequest } = require("../middleware/authMiddleware");
const { searchController } = require("../controllers/search-controller");

const router = express.Router();

router.use(authenticateRequest);

router.get("/posts", searchController);

module.exports = router;
