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
            res.json({ message: 'User logged in successfully!' });
        }
    });
});

// admin sending results part / or anyone with permission
app.post('/sendresults', (req,res)=>{
    const { username, password, send_to, result_context } = req.body;
    const sendresults = 'INSERT INTO test_results(send_by, send_to, result_text, test_result_users_id) VALUES (?,?,?,?);';
    const checkSendTo = 'SELECT id FROM test_result_users WHERE username = ?;';
    const checkPermission = 'SELECT permission FROM test_result_users WHERE username = ? AND password = ?;';
    var send_to_id;

    if(!username, !password) { // this should NEVER be reached
        return res.status(500).json({ error: 'How did we get here 💀.' });
    }

    if(!send_to, !result_context) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // let's make sure the sender has permission ( even tho he can't access the form without permission but we must stay protected no matter what )
    db.query(checkPermission, [username, password], (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if(results.length == 0 ){
            return res.status(403).json({ error: 'Nice hidden talent! Keep it hidden.' });
        }

        if(results.length == 1 ){
            if(results[0].permission==false){
                return res.status(403).json({ error: 'Nice try! Don\'t try it again ;) ' });
            }
        }
    });

    // now let's make sure the user we send to is a real user
    db.query(checkSendTo, [send_to], (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
        if(results.length == 0){
            return res.status(401).json({ error: 'User doesn\'t exist.' });
        }

        if(results.length==1){
            send_to_id = results[0].id; // we now have successfully gotten the send_to user id
        }

        // we did this query inside because we want the "checkSendTo" query one to finish first
        //now that we have everything we can send it
        db.query(sendresults, [username, send_to, result_context, send_to_id], (error, results) =>{
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Internal server error.' });
            }

            // Send a response
            res.json({ message: 'Result succesfully sent to ' + send_to });
        });
    });
});

// user retreiving his results
app.post('/getresults', (req,res) => {
    const { id, username, password} = req.body;
    const getresults = 'SELECT send_by, result_text FROM test_results WHERE test_result_users_id = ?';
    const checkUser = 'SELECT * FROM test_result_users WHERE id = ? AND username = ? AND password = ?';

    if(!id, !username, !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // make sure these id, username and password are correct because we have trust issues with users
    db.query(checkUser, [id,username,password], (error,results) =>{
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if(results.length == 0){
            return res.status(401).json({ error: 'User doesn\'t exist.' });
        }

        // if user exists we continue
        db.query(getresults, [id], (error, results) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Internal server error.' });
            }
            if(results.length == 0){
                return res.status(404).json({ error: 'You have no results.' });
            }
    
            if(results.length>0){
                res.json({ message: 'result Received results ' , results});
            }
        });
    });
});

app.listen(8081, ()=> {
    console.log("listening");
});