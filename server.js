var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
const { json } = require("body-parser");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// main
app.get("/", function(req, res) {
    return res.send({ error: true, message: "Welcome to KARI Web API", By: "KARI IT CP KKU 14" });
});

// connect Database
var dbConn = mysql.createConnection({
    host: "119.59.104.13",
    user: "supphita",
    password: "0646267404",
    database: "supphita_kariscore",
});

// var dbConn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "Kariscore",
// })

// คำสั่งเชื่อมต่อ
dbConn.connect();

// ดึงวิชา
app.get("/allsubject", function(req, res) {
    dbConn.query("SELECT * FROM Subject", function(error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

// Login
app.post("/auth/login", function(req, res) {
    let data = req.body;
    let email = data['user_email'];
    let password = data['user_pass'];
    console.log(email, password)
    if (!data) {
        return res.status(400).send({ error: true, message: 'Please provide กฟะฟ' });
    }
    dbConn.query('SELECT * FROM Users WHERE user_email = ? AND user_pass = ?', [email, password], function(error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0]);
        } else {
            return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
        }
    });
})

// Sign up Student
app.post("/auth/signup/student", function(req, res) {
    var std = req.body;
    console.log(std)
    if (!std) {
        return res
            .status(400)
            .send({ error: true, message: "The transmission was not found." });
    }
    dbConn.query(
        "INSERT INTO Users SET ? ",
        std,
        function(error, results, fields) {
            if (error) throw error;
            return res.send(results);
        }
    );
});

// Check student ID
app.post("auth/signup/student/check", function(req, res) {
    let stdid = req.body;
    console.log(stdid)
    if (!stdid) {
        return res.status(400).send({ error: true, message: 'The transmission was not found.' });
    }
    dbConn.query('SELECT * FROM Users WHERE ?', stdid,
        function(error, results, fields) {
            if (error) throw error;
            if (results[0]) {
                return res.send(results[0]);
            } else {
                return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
            }
        });
})

// Sign up Teacher
app.post("/auth/signup/teacher", function(req, res) {
    var teace = req.body;
    console.log(teace)
    if (!teace) {
        return res
            .status(400)
            .send({ error: true, message: "The transmission was not found." });
    }
    dbConn.query(
        "INSERT INTO Users SET ? ",
        teace,
        function(error, results, fields) {
            if (error) throw error;
            return res.send(results);
        }
    );
});

// Check Email Teacher
app.post("/auth/signup/teacher/check", function(req, res) {
    let teacemail = req.body;
    console.log(teacemail)
    if (!teacemail) {
        return res.status(400).send({ error: true, message: 'The transmission was not found.' });
    }
    dbConn.query('SELECT * FROM Users WHERE ?', teacemail,
        function(error, results, fields) {
            if (error) throw error;
            if (results[0]) {
                return res.send(results[0]);
            } else {
                return res.status(400).send({ error: true, message: 'Teacher email Not Found!!' });
            }
        });
})


//set port
app.listen(4000, function() {
    console.log("Node app is running on port 4000");
});

module.exports = app;