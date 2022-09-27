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

//set port
app.listen(4000, function() {
    console.log("Node app is running on port 3000");
});

module.exports = app;