const sql = require('mysql2')


let Assignmentdatabase = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sainath-9988',
    database: 'studentAssignment'
})


Assignmentdatabase.connect((err, data) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database: studentAssignment');
});

module.exports = Assignmentdatabase
