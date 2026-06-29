function getTransactions() {
  return AppState.transactions;
}

function addTransaction(data) {
  const transaction = {
    id: generateId(),
    date: data.date,
    description: data.description,
    category: data.category,
    type: data.type,
    amount: Math.abs(parseFloat(data.amount)),
    createdAt: new Date().toISOString(),
  };
  AppState.transactions.push(transaction);
  saveState("transactions");
}

function deleteTransaction(id) {
  AppState.transactions = AppState.transactions.filter((transaction) => {
    return transaction.id !== id;
  });

  saveState("transactions");
}

function updateTransaction(id, data) {
  const index = AppState.transactions.findIndex(
    (transaction) => transaction.id === id,
  );
  if (index === -1) {
    return;
  }
  const newTransaction = {
    ...AppState.transactions[index],
    ...data,
  };

  AppState.transactions[index] = newTransaction;

  saveState("transactions");
}

function getTotalIncome() {
  const incomes = AppState.transactions.filter((transaction) => {
    return transaction.type === "income";
  });
  const total = incomes.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  return total;
}

function getTotalExpenses() {
  const expenses = AppState.transactions.filter((transaction) => {
    return transaction.type === "expense";
  });
  const total = expenses.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  return total;
}
