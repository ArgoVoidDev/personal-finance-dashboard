const transactionState = {
  search: "",
  type: "",
  category: "",
  date: "",
  currentPage: 1,
  itemsPerPage: 10,
  sortField: "date",
  sortDirection: "desc",
};

function initTransactions() {
  const searchInput = document.getElementById("transaction-search");
  const typeFilter = document.getElementById("transaction-types-filter");
  const categoryFilter = document.getElementById(
    "transaction-categories-filter",
  );
  const dateFilter = document.getElementById("transaction-date-filter");
  const clearBtn = document.getElementById("clear-filters-btn");
  const exportBtn = document.getElementById("export-csv-btn");
  const addBtn = document.getElementById("add-transaction-btn");
  const tbody = document.getElementById("transactions-list");

  searchInput.addEventListener("input", () => {
    transactionState.search = searchInput.value.trim();
    transactionState.currentPage = 1;
    renderTransactions();
  });

  typeFilter.addEventListener("change", () => {
    transactionState.type = typeFilter.value;
    transactionState.currentPage = 1;
    renderTransactions();
  });

  categoryFilter.addEventListener("change", () => {
    transactionState.category = categoryFilter.value;
    transactionState.currentPage = 1;
    renderTransactions();
  });

  dateFilter.addEventListener("change", () => {
    transactionState.date = dateFilter.value;
    transactionState.currentPage = 1;
    renderTransactions();
  });

  clearBtn.addEventListener("click", () => {
    transactionState.search = "";
    transactionState.type = "";
    transactionState.category = "";
    transactionState.date = "";
    transactionState.currentPage = 1;

    searchInput.value = "";
    typeFilter.value = "";
    categoryFilter.value = "";
    dateFilter.value = "";

    renderTransactions();
  });

  exportBtn.addEventListener("click", exportToCSV);

  addBtn.addEventListener("click", () => {
    openModal();
  });

  document.querySelectorAll(".sortable").forEach((header) => {
    header.addEventListener("click", () => {
      const field = header.dataset.sort;

      if (transactionState.sortField === field) {
        transactionState.sortDirection =
          transactionState.sortDirection === "asc" ? "desc" : "asc";
      } else {
        transactionState.sortField = field;
        transactionState.sortDirection = "desc";
      }

      renderTransactions();
    });
  });

  tbody.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-action='edit']");
    const deleteBtn = e.target.closest("[data-action='delete']");

    if (editBtn) {
      const id = editBtn.dataset.id;
      openModal(id);
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      if (confirm("Are you sure you want to delete this transaction?")) {
        deleteTransaction(id);
        const filtered = getFilteredTransactions();
        const totalPages = Math.ceil(
          filtered.length / transactionState.itemsPerPage,
        );
        if (transactionState.currentPage > totalPages && totalPages > 0) {
          transactionState.currentPage = totalPages;
        }
        renderTransactions();
      }
    }
  });

  renderTransactions();
}

function getFilteredTransactions() {
  let result = getTransactions();

  if (transactionState.search) {
    const keyword = transactionState.search.toLowerCase();
    result = result.filter((t) =>
      t.description.toLowerCase().includes(keyword),
    );
  }

  if (transactionState.type) {
    result = result.filter((t) => t.type === transactionState.type);
  }

  if (transactionState.category) {
    result = result.filter((t) => t.category === transactionState.category);
  }

  if (transactionState.date) {
    const days = Number(transactionState.date);
    const now = new Date();
    result = result.filter((t) => {
      const diffDays = (now - new Date(t.date)) / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    });
  }

  return result;
}

function getSortedTransactions(transactions) {
  return transactions.slice().sort((a, b) => {
    const valA =
      transactionState.sortField === "date" ? new Date(a.date) : a.amount;
    const valB =
      transactionState.sortField === "date" ? new Date(b.date) : b.amount;

    return transactionState.sortDirection === "asc"
      ? valA > valB
        ? 1
        : -1
      : valA < valB
        ? 1
        : -1;
  });
}

function renderTransactions() {
  const filtered = getFilteredTransactions();
  const sorted = getSortedTransactions(filtered);

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / transactionState.itemsPerPage);
  const start =
    (transactionState.currentPage - 1) * transactionState.itemsPerPage;
  const pageItems = sorted.slice(start, start + transactionState.itemsPerPage);

  const countEl = document.getElementById("transactions-count");
  if (countEl) {
    countEl.textContent = `${totalItems} transaction${totalItems !== 1 ? "s" : ""}`;
  }

  updateSortUI();

  const container = document.getElementById("transactions-list");
  container.innerHTML =
    pageItems.length === 0
      ? renderEmptyState()
      : pageItems.map(renderTransactionRow).join("");

  renderPagination(totalItems, totalPages);
}

function renderTransactionRow(t) {
  const isIncome = t.type === "income";
  return `
    <tr>
      <td class="col-date">${formatDate(t.date)}</td>
      <td class="col-description">
        ${t.description}
        ${t.notes ? `<small>${t.notes}</small>` : ""}
      </td>
      <td><span class="badge badge--${t.category}">${capitalize(t.category)}</span></td>
      <td><span class="badge badge--${t.type}">${capitalize(t.type)}</span></td>
      <td class="col-amount ${isIncome ? "col-amount--income" : "col-amount--expense"}">
        ${isIncome ? "+" : "-"}${formatCurrency(t.amount)}
      </td>
      <td class="col-actions">
        <div class="transaction-actions">
          <button class="btn btn--icon" data-action="edit" data-id="${t.id}" title="Edit">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn--icon" data-action="delete" data-id="${t.id}" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderEmptyState() {
  const hasFilters =
    transactionState.search ||
    transactionState.type ||
    transactionState.category ||
    transactionState.date;

  return `
    <tr>
      <td colspan="6">
        <div class="transactions__empty">
          <div class="transactions__empty-icon">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <h3>No transactions found</h3>
          <p>${
            hasFilters
              ? "No transactions match your filters."
              : "No transactions yet. Add your first one!"
          }</p>
        </div>
      </td>
    </tr>
  `;
}

function renderPagination(totalItems, totalPages) {
  const paginationEl = document.getElementById("transactions-pagination");
  const infoEl = document.getElementById("pagination-info");

  if (infoEl) {
    if (totalItems === 0) {
      infoEl.textContent = "";
    } else {
      const start =
        (transactionState.currentPage - 1) * transactionState.itemsPerPage + 1;
      const end = Math.min(
        transactionState.currentPage * transactionState.itemsPerPage,
        totalItems,
      );
      infoEl.textContent = `Showing ${start}–${end} of ${totalItems}`;
    }
  }

  if (!paginationEl) return;

  paginationEl.innerHTML = "";

  if (totalPages <= 1) return;

  const current = transactionState.currentPage;
  const items = [];

  items.push(`
    <button class="pagination__btn" data-page="${current - 1}" ${current === 1 ? "disabled" : ""}>
      <i class="fa-solid fa-chevron-left"></i>
    </button>
  `);

  for (let i = 1; i <= totalPages; i++) {
    const isEdge = i === 1 || i === totalPages;
    const isNear = i >= current - 1 && i <= current + 1;
    const isDots = i === current - 2 || i === current + 2;

    if (isEdge || isNear) {
      items.push(`
        <button class="pagination__btn ${i === current ? "pagination__btn--active" : ""}" data-page="${i}">
          ${i}
        </button>
      `);
    } else if (isDots) {
      items.push(`<span class="pagination__dots">…</span>`);
    }
  }

  items.push(`
    <button class="pagination__btn" data-page="${current + 1}" ${current === totalPages ? "disabled" : ""}>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `);

  paginationEl.innerHTML = items.join("");

  paginationEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn || btn.disabled) return;
    transactionState.currentPage = Number(btn.dataset.page);
    renderTransactions();
  });
}

function updateSortUI() {
  document.querySelectorAll(".sortable").forEach((header) => {
    header.classList.remove("sort--asc", "sort--desc");
    const icon = header.querySelector(".sort-icon");
    if (!icon) return;

    if (header.dataset.sort === transactionState.sortField) {
      header.classList.add(`sort--${transactionState.sortDirection}`);
      icon.className =
        transactionState.sortDirection === "asc"
          ? "fa-solid fa-sort-up sort-icon"
          : "fa-solid fa-sort-down sort-icon";
    } else {
      icon.className = "fa-solid fa-sort sort-icon";
    }
  });
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function exportToCSV() {
  const filtered = getFilteredTransactions();

  if (filtered.length === 0) {
    alert("No transactions to export.");
    return;
  }

  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = filtered.map((t) => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount,
  ]);

  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `finio-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}
