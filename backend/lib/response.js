const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Success response (status code 200)
const success = (data) => ({
  statusCode: 200,
  headers,
  body: JSON.stringify(data)
});

// Created response (status code 201)
const created = (data) => ({
  statusCode: 201,
  headers,
  body: JSON.stringify(data)
});

// No content response (status code 204)
const noContent = () => ({
  statusCode: 204,
  headers,
  body: JSON.stringify({})
});

// Bad request response (status code 400)
const badRequest = (message) => ({
  statusCode: 400,
  headers,
  body: JSON.stringify({ message })
});

// Not found response (status code 404)
const notFound = (message) => ({
  statusCode: 404,
  headers,
  body: JSON.stringify({ message })
});

// Server error response (status code 500)
const serverError = (message) => ({
  statusCode: 500,
  headers,
  body: JSON.stringify({ message })
});

module.exports = {
  success,
  created,
  noContent,
  badRequest,
  notFound,
  serverError
};