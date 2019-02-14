jest.mock("../handlers/libs/dynamo");
const TaskService = require("../handlers/libs/taskService");
const Dynamo = require("../handlers/libs/dynamo");

describe("AddTask", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Add new task", async () => {
    // Assemble
    let task = {
      title: "MyTask",
      parent: 33
    };
    let userid = "myuserid";
    Dynamo.batchWriteItem.mockResolvedValue({});
    TaskService.tableName = "TaskTable";

    // Act
    let result = await TaskService.add(userid, task);


    // Assert
    expect(Dynamo.batchWriteItem).toBeCalledWith({
      RequestItems: {
        TaskTable: [
          {
            PutRequest: {
              Item: {
                code: "1:TASK",
                createDate: expect.any(String),
                id: 1,
                priority: "Medium",
                priorityCode: 3,
                status: "ToDo",
                taskStatus: "ToDo",
                title: "MyTask",
                userid: "myuserid",
                version: 1,
                parent: 33,
                taskParent: "33:TASK"
              },
            },
          },
          {
            PutRequest: {
              Item: {
                code: "1:V001",
                createDate: expect.any(String),
                id: 1,
                priority: "Medium",
                priorityCode: 3,
                status: "ToDo",
                title: "MyTask",
                parent: 33,
                userid: "myuserid",
                version: 1,
              },
            },
          },
        ],
      }
    });

    expect(result).toEqual({
      code: "1:TASK",
      createDate: expect.any(String),
      id: 1,
      priority: "Medium",
      priorityCode: 3,
      status: "ToDo",
      taskStatus: "ToDo",
      title: "MyTask",
      userid: "myuserid",
      version: 1,
      parent: 33,
      taskParent: "33:TASK"
    });
  });

  test("Save task", async () => {
    // Assemble
    let task = {
      id: 25,
      title: "NewTask",
      dueDate: "2019-01-01"
    };
    let existingTask = {
      code: "25:TASK",
      id: 25,
      priority: "Medium",
      priorityCode: 3,
      status: "ToDo",
      taskStatus: "ToDo",
      title: "OldTask",
      userid: "myuserid",
      version: 1
    };

    let userid = "myuserid";
    Dynamo.get.mockResolvedValue({ Item: existingTask });
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let result = await TaskService.add(userid, task);


    // Assert
    expect(Dynamo.batchWriteItem).toBeCalledWith({
      RequestItems: {
        TaskTable: [
          {
            PutRequest: {
              Item: {
                code: "25:TASK",
                createDate: expect.any(String),
                id: 25,
                priority: "Medium",
                priorityCode: 3,
                status: "ToDo",
                taskStatus: "ToDo",
                title: "NewTask",
                userid: "myuserid",
                version: 2,
                dueDate: "2019-01-01",
                taskDueDate: "2019-01-01T06:00:00.000Z",
              },
            },
          },
          {
            PutRequest: {
              Item: {
                code: "25:V002",
                createDate: expect.any(String),
                id: 25,
                priority: "Medium",
                priorityCode: 3,
                status: "ToDo",
                title: "NewTask",
                userid: "myuserid",
                version: 2,
                dueDate: "2019-01-01",
              },
            },
          },
        ],
      }
    });

    expect(result).toEqual({
      code: "25:TASK",
      createDate: expect.any(String),
      id: 25,
      priority: "Medium",
      priorityCode: 3,
      status: "ToDo",
      taskStatus: "ToDo",
      title: "NewTask",
      userid: "myuserid",
      version: 2,
      dueDate: "2019-01-01",
      taskDueDate: "2019-01-01T06:00:00.000Z",
    });
  });


  test("userid is required", async () => {
    // Assemble
    let task = {
      title: "NewTask",
      dueDate: "2019-01-01"
    };

    let userid = "";
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let ex = null;
    try {
      await TaskService.add(userid, task);
    } catch (e) {
      ex = e;
    }

    // Assert
    expect(ex).not.toBeNull();
    expect(ex.message).toBe("Invalid user id");
  });

  test("task is required", async () => {
    // Assemble
    let task = null;
    let userid = "user";
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let ex = null;
    try {
      await TaskService.add(userid, task);
    } catch (e) {
      ex = e;
    }

    // Assert
    expect(ex).not.toBeNull();
    expect(ex.message).toBe("Invalid task");
  });


  test("progress should be number", async () => {
    // Assemble
    let task = {
      title: "NewTask",
      dueDate: "2019-01-01",
      progress: "NA"
    };
    let userid = "user";
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let ex = null;
    try {
      await TaskService.add(userid, task);
    } catch (e) {
      ex = e;
    }

    // Assert
    expect(ex).not.toBeNull();
    expect(ex.message).toBe("Invalid progress value: NA");
  });

  test("progress should not be less than zero", async () => {
    // Assemble
    let task = {
      title: "NewTask",
      dueDate: "2019-01-01",
      progress: -10
    };
    let userid = "user";
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let ex = null;
    try {
      await TaskService.add(userid, task);
    } catch (e) {
      ex = e;
    }

    // Assert
    expect(ex).not.toBeNull();
    expect(ex.message).toBe("Invalid progress value: -10");
  });

  test("progress should not be more than 100", async () => {
    // Assemble
    let task = {
      title: "NewTask",
      dueDate: "2019-01-01",
      progress: 101
    };
    let userid = "user";
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let ex = null;
    try {
      await TaskService.add(userid, task);
    } catch (e) {
      ex = e;
    }

    // Assert
    expect(ex).not.toBeNull();
    expect(ex.message).toBe("Invalid progress value: 101");
  });


  test("parent should be number", async () => {
    // Assemble
    let task = {
      title: "NewTask",
      dueDate: "2019-01-01",
      progress: 100,
      parent: "AC"
    };
    let userid = "user";
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let ex = null;
    try {
      await TaskService.add(userid, task);
    } catch (e) {
      ex = e;
    }

    // Assert
    expect(ex).not.toBeNull();
    expect(ex.message).toBe("Invalid task parent: AC");
  });

  test("due date should be date", async () => {
    // Assemble
    let task = {
      title: "NewTask",
      progress: 100,
      dueDate: "33-22"
    };
    let userid = "user";
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let ex = null;
    try {
      await TaskService.add(userid, task);
    } catch (e) {
      ex = e;
    }

    // Assert
    expect(ex).not.toBeNull();
    expect(ex.message).toBe("Invalid due date: 33-22");
  });

  test("When provide task id, the task should be existed", async () => {
    // Assemble
    let task = {
      id: 3,
      title: "NewTask",
      progress: 0
    };
    let userid = "user";
    Dynamo.get.mockResolvedValue({ Item: null });
    Dynamo.batchWriteItem.mockResolvedValue();
    TaskService.tableName = "TaskTable";

    // Act
    let ex = null;
    try {
      await TaskService.add(userid, task);
    } catch (e) {
      ex = e;
    }

    // Assert
    expect(ex).not.toBeNull();
    expect(ex.message).toBe("Invalid task id");
  });
});