const sql = require('mssql');
const config = require('../config');

async function getReaders() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT id_czytelnika, Imie, Nazwisko From B_Czytelnik');
        return result.recordset;
    } catch (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}
async function deleteReader(req, res) {
    try {
        const pool = await sql.connect(config);
        const readerId = req.params.readerId;
        const result = await pool.request().query(`DELETE FROM B_Czytelnik WHERE id_czytelnika = ${readerId}`);
        if (result.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error('Błąd podczas usuwania czytelnika:', err);
        res.redirect('/reader');
    } finally {
        sql.close();
    }
}
    async function addReader(first_name, last_name, email) {
        try {
            const pool = await sql.connect(config);
            const maxIdResult = await pool.request().query('Select Max(id_czytelnika) AS maxId From B_Czytelnik');
            const maxid = maxIdResult.recordset[0].maxId;
            const newid = maxid + 1;
            const result = await pool
                .request()
                .input('id', sql.Int, newid)
                .input('imie', sql.VarChar(255), first_name)
                .input('nazwisko', sql.VarChar(255), last_name)
                .input('email', sql.VarChar(255), email)
                .query('INSERT INTO B_Czytelnik (id_czytelnika, Imie, Nazwisko, email) VALUES (@id, @imie, @nazwisko, @email)');

            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error('Błąd podczas dodawania czytelnika:', err);
            throw err;
        } finally {
            sql.close();
        }
    }


    async function editReader(readerId, first_name, last_name, email) {
        try {
            const pool = await sql.connect(config);
            const result = await pool
                .request()
                .input('id', sql.Int, readerId)
                .input('imie', sql.VarChar(255), first_name)
                .input('nazwisko', sql.VarChar(255), last_name)
                .input('email', sql.VarChar(255), email)
                .query('UPDATE B_Czytelnik SET Imie = @imie, Nazwisko = @nazwisko, email =@email WHERE id_czytelnika=@id');
            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error('Błąd podczas edycji czytelnika:', err);
            throw err;
        } finally {
            sql.close();
        }
    }
async function getReaderDetails(readerId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('readerId', sql.Int, readerId)
            .query('SELECT id_czytelnika, Imie, Nazwisko, email FROM B_Czytelnik WHERE id_czytelnika = @readerId');

        return result.recordset[0];
    } catch (err) {
        console.error('Błąd pobierania informacji o czytelniku z bazy danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}

async function getReaderLoans(readerId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('readerId', sql.Int, readerId)
            .query('SELECT FORMAT(data_wypozyczenia, \'dd/MM/yyyy\') AS DataW, FORMAT(data_oddania, \'dd/M/yyyy\') AS DataO, B_Ksiazka.Nazwa_ksiazki, B_Autor.Imie + \' \' + B_Autor.Nazwisko AS Autor ' +
                'FROM B_Wyporzyczenia ' +
                'INNER JOIN B_Ksiazka ON B_Ksiazka.id_ksiazki = B_Wyporzyczenia.id_ksiazki ' +
                'INNER JOIN B_Autor ON B_Autor.Id = B_Ksiazka.id_autora ' +
                'WHERE B_Wyporzyczenia.id_czytelnika = @readerId');

        return result.recordset;
    } catch (err) {
        console.error('Błąd pobierania historii wypożyczeń czytelnika z bazy danych:', err);
        throw err;
    } finally {
        sql.close();
    }
}

module.exports = { getReaders, addReader, deleteReader, editReader, getReaderDetails, getReaderLoans};
