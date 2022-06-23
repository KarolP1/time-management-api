const Group = require("../../models/Group");
const Task = require("../../models/Task");
const User = require("../../models/User");
const usersInGroup = require("../../models/usersInGroup");

//todelete
const getAllGroups = async (req, res) => {
  const allgroups = await Group.findAll();
  res.send(allgroups);
};

const createGroupUtil = async (groupCreator, GroupName, groupDescription) => {
  try {
    const creator = await User.findOne({ where: { id: groupCreator } });

    const newGroup = await Group.create({
      GroupName,
      GroupDescription: groupDescription,
      createdByUserId: groupCreator,
    });

    await creator.addGroup(newGroup);
    await usersInGroup.create({ groupId: newGroup.id, userId: creator.id });
    return newGroup;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const GetInfoAboutUser = async (userId) => {
  try {
    if (userId !== -1) {
      const userInfo = await User.findOne({ where: { id: userId } });

      return {
        id: userInfo.id,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const allUsersInGroup = async (groupId) => {
  const users = await usersInGroup.findAll({ where: { groupId: groupId } });
  const userIds = users.map((user) => user.userId);

  return userIds;
};

const isUserInGroup = async (userId, groupId) => {
  try {
    const bool = await usersInGroup.findOne({
      where: { userId: userId, groupId: groupId },
    });
    if (bool) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const getUserIdByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email: email } });
    return user.id;
  } catch (error) {
    return -1;
  }
};

const checkGroupOwnership = async (groupId, userId) => {
  try {
    const group = await Group.findOne({ where: { id: groupId } });
    if (!group || group.createdByUserId !== userId) return false;
    else return true;
  } catch (error) {
    return false;
  }
};

const getGroupById = async (groupId) => {
  const group = await Group.findByPk(groupId);

  return group;
};

const getGroupByUserId = async (userId) => {
  try {
    const groups = await usersInGroup.findAll({ where: { userId: userId } });
    const ids = groups.map((group) => group.groupId);
    return ids;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getInfoAboutGroup = async (groupId) => {
  const group = await Group.findOne({ where: { id: groupId } });

  if (!group) throw new Error({ message: "not valid group" });
  const { id, GroupName, GroupDescription, createdByUserId } = group;

  const owner = await User.findOne({ where: { id: createdByUserId } });
  const ownerInfo = await GetInfoAboutUser(owner.id);

  const UsersInGroup = await allUsersInGroup(groupId);
  const AllUsersInfo = await Promise.all(
    UsersInGroup.map(async (userId) => await GetInfoAboutUser(userId))
  );
  return {
    id,
    GroupName,
    GroupDescription,
    ownerInfo,
    AllUsersInfo,
  };
};

const deleteUserInGroup = async (groupId) => {
  await usersInGroup.destroy({ where: { GroupId: groupId } });
  await Task.destroy({ where: { GroupId: groupId } });
};

module.exports = {
  createGroupUtil,
  getAllGroups,
  allUsersInGroup,
  isUserInGroup,
  GetInfoAboutUser,
  getUserIdByEmail,
  checkGroupOwnership,
  getGroupById,
  getGroupByUserId,
  getInfoAboutGroup,
  deleteUserInGroup,
};
