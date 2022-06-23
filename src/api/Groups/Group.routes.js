const express = require("express");
const { VerifyAuth } = require("../../ustils/authenticate");
const {
  addUserToGroup,
  createGroup,
  getGroupInfo,
  updateGroupInfo,
  getMyGroups,
  deleteGroup,
} = require("./functions");

const routes = express.Router();

routes.get("/getGroupInfo/:groupId", VerifyAuth, getGroupInfo);
routes.post("/create", VerifyAuth, createGroup);

routes.post("/addUser", VerifyAuth, addUserToGroup);
routes.put("/update/:groupId", VerifyAuth, updateGroupInfo);

routes.get("/getMyGroups", VerifyAuth, getMyGroups);
routes.delete("/delete/:groupId", VerifyAuth, deleteGroup);

module.exports = routes;
