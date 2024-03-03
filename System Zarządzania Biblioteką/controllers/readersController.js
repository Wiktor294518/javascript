const readersModel = require('../models/readersModel');

async function getReaders(req, res) {
    try {
        const readers = await readersModel.getReaders();
        res.render('readers', { readers });
    } catch (err) {
        console.error('Błąd w kontrolerze readers:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function deleteReader(req, res) {
    try {
        const result = await readersModel.deleteReader(req, res);
        res.redirect('/readers');
        if (!result) {
            res.status(404).send('Błąd w usuwaniu');
        }
    } catch (err) {
        console.error('Błąd w kontrolerze deletereaders:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function form(req, res) {
    res.render('add_reader');
}
async function formE(req, res) {
    try{
        const readerId = req.params.readerId;
        res.render('edit_reader', { readerId });
    } catch (err) {
        console.error('Błąd w kontrolerze editreaderForm:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function addReader(req, res) {
    try {
        const {first_name, last_name, email} = req.body;
        if (!first_name || !last_name|| !email) {
            return res.status(400).send('Wszystkie pola są wymagane.');
        }
        const result = await readersModel.addReader(first_name, last_name, email);
        if (result) {
            res.redirect('/readers');
        } else {
            res.status(500).send('Wystąpił błąd podczas dodawania czytelnika.');
        }
    } catch (err) {
        console.error('Błąd podczas dodawania czytelnika:', err);
        res.status(500).send('Wystąpił błąd podczas dodawania czytelnika.');
    }
}
async function editReader(req, res) {
    try {

        const {first_name, last_name, email, readerId} = req.body;
        if (!first_name || !last_name|| !email || !readerId) {
            return res.status(400).send('Wszystkie pola są wymagane.');
        }
        const success = await readersModel.editReader(readerId, first_name, last_name, email);

        if (success) {
            res.redirect('/readers');
        } else {
            res.status(500).send('Wystąpił błąd podczas edytowania czytelnika.');
        }
    } catch (err) {
        console.error('Błąd podczas edytowania czytelnika:', err);
        res.status(500).send('Wystąpił błąd podczas edytowania czytelnika.');
    }
}
async function getReaderDetails(req, res) {
    try {
        const readerId = req.params.readerId;
        const reader = await readersModel.getReaderDetails(readerId);
        const loans = await readersModel.getReaderLoans(readerId);
        res.render('reader_details', { reader, loans });
    } catch (err) {
        console.error('Błąd w kontrolerze getReaderDetails:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getReaders, deleteReader, form, formE, addReader, editReader, getReaderDetails };
