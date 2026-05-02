require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('DB CONNECTION FAILED:', err.message);
    return;
  }
  console.log('DB CONNECTED SUCCESSFULLY');
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('QUERY FAILED:', err.message);
    } else {
      console.log('Users in database:', results);
    }
    connection.end();
  });
});