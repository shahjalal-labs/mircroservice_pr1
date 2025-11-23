const express = require("express");
const router = express.Router();

// middleware -> this will tell if the user is an auth user or not

router.use(authenticateRequest);

router.post("/create-post");

module.exports = router;
