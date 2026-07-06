const budgetState = {
  currentDate: new Date(),
};

function initBudget() {
  const addBtn = document.getElementById("add-budget-btn");
  const prevBtn = document.getElementById("budget-prev-month");
  const nextBtn = document.getElementById("budget-next-month");
  const budgetList = document.getElementById("budget-list");

  addBtn.addEventListener("click", () => openBudgetModal());

  prevBtn.addEventListener("click", () => {
    budgetState.currentDate.setMonth(budgetState.currentDate.getMonth() - 1);
    renderBudget();
  });

  nextBtn.addEventListener("click", () => {
    budgetState.currentDate.setMonth(budgetState.currentDate.getMonth() + 1);
    renderBudget();
  });

  budgetList.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-action='edit-budget']");
    const deleteBtn = e.target.closest("[data-action='delete-budget']");

    if (editBtn) {
      openBudgetModal(editBtn.dataset.id);
    }

    if (deleteBtn) {
      if (confirm("Delete this budget?")) {
        deleteBudget(deleteBtn.dataset.id);
        renderBudget();
        showSuccess("Budget deleted.");
      }
    }
  });

  renderBudget();
}

function renderBudget() {
  updateBudgetMonthLabel();
  updateBudgetSummaryCards();
  renderBudgetCards();
}

function updateBudgetMonthLabel() {
  const label = document.getElementById("budget-month-label");
  label.textContent = budgetState.currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function updateBudgetSummaryCards() {
  const budgets = getBudgets();

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);

  const totalSpent = budgets.reduce((sum, b) => {
    const progress = getBudgetProgress(b.id);
    return sum + (progress ? progress.spent : 0);
  }, 0);

  const remaining = totalBudget - totalSpent;

  document.getElementById("budget-stat-total").textContent =
    formatCurrency(totalBudget);
  document.getElementById("budget-stat-spent").textContent =
    formatCurrency(totalSpent);

  const remainingEl = document.getElementById("budget-stat-remaining");
  remainingEl.textContent = formatCurrency(Math.abs(remaining));
  remainingEl.style.color = remaining < 0 ? "var(--red)" : "";
}

function renderBudgetCards() {
  const budgets = getBudgets();
  const container = document.getElementById("budget-list");
  container.innerHTML = "";

  if (budgets.length === 0) {
    container.innerHTML = renderBudgetEmptyState();
    return;
  }

  budgets.forEach((budget) => {
    const progress = getBudgetProgress(budget.id);
    if (!progress) return;

    const percentage = Math.round(progress.percentage);

    let progressColor = "var(--green)";
    if (percentage >= 85) progressColor = "var(--red)";
    else if (percentage >= 60) progressColor = "var(--yellow)";

    container.innerHTML += `
      <div class="budget-card ${progress.isOver ? "budget-card--over" : ""}">
        <div class="budget-card__header">
          <div class="budget-card__category">
            <span class="badge badge--${budget.category}">${capitalize(budget.category)}</span>
          </div>
          <div class="budget-card__actions">
            <button class="btn btn--icon" data-action="edit-budget" data-id="${budget.id}" title="Edit">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn--icon" data-action="delete-budget" data-id="${budget.id}" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="budget-card__amounts">
          <span class="budget-card__spent">${formatCurrency(progress.spent)}</span>
          <span class="budget-card__limit">of ${formatCurrency(progress.limit)}</span>
        </div>

        <div class="budget-card__progress">
          <div
            class="budget-card__progress-fill"
            style="width: ${percentage}%; background-color: ${progressColor};"
          ></div>
        </div>

        <div class="budget-card__footer">
          <span class="budget-card__percentage">${percentage}%</span>
          ${
            progress.isOver
              ? `<span class="budget-card__status budget-card__status--over">Over budget</span>`
              : `<span class="budget-card__status">${formatCurrency(progress.remaining)} left</span>`
          }
        </div>
      </div>
    `;
  });

  container.innerHTML += `
    <div class="budget-card budget-card--add" id="budget-add-card">
      <div class="budget-card--add-inner">
        <div class="budget-card--add-icon">
          <i class="fa-solid fa-plus"></i>
        </div>
        <div class="budget-card--add-label">Add Budget</div>
      </div>
    </div>
  `;

  document.getElementById("budget-add-card").addEventListener("click", () => {
    openBudgetModal();
  });
}

function renderBudgetEmptyState() {
  return `
    <div class="budget__empty">
      <div class="transactions__empty-icon">
        <i class="fa-solid fa-chart-pie"></i>
      </div>
      <h3>No budgets yet</h3>
      <p>Set monthly budgets to track your spending.</p>
    </div>
  `;
}

function openBudgetModal(budgetId) {
  // fix that later, for now just log the budgetId
  console.log("openBudgetModal", budgetId);
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
