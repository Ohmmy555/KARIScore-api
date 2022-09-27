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


//set port
app.listen(4000, function() {
    console.log("Node app is running on port 3000");
});

module.exports = app;