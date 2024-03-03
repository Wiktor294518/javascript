const express = require('express');
const authorsController = require('./controllers/authorsController');
const readersController = require('./controllers/readersController');
const indexController = require('./controllers/indexController');
const booksController = require('./controllers/booksController');
const loansController = require('./controllers/loansController');
const path = require('path');
const ntlm = require('node-ntlm-client');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

if (process.platform === 'win64') {
    ntlm.init();
}
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/index', indexController.getIndex)
app.get('/books', booksController.getBooks);
app.get('/authors', authorsController.getAuthors);
app.get('/readers', readersController.getReaders);
app.get('/loans', loansController.getLoans);

app.get('/books/delete/:bookId', booksController.deleteBook);
app.get('/add_book', booksController.form);
app.post('/add_book', booksController.addBook);
app.get('/books/edit/:bookId', booksController.formE);
 app.post('/books/edit/:bookId', booksController.editBook);
app.get('/books/details/:bookId', booksController.getBookDetails);

app.get('/authors/delete/:authorId', authorsController.deleteAuthor);
app.get('/add_author', authorsController.form);
app.post('/add_author', authorsController.addAuthor);
app.get('/authors/edit/:authorId', authorsController.formE);
app.post('/authors/edit/:authorId', authorsController.editauthor);
app.get('/authors/details/:authorId', authorsController.getAuthorDetails);

app.get('/readers/delete/:readerId', readersController.deleteReader);
app.get('/add_reader', readersController.form);
app.post('/add_reader', readersController.addReader);
app.get('/readers/edit/:readerId', readersController.formE);
app.post('/readers/edit/:readerId', readersController.editReader);
app.get('/readers/details/:readerId', readersController.getReaderDetails);

app.get('/loans/delete/:loanId', loansController.deleteLoan);
app.get('/add_loan', loansController.form);
app.post('/add_loan', loansController.addLoan);
app.get('/loans/edit/:loanId', loansController.formE);
app.post('/loans/edit/:loanId', loansController.editLoan);
app.get('/loans/details/:loanId', loansController.getReaderDetails);




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
