const express = require("express");
const UserRoutes = require("./Users/UserRoutes");
const GroupRoutes = require("./Groups/Group.routes");
const TaskRoutes = require("./Task/Task.routes");
const router = express.Router();

router.use("/user", UserRoutes);
router.use("/group", GroupRoutes);
router.use("/task", TaskRoutes);

module.exports = router;
