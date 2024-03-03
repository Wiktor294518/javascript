const LoansModel = require('../models/LoansModel');

async function getLoans(req, res) {
    try {
        const Loans = await LoansModel.getLoans();
        res.render('Loans', { Loans });
    } catch (err) {
        console.error('Błąd w kontrolerze Loans:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function deleteLoan(req, res) {
    try {
        const result = await LoansModel.deleteLoan(req, res);
        res.redirect('/loans');
        if (!result) {
            res.status(404).send('Błąd w usuwaniu');
        }
    } catch (err) {
        console.error('Błąd w kontrolerze deleteLoan:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function form(req, res) {
    try{
        const books = await LoansModel.getBooks();
        const readers = await LoansModel.getReaders();
        res.render('add_loan', {books, readers});
    } catch (err) {
        console.error('Błąd w kontrolerze addloanForm:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function formE(req, res) {
    try{
        const loanId = req.params.loanId;
        const books = await LoansModel.getBooks();
        const readers = await LoansModel.getReaders();

        res.render('edit_loan', {loanId, books, readers});
    } catch (err) {
        console.error('Błąd w kontrolerze editLoanForm:', err);
        res.status(500).send('Internal Server Error');
    }
}
async function addLoan(req, res) {
    try {
        const {readerId, titleId, data_w, data_o} = req.body;

        if (!readerId || !titleId || !data_w) {
            return res.status(400).send('Wszystkie pola są wymagane.');
        }
        if (data_o && new Date(data_o) < new Date(data_w)) {
            return res.status(400).send('Data oddania nie może być wcześniejsza niż data wypożyczenia.');
        }
        const formattedData_o = data_o ? data_o : null;
        const result = await LoansModel.addLoan(readerId, titleId, data_w, formattedData_o);

        if (result) {
            res.redirect('/loans');
        } else {
            res.status(500).send('Wystąpił błąd podczas dodawania wyporzyczenia.');
        }
    } catch (err) {
        console.error('Błąd podczas dodawania wyporzyczenia:', err);
        res.status(500).send('Wystąpił błąd podczas dodawania wyporzyczenia.');
    }
}
async function editLoan(req, res) {
    try {
        const { loanId, readerId, titleId, data_w, data_o } = req.body;
        if (!readerId || !titleId || !data_w || !loanId) {
            return res.status(400).send('Wszystkie pola są wymagane.');
        }
        if (data_o && new Date(data_o) < new Date(data_w)) {
            return res.status(400).send('Data oddania nie może być wcześniejsza niż data wypożyczenia.');
        }

        const formattedData_o = data_o ? data_o : null;
        const success = await LoansModel.editLoan(loanId, readerId, titleId, data_w, formattedData_o);
        if (success) {
            res.redirect('/loans');
        } else {
            res.status(500).send('Wystąpił błąd podczas edytowania wyporzyczenia.');
        }
    } catch (err) {
        console.error('Błąd podczas edytowania wyporzyczenia:', err);
        res.status(500).send('Wystąpił błąd podczas edytowania wyporzyczenia.');
    }
}


async function getReaderDetails(req, res) {
    try {
        const loanId = req.params.loanId;
        const reader= await LoansModel.getReaderDetails(loanId);
        const book= await LoansModel.getBookDetails(loanId);

        res.render('loan_details', { reader: reader, book: book });
    } catch (err) {
        console.error('Błąd w kontrolerze getReaderDetails:', err);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = { getLoans, form, formE, editLoan, deleteLoan,addLoan, getReaderDetails };
