//
require("dotenv").config();

const express = require("express");

const cors = require("cors");

const Redis = require("ioredis");

const app = express();

const PORT = process.env.PORT || 3000;

const redisClient = new Redis(process.env.redis_url);
