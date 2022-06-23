const jwt = require("jsonwebtoken");
const {
  createTaskUtil,
  getTasks,
  getAllByGroupId,
  ifUserInGroup,
  checkTaskOwnership,
  UpdateTaskById,
  getTasksById,
  DeleteTaskById,
} = require("./utils");

async function getAllTasks(req, res) {
  const all = await getTasks();
  res.status(200).send({ message: "succes", all });
}

async function createTask(req, res) {
  const token = req.headers["authorization"].split(" ")[1];
  try {
    const { groupId, taskTitle, taskDescription, createdAt, endedAt } =
      req.body;
    const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;
    const bool = await ifUserInGroup(id, groupId);
    if (!bool) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    const taskCreator = await createTaskUtil({
      groupId: groupId,
      taskOwner: id,
      taskTitle: taskTitle,
      taskDescription: taskDescription ? taskDescription : "",
      createdAt:
        createdAt === undefined || createdAt === "" ? new Date() : createdAt,
      endedAt: endedAt === undefined || endedAt === "" ? new Date() : endedAt,
    });

    res.status(200).send({ message: "succes", taskCreator });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "failed", error: e.message });
  }
}

async function getTaskFromGroup(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;
    const groupId = req.params.groupId;

    const bool = await ifUserInGroup(id, groupId);
    if (bool === false) {
      res.status(401).send({ message: "Unautorized" });
      return;
    }
    const allTaskInGroup = await getAllByGroupId(groupId);
    res.status(200).json(allTaskInGroup);
  } catch (e) {
    res.status(500).json({ message: "fail", error: e.message });
  }
}

async function UpdateTask(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;
    const taskId = req.params.taskId;
    const bool = await checkTaskOwnership(taskId, id);

    if (bool === false) {
      res.status(401).json({ message: "Unautorized" });
      return;
    }
    const preUpdateTask = await getTasksById(taskId);
    const { taskTitle, taskDescription, taskStartTime, taskEndTime } = req.body;
    const params = {
      taskTitle:
        taskTitle === "" || taskTitle === undefined
          ? preUpdateTask.taskTitle
          : taskTitle,
      taskDescription:
        taskDescription === "" || taskDescription === undefined
          ? preUpdateTask.taskDescription
          : taskDescription,
      taskStartTime:
        taskStartTime === "" || taskStartTime === undefined
          ? preUpdateTask.taskStartTime
          : taskStartTime,
      taskEndTime:
        taskEndTime === "" || taskEndTime === undefined
          ? preUpdateTask.taskEndTime
          : taskEndTime,
    };
    const updatedTask = await UpdateTaskById(taskId, params);

    res.status(200).json({ message: "succes", updatedTask });
  } catch (e) {
    res.status(500).json({ message: "fail", error: e.message });
  }
}

async function DeleteTask(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN).id;
    const taskId = req.params.taskId;
    const bool = await checkTaskOwnership(taskId, id);

    if (bool === false) {
      res.status(401).json({ message: "Unautorized" });
      return;
    }

    const deleteTask = await DeleteTaskById(taskId);
    res.status(204).json({ message: "succes", taskdeleted: deleteTask });
  } catch (e) {
    res.status(500).json({ message: "fail", error: e.message });
  }
}

module.exports = {
  getAllTasks,
  createTask,
  getTaskFromGroup,
  UpdateTask,
  DeleteTask,
};
