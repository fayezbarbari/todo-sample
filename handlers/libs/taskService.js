"use strict";
const Dynamo = require("./dynamo");
const moment = require("moment");

class GameService {
  constructor() {
    this.tableName = process.env.TasksTable;
  }

  add(task) {
    return "Hello World";
  }
}


module.exports = new GameService();