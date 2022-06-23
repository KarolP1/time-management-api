const jwt = require("jsonwebtoken");
const User = require("../models/User");

const VerifyAuth = async function (req, res, next) {
  try {
    const accessToken = req.header("Authorization")?.split(" ")[1] || "";

    const payload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_ACCESS_TOKEN
    );

    if (!payload) {
      return res.status(401).send({
        message: "fail",
        error: "Unauthorized: " + e.message,
      });
    }

    const user = await User.findOne({ where: { id: payload.id } });

    if (!user) {
      return res.status(401).send({
        message: "fail",
        error: "Unauthorized: " + e.message,
      });
    }

    return next();
  } catch (e) {
    return res.status(401).send({
      message: "fail",
      error: "Unauthorized: " + e.message,
    });
  }
};

module.exports = { VerifyAuth };
