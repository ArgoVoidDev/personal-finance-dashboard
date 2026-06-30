function getSavings() {
  return AppState.savings;
}

function addSavings(data) {
  const saving = {
    id: generateId(),
    name: data.name,
    targetAmount: parseFloat(data.targetAmount),
    savedAmount: parseFloat(data.savedAmount),
    deadline: data.deadline,
    createdAt: new Date().toISOString(),
  };

  AppState.savings.push(saving);

  saveState("savings");
}

function deleteSavings(id) {
  AppState.savings = AppState.savings.filter((saving) => {
    return saving.id !== id;
  });

  saveState("savings");
}

function updateSavings(id, data) {
  const index = AppState.savings.findIndex((saving) => saving.id === id);
  if (index === -1) {
    return;
  }
  const newSaving = {
    ...AppState.savings[index],
    ...data,
  };

  AppState.savings[index] = newSaving;

  saveState("savings");
}

function getSavingsProgress(savingsId) {
  const saving = AppState.savings.find((saving) => {
    return saving.id === savingsId;
  });
  if (!saving) {
    return null;
  }

  const saved = saving.savedAmount;
  const target = saving.targetAmount;
  const remaining = Math.max(0, target - saved);
  const percentage = Math.min(100, (saved / target) * 100);
  const isCompleted = saved >= target;
  const daysLeft = Math.ceil(
    (new Date(saving.deadline) - new Date()) / (1000 * 60 * 60 * 24),
  );

  return {
    saved,
    target,
    remaining,
    percentage,
    isCompleted,
    daysLeft,
  };
}
