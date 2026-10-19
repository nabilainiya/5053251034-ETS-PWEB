"use strict";

/* STORAGE */
const STORAGE_KEY = "myRupiahTransactions";

let transactions = loadTransactions();

/* ELEMENTS */
const navigationButtons = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

const transactionForm = document.getElementById("transactionForm");
const transactionDate = document.getElementById("transactionDate");
const transactionType = document.getElementById("transactionType");
const transactionCategory = document.getElementById("transactionCategory");
const transactionAmount = document.getElementById("transactionAmount");
const transactionNote = document.getElementById("transactionNote");

const totalIncomeElement = document.getElementById("totalIncome");
const totalExpenseElement = document.getElementById("totalExpense");
const totalBalanceElement = document.getElementById("totalBalance");

const recentTransactionsElement =
  document.getElementById("recentTransactions");

const allTransactionsElement =
  document.getElementById("allTransactions");

const todayDateElement = document.getElementById("todayDate");
const toastElement = document.getElementById("toast");

let toastTimeout;

/* DATE AND CURRENCY FORMATTING */
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

/* LOCAL STORAGE */
function loadTransactions() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) return [];

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) return [];

    return parsedData.filter((item) => {
      return (
        item &&
        typeof item.id === "string" &&
        (item.type === "pemasukan" ||
          item.type === "pengeluaran") &&
        typeof item.amount === "number" &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        typeof item.date === "string" &&
        typeof item.category === "string"
      );
    });
  } catch (error) {
    console.error("Gagal memuat transaksi:", error);
    return [];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    );

    return true;
  } catch (error) {
    console.error("Gagal menyimpan transaksi:", error);
    showToast("Transaksi gagal disimpan. Periksa penyimpanan browser.");
    return false;
  }
}

/* NOTIFICATION */
function showToast(message) {
  toastElement.textContent = message;
  toastElement.hidden = false;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toastElement.hidden = true;
  }, 2800);
}

/* NAVIGATION */
function openPage(pageName) {
  const targetPage = document.getElementById(`page-${pageName}`);

  if (!targetPage) return;

  pages.forEach((page) => {
    page.classList.toggle("active", page === targetPage);
  });

  navigationButtons.forEach((button) => {
    const isActive = button.dataset.page === pageName;

    button.classList.toggle("active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });
}

navigationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openPage(button.dataset.page);
  });
});

/* DASHBOARD SHORTCUTS */
const addTransactionButton =
  document.getElementById("goToAddTransaction");

addTransactionButton.addEventListener("click", () => {
  openPage("transaksi");
  transactionDate.focus();
});

document.querySelectorAll("[data-open-page]").forEach((button) => {
  button.addEventListener("click", () => {
    openPage(button.dataset.openPage);
  });
});

/* FINANCIAL SUMMARY */
function renderSummary() {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "pemasukan")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "pengeluaran")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  totalIncomeElement.textContent = formatRupiah(totalIncome);
  totalExpenseElement.textContent = formatRupiah(totalExpense);
  totalBalanceElement.textContent = formatRupiah(balance);
}

/* TRANSACTION DISPLAY */
function createTransactionElement(transaction) {
  const item = document.createElement("article");
  item.className = "transaction-item";

  const main = document.createElement("div");
  main.className = "transaction-main";

  const symbol = document.createElement("span");
  const isIncome = transaction.type === "pemasukan";

  symbol.className = isIncome
    ? "transaction-symbol"
    : "transaction-symbol expense";

  symbol.textContent = isIncome ? "+" : "−";
  symbol.setAttribute("aria-hidden", "true");

  const details = document.createElement("div");
  details.className = "transaction-details";

  const category = document.createElement("strong");
  category.textContent = transaction.category;

  const description = document.createElement("p");

  const typeLabel = isIncome ? "Pemasukan" : "Pengeluaran";
  const note = transaction.note ? ` · ${transaction.note}` : "";

  description.textContent =
    `${formatDate(transaction.date)} · ${typeLabel}${note}`;

  details.append(category, description);
  main.append(symbol, details);

  const amount = document.createElement("span");

  amount.className = isIncome
    ? "transaction-amount amount-income"
    : "transaction-amount amount-expense";

  const sign = isIncome ? "+" : "−";
  amount.textContent = `${sign}${formatRupiah(transaction.amount)}`;

  item.append(main, amount);

  return item;
}

function renderTransactionList(container, list) {
  container.replaceChildren();

  if (list.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "Belum ada transaksi.";

    container.appendChild(emptyMessage);
    return;
  }

  list.forEach((transaction) => {
    container.appendChild(createTransactionElement(transaction));
  });
}

/* SORT TRANSACTIONS */
function getSortedTransactions() {
  return [...transactions].sort((a, b) => {
    const dateComparison = b.date.localeCompare(a.date);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return b.id.localeCompare(a.id);
  });
}

/* UPDATE THE INTERFACE */
function renderApp() {
  renderSummary();

  const sortedTransactions = getSortedTransactions();

  renderTransactionList(
    recentTransactionsElement,
    sortedTransactions.slice(0, 5)
  );

  renderTransactionList(
    allTransactionsElement,
    sortedTransactions
  );
}

/* ADD A TRANSACTION */
transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(transactionAmount.value);
  const date = transactionDate.value;
  const type = transactionType.value;
  const category = transactionCategory.value;
  const note = transactionNote.value.trim();

  if (!date) {
    showToast("Silakan pilih tanggal transaksi.");
    transactionDate.focus();
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showToast("Jumlah transaksi harus lebih dari nol.");
    transactionAmount.focus();
    return;
  }

  if (!["pemasukan", "pengeluaran"].includes(type)) {
    showToast("Silakan pilih jenis transaksi yang valid.");
    transactionType.focus();
    return;
  }

  if (!category) {
    showToast("Silakan pilih kategori transaksi.");
    transactionCategory.focus();
    return;
  }

  const transaction = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date,
    type,
    category,
    amount,
    note
  };

  transactions.push(transaction);

  if (!saveTransactions()) {
    transactions.pop();
    return;
  }

  renderApp();

  transactionForm.reset();
  transactionDate.value = getLocalDateString();

  showToast("Transaksi berhasil disimpan.");
  openPage("transaksi");
});

/* RESET FORM */
transactionForm.addEventListener("reset", () => {
  setTimeout(() => {
    transactionDate.value = getLocalDateString();
    transactionType.value = "pemasukan";
  }, 0);
});

/* INITIALIZE APPLICATION */
function initializeApp() {
  const today = new Date();

  todayDateElement.textContent = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  transactionDate.value = getLocalDateString();

  toastElement.hidden = true;

  renderApp();
  openPage("ringkasan");
}

initializeApp();
