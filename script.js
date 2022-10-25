let libraryDisplay = [];
let globalID = 0;

// I moved these up here to keep all the variables you're declaring outside of functions together.
let table = document.querySelector("table");
let bookForm = document.querySelector("form");

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// The patterns for creating a read button and a delete button are very similar. The only differences
// are the class, the text, and the event listener. By passing those into a single function, you can
// reuse that code.
let createButtonCell = (vals) => {
  let cell = document.createElement("td");
  let btn = document.createElement("button");

  btn.classList.add(vals.class);
  btn.innerText = vals.text;
  btn.addEventListener("click", (e)=>vals.listener(e, btn))

  cell.appendChild(btn);
  vals.row.appendChild(cell)
}

let createReadBtn = (row, book) => {
  // Create text options in a map, because a map will allow boolean keys.
  // You could cheat this by using JavaScript's reading of 0 as falsy and 
  // just use an object, but a map is a little more clear.
  let txt = new Map()
  txt.set(true, "Read")
  txt.set(false, "Not Read")

  let listener = (e, statusBtn) => {
    book.read = !book.read;
    // Here we use the map to get the appropriate text.
    statusBtn.innerText = txt.get(book.read)
  }

  // This just creates an object with all the values we need to make a button:
  // Class, text, listener, and the row that the button will be appended to.
  let btn = {
    class: "status-bttn",
    text: txt.get(book.read),
    listener,
    row,
  }

  createButtonCell(btn);
};

// By passing the book's id into the function to create the button, we can avoid
// selecting the parent node of a parent node or doing any other similar DOM traversal.
// Instead, we can just search for the document with the id we're looking for.
let createDeleteBtn = (row, id) => {
  let listener = () => {
    let toDeleteBook = document.querySelector(`[data-id="${id}"]`);
    toDeleteBook.remove();
    libraryDisplay = libraryDisplay.filter((row) => {
      return row.getAttribute("data-id") != id;
    });
  }

  // This just creates an object with all the values we need to make a button:
  // Class, text, listener, and the row that the button will be appended to.
  let btn = {
    class: "delete-bttn",
    text: "Delete",
    listener,
    row,
  }

  createButtonCell(btn);
};

function addBook(title, author, pages, read) {
  // Add Book to array of books
  let newBook = new Book(title, author, pages, read);

  // Add Book to Row in Table
  const rowBook = document.createElement("tr");
  rowBook.setAttribute("data-id", globalID);
  for (data in newBook) {
    if (data != "read") {
      let dataBook = document.createElement("td");
      const infoText = document.createTextNode(newBook[data]);
      dataBook.appendChild(infoText);
      rowBook.appendChild(dataBook);
    }
  }

  // Passing in the row here allows us to handle the appending for both buttons in their functions
  createReadBtn(rowBook, newBook);
  // Passing in the global id here will let you simplify the function.
  createDeleteBtn(rowBook, globalID);

  libraryDisplay.unshift(rowBook);

  // Since we're using the global id a little later, the increment needs to be 
  // relocated to the end of the function.
  globalID++;

  return rowBook;
}


bookForm.onsubmit = (e) => {
  e.preventDefault();
  let book = addBook(
    e.target.elements.title.value,
    e.target.elements.author.value,
    e.target.elements.pages.value,
    // Making this a boolean value will make managing text a little cleaner. You could make the 
    // value of the element true or false rather than "Read" or "Not Read", but the value of the element
    // will still be read as a string. This makes sure that you're working with a boolean value.
    e.target.elements.status.value==="Read"
  );

  // Since you return the entire row element from addBook, you can just prepend it.
  // There's no need to clear everything and refill the entire table with every added book.
  // That might be a useful feature to keep in mind if you added the ability to drag rows to 
  // sort them, however.
  table.prepend(book)

  return false;
};
