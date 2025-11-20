const express = require("express");
const { authenticateRequest } = require("../middleware/authMiddleware");

const router = express.Router();

// middleware -> this will tell if the user is an auth user or not

router.use(authenticateRequest);
