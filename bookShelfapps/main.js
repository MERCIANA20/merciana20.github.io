/*--to do tersubmit/dtmbhkan ,muncul di konsol browser*/
const books = [];
const RENDER_EVENT = 'render-book';
document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
function addBook() {
  const textBook = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const readStatusCheckbox = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textBook, author, year, readStatusCheckbox);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function generateId() {
  return +new Date();
}
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
function makeBook(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('h2');
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('action');
  const btnDelete = document.createElement('button');
  btnDelete.classList.add('red');
  btnDelete.innerText = 'Hapus Buku';

  const articleContainer = document.createElement('article');
  articleContainer.classList.add('book_item');
  articleContainer.append(textTitle, textAuthor, textYear, btnContainer);
  articleContainer.setAttribute('id', 'book-${bookObject.id}');

  if (bookObject.isCompleted) {
    const btnUndo = document.createElement('button');
    btnUndo.classList.add('green');
    btnUndo.setAttribute('id', 'btn-undo');
    btnUndo.innerText = 'Belum Selesai Dibaca';
    btnContainer.append(btnUndo, btnDelete);
    btnUndo.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });
    btnDelete.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('green');
    checkButton.setAttribute = ('id', 'check-button');
    checkButton.innerText = 'Selesai Dibaca';
    btnContainer.append(checkButton, btnDelete);
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id);
    });
    btnDelete.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
  }
  function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  return articleContainer;
}
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
  uncompletedBOOKList.innerHTML = '';

  const completedBOOKList = document.getElementById('completeBookshelfList');
  completedBOOKList.innerHTML = '';

  for (const book_Item of books) {
    const bookElement = makeBook(book_Item);
    if (!book_Item.isCompleted) uncompletedBOOKList.append(bookElement);
    else completedBOOKList.append(bookElement);
  }
});
function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
function isStorageExist() /*boolean*/ {
  if (typeof storage === undefined) {
    alert('Browser kamu tidak mendukung lokal storage');
    return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
