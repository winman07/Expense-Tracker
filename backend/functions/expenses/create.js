const uuid = require('uuid');
const { put } = require('../../lib/dynamodb');
const response = require('../../lib/response');

module.exports.handler = async (event) => {
  try {
    const { sub: userId } = event.requestContext.authorizer.claims;
    const timestamp = new Date().toISOString();
    const data = JSON.parse(event.body);
    
    // Validate input
    if (!data.amount || !data.category || !data.date) {
      return response.badRequest('Missing required fields: amount, category, date');
    }

    const expense = {
      userId,
      expenseId: uuid.v4(),
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      description: data.description || '',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await put({ Item: expense });

    return response.created(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return response.serverError('Could not create expense');
  }
};