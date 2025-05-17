// Define mockExpense first, before any imports or mocks
const mockExpense = {
  expenseId: 'test-expense-id',
  userId: 'test-user-id',
  amount: 50.99,
  category: 'food',
  date: '2025-05-15',
  description: 'Groceries'
};

const { handler } = require('../functions/expenses/get');

// Mock the DynamoDB module
jest.mock('../lib/dynamodb', () => ({
  get: jest.fn().mockResolvedValue(mockExpense)
}));

// Mock the response module
jest.mock('../lib/response', () => ({
  success: jest.fn().mockImplementation(data => ({
    statusCode: 200,
    body: JSON.stringify(data)
  })),
  notFound: jest.fn().mockImplementation(message => ({
    statusCode: 404,
    body: JSON.stringify({ error: message })
  })),
  serverError: jest.fn().mockImplementation(message => ({
    statusCode: 500,
    body: JSON.stringify({ error: message })
  }))
}));

describe('Get Expense Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get expense by ID', async () => {
    const event = {
      pathParameters: {
        id: 'test-expense-id'
      },
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
    expect(body.expenseId).toBe('test-expense-id');
    expect(body.amount).toBe(50.99);
  });

  test('should return 404 when expense not found', async () => {
    // Override the mock to return no item
    require('../lib/dynamodb').get.mockResolvedValueOnce(null);

    const event = {
      pathParameters: {
        id: 'non-existent-id'
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: 'test-user-id'
          }
        }
      }
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(404);
  });
});