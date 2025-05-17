const { remove, get } = require('../../lib/dynamodb');
const response = require('../../lib/response');

module.exports.handler = async (event) => {
  try {
    const { sub: userId } = event.requestContext.authorizer.claims;
    const { id: expenseId } = event.pathParameters;
    
    // Check if expense exists
    const existingExpense = await get({
      Key: {
        userId,
        expenseId
      }
    });
    
    if (!existingExpense) {
      return response.notFound('Expense not found');
    }
    
    await remove({
      Key: {
        userId,
        expenseId
      }
    });
    
    return response.noContent();
  } catch (error) {
    console.error('Error deleting expense:', error);
    return response.serverError('Could not delete expense');
  }
};