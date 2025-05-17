import { getExpenses, deleteExpense } from '../services/api';

export default class ExpenseList {
  constructor(container, onEditExpense = null) {
    this.container = container;
    this.expenses = [];
    this.onEditExpense = onEditExpense;
    this.render();
  }
  
  async loadExpenses() {
    try {
      this.showLoading();
      this.expenses = await getExpenses();
      this.render();
    } catch (error) {
      console.error('Error loading expenses:', error);
      this.showError('Failed to load expenses. Please try again.');
    }
  }
  
  render() {
    if (this.loading) {
      this.container.innerHTML = `
        <div class="text-center p-3">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      `;
      return;
    }
    
    if (this.error) {
      this.container.innerHTML = `
        <div class="alert alert-danger">
          ${this.error}
        </div>
      `;
      return;
    }
    
    if (this.expenses.length === 0) {
      this.container.innerHTML = `
        <div class="card">
          <div class="card-body text-center">
            <p class="mb-0">No expenses yet. Add your first expense using the form above!</p>
          </div>
        </div>
      `;
      return;
    }
    
    // Sort expenses by date
    const sortedExpenses = [...this.expenses].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    let expenseRows = '';
    
    sortedExpenses.forEach(expense => {
      const date = new Date(expense.date).toLocaleDateString();
      expenseRows += `
        <tr>
          <td>${date}</td>
          <td class="text-capitalize">${expense.category}</td>
          <td>${expense.description || '-'}</td>
          <td class="text-right">$${parseFloat(expense.amount).toFixed(2)}</td>
          <td class="text-right">
            <button class="btn btn-sm btn-outline-primary edit-expense mr-1" data-id="${expense.expenseId}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-expense" data-id="${expense.expenseId}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
    
    this.container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th class="text-right">Amount</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${expenseRows}
          </tbody>
        </table>
      </div>
    `;
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-expense').forEach(button => {
      button.addEventListener('click', (e) => {
        const expenseId = e.currentTarget.getAttribute('data-id');
        this.handleEdit(expenseId);
      });
    });
    
    document.querySelectorAll('.delete-expense').forEach(button => {
      button.addEventListener('click', (e) => {
        const expenseId = e.currentTarget.getAttribute('data-id');
        this.handleDelete(expenseId);
      });
    });
  }
  
  showLoading() {
    this.loading = true;
    this.error = null;
    this.render();
  }
  
  hideLoading() {
    this.loading = false;
    this.render();
  }
  
  showError(message) {
    this.loading = false;
    this.error = message;
    this.render();
  }
  
  handleEdit(expenseId) {
    const expense = this.expenses.find(exp => exp.expenseId === expenseId);
    if (expense && this.onEditExpense) {
      this.onEditExpense(expense);
    }
  }
  
  async handleDelete(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    try {
      await deleteExpense(expenseId);
      
      // Remove from local array
      this.expenses = this.expenses.filter(exp => exp.expenseId !== expenseId);
      
      // Re-render the list
      this.render();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  }
}