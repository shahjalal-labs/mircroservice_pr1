# srcFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/learning/sangam/mircroservice_pr1/media-service
├── bun.lock
├── combined.log
├── error.log
├── package.json
└── src
    ├── controllers
    │   ├── media.api.hurl
    │   └── media-controller.js
    ├── middleware
    │   ├── authMiddleware.js
    │   └── errorHandler.js
    ├── models
    │   └── media.js
    ├── routes
    │   └── media-routes.js
    ├── server.js
    └── utils
        ├── cloudinary.js
        ├── consoleLog.js
        └── logger.js

7 directories, 14 files
```

## 📁 src Module Tree

```bash
/home/sj/web/learning/sangam/mircroservice_pr1/media-service/src
├── controllers
│   ├── media.api.hurl
│   └── media-controller.js
├── middleware
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models
│   └── media.js
├── routes
│   └── media-routes.js
├── server.js
└── utils
    ├── cloudinary.js
    ├── consoleLog.js
    └── logger.js

6 directories, 10 files
```

## 📋 schema.prisma

```prisma
```

## 📦 package.json

```json
{
  "name": "media-service",
  "version": "1.0.0",
  "description": "",
  "main": "src/server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "amqplib": "^0.10.5",
    "cloudinary": "^2.8.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "ioredis": "^5.4.2",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.2",
    "multer": "^2.0.2",
    "winston": "^3.17.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
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
const errorHandler = require("./middleware/errorHandler");

const mediaRoutes = require("./routes/media-routes");

const app = express();

const PORT = process.env.PORT || 3003;

//connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));


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

app.use("/api/media", mediaRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Media service is running on port ${PORT}`);
});
```

## 🔧 routes/media-routes.js

```javascript
const express = require("express");
const router = express.Router();

// middleware -> this will tell if the user is an auth user or not

const logger = require("../utils/logger");
const multer = require("multer");
const { authenticateRequest } = require("../middleware/authMiddleware");
const { uploadMedia } = require("../controllers/media-controller");

// configure multer for file upload

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

router.post(
  "/upload",

  authenticateRequest,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        logger.error("Multer error while uploading:", err);
        return res.status(400).json({
          message: "Multer error while uploading:",
          error: err.message,
          stack: err.stack,
        });
      } else if (err) {
        logger.error("Unknown error occured while uploading:", err);
        next(err);
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file found!",
        });
      }
    });
    next();
  },
  uploadMedia,
);

router.get("/get", authenticateRequest);

module.exports = router;
```

## 🎮 controllers/media-controller.js

```javascript
//
const Media = require("../models/media");
const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const logger = require("../utils/logger");

//w: (start)╭──────────── uploadMedia ────────────╮
const uploadMedia = async (req, res, next) => {
  logger.info("Starting media upload");
  if (!req.file) {
    logger.error("No file found. Please add a file and try again!");
    return res.status(400).json({
      success: false,
      message: "No file found. Please add a file and try again!",
    });
  }

  const { originalname, mimetype, buffer } = req.file;

  const userId = req.user.userId;
  logger.info(`File details: name=${originalname}, type=${mimetype}`);
  logger.info("Uploading to cloudinary starting...");
  const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
  logger.info(
    `Cloudinary upload successfully. Public Id: - ${cloudinaryUploadResult.public_id}`,
  );
  try {
    const newlyCreatedMedia = new Media({
      publicId: cloudinaryUploadResult.public_id,
      originalName: originalname,
      mimeType: mimetype,
      url: cloudinaryUploadResult.secure_url,
      userId,
    });
    await newlyCreatedMedia.save();
    res.status(201).json({
      success: true,
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media upload is successfully",
    });
  } catch (error) {
    logger.error("Error creating media", error);
    next(error);
  }
};
//w: (end)  ╰──────────── uploadMedia ────────────╯

module.exports = { uploadMedia };
```

## 🧪 controllers/media.api.hurl

```bash
GET {{port3000}}/posts
Authorization: Bearer {{qToken}}

GET  {{port3000}}/posts/691f469960d7e52c7b4f4cc7
Authorization: Bearer {{qToken}}



DELETE {{port3000}}/posts/691f469960d7e52c7b4f4cc7
Authorization: Bearer {{qToken}}


```

## 📄 middleware/errorHandler.js

```javascript
//
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: err,
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

## 📄 utils/cloudinary.js

```javascript
const logger = require("./logger");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (err, result) => {
        if (err) {
          logger.error("Error while uploading media to cloudinary", err);
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(file.buffer);
  });
};

module.exports = { uploadMediaToCloudinary };
```

## 📄 utils/consoleLog.js

```javascript
//
export const { log } = console;
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
  defaultMeta: { service: "media-service" },
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

## 📄 models/media.js

```javascript
//
const mongoose = require("mongoose");
const mediaSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;
```
