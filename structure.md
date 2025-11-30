# 📁 Project Structure

```bash
.
├── api-gateway
│   ├── bun.lock
│   ├── combined.log
│   ├── Dockerfile
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
├── docker-compose.yml
├── Dockerfile
├── identity-service
│   ├── bun.lock
│   ├── combined.log
│   ├── Dockerfile
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
│   ├── bun.lock
│   ├── combined.log
│   ├── Dockerfile
│   ├── error.log
│   ├── package.json
│   └── src
│       ├── controllers
│       │   ├── media.api.hurl
│       │   └── media-controller.js
│       ├── eventHandlers
│       │   └── media-event-handlers.js
│       ├── middleware
│       │   ├── authMiddleware.js
│       │   └── errorHandler.js
│       ├── models
│       │   └── media.js
│       ├── routes
│       │   └── media-routes.js
│       ├── server.js
│       └── utils
│           ├── cloudinary.js
│           ├── consoleLog.js
│           ├── logger.js
│           └── rabbitmq.js
├── post-service
│   ├── bun.lock
│   ├── combined.log
│   ├── Dockerfile
│   ├── error.log
│   ├── package.json
│   └── src
│       ├── controllers
│       │   ├── post.api.hurl
│       │   └── post-controller.js
│       ├── middleware
│       │   ├── authMiddleware.js
│       │   └── errorHandler.js
│       ├── models
│       │   └── Post.js
│       ├── routes
│       │   └── post-routes.js
│       ├── server.js
│       ├── srcFullContent.md
│       └── utils
│           ├── consoleLog.js
│           ├── logger.js
│           ├── rabbitmq.js
│           └── validation.js
├── README.md
├── search-service
│   ├── bun.lock
│   ├── combined.log
│   ├── Dockerfile
│   ├── error.log
│   ├── package.json
│   └── src
│       ├── controllers
│       │   └── search-controller.js
│       ├── event-handlers
│       │   └── search-event-handler.js
│       ├── middleware
│       │   ├── authMiddleware.js
│       │   └── errorHandler.js
│       ├── models
│       │   └── Search.js
│       ├── routes
│       │   └── search-routes.js
│       ├── server.js
│       └── utils
│           ├── logger.js
│           └── rabbitmq.js
├── src
│   └── docs
│       └── cli_commands.md
└── structure.md

39 directories, 76 files

```
