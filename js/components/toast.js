const TOAST_DURATION = 3500;

function showToast(message, type) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");

  toast.className = `toast toast--${type}`;

  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info",
  };

  toast.innerHTML = `
    <i class="fa-solid ${icons[type]} toast__icon"></i>
    <span class="toast__message">${message}</span>
    <button class="toast__close btn btn--icon" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("toast--visible");
  });

  toast.querySelector(".toast__close").addEventListener("click", () => {
    dismissToast(toast);
  });

  const timer = setTimeout(() => {
    dismissToast(toast);
  }, TOAST_DURATION);

  toast.addEventListener("mouseenter", () => clearTimeout(timer));

  toast.addEventListener("mouseleave", () => {
    setTimeout(() => dismissToast(toast), 1500);
  });
}

function dismissToast(toast) {
  toast.classList.remove("toast--visible");

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

function showSuccess(message) {
  showToast(message, "success");
}

function showError(message) {
  showToast(message, "error");
}

function showWarning(message) {
  showToast(message, "warning");
}

function showInfo(message) {
  showToast(message, "info");
}
