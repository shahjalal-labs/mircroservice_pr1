//

require("dotenv").config();

const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./utils/logger");

const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");

const app = express();

const PORT = process.env.PORT || 3001;

const redisClient = new Redis(process.env.REDIS_URL);

//p: n! Secures the app by setting various HTTP headers
//p: n! Helps prevent common attacks like XSS, clickjacking, and MIME sniffing
app.use(helmet());
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${req.qip}`);
      res.status(429).json({
        success: false,
        message: "Too many requests",
      });
    });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));
