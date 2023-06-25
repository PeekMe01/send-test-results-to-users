const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());

// put your database info
const db = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7628111',
    password: 'f9mgGKMH63',
    database: 'sql7628111'
});

app.get('/', (re, res)=> {
    return res.json("From Backend Side");
})

// The signin part, not your typical one, i love chatgpt
app.post('/signin', (req, res)=> {
    const { username, password } = req.body;
    const sql = 'SELECT id FROM test_result_users WHERE username = ?';

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.query(sql, [username], (error, results) => {
        if (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal server error.' });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        const newUser = {
            _username: username,
            _password: password,
            _permission: false
        };

        db.query('INSERT INTO test_result_users(username,password,permission) VALUES(?,?,?)', [newUser._username, newUser._password, newUser._permission], (error) => {
            if (error) {
              console.error('Error:', error);
              return res.status(500).json({ error: 'Internal server error.' });
            }
      
            // Send a response
            res.json({ message: 'User signed up successfully!' });
        });
    });
});

app.listen(8081, ()=> {
    console.log("listening");
});