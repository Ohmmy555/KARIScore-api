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
    dbConn.query("SELECT * FROM Subjects", function(error, results, fields) {
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


// เพิ่มเติม
app.get('/std/:id', function(req, res) {
    let user_stdid = req.params.id;
    if (!user_stdid) {
        return res.status(400).send({ error: true, message: 'Please provide student id' });
    }
    dbConn.query('SELECT * FROM Users WHERE user_stdid = ?', user_stdid, function(error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0]);
        } else {
            return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
        }
    });
})

app.get("/allStudentScore", function(req, res) {
    dbConn.query("SELECT Users.user_stdid,Users.user_name,Score_Student.score FROM Score_Student,Users,Score "+
    "WHERE Score_Student.score_id='1' AND Score_Student.score_id=Score.score_id AND Users.user_id=Score_Student.user_id GROUP BY Users.user_id  ", function(error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

app.put('/subject/:id', function(req, res) {
    let subject_id = req.params.id;
    let sj = req.body
    if (!subject_id || !sj) {
        return res.status(400).send({ error: true, message: 'Please provide Subject id and Subject data' });
    }

    dbConn.query('UPDATE Subjects SET ? WHERE subject_id = ?', [sj, subject_id], function(error, results, fields) {
        if (error) throw error;

        return res.send({ error: false, message: 'Subject has been updated seccessfully' });

    });
})


app.delete('/subject/:id', function(req, res) {
    let subject_id = req.params.id;
    if (!subject_id) {
        return res.status(400).send({ error: true, message: 'Please provide Subject id' });
    }
    dbConn.query('DELETE FROM Subjects WHERE subject_id = ?', subject_id, function(error, results, fields) {
        if (error) throw error;

        return res.send({ error: false, message: 'Subject has been deleted seccessfully' });

    });
})

app.post("/insertSubject", function(req, res) {
    var subject = req.body;
    console.log(subject)
    if (!subject) {
        return res
            .status(400)
            .send({ error: true, message: "The transmission was not found." });
    }
    dbConn.query(
        "INSERT INTO Subjects SET ? ",
        subject,
        function(error, results, fields) {
            if (error) throw error;
            return res.send(results);
        }
    );
});

app.post("/insertOwner", function(req, res) {
    var owner = req.body;
    console.log(owner)
    if (!owner) {
        return res
            .status(400)
            .send({ error: true, message: "The transmission was not found." });
    }
    dbConn.query(
        "INSERT INTO Classroom SET ? ",
        owner,
        function(error, results, fields) {
            if (error) throw error;
            return res.send(results);
        }
    );
});

app.post("/createWork", function(req, res) {
    var work = req.body;
    console.log(work)
    if (!work) {
        return res
            .status(400)
            .send({ error: true, message: "The transmission was not found." });
    }
    dbConn.query(
        "INSERT INTO Score SET ? ",
        work,
        function(error, results, fields) {
            if (error) throw error;
            return res.send(results);
        }
    );
});

//set port
app.listen(4000, function() {
    console.log("Node app is running on port 4000");
});

module.exports = app;