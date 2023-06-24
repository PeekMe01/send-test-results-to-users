const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());


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

// here is where you fetch things
app.get('/name it', (req, res)=> {
    const sql = 'SQL statement'
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, ()=> {
    console.log("listening");
});