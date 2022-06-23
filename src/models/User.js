const { STRING, DATE, INTEGER } = require("sequelize");
const sequelize = require("../db.config");
const Role = require("./Role");

const User = sequelize.define("User", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  first_name: {
    type: STRING,
  },
  last_name: {
    type: STRING,
  },
  email: {
    type: STRING,
    unique: true,
  },
  password: {
    type: STRING,
  },
  createdAt: {
    allowNull: false,
    type: DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DATE,
  },
});

User.belongsTo(Role, {
  foreignKey: {
    defaultValue: 3,
    allowNull: false,
    name: "roleId",
  },
});

module.exports = User;
