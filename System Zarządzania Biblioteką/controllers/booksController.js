const booksModel = require('../models/booksModel');

async function getBooks(req, res) {
    try {
        const books = await booksModel.getBooks();
        res.render('books', { books });
    } catch (err) {
        console.error('Błąd w kontrolerze books:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function deleteBook(req, res) {
    try {
        const result = await booksModel.deleteBook(req, res);
        res.redirect('/books');
        if (!result) {
            res.status(404).send('Błąd w usuwaniu');
        }
    } catch (err) {
        console.error('Błąd w kontrolerze deleteBook:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function form(req, res) {
    try{
        const authors = await booksModel.getAuthors();
        const genres = await booksModel.getGenres();
        res.render('add_book', {authors, genres});
    } catch (err) {
        console.error('Błąd w kontrolerze addBookForm:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function formE(req, res) {
    try{
    const bookId = req.params.bookId;
    const authors = await booksModel.getAuthors();
    const genres = await booksModel.getGenres();

    res.render('edit_book', { bookId, authors, genres });
} catch (err) {
    console.error('Błąd w kontrolerze editBookForm:', err);
    res.status(500).send('Internal Server Error');
}
}
async function addBook(req, res) {
    try {
        const {title, author, genre} = req.body;
        if (!title || !author || !genre) {
            return res.status(400).send('Wszystkie pola są wymagane.');
        }
        const result = await booksModel.addBook(title, author, genre);

        if (result) {
            res.redirect('/books');
        } else {
            res.status(500).send('Wystąpił błąd podczas dodawania książki.');
        }
    } catch (err) {
        console.error('Błąd podczas dodawania książki:', err);
        res.status(500).send('Wystąpił błąd podczas dodawania książki.');
    }
}
async function editBook(req, res) {
    try {
        const { title, author, genre, bookId } = req.body;
        if (!title || !author || !genre|| !bookId) {
            return res.status(400).send('Wszystkie pola są wymagane.');
        }
        const success = await booksModel.editBook(bookId, title, author, genre);

        if (success) {
            res.redirect('/books');
        } else {
            res.status(500).send('Wystąpił błąd podczas edytowania książki.');
        }
    } catch (err) {
        console.error('Błąd podczas edytowania książki:', err);
        res.status(500).send('Wystąpił błąd podczas edytowania książki.');
    }
}


async function getBookDetails(req, res) {
    try {
        const bookId = req.params.bookId;
        const bookDetails = await booksModel.getBookDetails(bookId);
        res.render('book_details', { book: bookDetails.book, loans: bookDetails.loans });
    } catch (err) {
        console.error('Błąd w kontrolerze getBookDetails:', err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = { getBooks, deleteBook, addBook, form, editBook, formE, getBookDetails };
