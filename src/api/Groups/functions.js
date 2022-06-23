const User = require("../../models/User");
const usersInGroup = require("../../models/usersInGroup");
const jwt = require("jsonwebtoken");
const {
  createGroupUtil,
  isUserInGroup,
  GetInfoAboutUser,
  allUsersInGroup,
  getUserIdByEmail,
  getGroupById,
  checkGroupOwnership,
  getGroupByUserId,
  getInfoAboutGroup,
  deleteUserInGroup,
} = require("./utils");
const Group = require("../../models/Group");
const { io } = require("../../index");

const createGroup = async function (req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;

    const { groupName, description } = req.body;

    if (
      groupName === undefined ||
      description === undefined ||
      groupName === "" ||
      description === ""
    ) {
      res.status(400).send({ status: 400, message: "bad request" });
      return;
    }

    const groupInDb = await Group.findOne({ where: { GroupName: groupName } });
    if (groupInDb) {
      res.status(400).send({
        message: "fail",
        data: "there is already a group with that name",
      });
      return;
    }
    const newGroup = await createGroupUtil(id, groupName, description);

    res.send({ message: newGroup });
  } catch (error) {
    res.status(500).send({ message: "fail", error: error.message });
  }
};

const addUserToGroup = async function (req, res) {
  try {
    const { userEmail, groupId } = req.body;

    const userIdByEmail = await getUserIdByEmail(userEmail);

    if (!userIdByEmail || userIdByEmail === -1) {
      res
        .status(404)
        .send({ message: "fail", error: "there is no user with that email" });
      return;
    }

    const isUserAlreadyInGroup = await isUserInGroup(userIdByEmail, groupId);
    if (isUserAlreadyInGroup) {
      res
        .status(409)
        .send({ status: "fail", message: "User already in group" });
      return;
    }

    await usersInGroup.create({ userId: userIdByEmail, groupId: groupId });

    res.status(200).send({ message: "succes" });
  } catch (error) {
    res.status(500).send({ message: "fail", error: error.message });
  }
};

const getGroupInfo = async function (req, res) {
  try {
    const groupId = req.params.groupId;

    const info = await getInfoAboutGroup(groupId);

    res.status(200).json({
      message: "succes",
      data: info,
    });
  } catch (error) {
    res.status(500).send({ message: "fail", error: error.message });
  }
};

const updateGroupInfo = async function (req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;

    const { groupId } = req.params;
    const { groupName, groupDescription } = req.body;
    const group = await getGroupById(groupId);
    if (!group) {
      res.status(404).send({ message: "fail", error: "Group not found" });
      return;
    }
    const bool = await checkGroupOwnership(groupId, id);

    if (bool === false) {
      res
        .status(409)
        .send({ message: "fail", error: "you are not owner of this group" });
      return;
    }
    await Group.update(
      {
        GroupName: groupName,
        GroupDescription: groupDescription,
      },
      { where: { id: groupId } }
    );
    const resgr = await Group.findByPk(groupId);
    res.status(200).send({ message: "succes", resgr });
  } catch (error) {
    res.status(500).send({ message: "fail", error: error.message });
  }
};

const getMyGroups = async function (req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const userId = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;

    const groupsId = await getGroupByUserId(userId);
    const infoMyGroups = await Promise.all(
      groupsId.map(async (grId) => {
        return await getInfoAboutGroup(grId);
      })
    );
    res.status(200).json({
      message: "succes",
      data: infoMyGroups,
    });
  } catch (error) {
    res.status(500).send({ message: "fail", error: error.message });
  }
};

const deleteGroup = async function (req, res) {
  try {
    const groupId = req.params.groupId;
    if (!groupId) {
      res.status(400).send({ message: "fail", data: " bad request" });
    }
    const token = req.headers["authorization"].split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;
    const bool = await checkGroupOwnership(groupId, id);
    if (bool === false) {
      res.status(409).send({
        message: "fail",
        error: "you are not allowed to delete this group",
      });
      return;
    }
    const group = await getGroupById(groupId);
    if (!group) {
      res
        .status(404)
        .send({ message: "fail", message: "not such group " + groupId });
      return;
    }
    await deleteUserInGroup(groupId);
    await group.destroy();
    res.status(200).send({ message: "succes" });
  } catch (error) {
    res.status(500).send({ message: "fail", message: error.message });
  }
};

module.exports = {
  createGroup,
  addUserToGroup,
  getGroupInfo,
  updateGroupInfo,
  getMyGroups,
  deleteGroup,
};
