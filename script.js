"use strict";

const STORAGE_KEY = "myRupiahTransactions";

let transactions = loadTransactions();

const transactionForm = document.getElementById("transactionForm");
const transactionType = document.getElementById("transactionType");
const transactionCategory = document.getElementById("transactionCategory");
const transactionDate = document.getElementById("transactionDate");
const transactionAmount = document.getElementById("transactionAmount");
const transactionNote = document.getElementById("transactionNote");
const toast = document.getElementById("toast");

// Format tanggal lokal sebagai YYYY-MM-DD tanpa masalah zona waktu.
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Memuat transaksi dari localStorage.
function loadTransactions() {
  try {
    const savedTransactions = localStorage.getItem(STORAGE_KEY);

    if (!savedTransactions) {
      return [];
    }

    const parsedTransactions = JSON.parse(savedTransactions);

    if (!Array.isArray(parsedTransactions)) {
      return [];
    }

    return parsedTransactions.filter((transaction) => {
      return (
        transaction &&
        typeof transaction.date === "string" &&
        ["income", "expense"].includes(transaction.type) &&
        Number.isFinite(Number(transaction.amount)) &&
        Number(transaction.amount) > 0
      );
    });
  } catch (error) {
    console.error("Gagal memuat transaksi:", error);
    return [];
  }
}

// Menyimpan transaksi.
function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan transaksi:", error);
    showToast("Transaksi gagal disimpan. Periksa penyimpanan browser.");
    return false;
  }
}

// Menampilkan notifikasi.
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Navigasi halaman.
function openPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );
  });

  const targetPage = document.getElementById(`${pageName}Page`);

  if (targetPage) {
    targetPage.classList.add("active");
  }
}

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => {
    openPage(button.dataset.page);
  });
});

// Menampilkan tanggal pada navbar.
function renderDate() {
  const today = new Date();

  document.getElementById("todayDate").textContent =
    today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
}

// Format mata uang Rupiah.
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

// Mengatur kategori berdasarkan jenis transaksi.
function updateCategoryOptions() {
  const categories =
    transactionType.value === "income"
      ? [
          "Pendapatan Ojol",
          "Pendapatan Lainnya"
        ]
      : [
          "Bensin",
          "Makan/Minum",
          "Perawatan Kendaraan",
          "Parkir",
          "Pengeluaran Lainnya"
        ];

  transactionCategory.replaceChildren();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    transactionCategory.appendChild(option);
  });
}

transactionType.addEventListener("change", updateCategoryOptions);

// Mengurutkan transaksi dari tanggal terbaru.
function getSortedTransactions() {
  return [...transactions].sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }

    return Number(b.id) - Number(a.id);
  });
}

// Menghitung dan menampilkan ringkasan.
function renderSummary() {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  const totalBalance = totalIncome - totalExpense;

  // Hanya pendapatan ojol yang tanggalnya sama dengan hari ini.
  const today = getLocalDateString();

  const todayOjolIncome = transactions
    .filter((transaction) => {
      return (
        transaction.type === "income" &&
        transaction.category === "Pendapatan Ojol" &&
        transaction.date === today
      );
    })
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  document.getElementById("totalIncome").textContent =
    formatRupiah(totalIncome);

  document.getElementById("totalExpense").textContent =
    formatRupiah(totalExpense);

  document.getElementById("totalBalance").textContent =
    formatRupiah(totalBalance);

  document.getElementById("todayOjolIncome").textContent =
    formatRupiah(todayOjolIncome);
}

// Membuat tampilan satu transaksi.
function createTransactionElement(transaction) {
  const isIncome = transaction.type === "income";

  const item = document.createElement("article");
  item.className = "transaction-item";

  const main = document.createElement("div");
  main.className = "transaction-main";

  const symbol = document.createElement("div");
  symbol.className = `transaction-symbol ${
    isIncome ? "income" : "expense"
  }`;

  symbol.textContent =
    transaction.category === "Pendapatan Ojol"
      ? "🏍"
      : isIncome
        ? "↗"
        : "↘";

  const details = document.createElement("div");
  details.className = "transaction-details";

  const title = document.createElement("h3");
  title.textContent = transaction.category;

  const description = document.createElement("p");

  const formattedDate = new Date(
    `${transaction.date}T12:00:00`
  ).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  description.textContent = transaction.note
    ? `${formattedDate} · ${transaction.note}`
    : formattedDate;

  details.append(title, description);
  main.append(symbol, details);

  const amount = document.createElement("div");
  amount.className = `transaction-amount ${
    isIncome ? "income" : "expense"
  }`;

  amount.textContent =
    `${isIncome ? "+" : "−"}${formatRupiah(
      Number(transaction.amount)
    )}`;

  item.append(main, amount);

  return item;
}

// Menampilkan daftar transaksi.
function renderTransactionList(containerId, emptyId, list) {
  const container = document.getElementById(containerId);
  const emptyMessage = document.getElementById(emptyId);

  container.replaceChildren();

  emptyMessage.hidden = list.length > 0;

  list.forEach((transaction) => {
    container.appendChild(createTransactionElement(transaction));
  });
}

// Memperbarui seluruh tampilan aplikasi.
function renderApp() {
  renderSummary();

  const sortedTransactions = getSortedTransactions();

  renderTransactionList(
    "recentTransactions",
    "recentEmpty",
    sortedTransactions.slice(0, 5)
  );

  renderTransactionList(
    "allTransactions",
    "allEmpty",
    sortedTransactions
  );
}

// Menyimpan transaksi baru.
transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const date = transactionDate.value;
  const type = transactionType.value;
  const category = transactionCategory.value;
  const amount = Number(transactionAmount.value);
  const note = transactionNote.value.trim();

  if (!date || !category || !Number.isFinite(amount) || amount <= 0) {
    showToast("Periksa kembali data transaksi.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    date,
    type,
    category,
    amount,
    note
  };

  transactions.push(newTransaction);

  if (!saveTransactions()) {
    transactions.pop();
    return;
  }

  renderApp();

  transactionForm.reset();
  transactionDate.value = getLocalDateString();

  updateCategoryOptions();

  showToast("Transaksi berhasil disimpan!");
});

// Menghapus semua transaksi.
document
  .getElementById("resetTransactions")
  .addEventListener("click", () => {
    if (transactions.length === 0) {
      showToast("Belum ada transaksi untuk dihapus.");
      return;
    }

    const confirmed = confirm(
      "Yakin ingin menghapus semua transaksi? Tindakan ini tidak dapat dibatalkan."
    );

    if (!confirmed) {
      return;
    }

    const previousTransactions = transactions;
    transactions = [];

    if (!saveTransactions()) {
      transactions = previousTransactions;
      return;
    }

    renderApp();
    showToast("Semua transaksi berhasil dihapus.");
  });

// Inisialisasi aplikasi.
function initializeApp() {
  renderDate();

  transactionDate.value = getLocalDateString();

  updateCategoryOptions();
  renderApp();
}

initializeApp();