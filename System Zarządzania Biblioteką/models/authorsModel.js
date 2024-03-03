const sql = require('mssql');
const config = require('../config');

async function getAuthors() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT B_Autor.Id, B_Autor.Imie, B_Autor.Nazwisko FROM B_Autor;');
        return result.recordset;
    } catch (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}

async function deleteAuthor(req, res) {
    try {
        const pool = await sql.connect(config);
        const authorId = req.params.authorId;
        const result = await pool.request().query(`DELETE FROM B_Autor WHERE Id = ${authorId}`);
        if (result.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error('Błąd podczas usuwania autora:', err);
        res.redirect('/authors');
    } finally {
        sql.close();
    }
}
async function editAuthor(authorId, first_name, last_name) {
    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('id', sql.Int, authorId)
            .input('imie', sql.VarChar(255), first_name)
            .input('nazwisko', sql.VarChar(255), last_name)
            .query('UPDATE B_Autor SET Imie = @imie, Nazwisko = @nazwisko WHERE Id=@id');

        return result.rowsAffected[0] > 0;
    } catch (err) {
        console.error('Błąd podczas edycji autora:', err);
        throw err;
    } finally {
        sql.close();
    }
}

async function addAuthor(first_name, last_name) {
    try {
        const pool = await sql.connect(config);
        const maxIdResult = await pool.request().query('Select Max(Id) AS maxId From B_Autor');
        const maxid = maxIdResult.recordset[0].maxId;
        const newid = maxid + 1;
        const result = await pool
            .request()
            .input('id', sql.Int, newid)
            .input('imie', sql.VarChar(255), first_name)
            .input('nazwisko', sql.VarChar(255), last_name)
            .query('INSERT INTO B_Autor (Id, Imie, Nazwisko) VALUES (@id, @imie, @nazwisko)');

        return result.rowsAffected[0] > 0;
    } catch (err) {
        console.error('Błąd podczas dodawania autora:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function getAuthorDetails(authorId) {
    try {
        const pool = await sql.connect(config);

        const authorResult = await pool.request()
            .input('authorId', sql.Int, authorId)
            .query('SELECT Id, Imie, Nazwisko FROM B_Autor WHERE Id = @authorId');


        const booksResult = await pool.request()
            .input('authorId', sql.Int, authorId)
            .query('SELECT Id_ksiazki, Nazwa_ksiazki, B_Gatunek.Nazwa_gatunku AS Gatunek, B_Gatunek.opis AS Opis FROM B_Ksiazka Join B_Gatunek on B_Gatunek.id_gatunku = B_Ksiazka.id_gatunku WHERE Id_autora = @authorId');



        const author = authorResult.recordset[0];
        const books = booksResult.recordset;


        return { author, books};
    } catch (err) {
        console.error('Błąd w modelu getAuthorDetails:', err);
        throw err;
    } finally {
        sql.close();
    }
}


module.exports = { getAuthors, addAuthor, deleteAuthor, editAuthor , getAuthorDetails};
