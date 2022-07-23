var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../../models/User");
const Role = require("../../models/Role");
const signToken = require("../../ustils/jwtAccessToken");
const { VerifyAuth } = require("../../ustils/authenticate");
const { InfoAboutMe } = require("./functions");
const axios = require("axios");
const { resetTokenJWT } = require("../../ustils/jwtAccessToken");
dotenv.config();
/**
 * test route to figure out if is it working
 */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

/**
 * /register
 * method:"post"
 * @param first_name string
 */
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (
      first_name === undefined ||
      last_name === undefined ||
      email === undefined ||
      password === undefined ||
      first_name === "" ||
      last_name === "" ||
      email === "" ||
      password === ""
    ) {
      res.status(400).send({ success: false, message: "bad request" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.status(409).send({ message: "User already exists" });
      return null;
    }

    created_user = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: await bcrypt.hash(password, salt),
    });

    await axios.post(
      "http://karolcodetest.networkmanager.pl/java/services/mailing/sendWelcomeEmial",
      {
        email: email,
        title: `hello ${first_name}`,
        description: "better run away",
        messageText: "hello my darling",
        vreify: "http://localhost:8000/api/v1/user/authenticated",
      }
    );
    res.send({ created_user });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: error });
    return;
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "bad request" });
      return null;
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(404).json({ message: "User not exist" });
      return null;
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      res.status(404).json({ message: "Incorerect login data" });
      return null;
    }
    const role = await Role.findOne({ where: { id: user.roleId } });

    const token = await signToken.signAccesToken(user, role.RoleName);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/info", VerifyAuth, InfoAboutMe);

//test authentication
router.post("/authenticated", VerifyAuth, async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;
  const user = await User.findOne({ where: { id: id } });
  const role = await Role.findOne({ where: { id: user.roleId } });
  const newToken = await signToken.signAccesToken(user, role.RoleName);

  res.status(200).send({ message: "token is valid", token: newToken });
});

router.get("/sendReset/:email", async (req, res) => {
  const { email } = req.params;
  const token = await resetTokenJWT(email);
  console.log("");
  console.log("");
  console.log("");
  console.log("");
  console.log(`localhost:8000/api/v1/user/sendReset/${token}`);

  await axios.post(
    "http://karolcodetest.networkmanager.pl/java/services/mailing/sendResetEmial",
    {
      email: email,
      title: `hello ${email}`,
      description: "better run away",
      messageText: "hello my darling",
      verifyLink: `localhost:8000/api/v1/user/sendReset/${token}`,
    }
  );
  res.status(200).send({
    success: true,
    data: `localhost:8000/api/v1/user/sendReset/${token}`,
  });
});

router.post("/sendReset/:token", async (req, res) => {
  const { password, confirmpassword, email } = req.body;

  const token = req.params.token;
  const decoded = jwt.decode(token);

  if (decoded.email !== email) {
    res.status(405).send({ succes: false, message: "email'a not match" });
    return;
  }

  if (password !== confirmpassword) {
    res.status(400).send("password wont match.");
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const user = await User.findOne({ email: decoded.email });
    await user.update({ password: await bcrypt.hash(password, salt) });
  } catch (error) {
    res.status(405).send({ success: false, message: "Unauthorized" });
    return;
  }
  res.status(200).send({ success: true, message: "passwords changed" });
});

module.exports = router;
