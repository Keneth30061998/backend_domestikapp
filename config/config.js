const mysql = require('mysql2');

const db=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Keneth1998',
    database: 'db_domestikapp'
});

db.connect(function(err){
    if(err) throw err;
    console.log('Database connected');
});

module.exports = db;