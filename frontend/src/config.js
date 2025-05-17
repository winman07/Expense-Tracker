const useMockData = process.env.NODE_ENV !== 'production';

const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'API_URL_PLACEHOLDER', // Will be updated after deployment
  userPoolId: process.env.REACT_APP_USER_POOL_ID || 'USER_POOL_ID_PLACEHOLDER', // Will be updated after deployment
  userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'USER_POOL_CLIENT_ID_PLACEHOLDER', // Will be updated after deployment
  region: 'us-east-2'
};

if (useMockData) {
  console.log('Using mock data for development');
  
  if (localStorage.getItem('mockUser')) {
    window.mockUser = JSON.parse(localStorage.getItem('mockUser'));
  } else {
    window.mockUser = null;
  }
  
  if (localStorage.getItem('mockExpenses')) {
    window.mockExpenses = JSON.parse(localStorage.getItem('mockExpenses'));
  } else {
    window.mockExpenses = [
      {
        expenseId: '1',
        userId: 'mock-user-id',
        amount: 54.99,
        category: 'food',
        date: '2025-05-14',
        description: 'Grocery shopping',
        createdAt: '2025-05-14T10:00:00Z',
        updatedAt: '2025-05-14T10:00:00Z'
      },
      {
        expenseId: '2',
        userId: 'mock-user-id',
        amount: 120.00,
        category: 'housing',
        date: '2025-05-13',
        description: 'Electricity bill',
        createdAt: '2025-05-13T14:30:00Z',
        updatedAt: '2025-05-13T14:30:00Z'
      },
      {
        expenseId: '3',
        userId: 'mock-user-id',
        amount: 35.75,
        category: 'transportation',
        date: '2025-05-12',
        description: 'Gas',
        createdAt: '2025-05-12T18:15:00Z',
        updatedAt: '2025-05-12T18:15:00Z'
      },
      {
        expenseId: '4',
        userId: 'mock-user-id',
        amount: 65.99,
        category: 'entertainment',
        date: '2025-05-11',
        description: 'Movie night',
        createdAt: '2025-05-11T20:45:00Z',
        updatedAt: '2025-05-11T20:45:00Z'
      }
    ];
    localStorage.setItem('mockExpenses', JSON.stringify(window.mockExpenses));
  }
}

export default config;
export { useMockData };