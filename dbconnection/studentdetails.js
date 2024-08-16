const sql = require('mysql2')


let database = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sainath-9988',
    database: 'Students'
})


database.connect((err, data) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database: Students');
});

module.exports = database
