//
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./utils/logger");

const app = express();
const port = process.env.PORT || 3004;

// connect to mongodb

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

const redisClient = new Redis(process.env.REDIS_URL);

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info()(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, `, req.body);
  next();
});
