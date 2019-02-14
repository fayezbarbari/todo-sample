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
    this.statusIndex = "StatusIndex";
    this.parentIndex = "ParentIndex";
    this.dueDateIndex = "DueDateIndex";
  }

  async add(userid, task) {
    // validate
    if (!userid)
      throw new Error("Invalid user id");
    if (!task)
      throw new Error("Invalid task");

    if (task.progress !== undefined
      && (!Number.isInteger(task.progress) || task.progress < 0 || task.progress > 100))
      throw new Error(`Invalid progress value: ${task.progress}`);

    if (!task.status)
      task.status = "ToDo";
    if (task.parent != undefined && !Number.isInteger(task.parent))
      throw new Error(`Invalid task parent: ${task.parent}`);


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
    task.taskStatus = task.status;
    if (task.dueDate)
      task.taskDueDate = moment(task.dueDate).toISOString();
    if (task.parent)
      task.taskParent = `${task.parent}:TASK`;

    let currentVersion = Object.assign({}, task, {
      code: `${task.id}:V${this._getVerionCode(task.version)}`
    });

    // remove index properties
    delete currentVersion.taskParent;
    delete currentVersion.taskStatus;
    delete currentVersion.taskDueDate;

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
    // validate
    if (!userid)
      throw new Error("Invalid user id");
    if (!taskid)
      throw new Error("Invalid task");

    let params = {
      TableName: this.tableName,
      Key: {
        userid,
        code: !version ? `${taskid}:TASK` : `${taskid}:V${this._getVerionCode(version)}`
      }
    };

    const result = await Dynamo.get(params);
    return result.Item;
  }

  async getHistory(userid, taskid) {
    // validate
    if (!userid)
      throw new Error("Invalid user id");
    if (!taskid)
      throw new Error("Invalid task");

    let queryParam = {
      TableName: this.tableName,
      ScanIndexForward: false,
      KeyConditionExpression: "#uid = :uid and begins_with(#c, :c)",
      ProjectionExpression: "#id, #v, #cd, #pri, #prog, #t, #s",
      ExpressionAttributeValues: {
        ":uid": userid,
        ":c": `${taskid}:V`
      },
      ExpressionAttributeNames: {
        "#uid": "userid",
        "#c": "code",
        "#id": "id",
        "#v": "version",
        "#cd": "createDate",
        "#pri": "priority",
        "#prog": "progress",
        "#t": "title",
        "#s": "status"
      },
    };

    let result = await Dynamo.query(queryParam);
    if (result && result.Items && result.Items.length)
      return result.Items;
    return [];
  }

  async list(userid, status) {
    // validate
    if (!userid)
      throw new Error("Invalid user id");
    if (!status)
      throw new Error("Invalid status");

    let queryParam = {
      TableName: this.tableName,
      IndexName: this.statusIndex,
      KeyConditionExpression: "#uid = :uid and #ts = :ts",
      ProjectionExpression: "#id, #d, #pri, #prog, #t, #s, #p",
      ExpressionAttributeValues: {
        ":uid": userid,
        ":ts": status
      },
      ExpressionAttributeNames: {
        "#uid": "userid",
        "#id": "id",
        "#d": "dueDate",
        "#pri": "priority",
        "#prog": "progress",
        "#t": "title",
        "#s": "status",
        "#ts": "taskStatus",
        "#p": "parent"
      }
    };

    let result = await Dynamo.query(queryParam);
    if (result && result.Items && result.Items.length)
      return result.Items;
    return [];
  }

  async getSubTasks(userid, parent) {
    // validate
    if (!userid)
      throw new Error("Invalid user id");
    if (!parent)
      throw new Error("Invalid task");

    let queryParam = {
      TableName: this.tableName,
      IndexName: this.parentIndex,
      KeyConditionExpression: "#uid = :uid and #tp = :tp",
      ProjectionExpression: "#id, #d, #pri, #prog, #t, #s, #m, #p",
      ExpressionAttributeValues: {
        ":uid": userid,
        ":tp": `${parent}:TASK`
      },
      ExpressionAttributeNames: {
        "#uid": "userid",
        "#id": "id",
        "#d": "dueDate",
        "#pri": "priority",
        "#prog": "progress",
        "#t": "title",
        "#s": "status",
        "#m": "main",
        "#p": "parent",
        "#tp": "taskParent"
      }
    };

    let result = await Dynamo.query(queryParam);
    if (result && result.Items && result.Items.length)
      return result.Items;
    return [];
  }

  async dueInMonth(userid) {
    // validate
    if (!userid)
      throw new Error("Invalid user id");

    let startDate = moment().toISOString();
    let endDate = moment().add(1, "M").toISOString();

    let queryParam = {
      TableName: this.tableName,
      IndexName: this.dueDateIndex,
      KeyConditionExpression: "#uid = :uid and #tdd BETWEEN :sd AND :ed",
      ProjectionExpression: "#id, #d, #pri, #prog, #t, #s, #p",
      ExpressionAttributeValues: {
        ":uid": userid,
        ":sd": startDate,
        ":ed": endDate
      },
      ExpressionAttributeNames: {
        "#uid": "userid",
        "#id": "id",
        "#d": "dueDate",
        "#tdd": "taskDueDate",
        "#pri": "priority",
        "#prog": "progress",
        "#t": "title",
        "#s": "status",
        "#p": "parent"
      }
    };

    let result = await Dynamo.query(queryParam);
    if (result && result.Items && result.Items.length)
      return result.Items;
    return [];
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