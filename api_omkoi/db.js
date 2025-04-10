// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'omkoi' 
});

connection.connect((err) => {
    if (err) {
        console.error("ไม่สามารถเชื่อมต่อ MySQL ได้:", err);
    } else {
        console.log("เชื่อมต่อ MySQL สำเร็จ");
    }
});

module.exports = connection;
