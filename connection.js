const mysql = require('mysql');

const mysqlConnection = mysql.createPool({
    connectionLimit: 10,
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "b071488dca2501",
    password: "ec20c0a1",
    database: "heroku_f1cf93086df67b3",
    port: 3306,
});

mysqlConnection.query('SELECT 1', (err, results, fields) => {
    try {
        if (err) throw `${err}`
        else {
            console.log("DB: connected");
        }
    } catch (error) {
        console.log(`Error while connecting to DB: \n${error}`);
    }
});

module.exports = mysqlConnection;