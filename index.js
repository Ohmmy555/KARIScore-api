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

app.get("/", function(req, res) {
    return res.send({ error: true, message: "Welcome to KARI Web API", By: "KARI IT CP KKU 14" });
});

var dbConn = mysql.createConnection({
    host: "119.59.104.13",
    user: "supphita",
    password: "0646267404",
    database: "supphita_kariscore",
});

dbConn.connect();

app.get("/allsubject", function(req, res) {
    dbConn.query("SELECT * FROM Subject", function(error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

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

app.post('/signup/student', function(req, res) {
    let data = req.body;
    let stdid = data['std_id'];
    let stdname = data['std_name'];
    let stdemail = data['std_email'];
    let stdpassword = dara['std_password'];
    let type = 1
    if (!stdid) {
        return res.status(400).send({ error: true, message: 'Please provide student id and student data' });
    }
    dbConn.query(
        "INSERT INTO Users(student_id, user_name, user_email, user_pass, idUser_type) VALUES ? ", [stdid, stdname, stdemail, stdpassword, type],
        function(error, results, fields) {
            if (error) throw error;
            if (results[0]) {
                return res.send(results[0]);
            } else {
                return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
            }
        });
    //return JSON.parse({ stdid: true })
})

//set port
app.listen(4000, function() {
    console.log("Node app is running on port 3000");
});

module.exports = app;