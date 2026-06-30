function getBudgets() {
  return AppState.budgets;
}

function addBudget(data) {
  const budget = {
    id: generateId(),
    category: data.category,
    limit: parseFloat(data.limit),
    createdAt: new Date().toISOString(),
  };

  AppState.budgets.push(budget);

  saveState("budgets");
}

function deleteBudget(id) {
  AppState.budgets = AppState.budgets.filter((budget) => {
    return budget.id !== id;
  });

  saveState("budgets");
}

function updateBudget(id, data) {
  const index = AppState.budgets.findIndex((budget) => budget.id === id);
  if (index === -1) {
    return;
  }
  const newBudget = {
    ...AppState.budgets[index],
    ...data,
  };

  AppState.budgets[index] = newBudget;

  saveState("budgets");
}

function getSpentByCategory(category) {
  const expenses = AppState.transactions.filter((transaction) => {
    return transaction.type === "expense" && transaction.category === category;
  });

  const total = expenses.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  return total;
}

function getBudgetProgress(budgetId) {
  const budget = AppState.budgets.find((budget) => {
    return budget.id === budgetId;
  });
  if (!budget) {
    return null;
  }

  const spent = getSpentByCategory(budget.category);
  const remaining = budget.limit - spent;
  const percentage = Math.min((spent / budget.limit) * 100, 100);
  const isOver = spent > budget.limit;

  return {
    spent,
    limit: budget.limit,
    remaining,
    percentage,
    isOver,
  };
}
