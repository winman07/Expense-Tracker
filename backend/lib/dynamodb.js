const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const TableName = process.env.EXPENSES_TABLE;

const get = async (params) => {
  const command = new GetCommand({
    TableName,
    ...params
  });
  const result = await dynamoDb.send(command);
  return result.Item;
};

const query = async (params) => {
  const command = new QueryCommand({
    TableName,
    ...params
  });
  const result = await dynamoDb.send(command);
  return result.Items;
};

const put = async (params) => {
  const command = new PutCommand({
    TableName,
    ...params
  });
  return dynamoDb.send(command);
};

const update = async (params) => {
  const command = new UpdateCommand({
    TableName,
    ...params
  });
  return dynamoDb.send(command);
};

const remove = async (params) => {
  const command = new DeleteCommand({
    TableName,
    ...params
  });
  return dynamoDb.send(command);
};

module.exports = {
  get,
  query,
  put,
  update,
  remove,
  client: dynamoDb
};