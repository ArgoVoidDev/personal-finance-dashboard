const modalState = {
  editingId: null,
};

function initModal() {
  const overlay = document.getElementById("transaction-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const submitBtn = document.getElementById("modal-submit-btn");

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  closeBtn.addEventListener("click", closeModal);

  cancelBtn.addEventListener("click", closeModal);

  submitBtn.addEventListener("click", handleSubmit);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.getAttribute("aria-hidden")) {
      closeModal();
    }
  });

  document.querySelectorAll(".type-toggle__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".type-toggle__btn").forEach((b) => {
        b.classList.remove("type-toggle__btn--active");
      });

      btn.classList.add("type-toggle__btn--active");

      document.getElementById("modal-type").value = btn.dataset.type;
    });
  });

  ["modal-amount", "modal-description", "modal-category", "modal-date"].forEach(
    (id) => {
      document.getElementById(id).addEventListener("input", () => {
        clearError(id);
      });
    },
  );
}

function openModal(transactionId) {
  const overlay = document.getElementById("transaction-modal");
  const title = document.getElementById("modal-title");
  const submitBtn = document.getElementById("modal-submit-btn");

  if (transactionId) {
    modalState.editingId = transactionId;
    title.textContent = "Edit Transaction";
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Update Transaction`;

    const transaction = getTransactions().find((t) => t.id === transactionId);
    if (transaction) {
      fillForm(transaction);
    }
  } else {
    modalState.editingId = null;
    title.textContent = "Add Transaction";
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Save Transaction`;

    resetForm();
  }

  overlay.setAttribute("aria-hidden", "false");
  overlay.classList.add("modal-overlay--visible");

  document.getElementById("modal-amount").focus();
}

function closeModal() {
  const overlay = document.getElementById("transaction-modal");

  overlay.setAttribute("aria-hidden", "true");
  overlay.classList.remove("modal-overlay--visible");

  modalState.editingId = null;
  resetForm();
}

function handleSubmit() {
  if (!validateForm()) return;

  const data = {
    type: document.getElementById("modal-type").value,
    amount: document.getElementById("modal-amount").value,
    description: document.getElementById("modal-description").value.trim(),
    category: document.getElementById("modal-category").value,
    date: document.getElementById("modal-date").value,
    notes: document.getElementById("modal-notes").value.trim(),
  };

  if (modalState.editingId) {
    updateTransaction(modalState.editingId, data);
    showSuccess("Transaction updated successfully.");
  } else {
    addTransaction(data);
    showSuccess("Transaction added successfully.");
  }

  closeModal();

  renderTransactions();
}

function validateForm() {
  let isValid = true;

  const amount = document.getElementById("modal-amount").value;
  const description = document.getElementById("modal-description").value.trim();
  const category = document.getElementById("modal-category").value;
  const date = document.getElementById("modal-date").value;

  if (!amount || Number(amount) <= 0) {
    showError("modal-amount", "Please enter a valid amount.");
    isValid = false;
  }

  if (!description) {
    showError("modal-description", "Description is required.");
    isValid = false;
  }

  if (!category) {
    showError("modal-category", "Please select a category.");
    isValid = false;
  }

  if (!date) {
    showError("modal-date", "Please select a date.");
    isValid = false;
  }

  return isValid;
}

function fillForm(transaction) {
  document.querySelectorAll(".type-toggle__btn").forEach((btn) => {
    btn.classList.toggle(
      "type-toggle__btn--active",
      btn.dataset.type === transaction.type,
    );
  });
  document.getElementById("modal-type").value = transaction.type;

  document.getElementById("modal-amount").value = transaction.amount;
  document.getElementById("modal-description").value = transaction.description;
  document.getElementById("modal-category").value = transaction.category;
  document.getElementById("modal-date").value = transaction.date;
  document.getElementById("modal-notes").value = transaction.notes || "";
}

function resetForm() {
  document.querySelectorAll(".type-toggle__btn").forEach((btn) => {
    btn.classList.toggle(
      "type-toggle__btn--active",
      btn.dataset.type === "expense",
    );
  });
  document.getElementById("modal-type").value = "expense";

  document.getElementById("modal-amount").value = "";
  document.getElementById("modal-description").value = "";
  document.getElementById("modal-category").value = "";

  document.getElementById("modal-date").value = new Date()
    .toISOString()
    .slice(0, 10);

  document.getElementById("modal-notes").value = "";

  ["modal-amount", "modal-description", "modal-category", "modal-date"].forEach(
    clearError,
  );
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);

  field.classList.add("form-input--error");

  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);

  field.classList.remove("form-input--error");

  if (errorEl) {
    errorEl.textContent = "";
  }
}

const budgetModalState = {
  editingId: null,
};

function initBudgetModal() {
  const overlay = document.getElementById("budget-modal");
  const closeBtn = document.getElementById("budget-modal-close-btn");
  const cancelBtn = document.getElementById("budget-modal-cancel-btn");
  const submitBtn = document.getElementById("budget-modal-submit-btn");

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeBudgetModal();
  });

  closeBtn.addEventListener("click", closeBudgetModal);
  cancelBtn.addEventListener("click", closeBudgetModal);
  submitBtn.addEventListener("click", handleBudgetSubmit);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.getAttribute("aria-hidden") === "false") {
      closeBudgetModal();
    }
  });

  ["budget-modal-category", "budget-modal-limit"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      clearError(id);
    });
  });
}

function openBudgetModal(budgetId) {
  const overlay = document.getElementById("budget-modal");
  const title = document.getElementById("budget-modal-title");
  const submitBtn = document.getElementById("budget-modal-submit-btn");

  if (budgetId) {
    budgetModalState.editingId = budgetId;
    title.textContent = "Edit Budget";
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Update Budget`;

    const budget = getBudgets().find((b) => b.id === budgetId);
    if (budget) {
      document.getElementById("budget-modal-category").value = budget.category;
      document.getElementById("budget-modal-limit").value = budget.limit;
    }
  } else {
    budgetModalState.editingId = null;
    title.textContent = "Add Budget";
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Save Budget`;

    resetBudgetForm();
  }

  overlay.setAttribute("aria-hidden", "false");
  overlay.classList.add("modal-overlay--visible");
  document.getElementById("budget-modal-category").focus();
}

function closeBudgetModal() {
  const overlay = document.getElementById("budget-modal");
  overlay.setAttribute("aria-hidden", "true");
  overlay.classList.remove("modal-overlay--visible");

  budgetModalState.editingId = null;
  resetBudgetForm();
}

function handleBudgetSubmit() {
  if (!validateBudgetForm()) return;

  const data = {
    category: document.getElementById("budget-modal-category").value,

    limit: Number(document.getElementById("budget-modal-limit").value),
  };

  if (budgetModalState.editingId) {
    updateBudget(budgetModalState.editingId, data);
    showSuccess("Budget updated successfully.");
  } else {
    addBudget(data);
    showSuccess("Budget added successfully.");
  }

  closeBudgetModal();
  renderBudget();
}

function validateBudgetForm() {
  let isValid = true;

  const category = document.getElementById("budget-modal-category").value;
  const limit = document.getElementById("budget-modal-limit").value;

  if (!category) {
    showError("budget-modal-category", "Please select a category.");
    isValid = false;
  }

  if (!limit || Number(limit) <= 0) {
    showError("budget-modal-limit", "Please enter a valid amount.");
    isValid = false;
  }

  return isValid;
}

function resetBudgetForm() {
  document.getElementById("budget-modal-category").value = "";
  document.getElementById("budget-modal-limit").value = "";
  ["budget-modal-category", "budget-modal-limit"].forEach(clearError);
}

const savingsModalState = {
  editingId: null,
};

function initSavingsModal() {
  const overlay = document.getElementById("savings-modal");
  const closeBtn = document.getElementById("savings-modal-close-btn");
  const cancelBtn = document.getElementById("savings-modal-cancel-btn");
  const submitBtn = document.getElementById("savings-modal-submit-btn");

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSavingsModal();
  });

  closeBtn.addEventListener("click", closeSavingsModal);
  cancelBtn.addEventListener("click", closeSavingsModal);
  submitBtn.addEventListener("click", handleSavingsSubmit);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.getAttribute("aria-hidden") === "false") {
      closeSavingsModal();
    }
  });

  ["savings-modal-name", "savings-modal-target"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      clearError(id);
    });
  });
}

function openSavingsModal(savingsId) {
  const overlay = document.getElementById("savings-modal");
  const title = document.getElementById("savings-modal-title");
  const submitBtn = document.getElementById("savings-modal-submit-btn");

  if (savingsId) {
    savingsModalState.editingId = savingsId;
    title.textContent = "Edit Savings Goal";
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Update Goal`;

    const saving = getSavings().find((s) => s.id === savingsId);
    if (saving) {
      document.getElementById("savings-modal-name").value = saving.name;
      document.getElementById("savings-modal-target").value =
        saving.targetAmount;
      document.getElementById("savings-modal-saved").value =
        saving.savedAmount || "";
      document.getElementById("savings-modal-deadline").value =
        saving.deadline || "";
    }
  } else {
    savingsModalState.editingId = null;
    title.textContent = "Add Savings Goal";
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Save Goal`;

    resetSavingsForm();
  }

  overlay.setAttribute("aria-hidden", "false");
  overlay.classList.add("modal-overlay--visible");
  document.getElementById("savings-modal-name").focus();
}

function closeSavingsModal() {
  const overlay = document.getElementById("savings-modal");
  overlay.setAttribute("aria-hidden", "true");
  overlay.classList.remove("modal-overlay--visible");

  savingsModalState.editingId = null;
  resetSavingsForm();
}

function handleSavingsSubmit() {
  if (!validateSavingsForm()) return;

  const data = {
    name: document.getElementById("savings-modal-name").value.trim(),
    targetAmount: Number(document.getElementById("savings-modal-target").value),
    savedAmount:
      Number(document.getElementById("savings-modal-saved").value) || 0,
    deadline: document.getElementById("savings-modal-deadline").value || null,
  };

  if (savingsModalState.editingId) {
    updateSavings(savingsModalState.editingId, data);
    showSuccess("Savings goal updated successfully.");
  } else {
    addSavings(data);
    showSuccess("Savings goal added successfully.");
  }

  closeSavingsModal();
  renderSavingsPage();
}

function validateSavingsForm() {
  let isValid = true;

  const name = document.getElementById("savings-modal-name").value.trim();
  const target = document.getElementById("savings-modal-target").value;

  if (!name) {
    showError("savings-modal-name", "Goal name is required.");
    isValid = false;
  }

  if (!target || Number(target) <= 0) {
    showError("savings-modal-target", "Please enter a valid target amount.");
    isValid = false;
  }

  return isValid;
}

function resetSavingsForm() {
  document.getElementById("savings-modal-name").value = "";
  document.getElementById("savings-modal-target").value = "";
  document.getElementById("savings-modal-saved").value = "";
  document.getElementById("savings-modal-deadline").value = "";
  ["savings-modal-name", "savings-modal-target"].forEach(clearError);
}
