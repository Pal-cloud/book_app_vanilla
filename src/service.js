const booksContainer = document.getElementById("book-section");
const createForm = document.getElementById("create-book-form");

// CREATE
async function createBook(newBook) {
  const response = await fetch("http://localhost:3000/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBook)
  });

  if (response.ok) {
    await printBooks();
    createForm.reset();
  } else {
    console.error("Error al crear el libro");
  }
}

// READ
async function getBooks() {
  const res = await fetch("http://localhost:3000/books", {
    headers: { "Content-Type": "application/json" }
  });
  return await res.json();
}

// UPDATE
async function updateBook(id, editedBook) {
  const response = await fetch(`http://localhost:3000/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editedBook)
  });

  if (response.ok) {
    await printBooks();
  } else {
    console.error("Error al actualizar el libro");
  }
}

// DELETE
async function deleteBook(id) {
  const response = await fetch(`http://localhost:3000/books/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    await printBooks();
  } else {
    console.error("Error al eliminar el libro");
  }
}

// PRINT BOOKS
async function printBooks() {
  const books = await getBooks();
  booksContainer.innerHTML = "";

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.id = `book-${book.id}`;

    card.innerHTML = `
      <div class="view-mode">
        <h3>${book.title}</h3>
        <p><strong>Autor:</strong> ${book.writer}</p>
        <p><strong>Descripción:</strong> ${book.book_description}</p>
        <p><strong>ID:</strong> ${book.id}</p>
        <button onclick="startInlineEdit('${book.id}')">📝 ​Editar</button>
        <button onclick="deleteBook('${book.id}')">🗑️ ​Eliminar</button>
      </div>
    `;

    booksContainer.appendChild(card);
  });
}

// INLINE EDIT
function startInlineEdit(id) {
  const card = document.getElementById(`book-${id}`);
  const title = card.querySelector("h3").textContent;
  const writer = card.querySelector("p:nth-of-type(1)").textContent.replace("Autor: ", "");
  const description = card.querySelector("p:nth-of-type(2)").textContent.replace("Descripción: ", "");

  card.innerHTML = `
    <div class="edit-mode">
      <input type="text" id="inline-title-${id}" value="${title}">
      <input type="text" id="inline-writer-${id}" value="${writer}">
      <textarea id="inline-description-${id}">${description}</textarea>
      <button onclick="saveInlineEdit('${id}')">Guardar</button>
      <button onclick="cancelInlineEdit('${id}', '${escapeQuotes(title)}', '${escapeQuotes(writer)}', \`${escapeBackticks(description)}\`)">Cancelar</button>
    </div>
  `;
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}

function escapeBackticks(str) {
  return str.replace(/`/g, "\\`");
}

async function saveInlineEdit(id) {
  const title = document.getElementById(`inline-title-${id}`).value;
  const writer = document.getElementById(`inline-writer-${id}`).value;
  const description = document.getElementById(`inline-description-${id}`).value;

  const editedBook = { title, writer, book_description: description };
  await updateBook(id, editedBook);
}

function cancelInlineEdit(id, title, writer, description) {
  const card = document.getElementById(`book-${id}`);
  card.innerHTML = `
    <div class="view-mode">
      <h3>${title}</h3>
      <p><strong>Autor:</strong> ${writer}</p>
      <p><strong>Descripción:</strong> ${description}</p>
      <p><strong>ID:</strong> ${id}</p>
      <button onclick="startInlineEdit('${id}')">Editar</button>
      <button onclick="deleteBook('${id}')">Eliminar</button>
    </div>
  `;
}

// EVENTO CREAR
createForm.addEventListener("submit", async e => {
  e.preventDefault();
  const newBook = {
    title: document.getElementById("title").value,
    writer: document.getElementById("writer").value,
    book_description: document.getElementById("book_description").value
  };
  await createBook(newBook);
});