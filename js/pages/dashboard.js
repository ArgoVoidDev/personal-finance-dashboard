function updateStatCards() {
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();

  const balance = totalIncome - totalExpenses;
  const saving = balance;

  const balanceElement = document.getElementById("stat-balance");
  const incomeElement = document.getElementById("stat-income");
  const expensesElement = document.getElementById("stat-expenses");
  const savingsElement = document.getElementById("stat-savings");

  balanceElement.textContent = formatCurrency(balance);
  incomeElement.textContent = formatCurrency(totalIncome);
  expensesElement.textContent = formatCurrency(totalExpenses);
  savingsElement.textContent = formatCurrency(saving);
}

function renderBudgetOverview() {
  const budgets = getBudgets();

  const container = document.getElementById("budget-overview-list");

  container.innerHTML = "";

  budgets.forEach((budget) => {
    const progress = getBudgetProgress(budget.id);

    container.innerHTML += `
    <div class="budget-item">
    <div class="budget-item__header">
    <span>${budget.category}</span>
    <span>${formatCurrency(progress.spent)} / ${formatCurrency(progress.limit)}</span>
    </div>
    <div class="budget-item__progress">
    <div 
    class="budget-item__progress-fill"
    style="width: ${progress.percentage}%;"></div>
    </div>
    <div class="budget-item__percentage">${progress.percentage}%</div>
    </div>
    `;
  });
}

function renderSavingsGoals() {
  const savings = getSavings();

  const container = document.getElementById("savings-goals-list");

  container.innerHTML = "";

  savings.forEach((saving) => {
    const progress = getSavingsProgress(saving.id);

    container.innerHTML += `
    <div class="saving-item">
    <div class="saving-item__header">
    <span>${saving.name}</span>
    <span>${formatCurrency(progress.saved)} / ${formatCurrency(progress.target)}</span>
    </div>

    <div class="saving-item__progress">

    <div class="saving-item__progress-fill"
    style="width: ${progress.percentage}%"></div>

    </div>

    <div class="saving-item__footer">
    <span>${progress.percentage}%</span>

    <span>${progress.isCompleted ? "Completed" : `${progress.daysLeft} days left`}</span>
    </div>

    </div>
    
    `;
  });
}

function initDashboard() {
  updateStatCards();
  renderBudgetOverview();
  renderSavingsGoals();
}
