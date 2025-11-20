# srcFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/learning/sangam/mircroservice_pr1
├── api-gateway
│   ├── bun.lock
│   ├── combined.log
│   ├── error.log
│   ├── package.json
│   └── src
│       ├── middleware
│       │   ├── authMiddleware.js
│       │   └── errorHandler.js
│       ├── models
│       ├── routes
│       ├── server.js
│       └── utils
│           └── logger.js
├── identity-service
│   ├── bun.lock
│   ├── combined.log
│   ├── error.log
│   ├── package.json
│   └── src
│       ├── controllers
│       │   └── identity-controller.js
│       ├── middleware
│       │   └── errorHandler.js
│       ├── models
│       │   ├── RefreshToken.js
│       │   └── User.js
│       ├── routes
│       │   └── identity-service.js
│       ├── server.js
│       └── utils
│           ├── generateToken.js
│           ├── logger.js
│           └── validation.js
├── media-service
├── post-service
│   ├── bun.lock
│   ├── combined.log
│   ├── error.log
│   ├── package.json
│   └── src
│       ├── controllers
│       │   └── post-controller.js
│       ├── middleware
│       │   ├── authMiddleware.js
│       │   └── errorHandler.js
│       ├── models
│       │   └── Post.js
│       ├── routes
│       │   └── post-routes.js
│       ├── server.js
│       └── utils
│           ├── logger.js
│           └── validation.js
├── README.md
├── search-service
└── src
    └── docs
        └── cli_commands.md

25 directories, 35 files
```

## 📁 src Module Tree

```bash
/home/sj/web/learning/sangam/mircroservice_pr1/post-service/src
├── controllers
│   └── post-controller.js
├── middleware
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models
│   └── Post.js
├── routes
│   └── post-routes.js
├── server.js
└── utils
    ├── logger.js
    └── validation.js

6 directories, 8 files
```

## 📋 schema.prisma

```prisma
```

## 📦 package.json

```json
```

## 📄 server.js

```javascript
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
```

## 🔧 routes/post-routes.js

```javascript
const express = require("express");
const { authenticateRequest } = require("../middleware/authMiddleware");
const { createPost } = require("../controllers/post-controller");

const router = express.Router();

// middleware -> this will tell if the user is an auth user or not

router.use(authenticateRequest);

router.post("/create-post", createPost);

module.exports = router;
```

## 🎮 controllers/post-controller.js

```javascript
const logger = require("../utils/logger");
const { validateCreatePost } = require("../utils/validation");

const createPost = async (req, res) => {
  logger.info("Create post endpoint hit");

  try {
    const { error } = validateCreatePost(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { content, mediaIds } = req.body;

    const newlyCreatedPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    await newlyCreatedPost.save();
  } catch (e) {
    logger.error("Error creating post", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
    });
  }
};

module.exports = { createPost };
```

## 📄 middleware/errorHandler.js

```javascript
//
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
```

## 📄 middleware/authMiddleware.js

```javascript
//
const logger = require("../utils/logger");

const authenticateRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    logger.warn(`Access attempted without user ID`);
    return res.status(401).json({
      success: false,
      message: "Authencation required! Please login to continue",
    });
  }

  req.user = {
    userId,
  };
  next();
};

module.exports = {
  authenticateRequest,
};
```

## 📝 utils/validation.js

```javascript
//
const Joi = require("joi");

const validateCreatePost = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(10),
    mediaIds: Joi.array(),
  });

  return schema.validate(data);
};

module.exports = { validateCreatePost };
```

## 📄 utils/logger.js

```javascript
// chatgpt explanation:  https://chatgpt.com/share/691b1899-42b0-800c-9209-b1c93cb70d25
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: "identity-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

module.exports = logger;
```

## 📄 models/Post.js

```javascript
const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    mediaIds: [
      {
        type: String,
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.index({
  content: "text",
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
```
