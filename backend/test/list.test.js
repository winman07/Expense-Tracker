// Define mockExpenses first, before any imports or mocks
const mockExpenses = [
  {
    expenseId: 'expense-1',
    userId: 'test-user-id',
    amount: 50.99,
    category: 'food',
    date: '2025-05-15'
  },
  {
    expenseId: 'expense-2',
    userId: 'test-user-id',
    amount: 30.50,
    category: 'transportation',
    date: '2025-05-16'
  }
];

const { handler } = require('../functions/expenses/list');

// Mock the DynamoDB module
jest.mock('../lib/dynamodb', () => ({
  query: jest.fn().mockResolvedValue(mockExpenses)
}));

// Mock the response module
jest.mock('../lib/response', () => ({
  success: jest.fn().mockImplementation(data => ({
    statusCode: 200,
    body: JSON.stringify(data)
  })),
  serverError: jest.fn().mockImplementation(message => ({
    statusCode: 500,
    body: JSON.stringify({ error: message })
  }))
}));

describe('List Expenses Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return list of expenses for user', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'test-user-id'
          }
        }
      }
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    expect(body[0].expenseId).toBe('expense-1');
    expect(body[1].expenseId).toBe('expense-2');
  });
});