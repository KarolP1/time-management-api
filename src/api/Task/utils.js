const Group = require("../../models/Group");
const Task = require("../../models/Task");
const usersInGroup = require("../../models/usersInGroup");

const createTaskUtil = async ({
  taskOwner,
  taskTitle,
  taskDescription,
  createdAt,
  endedAt,
  groupId,
}) => {
  const task = await Task.create({
    taskOwner,
    taskTitle,
    taskDescription,
    taskStartTime: createdAt,
    taskEndTime: endedAt,
    GroupId: groupId,
  });
  return task;
};

const getTasks = async () => {
  return await Task.findAll();
};

const getTasksById = async (id) => {
  return await Task.findAll({ where: { id: id } });
};

const getAllByGroupId = async (groupId) => {
  return await Task.findAll({ where: { groupId: groupId } });
};

const checkTaskOwnership = async (taskId, userId) => {
  try {
    const task = await Task.findOne({ where: { id: taskId } });

    console.log(task.taskOwner);
    if (task.taskOwner !== userId) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const ifUserInGroup = async (userId, groupId) => {
  const bool = await usersInGroup.findAll({
    where: { userId: userId, groupId: groupId },
  });
  if (bool.length !== 0) return true;
  else return false;
};

const UpdateTaskById = async (taskId, params) => {
  const taskToUpdate = await Task.findOne({ where: { id: taskId } });
  taskToUpdate.update(params);
  return taskToUpdate;
};

const DeleteTaskById = async (taskId) => {
  await Task.destroy({ where: { id: taskId } });
  return taskId;
};

module.exports = {
  createTaskUtil,
  getTasks,
  getAllByGroupId,
  ifUserInGroup,
  checkTaskOwnership,
  UpdateTaskById,
  getTasksById,
  DeleteTaskById,
};
