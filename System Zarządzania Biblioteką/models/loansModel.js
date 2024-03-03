
const sql = require('mssql');
const config = require('../config');

async function getLoans() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT Id_wpozyczenia, B_Czytelnik.Imie + \' \' + B_Czytelnik.Nazwisko AS Imie, B_Ksiazka.Nazwa_ksiazki, FORMAT(data_wypozyczenia, \'MM/dd/yyyy\') as DataW, FORMAT(data_oddania, \'MM/dd/yyyy\') as DataO  From B_Wyporzyczenia Inner Join B_Czytelnik on B_Czytelnik.id_czytelnika = B_Wyporzyczenia.id_czytelnika Inner Join B_Ksiazka on B_Ksiazka.id_ksiazki = B_Wyporzyczenia.id_ksiazki');
        return result.recordset;
    } catch (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function deleteLoan(req, res) {
    try {
        const pool = await sql.connect(config);
        const loanId = req.params.loanId;
        const result = await pool.request().query(`DELETE FROM B_Wyporzyczenia WHERE Id_wpozyczenia = ${loanId}`);
        if (result.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error('Błąd podczas usuwania wyporzyczenia:', err);
        res.redirect('/loans');
    } finally {
        sql.close();
    }
}
async function addLoan(readerId, titleId, data_w, data_o) {
    try {
        const pool = await sql.connect(config);
        const maxIdResult = await pool.request().query('Select Max(Id_wpozyczenia) AS maxId From B_Wyporzyczenia');
        const maxid = maxIdResult.recordset[0].maxId;
        const newid = maxid + 1;
        const result = await pool
            .request()
            .input('id', sql.Int, newid)
            .input('title', sql.Int, titleId)
            .input('reader', sql.Int, readerId)
            .input('data_w', sql.Date, data_w)
            .input('data_o', sql.Date, data_o)
            .query('INSERT INTO B_Wyporzyczenia(Id_wpozyczenia, id_czytelnika,id_ksiazki, data_wypozyczenia, data_oddania) VALUES (@id,  @reader, @title, @data_w, @data_o)');

        return result.rowsAffected[0] > 0;
    } catch (err) {
        console.error('Błąd podczas dodawania wyporzyczenia:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function editLoan(loanId, readerId, titleId, data_w, data_o) {
    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('id', sql.Int, loanId)
            .input('reader', sql.Int, readerId)
            .input('title', sql.Int, titleId)
            .input('data_w', sql.Date, data_w)
            .input('data_o', sql.Date, data_o)
            .query('UPDATE B_Wyporzyczenia SET id_ksiazki = @title, id_czytelnika = @reader, data_wypozyczenia = @data_w, data_oddania = @data_o WHERE Id_wpozyczenia = @id');

        return result.rowsAffected[0] > 0;
    } catch (err) {
        console.error('Błąd podczas edycji wyporzyczenia:', err);
        throw err;
    } finally {
        sql.close();
    }
}

async function getReaders() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT id_czytelnika, Imie , Nazwisko FROM B_Czytelnik');
        return result.recordset;
    } catch (err) {
        console.error('Błąd pobierania czytelnikow z bazy danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function getBooks() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT id_ksiazki, Nazwa_ksiazki FROM B_Ksiazka');
        return result.recordset;
    } catch (err) {
        console.error('Błąd pobierania ksiazek z bazy danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function getBookDetails(loanId) {
    try {
        const pool = await sql.connect(config);

        const bookResult = await pool
            .request()
            .input('loanId', sql.Int, loanId)
            .query('SELECT B_Ksiazka.id_ksiazki, B_Ksiazka.Nazwa_ksiazki, B_Autor.Imie + \' \' + B_Autor.Nazwisko AS Autor, B_Gatunek.Nazwa_gatunku AS Gatunek FROM B_Wyporzyczenia JOIN B_Ksiazka ON B_Wyporzyczenia.id_ksiazki = B_Ksiazka.id_ksiazki JOIN B_Autor ON B_Autor.Id = B_Ksiazka.Id_autora JOIN B_Gatunek ON B_Gatunek.Id_gatunku = B_Ksiazka.Id_gatunku WHERE B_Wyporzyczenia.Id_wpozyczenia = @loanId');

        const book = bookResult.recordset[0];


        return book
    } catch (err) {
        console.error('Błąd pobierania danych o książce:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function getReaderDetails(loanId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('loanId', sql.Int, loanId)
            .query('SELECT id_czytelnika, Imie, Nazwisko, email FROM B_Czytelnik WHERE id_czytelnika = (SELECT id_czytelnika FROM B_Wyporzyczenia WHERE id_wpozyczenia = @loanId)');

        return result.recordset[0];
    } catch (err) {
        console.error('Błąd pobierania informacji o czytelniku z bazy danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}

module.exports = { getLoans, getBooks, getReaders, deleteLoan, editLoan, addLoan, getBookDetails, getReaderDetails};
