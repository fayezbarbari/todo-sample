import config from "./aws-config";

const awsConfig = {
  API: {
    endpoints: [
      {
        name: "tasks",
        endpoint: config.tasksGateway.URL,
        region: config.tasksGateway.REGION
      }
    ]
  }
};

export default awsConfig;
