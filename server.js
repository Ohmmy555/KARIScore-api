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


//Auth
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

// Subject
// Call Subject
app.post("/allsubject", function(req, res) {
    let data = req.body;
    let user_id = data['user_id']
    console.log(user_id);
    dbConn.query("SELECT Subjects.subject_name,Subjects.subject_description,Subjects.subject_year,Subjects.subject_term,Subjects.subject_id,Subjects.subject_code,Classroom.user_type_id FROM Classroom,Subjects WHERE Classroom.subject_id=Subjects.subject_id AND Classroom.user_id = ? AND deleted_at = '0000-00-00 00:00:00.000000' GROUP BY Subjects.subject_name", user_id, function(error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

// Join Subject : check code
app.post("/subject/join", function(req, res) {
    let data = req.body;
    dbConn.query("SELECT * FROM Subjects WHERE ?", data, function(error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0]);
        } else {
            return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
        }
    });
})

// Join Subject : check student
app.post("/subject/join/check", function(req, res) {
    let data = req.body;
    let subject_id = data['subject_id'];
    let user_id = data['user_id'];
    dbConn.query('SELECT * FROM Classroom WHERE subject_id = ? AND user_id = ?', [subject_id, user_id], function(error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0])
        } else {
            return res.status(400).send({ error: true, message: 'Student id Not Found!!' })
        }
    })
})

// Join Subject : insert student
app.post("/subject/join/update", function(req, res) {
    let data = req.body;
    console.log(data)
    dbConn.query("INSERT INTO Classroom SET ?", data, function(error, results, fields) {
        if (error) throw error;
        return res.send(results)
    })
})

// Join Subject : Check subject id
app.post("/insertSubject/call", function(req, res) {
    let data = req.body;
    console.log(data);
    dbConn.query("SELECT * FROM Subjects WHERE ?", data, function(error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0]);
        } else {
            return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
        }
    });
})

// Score
// Search Student for score
app.post('/score/search', function(req, res) {
    let data = req.body;
    let user_stdid = "%" + data['user_stdid'];
    let subject_id = data['subject_id'];
    console.log(subject_id);
    if (!user_stdid) {
        return res.status(400).send({ error: true, message: 'Please provide student id' });
    }
    dbConn.query('SELECT Users.user_stdid,Users.user_name,Users.user_id FROM Users,Classroom WHERE Classroom.user_id=Users.user_id AND Users.user_stdid LIKE ? AND Classroom.subject_id = ? AND user_type_id = 3', [user_stdid, subject_id], function(error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0]);
        } else {
            return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
        }
    });
})


// Score : call subject
app.post("/score/subject", function(req, res) {
    let data = req.body;
    dbConn.query("SELECT * FROM Subjects WHERE ?", data, function(error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0]);
        } else {
            return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
        }
    });
})

app.post("/allStudentScore", function(req, res) {
    let data = req.body;
    let scoreid = data['score_id']
    console.log(scoreid);
    dbConn.query("SELECT Users.user_stdid,Users.user_name,Score_Student.score FROM Score_Student,Users WHERE Score_Student.user_id=Users.user_id AND Score_Student.score_id=?", scoreid,
        function(error, results, fields) {
            if (error) throw error;
            return res.send(results);
        });
});

//Edit subject
app.post('/subject/edit', function(req, res) {
    let data = req.body;
    let subject_id = data['subject_id'];
    let subject_name = data['subject_name'];
    let subject_year = data['subject_year'];
    let subject_tear = data['subject_term'];
    let subject_description = data['subject_description']
    if (!data) {
        return res.status(400).send({ error: true, message: 'Please provide Subject data' });
    }

    dbConn.query('UPDATE Subjects SET subject_name = ?,subject_year = ?,subject_term = ?,subject_description = ? WHERE subject_id = ?', [subject_name, subject_year, subject_tear, subject_description, subject_id], function(error, results, fields) {
        if (error) throw error;
        return res.send(results)

    });
})


// Delete subject
app.post('/subject/delete', function(req, res) {
    let data = req.body;
    let subject_id = data['subject_id']
    let date = new Date();
    console.log(subject_id);
    console.log(date.toISOString())
    if (!subject_id) {
        return res.status(400).send({ error: true, message: 'Please provide Subject id' });
    }
    dbConn.query("UPDATE Subjects SET deleted_at = ? WHERE subject_id = ?", [date, subject_id], function(error, results, fields) {
        if (error) throw error;
        return res.send(results)
    })

})

function generateString(length) {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result = '';
    //นับจำนวนตัวอักษร
    charactersLength = characters.length;
    //วนลูปตามจำนวนตัวอักษร
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

app.post("/insertSubject", function(req, res) {
    var data = req.body;
    var subject_name = data['subject_name']
    var subject_year = data['subject_year']
    var subject_term = data['subject_term']
    var subject_description = data['subject_description']
    var code = generateString(4);
    console.log(code)
    if (!data) {
        return res
            .status(400)
            .send({ error: true, message: "The transmission was not found." });
    }
    dbConn.query(
        "INSERT INTO Subjects SET subject_name = ?, subject_year = ?, subject_term = ?, subject_description = ?, subject_code = ?", [subject_name, subject_year, subject_term, subject_description, code],
        function(error, results, fields) {
            if (error) throw error;
            return res.send(results);
        }
    );
});

app.post("/insertScoreStudent", function(req, res) {
    var scoreStudent = req.body;
    console.log(scoreStudent)
    if (!scoreStudent) {
        return res
            .status(400)
            .send({ error: true, message: "The transmission was not found." });
    }
    dbConn.query(
        "INSERT INTO Score_Student SET ? ",
        scoreStudent,
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




app.post("/subjectWork", function(req, res) {
    let data = req.body;
    console.log(data)
    dbConn.query("SELECT score_id,score_name,score_date FROM Score WHERE ?", data, function(error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

// Call Teacher in subject
app.post("/subject/people/teacher", function(req, res) {
    let data = req.body;
    let subject_id = data['subject_id'];
    console.log("ดึงอาจารย์ : " + subject_id);
    dbConn.query("SELECT Users.user_id,Users.user_name,Users.user_stdid FROM Classroom,Users WHERE Classroom.user_id=Users.user_id AND Classroom.subject_id = ? AND Classroom.user_type_id = 1", subject_id, function(error, results, fields) {
        if (error) throw error;
        if (results) {
            return res.send(results)
        } else {
            return res
                .status(400)
                .send({
                    error: true,
                    message: "The transmission was not found."
                })
        }
    })
})

// Call Student in subject
app.post("/subject/people/student", function(req, res) {
    let data = req.body;
    let subject_id = data['subject_id'];
    console.log("ดึงนักศึกษา : " + subject_id);
    dbConn.query("SELECT Users.user_id,Users.user_name,Users.user_stdid FROM Classroom,Users WHERE Classroom.user_id=Users.user_id AND Classroom.subject_id = ? AND Classroom.user_type_id = 2", subject_id, function(error, results, fields) {
        if (error) throw error;
        if (results) {
            return res.send(results)
        } else {
            return res
                .status(400)
                .send({
                    error: true,
                    message: "The transmission was not found."
                })
        }
    })
})

// Delete people in subject
app.post("/subject/people/delete", function(req, res) {
    let data = req.body;
    let subject_id = data['subject_id'];
    let user_id = data['user_id'];
    console.log(data)
    dbConn.query("DELETE FROM Classroom WHERE subject_id = ? AND user_id = ?", [subject_id, user_id], function(error, results, fields) {
        if (error) throw error;
        if (results) {
            return res.send(results)
        } else {
            return res
                .status(400)
                .send({
                    error: true,
                    message: "The transmission was not found."
                })
        }
    })
})

// Add people in subject
app.post("/subject/people/add/check", function(req, res) {
    let data = req.body;
    console.log(data)
    dbConn.query("SELECT * FROM Users WHERE ?", data, function(error, results, fields) {
        console.log(results)
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0])
        } else {
            res
                .status(400)
                .send({
                    error: true,
                    message: "The transmission was not found."
                })
        }
    })
})

// check type
app.post('/subject/score', function(req, res) {
    let data = req.body;
    let subject_id = data['subject_id'];
    let user_id = data['user_id'];
    dbConn.query('SELECT Score.score_id,Score.score_name,Score.create_at,Score_Student.score FROM Score,Score_Student WHERE Score.score_id=Score_Student.score_id AND Score.subject_id = ? AND Score_Student.user_id = ?', [subject_id, user_id], function(error, results, fields) {
        if (error) throw error;
        if (results) {
            console.log(results)
            return res.send(results)
        } else {
            return res.status(400).send({ error: true, message: "The transmission was not found." })
        }
    })
})

// Call data users
app.post("/call/student", function(req, res) {
    let data = req.body;
    dbConn.query('SELECT * FROM Users WHERE ?', data, function(error, results, fields) {
        if (error) throw error;
        if (results) {
            console.log(results)
            return res.send(results[0])
        } else {
            return res.status(400).send({ error: true, message: "The transmission was not found." })
        }
    })
})

// Save profile name
app.post('/profile/save', function(req, res) {
    let data = req.body;
    let user_name = data['user_name'];
    let user_id = data['user_id'];
    dbConn.query("UPDATE Users SET user_name = ? WHERE user_id = ?", [user_name, user_id], function(error, results, fields) {
        if (error) throw error;
        if (results) {
            return res.send(results);
        } else {
            return res.status(400).send({ error: true, message: "The transmission was not found." })
        }
    })
})

// check password
app.post('/profile/password/check', function(req, res) {
    let data = req.body;
    let user_id = data['user_id'];
    let password = data['user_pass'];
    console.log(user_id, password)
    if (!data) {
        return res.status(400).send({ error: true, message: 'Please provide กฟะฟ' });
    }
    dbConn.query('SELECT * FROM Users WHERE user_id = ? AND user_pass = ?', [user_id, password], function(error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            return res.send(results[0]);
        } else {
            return res.status(400).send({ error: true, message: 'Student id Not Found!!' });
        }
    });
})

// update password
app.post('/profile/password/update', function(req, res) {
    let data = req.body;
    let user_id = data['user_id'];
    let password = data['user_pass'];
    console.log(user_id, password)
    if (!data) {
        return res.status(400).send({ error: true, message: 'Please provide กฟะฟ' });
    }
    dbConn.query('UPDATE Users SET user_pass = ? WHERE user_id = ?', [password, user_id], function(error, results, fields) {
        if (error) throw error;
        return res.send(results)
    })
})




//set port
app.listen(4000, function() {
    console.log("Node app is running on port 4000");
});

module.exports = app;