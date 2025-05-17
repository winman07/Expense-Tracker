// Helper for API responses
const response = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
};

module.exports = {
  success: (body) => response(200, body),
  created: (body) => response(201, body),
  noContent: () => response(204, {}),
  badRequest: (message) => response(400, { error: message }),
  unauthorized: (message) => response(401, { error: message }),
  forbidden: (message) => response(403, { error: message }),
  notFound: (message) => response(404, { error: message }),
  serverError: (message) => response(500, { error: message }),
};