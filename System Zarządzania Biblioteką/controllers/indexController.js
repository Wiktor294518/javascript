
async function getIndex(req, res) {
    try {
        res.render('index');
    } catch (err) {
        console.error('Błąd w kontrolerze index:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getIndex };
