"use strict";

const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const STORAGE_KEY = "quicknotes-notes";

function loadNotes() {
  try {
    const storedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(storedNotes)) return [];

    return storedNotes.filter((note) =>
      note && typeof note.id === "string" &&
      typeof note.text === "string" &&
      typeof note.category === "string" &&
      typeof note.createdAt === "string"
    );
  } catch {
    return [];
  }
}

let notes = loadNotes();

function createNoteElement(note) {
  const card = document.createElement("li");
  card.className = `note-card category-${note.category}`;
  card.dataset.id = note.id;

  const text = document.createElement("p");
  text.className = "note-text";
  text.textContent = note.text;

  const meta = document.createElement("div");
  meta.className = "note-meta";

  const category = document.createElement("span");
  category.className = "category-label";
  category.textContent = note.category;

  const createdAt = document.createElement("time");
  createdAt.dateTime = note.createdAt;
  createdAt.textContent = new Date(note.createdAt).toLocaleString();

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete note: ${note.text}`);

  meta.append(category, createdAt, deleteButton);
  card.append(text, meta);
  return card;
}

function render() {
  notesList.replaceChildren();
  updateNoteCount();

  const query = searchInput.value.trim().toLocaleLowerCase();
  const visibleNotes = notes.filter((note) =>
    note.text.toLocaleLowerCase().includes(query)
  );

  if (visibleNotes.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = notes.length === 0
      ? "No notes yet. Add one above to get started."
      : "No notes match your search.";
    notesList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const note of visibleNotes) {
    fragment.append(createNoteElement(note));
  }
  notesList.append(fragment);
}

function updateNoteCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();
  if (text.length === 0) {
    errorMessage.textContent = "Please type a note first.";
    noteInput.focus();
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    noteInput.focus();
    return;
  }

  errorMessage.textContent = "";
  const note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    category: noteCategory.value,
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  saveNotes();
  render();
  noteInput.value = "";
  noteInput.focus();
});

notesList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const deleteButton = event.target.closest(".delete-button");
  if (!deleteButton) return;

  const card = deleteButton.closest(".note-card");
  if (!card) return;

  notes = notes.filter((note) => String(note.id) !== card.dataset.id);
  saveNotes();
  render();
});

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    errorMessage.textContent = "Your browser could not save these notes.";
  }
}

searchInput.addEventListener("input", render);

render();
