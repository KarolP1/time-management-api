const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_name,
  process.env.DB_user,
  process.env.DB_password,
  {
    host: process.env.DB_host, //host
    dialect: "mariadb",
    logging: false,
    define: {
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  }
);
sequelize.sync();
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database: ", { error });
  }
})();
module.exports = sequelize;
