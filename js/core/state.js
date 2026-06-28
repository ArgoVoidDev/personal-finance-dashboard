const AppState = {
  transactions: [],
  budgets: [],
  savings: [],
  settings: {
    name: "Alex Kim",
    email: "alex@finio.app",
    currency: "USD",
    theme: "dark",
  },
};

function initState() {
  const transactionsData = loadData("transactions");
  const budgetsData = loadData("budgets");
  const savingsData = loadData("savings");
  const settingsData = loadData("settings");

  if (transactionsData !== null) {
    AppState.transactions = transactionsData;
  }
  if (budgetsData !== null) {
    AppState.budgets = budgetsData;
  }
  if (savingsData !== null) {
    AppState.savings = savingsData;
  }
  if (settingsData !== null) {
    AppState.settings = settingsData;
  }
}

function saveState(key) {
  saveData(key, AppState[key]);
}
