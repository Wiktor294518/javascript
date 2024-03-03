module.exports = {
    server: 'db-mssql',
    authentication: {
        type: 'ntlm',
        options: {
            userName: '',
            password: ',
            domain: ''
        }
    },
    options: {
        encrypt: false,
        database: ''
    }
};
