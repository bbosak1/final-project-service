// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/students");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Model
var Student = mongoose.model('Student', {
    name: String,
    phoneNo: String,
    emailAddr: String,
});


// Get all students
app.get('/api/students', function (req, res) {

    console.log("Listing students...");

    //use mongoose to get all students in the database
    Student.find(function (err, students) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(students); // return all students in JSON format
    });
});

// Create a student
app.post('/api/students', function (req, res) {

    console.log("Creating student...");

    Student.create({
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        emailAddr: req.body.emailAddr,
        done: false
    }, function (err, student) {
        if (err) {
            res.send(err);
        }

        // create and return students
        Student.find(function (err, students) {
            if (err)
                res.send(err);
            res.json(students);
        });
    });

});

// Update a student
app.put('/api/students/:id', function (req, res) {
    const student = {
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        emailAddr: req.body.emailAddr,
    };
    console.log("Updating item - ", req.params.id);
    Student.update({_id: req.params.id}, student, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});


// Delete a student
app.delete('/api/students/:id', function (req, res) {
    Student.remove({
        _id: req.params.id
    }, function (err, student) {
        if (err) {
            console.error("Error deleting student ", err);
        }
        else {
            Student.find(function (err, students) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(students);
                }
            });
        }
    });
});


// Start app and listen on port 8080
app.listen(process.env.PORT || 8080);
console.log("Student server listening on port  - ", (process.env.PORT || 8080));