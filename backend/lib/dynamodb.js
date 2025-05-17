const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TableName = process.env.EXPENSES_TABLE;

const get = async (params) => {
  const result = await dynamoDb.get({ TableName, ...params }).promise();
  return result.Item;
};

const query = async (params) => {
  const result = await dynamoDb.query({ TableName, ...params }).promise();
  return result.Items;
};

const put = async (params) => {
  return dynamoDb.put({ TableName, ...params }).promise();
};

const update = async (params) => {
  return dynamoDb.update({ TableName, ...params }).promise();
};

const remove = async (params) => {
  return dynamoDb.delete({ TableName, ...params }).promise();
};

module.exports = {
  get,
  query,
  put,
  update,
  remove,
  client: dynamoDb
};