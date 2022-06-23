const { INTEGER, DATE, STRING } = require("sequelize");
const sequelize = require("../db.config");
const Group = require("./Group");

const Task = sequelize.define("Task", {
  taskOwner: {
    type: INTEGER,
    allowNull: false,
  },
  taskTitle: { type: STRING, allowNull: false },
  taskDescription: { type: STRING, allowNull: true },
  taskStartTime: {
    type: DATE,
    allowNull: false,
  },
  taskEndTime: {
    type: DATE,
    allowNull: false,
  },
});

module.exports = Task;
