import { createExpense, updateExpense } from '../services/api';

export default class ExpenseForm {
  constructor(container, onExpenseAdded = null, expense = null) {
    this.container = container;
    this.onExpenseAdded = onExpenseAdded;
    this.expense = expense; // Null for create, expense object for update
    this.render();
    this.registerEventListeners();
  }
  
  render() {
    const today = new Date().toISOString().split('T')[0];
    const isUpdate = !!this.expense;
    
    this.container.innerHTML = `
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">${isUpdate ? 'Edit Expense' : 'Add New Expense'}</h5>
        </div>
        <div class="card-body">
          <form id="expense-form">
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="expense-amount">Amount</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">$</span>
                  </div>
                  <input type="number" class="form-control" id="expense-amount" min="0.01" step="0.01" required
                         value="${isUpdate ? this.expense.amount : ''}">
                </div>
              </div>
              <div class="form-group col-md-6">
                <label for="expense-category">Category</label>
                <select class="form-control" id="expense-category" required>
                  <option value="" disabled ${isUpdate ? '' : 'selected'}>Select a category</option>
                  <option value="food" ${isUpdate && this.expense.category === 'food' ? 'selected' : ''}>Food</option>
                  <option value="transportation" ${isUpdate && this.expense.category === 'transportation' ? 'selected' : ''}>Transportation</option>
                  <option value="housing" ${isUpdate && this.expense.category === 'housing' ? 'selected' : ''}>Housing</option>
                  <option value="utilities" ${isUpdate && this.expense.category === 'utilities' ? 'selected' : ''}>Utilities</option>
                  <option value="entertainment" ${isUpdate && this.expense.category === 'entertainment' ? 'selected' : ''}>Entertainment</option>
                  <option value="other" ${isUpdate && this.expense.category === 'other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="expense-date">Date</label>
                <input type="date" class="form-control" id="expense-date" required
                       value="${isUpdate ? this.expense.date : today}">
              </div>
              <div class="form-group col-md-6">
                <label for="expense-description">Description</label>
                <input type="text" class="form-control" id="expense-description" placeholder="Optional"
                       value="${isUpdate ? this.expense.description : ''}">
              </div>
            </div>
            <div id="expense-form-error" class="alert alert-danger d-none"></div>
            <button type="submit" class="btn btn-success">${isUpdate ? 'Update' : 'Add'} Expense</button>
            ${isUpdate ? '<button type="button" id="cancel-update" class="btn btn-secondary ml-2">Cancel</button>' : ''}
          </form>
        </div>
      </div>
    `;
  }
  
  registerEventListeners() {
    document.getElementById('expense-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    if (this.expense) {
      document.getElementById('cancel-update').addEventListener('click', () => {
        if (this.onExpenseAdded) {
          this.onExpenseAdded(null, false);
        }
      });
    }
  }
  
  showError(message) {
    const errorElement = document.getElementById('expense-form-error');
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
  }
  
  hideError() {
    document.getElementById('expense-form-error').classList.add('d-none');
  }
  
  async handleSubmit() {
    try {
      const amount = document.getElementById('expense-amount').value;
      const category = document.getElementById('expense-category').value;
      const date = document.getElementById('expense-date').value;
      const description = document.getElementById('expense-description').value;
      
      if (!amount || !category || !date) {
        this.showError('Please fill in all required fields.');
        return;
      }
      
      const expenseData = {
        amount: parseFloat(amount),
        category,
        date,
        description
      };
      
      this.hideError();
      
      let result;
      if (this.expense) {
        // Update existing expense
        result = await updateExpense(this.expense.expenseId, expenseData);
      } else {
        // Create new expense
        result = await createExpense(expenseData);
      }
      
      if (this.onExpenseAdded) {
        this.onExpenseAdded(result, true);
      }
      
      // Reset form if creating a new expense
      if (!this.expense) {
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-category').value = '';
        document.getElementById('expense-description').value = '';
      }
    } catch (error) {
      console.error('Expense submission error:', error);
      this.showError(error.message || 'Failed to save expense. Please try again.');
    }
  }
}