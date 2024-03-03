const authorsModel = require('../models/authorsModel');

async function getAuthors(req, res) {
    try {
        const authors = await authorsModel.getAuthors();
        res.render('authors', { authors });
    } catch (err) {
        console.error('Błąd w kontrolerze authors:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function deleteAuthor(req, res) {
    try {
        const result = await authorsModel.deleteAuthor(req, res);
        res.redirect('/authors');
        if (!result) {
            res.status(404).send('Błąd w usuwaniu');
        }
    } catch (err) {
        console.error('Błąd w kontrolerze deleteAuthors:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function form(req, res) {
        res.render('add_author');
}
async function formE(req, res) {
    try{
        const authorId = req.params.authorId;
        res.render('edit_author', { authorId });
    } catch (err) {
        console.error('Błąd w kontrolerze editBookForm:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function addAuthor(req, res) {
    try {
        const {first_name, last_name} = req.body;
        if (!first_name || !last_name) {
            return res.status(400).send('Wszystkie pola są wymagane.');
        }
        const result = await authorsModel.addAuthor(first_name, last_name);
        if (result) {
            res.redirect('/authors');
        } else {
            res.status(500).send('Wystąpił błąd podczas dodawania autora.');
        }
    } catch (err) {
        console.error('Błąd podczas dodawania autora:', err);
        res.status(500).send('Wystąpił błąd podczas dodawania autora.');
    }
}
async function editauthor(req, res) {
    try {

        const {first_name, last_name, authorId} = req.body;
        if (!first_name || !last_name || !authorId) {
            return res.status(400).send('Wszystkie pola są wymagane.');
        }

        const success = await authorsModel.editAuthor(authorId, first_name, last_name);

        if (success) {
            res.redirect('/authors');
        } else {
            res.status(500).send('Wystąpił błąd podczas edytowania autora.');
        }
    } catch (err) {
        console.error('Błąd podczas edytowania autora:', err);
        res.status(500).send('Wystąpił błąd podczas edytowania autora.');
    }
}
async function getAuthorDetails(req, res) {
    try {
        const authorId = req.params.authorId;
        const authorDetails = await authorsModel.getAuthorDetails(authorId);
        res.render('author_details', { author: authorDetails.author, books: authorDetails.books});
    } catch (err) {
        console.error('Błąd w kontrolerze getAuthorDetails:', err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = { getAuthors, form, addAuthor, deleteAuthor, formE, editauthor, getAuthorDetails};
