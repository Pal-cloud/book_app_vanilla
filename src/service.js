// CREATE MÉTODO POST
/* CREATE Método POST */
async function createBook(newBook) {
  const response = await fetch("http://localhost:3000/books",  {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(newBook)
});

if (response.ok) {
  const createBook = await response.json();
  console.log("Libro creado:", createBook);
  await printBooks(); //actualizar la lista
  return createBook;
} else {
  console.log("Error al crear libro");
}
}

// READ MÉTODO GET
async function getBooks(){
    const response = await fetch("http://localhost:3000/books", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const bookData = await response.json()
    console.log(bookData)
    return bookData
}
getBooks()


// UPDATE MÉTODO PUT
function updateBook(id, editedBook){

}

// DELETE MÉTODO DELETE

async function deleteBook(id) {
    const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
if(response.ok){
    await prrintBooks()
}
}
    

//Imprimir//

let booksContainer = document.getElementById("book-section")

async function printBooks() {
        let books = await getBooks();
        booksContainer.innerHTML = ""
        const printBookList = books.map(book =>{
            return booksContainer.innerHTML += `<h1>${book.title}</h1>
            <p>${book.writer}</p>
            <p>${book.book_description}</p>
            <p>${book.id}</p>
            <button onclick="deleteBook('${book.id}')">Eliminar</button>`
        });
        return printBookList
    }
    


