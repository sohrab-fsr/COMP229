// -------- Helpers --------
const API = (path) => `${window.API_BASE}${path}`;

async function apiGet(path) {
  const res = await fetch(API(path));
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(API(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

// -------- DOM refs --------
const authorsList = document.getElementById("authors-list");
const authorsStatus = document.getElementById("authors-status");
const authorForm = document.getElementById("author-form");

const booksList = document.getElementById("books-list");
const booksStatus = document.getElementById("books-status");
const bookForm = document.getElementById("book-form");
const bookAuthorSelect = document.getElementById("book-author");

// -------- Renderers --------
function renderAuthors(authors) {
  authorsList.innerHTML = "";
  bookAuthorSelect.innerHTML = '<option value="">-- Select author --</option>';
  authors.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.name} — ${a.bio}`;
    authorsList.appendChild(li);

    const opt = document.createElement("option");
    opt.value = a._id;
    opt.textContent = a.name;
    bookAuthorSelect.appendChild(opt);
  });
}

function renderBooks(books) {
  booksList.innerHTML = "";
  books.forEach(b => {
    const li = document.createElement("li");
    const authorName = b.author?.name ?? "(unknown author)";
    const year = b.year ? ` • ${b.year}` : "";
    li.textContent = `${b.title} — ${authorName}${year}`;
    booksList.appendChild(li);
  });
}

// -------- Loaders --------
async function loadAuthors() {
  try {
    authorsStatus.textContent = "Loading authors...";
    const authors = await apiGet("/author");
    renderAuthors(authors);
    authorsStatus.textContent = "";
  } catch (e) {
    authorsStatus.textContent = e.message;
  }
}

async function loadBooks() {
  try {
    booksStatus.textContent = "Loading books...";
    const books = await apiGet("/book");
    renderBooks(books);
    booksStatus.textContent = "";
  } catch (e) {
    booksStatus.textContent = e.message;
  }
}

// -------- Handlers --------
authorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(authorForm);
  const name = fd.get("name")?.trim();
  const bio = fd.get("bio")?.trim();
  if (!name || !bio) return;

  try {
    authorsStatus.textContent = "Saving...";
    await apiPost("/author", { name, bio });
    authorForm.reset();
    await loadAuthors();
    authorsStatus.textContent = "Author added ✔";
    setTimeout(() => (authorsStatus.textContent = ""), 1200);
  } catch (e) {
    authorsStatus.textContent = e.message;
  }
});

bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(bookForm);
  const title = fd.get("title")?.trim();
  const yearStr = fd.get("year");
  const author = fd.get("author");

  const body = { title, author };
  if (yearStr) body.year = Number(yearStr);

  if (!title || !author) return;

  try {
    booksStatus.textContent = "Saving...";
    await apiPost("/book", body);
    bookForm.reset();
    await loadBooks();
    booksStatus.textContent = "Book added ✔";
    setTimeout(() => (booksStatus.textContent = ""), 1200);
  } catch (e) {
    booksStatus.textContent = e.message;
  }
});

// -------- Init --------
(async function init() {
  await loadAuthors();
  await loadBooks();
})();
