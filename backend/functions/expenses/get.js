const { get } = require('../../lib/dynamodb');
const response = require('../../lib/response');

module.exports.handler = async (event) => {
  try {
    const { sub: userId } = event.requestContext.authorizer.claims;
    const { id: expenseId } = event.pathParameters;
    
    const expense = await get({
      Key: {
        userId,
        expenseId
      }
    });
    
    if (!expense) {
      return response.notFound('Expense not found');
    }
    
    return response.success(expense);
  } catch (error) {
    console.error('Error getting expense:', error);
    return response.serverError('Could not get expense');
  }
};