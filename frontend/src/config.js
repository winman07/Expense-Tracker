const useMockData = false;

const config = {
  apiUrl: 'https://uwpb2sinm0.execute-api.us-east-2.amazonaws.com/prod',
  // These need to be at the top level, not nested in a cognito object
  userPoolId: 'us-east-2_qZZ3zerEy',
  userPoolClientId: '57vi4bvqr9em4pe1rhlbdoa2tg',
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