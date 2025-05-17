const { update, get } = require('../../lib/dynamodb');
const response = require('../../lib/response');

module.exports.handler = async (event) => {
  try {
    const { sub: userId } = event.requestContext.authorizer.claims;
    const { id: expenseId } = event.pathParameters;
    const data = JSON.parse(event.body);
    const timestamp = new Date().toISOString();
    
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
    
    // update expression
    let updateExpression = 'SET updatedAt = :updatedAt';
    const expressionAttributeValues = {
      ':updatedAt': timestamp
    };
    
    // update fields that are provided
    if (data.amount !== undefined) {
      updateExpression += ', amount = :amount';
      expressionAttributeValues[':amount'] = parseFloat(data.amount);
    }
    
    if (data.category !== undefined) {
      updateExpression += ', category = :category';
      expressionAttributeValues[':category'] = data.category;
    }
    
    if (data.date !== undefined) {
      updateExpression += ', #date = :date';
      expressionAttributeValues[':date'] = data.date;
    }
    
    if (data.description !== undefined) {
      updateExpression += ', description = :description';
      expressionAttributeValues[':description'] = data.description;
    }
    
    await update({
      Key: {
        userId,
        expenseId
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: {
        '#date': 'date'
      },
      ReturnValues: 'ALL_NEW'
    });
    
    // Get the updated item
    const updatedExpense = await get({
      Key: {
        userId,
        expenseId
      }
    });
    
    return response.success(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return response.serverError('Could not update expense');
  }
};