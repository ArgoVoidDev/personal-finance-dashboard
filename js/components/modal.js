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
