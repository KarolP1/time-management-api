const { INTEGER } = require("sequelize");
const sequelize = require("../db.config");

const usersInGroup = sequelize.define("usersInGroup", {
  groupId: {
    type: INTEGER,
    allowNull: false,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
});

module.exports = usersInGroup;
