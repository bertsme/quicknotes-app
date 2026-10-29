"use strict";

const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");

let notes = [];

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

  if (notes.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No notes yet. Add one above to get started.";
    notesList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const note of notes) {
    fragment.append(createNoteElement(note));
  }
  notesList.append(fragment);
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();
  const note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    category: noteCategory.value,
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  render();
  noteInput.value = "";
  noteInput.focus();
});

render();
