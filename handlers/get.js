const TaskService = require("./libs/taskService");
const Api = require("./libs/api");

exports.handler = async (event) => {
  const api = new Api(event);

  try {
    let data = await TaskService.get(api.userid, api.params.id, api.params.version);
    return api.successResponse(data);
  } catch (err) {
    return api.failureResponse(err);
  }
};