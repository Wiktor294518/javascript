
const sql = require('mssql');
const config = require('../config');

async function getBooks() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT id_ksiazki, Nazwa_ksiazki, B_Autor.Imie + B_Autor.Nazwisko AS Autor FROM B_Ksiazka JOIN B_Autor ON B_Autor.Id = B_Ksiazka.Id_autora Join B_Gatunek on B_Gatunek.Id_gatunku = B_Ksiazka.Id_gatunku ');
        return result.recordset;
    } catch (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function deleteBook(req, res) {
    try {
        const pool = await sql.connect(config);
        const bookId = req.params.bookId;
        const result = await pool.request().query(`DELETE FROM B_Ksiazka WHERE id_ksiazki = ${bookId}`);
        if (result.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error('Błąd podczas usuwania książki:', err);
        res.redirect('/books');
    } finally {
        sql.close();
    }
}
async function addBook(title, author, genre) {
    try {
        const pool = await sql.connect(config);
        const maxIdResult = await pool.request().query('Select Max(id_ksiazki) AS maxId From B_ksiazka');
        const maxid = maxIdResult.recordset[0].maxId;
        const newid = maxid + 1;
        const result = await pool
            .request()
            .input('id', sql.Int, newid)
            .input('title', sql.VarChar(255), title)
            .input('author', sql.Int, author)
            .input('genre', sql.Int, genre)
            .query('INSERT INTO B_Ksiazka (id_ksiazki, Nazwa_ksiazki, Id_gatunku, Id_autora) VALUES (@id, @title, @genre, @author)');

        return result.rowsAffected[0] > 0;
    } catch (err) {
        console.error('Błąd podczas dodawania książki:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function editBook(bookId, title, author, genre) {
    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('id', sql.Int, bookId)
            .input('title', sql.VarChar(255), title)
            .input('author', sql.Int, author)
            .input('genre', sql.Int, genre)
            .query('UPDATE B_Ksiazka SET Nazwa_ksiazki = @title, Id_gatunku = @genre, Id_autora = @author WHERE id_ksiazki = @id');

        return result.rowsAffected[0] > 0;
    } catch (err) {
        console.error('Błąd podczas edycji książki:', err);
        throw err;
    } finally {
        sql.close();
    }
}


async function getGenres() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT Id_gatunku, Nazwa_gatunku FROM B_Gatunek');
        return result.recordset;
    } catch (err) {
        console.error('Błąd pobierania gatunków z bazy danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function getAuthors() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT Id, Imie, Nazwisko FROM B_Autor');
        return result.recordset;
    } catch (err) {
        console.error('Błąd pobierania autorów z bazy danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function getBookDetails(bookId) {
    try {
        const pool = await sql.connect(config);

        const bookResult = await pool
            .request()
            .input('bookId', sql.Int, bookId)
            .query('SELECT id_ksiazki, Nazwa_ksiazki, B_Autor.Imie + B_Autor.Nazwisko AS Autor, B_Gatunek.Nazwa_gatunku AS Gatunek FROM B_Ksiazka JOIN B_Autor ON B_Autor.Id = B_Ksiazka.Id_autora Join B_Gatunek on B_Gatunek.Id_gatunku = B_Ksiazka.Id_gatunku Where id_ksiazki=@bookId');

        const book = bookResult.recordset[0];

        const loansResult = await pool
            .request()
            .input('bookId', sql.Int, bookId)
            .query('SELECT FORMAT(data_wypozyczenia, \'dd/MM/yyyy\') as DataW, FORMAT(data_oddania, \'dd/MM/yyyy\') as DataO, B_Czytelnik.Imie, B_Czytelnik.Nazwisko ' +
                'FROM B_Wyporzyczenia ' +
                'INNER JOIN B_Czytelnik ON B_Czytelnik.id_czytelnika = B_Wyporzyczenia.id_czytelnika ' +
                'WHERE B_Wyporzyczenia.id_ksiazki = @bookId');

        const loans = loansResult.recordset;

        return { book, loans };
    } catch (err) {
        console.error('Błąd pobierania danych o książce:', err);
        throw err;
    } finally {
        sql.close();
    }
}

module.exports = { getBooks, deleteBook, addBook, editBook, getAuthors, getGenres, getBookDetails};


