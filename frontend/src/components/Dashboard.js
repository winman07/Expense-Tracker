export default class Dashboard {
  constructor(container, expenses = []) {
    this.container = container;
    this.expenses = expenses;
    this.render();
  }
  
  updateExpenses(expenses) {
    this.expenses = expenses;
    this.render();
  }
  
  render() {
    if (!this.expenses || this.expenses.length === 0) {
      this.container.innerHTML = `
        <div class="card mb-4">
          <div class="card-body text-center">
            <p class="mb-0">No expenses recorded yet. Add your first expense using the form below.</p>
          </div>
        </div>
      `;
      return;
    }
    
    // Calculate total expenses
    const total = this.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    
    // Calculate category totals and percentages
    const categoryData = this.getCategoryData(total);
    
    // HTML for category breakdown
    let categorySummaryHtml = '';
    
    Object.keys(categoryData).forEach(category => {
      const { amount, percentage } = categoryData[category];
      categorySummaryHtml += `
        <tr>
          <td class="text-capitalize">${category}</td>
          <td>$${amount.toFixed(2)}</td>
          <td>${percentage.toFixed(1)}%</td>
        </tr>
      `;
    });
    
    // HTML for dashboard
    this.container.innerHTML = `
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Expense Summary</h5>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-12">
              <h2>Total: $${total.toFixed(2)}</h2>
              <p>${this.expenses.length} expenses recorded</p>
            </div>
          </div>
          
          <h6 class="mb-3">Category Breakdown</h6>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${categorySummaryHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  
  getCategoryData(total) {
    const categoryData = {};
    
    this.expenses.forEach(expense => {
      const category = expense.category;
      const amount = parseFloat(expense.amount);
      
      if (categoryData[category]) {
        categoryData[category].amount += amount;
      } else {
        categoryData[category] = {
          amount: amount,
          percentage: 0
        };
      }
    });
    
    // Calculate percentages
    Object.keys(categoryData).forEach(category => {
      categoryData[category].percentage = (categoryData[category].amount / total * 100);
    });
    
    return categoryData;
  }
}