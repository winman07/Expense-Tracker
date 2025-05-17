const { handler } = require('../functions/expenses/create');

// Mock the DynamoDB module
jest.mock('../lib/dynamodb', () => ({
  put: jest.fn().mockResolvedValue({})
}));

// Mock the response module
jest.mock('../lib/response', () => ({
  created: jest.fn().mockImplementation(data => ({
    statusCode: 201,
    body: JSON.stringify(data)
  })),
  badRequest: jest.fn().mockImplementation(message => ({
    statusCode: 400,
    body: JSON.stringify({ error: message })
  })),
  serverError: jest.fn().mockImplementation(message => ({
    statusCode: 500,
    body: JSON.stringify({ error: message })
  }))
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-value')
}));

describe('Create Expense Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create expense with valid input', async () => {
    const event = {
      body: JSON.stringify({
        amount: 50.99,
        category: 'food',
        date: '2025-05-15',
        description: 'Groceries'
      }),
      requestContext: {
        authorizer: {
          claims: {
            sub: 'test-user-id'
          }
        }
      }
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(201);
    
    const body = JSON.parse(response.body);
    expect(body.amount).toBe(50.99);
    expect(body.category).toBe('food');
    expect(body.userId).toBe('test-user-id');
  });

  test('should return 400 for missing required fields', async () => {
    const event = {
      body: JSON.stringify({
        category: 'food',
        // missing amount and date
        description: 'Groceries'
      }),
      requestContext: {
        authorizer: {
          claims: {
            sub: 'test-user-id'
          }
        }
      }
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(400);
  });
});