"use strict";

const AWS = require("aws-sdk");

class Dynamo {
  constructor() {
    this.dynamoClient = new AWS.DynamoDB.DocumentClient();
  }

  put(params) {
    return this.dynamoClient.put(params).promise();
  }

  update(params) {
    return this.dynamoClient.update(params).promise();
  }

  query(params) {
    return this.dynamoClient.query(params).promise();
  }

  scan(params) {
    return this.dynamoClient.scan(params).promise();
  }

  get(params) {
    return this.dynamoClient.get(params).promise();
  }

  batchWriteItem(params) {
    return this.dynamoClient.batchWrite(params).promise();
  }
}

module.exports = new Dynamo();