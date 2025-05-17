const { query } = require('../../lib/dynamodb');
const response = require('../../lib/response');

module.exports.handler = async (event) => {
  try {
    const { sub: userId } = event.requestContext.authorizer.claims;
    
    const params = {
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    const expenses = await query(params);
    
    return response.success(expenses);
  } catch (error) {
    console.error('Error listing expenses:', error);
    return response.serverError('Could not list expenses');
  }
};