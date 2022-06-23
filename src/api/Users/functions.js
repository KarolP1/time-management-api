const { GetInfoAboutUser } = require("../Groups/utils");
const jwt = require("jsonwebtoken");

const InfoAboutMe = async function getInfoAboutMe(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;

    const user = await GetInfoAboutUser(id);
    if (!user) {
      res.status(404).send({ message: "fail", message: "not valid user" });
      return;
    }
    res.status(200).json({ message: "succes", data: user });
  } catch (error) {
    res.status(500).send({ message: "fail", error: error.message });
  }
};

module.exports = { InfoAboutMe };
