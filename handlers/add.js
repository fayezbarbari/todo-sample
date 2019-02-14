const TaskService = require("./libs/taskService");
const Api = require("./libs/api");

exports.handler = async (event) => {
  const api = new Api(event);

  try {
    let data = await TaskService.add(api.userid);
    return api.successResponse(data);
  } catch (err) {
    return api.failureResponse(err);
  }
};