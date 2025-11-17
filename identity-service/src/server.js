//

require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const logger = require("./utils/logger");

const app = express();

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));
