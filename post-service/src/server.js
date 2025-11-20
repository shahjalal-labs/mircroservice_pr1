//
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./utils/logger");
const postRoutes = require("./routes/post-routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 3002;

console.log(process.env.MONGODB_URI, "mongodb uri");
//connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

const redisClient = new Redis(process.env.REDIS_URL);

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

//routes => pass redisclient to routes

app.use(
  "/api/posts",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  postRoutes,
);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Post service is running on port ${PORT}`);
});
