var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", function(req, res) {
    return res.send({ error: true, message: "Test Employee Web API" });
});

var dbConn = mysql.createConnection({
    host: "https://ns23.hostinglotus.net/phpMyAdmin/",
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


//set port
app.listen(3000, function() {
    console.log("Node app is running on port 3000");
});

module.exports = app;