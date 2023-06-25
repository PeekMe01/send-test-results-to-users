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

// The signin part, not your typical one
app.post('/signup', (req, res)=> {
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


// The login part
app.post('/login', (req,res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM test_result_users WHERE username = ? AND password = ?';

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.query(sql, [username, password], (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if(results.length == 0){
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        var id = results[0].id;
        var username = results[0].username;
        var password = results[0].password;
        var permission = results[0].permission;

        if (results.length == 1) {
            const userData = {
                id,
                username,
                password,
                permission
            };
            res.json({ message: 'User logged in successfully!', userData });
        }
    });
});

app.listen(8081, ()=> {
    console.log("listening");
});