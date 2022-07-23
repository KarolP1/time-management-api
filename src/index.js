require("dotenv").config();
require("./db.config");
require("./models/User");
require("./models/Role");
require("./models/Group");
require("./models/usersInGroup");
require("./models/Task");

//#region app setup and server

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const http = require("http");
const middlewares = require("./middlewares/index");
const api = require("./api");
const app = express();
const socketio = require("socket.io");

//#endregion

const PORT = process.env.PORT || 8082;

//#region app.use
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/**
 * Main api route
 * app.use("/api/v1", api);
 *
 */
app.use("/api/v1", api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

//#endregion

app.listen(PORT, () => {
  console.log("listen on port " + PORT);
});
