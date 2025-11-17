//

const express = require("express");
const { registerUser } = require("../utils/identity-controller");

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;
