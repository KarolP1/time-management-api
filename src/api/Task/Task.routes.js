const express = require("express");
const { VerifyAuth } = require("../../ustils/authenticate");
const {
  getAllTasks,
  createTask,
  getTaskFromGroup,
  UpdateTask,
  DeleteTask,
} = require("./functions");
const routes = express.Router();

routes.get("/", getAllTasks);
routes.get("/:groupId", VerifyAuth, getTaskFromGroup);

routes.post("", VerifyAuth, createTask);
routes.put("/:taskId", VerifyAuth, UpdateTask);
routes.delete("/:taskId", VerifyAuth, DeleteTask);

module.exports = routes;
