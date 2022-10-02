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
app.put("/login/:email", function(req, res) {
    let email = req.params.email;
    let data = req.body;
    let password = data["password"];
    if (!email) {
        return res.status(400).send({ error: true, message: 'Please provide email' });
    }
    dbConn.query('SELECT * FROM Users WHERE user_email = ? and user_pass = ?', [email, password],
        function(error, results, fields) {
            if (error) throw error;
            if (results[0]) {
                return res.send(results[0]);
            } else {
                return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
            }
        });
})

// Sign up Student
app.post("/signup/student", function(req, res) {
    var std = req.body;
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
app.get("signup/student/check/:user_stdid", function(req, res) {
    var stdid = req.params.user_stdid;
    if (!stdid) {
        return res.status(400).send({ error: true, message: "The transmission was not found." });
    }
    dbConn.query('SELECT * FROM Users WHERE user_stdid = ?', stdid,
        function(error, results, fields) {
            if (error) throw error;
            if (results[0]) {
                return res.send(results[0]);
            } else {
                return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
            }
        });
});


//set port
app.listen(4000, function() {
    console.log("Node app is running on port 4000");
});

module.exports = app;