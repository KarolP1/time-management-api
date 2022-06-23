const { STRING } = require("sequelize");
const sequelize = require("../db.config");

const Role = sequelize.define("Roles", {
  RoleName: {
    type: STRING,
    allowNull: false,
    unique: true,
    defaultValue: "User",
  },
});

Role.afterSync("Roles", () => {
  Role.findOrCreate({ where: { RoleName: "admin" } });
  Role.findOrCreate({ where: { RoleName: "moderator" } });
  Role.findOrCreate({ where: { RoleName: "user" } });
});
module.exports = Role;
