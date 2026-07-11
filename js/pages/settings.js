function initSettings() {
  const saveBtn = document.getElementById("settings-save-btn");
  const exportBtn = document.getElementById("settings-export-btn");
  const importInput = document.getElementById("settings-import-input");
  const clearBtn = document.getElementById("settings-clear-btn");

  loadSettingsToForm();

  document.querySelectorAll(".settings__theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".settings__theme-btn").forEach((b) => {
        b.classList.remove("settings__theme-btn--active");
      });
      btn.classList.add("settings__theme-btn--active");

      applyTheme(btn.dataset.theme);
    });
  });

  saveBtn.addEventListener("click", () => {
    const name = document.getElementById("settings-name").value.trim();
    const email = document.getElementById("settings-email").value.trim();
    const currency = document.getElementById("settings-currency").value;
    const activeThemeBtn = document.querySelector(
      ".settings__theme-btn--active",
    );
    const theme = activeThemeBtn ? activeThemeBtn.dataset.theme : "dark";

    if (!name) {
      showWarning("Please enter your name.");
      return;
    }

    AppState.settings = { name, email, currency, theme };
    saveState("settings");

    updateSidebarUser(name, email);

    showSuccess("Settings saved successfully.");
  });

  exportBtn.addEventListener("click", () => {
    const data = {
      transactions: getTransactions(),
      budgets: getBudgets(),
      savings: getSavings(),
      settings: AppState.settings,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `finio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showSuccess("Data exported successfully.");
  });

  importInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (!data.transactions || !data.budgets || !data.savings) {
          showError("Invalid backup file.");
          return;
        }

        if (
          !confirm("This will replace all your current data. Are you sure?")
        ) {
          return;
        }

        saveData("transactions", data.transactions);
        saveData("budgets", data.budgets);
        saveData("savings", data.savings);

        if (data.settings) {
          AppState.settings = data.settings;
          saveState("settings");
          loadSettingsToForm();
        }

        showSuccess("Data imported successfully. Refreshing...");

        setTimeout(() => location.reload(), 1500);
      } catch {
        showError(
          "Could not read the file. Make sure it's a valid JSON backup.",
        );
      }
    };

    reader.readAsText(file);

    importInput.value = "";
  });

  clearBtn.addEventListener("click", () => {
    if (
      !confirm(
        "This will permanently delete ALL your data. This cannot be undone. Continue?",
      )
    ) {
      return;
    }

    if (!confirm("Are you absolutely sure?")) {
      return;
    }

    AppState.transactions = [];
    AppState.budgets = [];
    AppState.savings = [];
    saveState("transactions");
    saveState("budgets");
    saveState("savings");

    showSuccess("All data cleared. Refreshing...");
    setTimeout(() => location.reload(), 1500);
  });
}

function loadSettingsToForm() {
  const settings = AppState.settings;
  if (!settings) return;

  if (settings.name) {
    document.getElementById("settings-name").value = settings.name;
  }

  if (settings.email) {
    document.getElementById("settings-email").value = settings.email;
  }

  if (settings.currency) {
    document.getElementById("settings-currency").value = settings.currency;
  }

  if (settings.theme) {
    document.querySelectorAll(".settings__theme-btn").forEach((btn) => {
      btn.classList.toggle(
        "settings__theme-btn--active",
        btn.dataset.theme === settings.theme,
      );
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function updateSidebarUser(name, email) {
  const nameEl = document.querySelector(".sidebar__user-name");
  const emailEl = document.querySelector(".sidebar__user-email");
  const avatarEl = document.querySelector(".sidebar__user-avatar");

  if (nameEl) nameEl.textContent = name;
  if (emailEl) emailEl.textContent = email;

  if (avatarEl && name) {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    avatarEl.textContent = initials;
  }
}
