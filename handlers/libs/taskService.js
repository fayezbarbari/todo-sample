"use strict";
const Dynamo = require("./dynamo");
const moment = require("moment");

const PRIORITY_CODE = {
  HIGHEST: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  LOWEST: 1
};

class TaskService {
  constructor() {
    this.tableName = process.env.TasksTable;
    this.idIndex = "IdIndex";
  }

  async add(userid, task) {
    // validate
    if (!userid)
      throw new Error("Invalid user id");
    if (!task)
      throw new Error("Invalid task");

    if (task.progress != undefined
      && (!Number.isInteger(task.progress) || task.progress < 0 || task.progress > 100))
      throw new Error(`Invalid progress value: ${task.progress}`);

    if (task.dueDate && isNaN(new Date(task.dueDate)))
      throw new Error(`Invalid due date: ${task.dueDate}`);

    // Fill priority code
    if (!task.priority || !PRIORITY_CODE[task.priority.toUpperCase()])
      task.priority = "Medium";
    task.priorityCode = PRIORITY_CODE[task.priority.toUpperCase()];

    if (!task.id) {
      // generate task id 
      task.id = await this._newId(userid);
      task.version = 1;
    } else {
      let currentTask = await this.get(userid, task.id);
      if (!currentTask)
        throw new Error("Invalid task id");
      task.version = (currentTask.version || 0) + 1;
    }

    task.userid = userid;
    task.code = `${task.id}:TASK`;
    task.createDate = moment().toISOString();
    if (task.dueDate)
      task.dueDate = moment(task.dueDate).toISOString();

    let currentVersion = Object.assign({}, task, {
      code: `${task.id}:V${this._getVerionCode(task.version)}`
    });

    var params = {
      RequestItems: {}
    };
    params.RequestItems[this.tableName] = [
      { PutRequest: { Item: task } },
      { PutRequest: { Item: currentVersion } }
    ];

    await Dynamo.batchWriteItem(params);
    return task;
  }

  async get(userid, taskid, version) {
    let params = {
      TableName: this.tableName,
      Key: {
        userid,
        code: !version ? `${taskid}:TASK` : `${taskid}:V${this._getVerionCode(version)}`
      }
    };

    const result = await Dynamo.get(params);
    return result.Item || {};
  }

  // private functions
  async _newId(userid) {
    let queryParam = {
      TableName: this.tableName,
      IndexName: this.idIndex,
      Limit: 1,
      ScanIndexForward: false,
      KeyConditionExpression: "#uid = :uid",
      ExpressionAttributeValues: {
        ":uid": userid
      },
      ExpressionAttributeNames: {
        "#uid": "userid"
      },
    };

    let task = await Dynamo.query(queryParam);
    if (task && task.Items && task.Items.length == 1)
      return task.Items[0].id + 1;
    return 1;
  }

  _getVerionCode(v) {
    v = "A000" + v;
    return v.substring(v.length - 3);
  }
}

module.exports = new TaskService();