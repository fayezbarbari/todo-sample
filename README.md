# todo-sample
ToDo app sample AWS

## Install AWS CLI and SAM CLI
- Install aws cli: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
- Install aws sam cli: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
- Configure aws cli: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

## Deploy the Microservice:
- Create S3 bucket: 
```
aws s3api create-bucket --bucket <BUCKET_NAME>
```
- Install NPM Packages
```
npm install

cd handlers

npm install

cd ..
```
- Deploy the Serverless Application:
```
S3=<BUCKET_NAME> npm run deploy
```
- Get the API URL from the following command:
```
aws cloudformation describe-stacks --stack-name todo-ms-stack --query 'Stacks[0].Outputs[?OutputKey==`APIUrl`].OutputValue' --output text
```


## Build the vuejs app:
- Install NPM Packages
```
cd app

npm install
```
- Copy the API URL has been created in the previous section 
- Open the following file in text editor
```todo-sample/app/src/aws-config.js```
- Fill the URL property with the API URL
```javascript
export default {
  tasksGateway: {
    REGION: "us-east-1",
    URL: "<<API URL>>"
  }
};
```
  - To serve the app locally run:
```
npm run serve
```
