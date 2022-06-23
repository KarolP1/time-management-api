const { STRING, INTEGER } = require("sequelize");
const sequelize = require("../db.config");
const Task = require("./Task");
const User = require("./User");

const Group = sequelize.define("Group", {
  GroupName: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  GroupDescription: {
    type: STRING,
    allowNull: false,
  },
  createdByUserId: {
    type: INTEGER,
    allowNull: false,
  },
});

User.belongsToMany(Group, { through: "UserGroup" });
Group.belongsToMany(User, { through: "UserGroup" });

Group.hasMany(Task, {
  foreignKey: "GroupId",
});

module.exports = Group;
