jest.mock("../handlers/libs/dynamo");
const TaskService = require("../handlers/libs/taskService");
const Dynamo = require("../handlers/libs/dynamo");

describe("AddTask", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Add task", async () => {
    // Assemble
    let task = { title: "MyTask" };
    let userid = "myuserid";
    Dynamo.put.mockResolvedValue({});
    TaskService.tableName = "TaskTable";

    // Act
    let result = await TaskService.add(userid, task);

    // Assert
    expect(result).toBe("Hello World");
  });

});