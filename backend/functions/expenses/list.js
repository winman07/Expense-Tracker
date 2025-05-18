const { query } = require('../../lib/dynamodb');
const response = require('../../lib/response');

module.exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Environment:', JSON.stringify(process.env, null, 2));
  
  try {
    // Check if authorization is correctly passed
    if (!event.requestContext || !event.requestContext.authorizer || !event.requestContext.authorizer.claims) {
      console.log('Authorization data missing');
      return response.serverError('Authorization data missing');
    }
    
    const { sub: userId } = event.requestContext.authorizer.claims;
    console.log('UserId:', userId);
    
    const params = {
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };
    console.log('Query params:', JSON.stringify(params, null, 2));

    const expenses = await query(params);
    console.log('Query result:', JSON.stringify(expenses, null, 2));
    
    return response.success(expenses);
  } catch (error) {
    console.error('Error listing expenses:', error);
    return response.serverError('Could not list expenses');
  }
};