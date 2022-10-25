let myLibrary = [];
let libraryDisplay = [];
let globalID = 0;

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

let createReadBtn = (book) => {
  let dataBook = document.createElement("td");
  let statusBtn = document.createElement("button");
  statusBtn.classList.add("status-bttn");
  statusBtn.innerText = book.read;
  statusBtn.addEventListener("click", (e) => {
    if (statusBtn.innerText === "Read") statusBtn.innerText = "Not Read";
    else statusBtn.innerText = "Read";
    book.read = statusBtn.innerText;
  });
  dataBook.appendChild(statusBtn);
  return dataBook;
};

let createDeleteBtn = () => {
  let dataBook = document.createElement("td");
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-bttn");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", (e) => {
    let toDeleteBook = e.target.parentNode.parentNode;
    let deleteId = toDeleteBook.getAttribute("data-id");
    toDeleteBook.remove();
    libraryDisplay = libraryDisplay.filter((row) => {
      return row.getAttribute("data-id") != deleteId;
    });
  });
  dataBook.appendChild(deleteBtn);
  return dataBook;
};

function addBook(title, author, pages, read) {
  // Add Book to array of books
  let newBook = new Book(title, author, pages, read);
  myLibrary.unshift(newBook);

  // Add Book to Row in Table
  const rowBook = document.createElement("tr");
  rowBook.setAttribute("data-id", globalID);
  globalID++;
  for (data in newBook) {
    if (data != "read") {
      let dataBook = document.createElement("td");
      const infoText = document.createTextNode(newBook[data]);
      dataBook.appendChild(infoText);
      rowBook.appendChild(dataBook);
    }
  }

  let readStatus = createReadBtn(newBook);
  rowBook.appendChild(readStatus);
  let deleteBtn = createDeleteBtn();
  rowBook.appendChild(deleteBtn);
  libraryDisplay.unshift(rowBook);

  return rowBook;
}

let table = document.querySelector("table");

let displayBooks = (library) => {
  for (let book in library) {
    table.appendChild(library[book]);
  }
};

let clearTable = (table) => {
  let rows = table.getElementsByTagName("tr");
  while (rows.length > 1) {
    rows[1].parentNode.removeChild(rows[1]);
  }
};

let bookForm = document.querySelector("form");

bookForm.onsubmit = (e) => {
  e.preventDefault();
  addBook(
    e.target.elements.title.value,
    e.target.elements.author.value,
    e.target.elements.pages.value,
    e.target.elements.status.value
  );
  clearTable(table);
  displayBooks(libraryDisplay);
  return false;
};
