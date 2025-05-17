import { isAuthenticated, signOut, getCurrentUser } from './services/auth';
import { getExpenses } from './services/api';
import Auth from './components/Auth';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import './styles/styles.css';

class App {
  constructor() {
    this.app = document.getElementById('app');
    this.currentExpense = null;
    this.expenses = [];
    this.initialize();
  }
  
  async initialize() {
    const authenticated = await isAuthenticated();
    
    if (authenticated) {
      this.user = await getCurrentUser();
      this.renderAuthenticatedView();
      this.loadExpenses();
    } else {
      this.renderUnauthenticatedView();
    }
  }
  
  renderUnauthenticatedView() {
    this.app.innerHTML = `
      <div id="auth-container"></div>
    `;
    
    // Initialize Auth component
    new Auth(document.getElementById('auth-container'));
  }
  
  renderAuthenticatedView() {
    this.app.innerHTML = `
      <nav class="navbar navbar-light bg-light">
        <div class="container">
          <a class="navbar-brand" href="#">Personal Expense Tracker</a>
          <div class="ml-auto">
            <span class="navbar-text mr-3">
              <strong>Welcome, ${this.user.email}</strong>
            </span>
            <button id="signout-btn" class="btn btn-outline-danger btn-sm">Sign Out</button>
          </div>
        </div>
      </nav>
      
      <div class="container py-4">
        <div id="dashboard-container" class="mb-4"></div>
        
        <div id="expense-form-container"></div>
        
        <h4 class="mb-3 mt-4">Your Expenses</h4>
        <div id="expense-list-container"></div>
      </div>
    `;
    
    // Add event listener for sign out
    document.getElementById('signout-btn').addEventListener('click', () => {
      signOut();
      window.location.reload();
    });
    
    // Initialize components
    this.expenseForm = new ExpenseForm(
      document.getElementById('expense-form-container'),
      (expense, success) => this.handleExpenseFormSubmit(expense, success)
    );
    
    this.expenseList = new ExpenseList(
      document.getElementById('expense-list-container'),
      (expense) => this.handleEditExpense(expense)
    );
    
    this.dashboard = new Dashboard(
      document.getElementById('dashboard-container')
    );
  }
  
  async loadExpenses() {
    try {
      this.expenses = await getExpenses();
      this.expenseList.expenses = this.expenses;
      this.expenseList.render();
      this.dashboard.updateExpenses(this.expenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  }
  
  handleExpenseFormSubmit(expense, success) {
    if (success) {
      // Refresh expense list
      this.loadExpenses();
      
      if (this.currentExpense) {
        this.currentExpense = null;
        // Re-render expense form for adding new expense
        this.expenseForm = new ExpenseForm(
          document.getElementById('expense-form-container'),
          (expense, success) => this.handleExpenseFormSubmit(expense, success)
        );
      }
    }
  }
  
  handleEditExpense(expense) {
    this.currentExpense = expense;
    
    this.expenseForm = new ExpenseForm(
      document.getElementById('expense-form-container'),
      (expense, success) => this.handleExpenseFormSubmit(expense, success),
      this.currentExpense
    );
    
    // Scroll to the form
    document.getElementById('expense-form-container').scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new App();
});