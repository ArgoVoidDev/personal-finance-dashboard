function initSavings() {
  const addBtn = document.getElementById("add-savings-btn");
  const savingsList = document.getElementById("savings-list");

  addBtn.addEventListener("click", () => openSavingsModal());

  savingsList.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-action='edit-savings']");
    const deleteBtn = e.target.closest("[data-action='delete-savings']");

    if (editBtn) {
      openSavingsModal(editBtn.dataset.id);
    }

    if (deleteBtn) {
      if (confirm("Delete this savings goal?")) {
        deleteSavings(deleteBtn.dataset.id);
        renderSavingsPage();
        showSuccess("Savings goal deleted.");
      }
    }
  });

  renderSavingsPage();
}

function renderSavingsPage() {
  const savings = getSavings();
  const container = document.getElementById("savings-list");
  container.innerHTML = "";

  if (savings.length === 0) {
    container.innerHTML = renderSavingsEmptyState();
    return;
  }

  savings.forEach((saving) => {
    const progress = getSavingsProgress(saving.id);
    if (!progress) return;

    const percentage = Math.round(progress.percentage);

    const isOverdue = !progress.isCompleted && progress.daysLeft < 0;

    let statusBadge = "";
    if (progress.isCompleted) {
      statusBadge = `<span class="badge badge--income">Completed</span>`;
    } else if (isOverdue) {
      statusBadge = `<span class="badge badge--expense">Overdue</span>`;
    } else {
      statusBadge = `<span class="badge badge--other">In Progress</span>`;
    }

    let daysText = "";
    if (progress.isCompleted) {
      daysText = "Goal reached!";
    } else if (isOverdue) {
      daysText = `${Math.abs(progress.daysLeft)} days overdue`;
    } else {
      daysText = `${progress.daysLeft} days left`;
    }

    container.innerHTML += `
      <div class="savings-card ${progress.isCompleted ? "savings-card--completed" : ""}">
        <div class="savings-card__header">
          <div class="savings-card__info">
            <h3 class="savings-card__name">${saving.name}</h3>
            ${statusBadge}
          </div>
          <div class="savings-card__actions">
            <button class="btn btn--icon" data-action="edit-savings" data-id="${saving.id}" title="Edit">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn--icon" data-action="delete-savings" data-id="${saving.id}" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="savings-card__amounts">
          <span class="savings-card__saved">${formatCurrency(progress.saved)}</span>
          <span class="savings-card__target">of ${formatCurrency(progress.target)}</span>
        </div>

        <div class="savings-card__progress">
          <div
            class="savings-card__progress-fill"
            style="width: ${percentage}%;"
          ></div>
        </div>

        <div class="savings-card__footer">
          <span class="savings-card__percentage">${percentage}%</span>
          <span class="savings-card__days">${daysText}</span>
        </div>

        ${
          !progress.isCompleted
            ? `
          <div class="savings-card__deposit">
            <input
              type="number"
              class="form-input savings-card__deposit-input"
              placeholder="Add amount..."
              min="0"
              step="0.01"
              data-savings-id="${saving.id}"
            />
            <button class="btn btn--secondary savings-card__deposit-btn" data-savings-id="${saving.id}">
              <i class="fa-solid fa-plus"></i>
              Deposit
            </button>
          </div>
        `
            : ""
        }
      </div>
    `;
  });

  container.innerHTML += `
    <div class="savings-card savings-card--add" id="savings-add-card">
      <div class="savings-card--add-inner">
        <div class="savings-card--add-icon">
          <i class="fa-solid fa-plus"></i>
        </div>
        <div class="savings-card--add-label">New Goal</div>
      </div>
    </div>
  `;

  document.getElementById("savings-add-card").addEventListener("click", () => {
    openSavingsModal();
  });

  container.querySelectorAll(".savings-card__deposit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.savingsId;

      const input = container.querySelector(
        `.savings-card__deposit-input[data-savings-id="${id}"]`,
      );

      const amount = parseFloat(input.value);

      if (!amount || amount <= 0) {
        showError("Please enter a valid amount.");
        return;
      }

      const saving = getSavings().find((s) => s.id === id);
      if (!saving) return;

      updateSavings(id, {
        savedAmount: saving.savedAmount + amount,
      });

      showSuccess(`$${amount} deposited to "${saving.name}".`);
      input.value = "";
      renderSavingsPage();
    });
  });
}

function renderSavingsEmptyState() {
  return `
    <div class="savings__empty">
      <div class="transactions__empty-icon">
        <i class="fa-solid fa-piggy-bank"></i>
      </div>
      <h3>No savings goals yet</h3>
      <p>Set a goal and start saving towards it.</p>
    </div>
  `;
}
