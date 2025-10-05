require("dotenv").config({ path: "../.env" });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const useragent = require("express-useragent");
const cors = require("cors");
const debug = require("debug")("tasker-api");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const redis = require("redis");
const cron = require('node-cron');

// NOTE: importing neccessary files/moules
const connectDB = require("./config/databaseConnection");
const { catchAsync } = require("./utils/errors/catchAsync.js");
const handleResponse = require("./utils/response/response");
const { globalErrorHandler } = require("./controllers/error.js");
const { startupMethod } = require("./config/startupMethod.js");
const { initSocket } = require("./sockets/initSocket.js");
const { authenticateSocket } = require("./middlewares/authenticateSocket.js");

// NOTE: importing routes
const AuthRoutes = require("./routes/auth.js");
const SensorRoutes = require("./routes/sensor.js");
const CollectionRequestRoutes = require("./routes/collectionRequest.js");
const BinRoutes = require("./routes/bin.js");

// NOTE: building the current environment according to env variables
const currentEnvironment = require("./config/environmentConfig");
const {
  UnauthorizedError,
  RecordNotFoundError,
} = require("./utils/errors/CustomErrors");
const { environmentTypes } = require("./constants/commonConstants.js");
const { log } = require("console");
// const Event = require("./models/event.js");
// const { handleSubscriptionWebhook, handleOneTimePaymentWebhook } = require("./controllers/order.js");
// const { schedulePayoutJobs, scheduleSubscriptionCancellationsForAllEvents } = require('./controllers/order.js');
const PORT = currentEnvironment.PORT;
const CLIENT = currentEnvironment.CLIENT;
const ADMIN = currentEnvironment.ADMIN;
const SERVICE_PROVIDER = currentEnvironment.SERVICE_PROVIDER;
const ENVIRONMENT = currentEnvironment.ENVIRONMENT;

// NOTE: connecting the redis server
// const redisClient = redis.createClient({
//   url: `redis://${currentEnvironment.REDIS_HOST}:${currentEnvironment.REDIS_PORT}`,
// });

// const connectRedis = async () => {
//   try {
//     await redisClient.connect();
//   } catch (error) {
//     console.error("Redis connection failed", err);
//   }
// }
// NOTE: connect redis instance
// connectRedis();

const app = express();


// app.post(
//   `/api/v${currentEnvironment.API_VERSION}/order/payment/webhook`,
//   express.raw({ type: "application/json" }),
//   handleOneTimePaymentWebhook
// );

// app.post(
//   `/api/v${currentEnvironment.API_VERSION}/order/subscription/webhook`,
//   express.raw({ type: "application/json" }),
//   handleSubscriptionWebhook
// );

// app.use((req, res, next) => {
//   const webhookPaths = [
//     `/api/v${currentEnvironment.API_VERSION}/order/subscription/webhook`,
//     `/api/v${currentEnvironment.API_VERSION}/order/payment/webhook`
//   ];

//   const isWebhookRoute = webhookPaths.includes(req.path);

//   if (isWebhookRoute) {
//     return next()
//   }

//   express.json()(req, res, next);
// });

// app.use((req, res, next) => {
//   if (req.path === `${currentEnvironment.WEBHOOK_ENDPOINT_URL}/payment/webhook`) {
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });

// app.use((req, res, next) => {
//   if (req.path === `${currentEnvironment.WEBHOOK_ENDPOINT_URL}/subscription/webhook`) {
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });

// NOTE: mounting the swagger api documentation based on the current running environment; enabling only in development mode
if (ENVIRONMENT === environmentTypes.DEV) {
  const swaggerUi = require("swagger-ui-express");
  const swaggerSpec = require("./config/swaggerConfig.js");

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// NOTE: disable X-Powered-By header && suppress other vulnerable headers from exposing
app.disable("x-powered-by");
app.use(function (req, res, next) {
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("X-Frame-Options", "deny");
  res.header("X-Content-Type-Options", "nosniff");
  next();
});

// NOTE: Middleware to parse JSON with an increased limit (30MB)
app.use(bodyParser.json({ limit: "30mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(useragent.express());

// NOTE: Sanitizing incoming request values before to save in db
app.use(mongoSanitize());
app.use(xss());

// NOTE: Set CORS configuration
app.use(
  cors({
    origin: [`${CLIENT}`, `${ADMIN}`, `${SERVICE_PROVIDER}`],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

// NOTE: testing route: verifing the api running or not
app.get("/", async (req, res, next) => {
  try {
    return handleResponse(res, 200, "Welcome to UrbanEcoFlow API !");
  } catch (error) {
    return next(error);
  }
});

// NOTE: authentication testing route
app.get(
  `/api/v${currentEnvironment.API_VERSION}/check-auth`,
  (req, res, next) => {
    try {
      const auth = req.header("Authorization");
      if (!auth) {
        throw new UnauthorizedError();
      }
      return handleResponse(res, 200, "User Authentication Found");
    } catch (error) {
      return next(error);
    }
  }
);

// NOTE: configuring routes
app.use(`/api/v${currentEnvironment.API_VERSION}/auth`, AuthRoutes);
app.use(`/api/v${currentEnvironment.API_VERSION}/sensors`, SensorRoutes);
app.use(`/api/v${currentEnvironment.API_VERSION}/collection-requests`, CollectionRequestRoutes);
app.use(`/api/v${currentEnvironment.API_VERSION}/bins`, BinRoutes);

// NOTE: Add catch all route - for handling the unmatched routes
app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new RecordNotFoundError("Requested Path");
  })
);

// cron.schedule('* * * * *', async () => {
//   const currentTime = new Date();

//   // Find events that have ended and are ready for payoutss
//   const events = await Event.find({ endingTime: { $lte: currentTime } });

//   for (let event of events) {
//     // await processEventPayout(event);
//   }
// });

// scheduleSubscriptionCancellationsForAllEvents();

// NOTE: This events prevent the application from crashing
process.on("unhandledRejection", (e) => {
  debug(e);
});

process.on("uncaughtException", (e) => {
  debug(e);
});

// NOTE: socket communication
const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: [`${CLIENT}`, `${ADMIN}`, `${SERVICE_PROVIDER}`],
  },
});

socketIO.use(authenticateSocket);

// NOTE: initializing socket communicating modules
// initSocket(socketIO, redisClient);

// NOTE: connecting redis
// redisClient.on("error", (err) => {
//   console.log("Redis Client Error", err);
// });

// redisClient.on("connect", () => {
//   console.log("Connection to Redis successfully!");
// });

// NOTE : Re sceduling the planned scheduled jobs after on a server re-startup
// reschedulePendingJobs();

// NOTE: set gloabal exception handler
app.use(globalErrorHandler);

// NOTE: binding the server
http.listen(PORT, async function () {

  try {
    await connectDB();

    // NOTE: startup logics =============================
    await startupMethod();

    // Schedule payouts for pending events
    // await schedulePayoutJobs();

    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;