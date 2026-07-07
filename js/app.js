const pageTitles = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  budget: "Budget",
  savings: "Savings",
  settings: "Settings",
};
const pages = document.querySelectorAll(".page");
const btns = document.querySelectorAll(".sidebar__nav-btn");
const pageTitle = document.querySelector("#page-title");

initState();
initModal();
initBudgetModal();
initSavingsModal();

const initializedPages = {};

function navigateTo(pageId) {
  pages.forEach((page) => page.classList.remove("page--active"));

  const activePage = document.querySelector("#" + pageId);
  activePage.classList.add("page--active");

  btns.forEach((btn) => btn.classList.remove("sidebar__nav-btn--active"));

  const activeBtn = document.querySelector(`[data-page="${pageId}"]`);

  activeBtn.classList.add("sidebar__nav-btn--active");

  pageTitle.textContent = pageTitles[pageId];

  if (!initializedPages[pageId]) {
    initializedPages[pageId] = true;

    if (pageId === "dashboard") initDashboard();
    if (pageId === "transactions") initTransactions();
    if (pageId === "budget") initBudget();
    if (pageId === "savings") initSavings();
    if (pageId === "settings") initSettings();
  }
}
btns.forEach((button) => {
  button.addEventListener("click", (event) => {
    const pageId = button.dataset.page;

    navigateTo(pageId);
  });
});

navigateTo("dashboard");
