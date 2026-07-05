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

function renderIncomeExpenseChart() {
  const canvas = document.getElementById("income-expense-chart");
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Amount",
          backgroundColor: ["#6C63FF", "#F87171"],
          data: [getTotalIncome(), getTotalExpenses()],
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
      },
    },
  });
}

function renderSpendingChart() {
  const chartColors = [
    "#6C63FF",
    "#34D399",
    "#F87171",
    "#FBBF24",
    "#22d3ee",
    "#a78bfa",
  ];
  const canvas = document.getElementById("spending-chart");
  const ctx = canvas.getContext("2d");

  const spendingByCategory = {};

  const transactions = getTransactions();

  const expenses = transactions.filter((transaction) => {
    return transaction.type === "expense";
  });

  expenses.forEach((transaction) => {
    const category = transaction.category;
    const amount = transaction.amount;

    if (!spendingByCategory[category]) {
      spendingByCategory[category] = 0;
    }

    spendingByCategory[category] += amount;
  });

  const labels = Object.keys(spendingByCategory);
  const data = Object.values(spendingByCategory);

  const totalSpending = data.reduce((sum, val) => sum + val, 0);

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
      const {
        ctx,
        chartArea: { top, bottom, left, right },
      } = chart;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      ctx.save();

      ctx.font = "500 12px Inter";
      ctx.fillStyle = "#9CA3AF";
      ctx.textAlign = "center";
      ctx.fillText("Total", centerX, centerY - 10);

      ctx.font = "700 18px Inter";
      ctx.fillStyle = "#F1F2F6";
      ctx.fillText(formatCurrency(totalSpending), centerX, centerY + 12);

      ctx.restore();
    },
  };

  new Chart(ctx, {
    type: "doughnut",
    plugins: [centerTextPlugin],
    data: {
      labels: labels,
      datasets: [
        {
          backgroundColor: chartColors,
          data: data,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "70%",
      plugins: {
        legend: { display: false },
      },
    },
  });
  const legendContainer = document.getElementById("spending-chart-legend");
  legendContainer.innerHTML = "";

  labels.forEach((label, i) => {
    const amount = data[i];
    const percentage = Math.round((amount / totalSpending) * 100);

    legendContainer.innerHTML += `
    <div class="chart-legend-item">
      <span class="chart-legend-dot" style="background-color: ${chartColors[i]}"></span>
      <span class="chart-legend-label">${label}</span>
      <span class="chart-legend-amount">${formatCurrency(amount)}</span>
      <span class="chart-legend-percent">${percentage}%</span>
    </div>
  `;
  });
}

function initDashboard() {
  updateStatCards();
  renderBudgetOverview();
  renderSavingsGoals();
  renderIncomeExpenseChart();
  renderSpendingChart();
}
