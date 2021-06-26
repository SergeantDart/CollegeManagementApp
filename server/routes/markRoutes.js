const Course = require("../models/Course");
const Mark = require("../models/Mark");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

module.exports = function(app) {

    app.get("/api/getMarks/:id", (req, res) => {
        Mark.findAll({ 
            include: [
            {
                model: Student,
                required: true
            }    
        ]}).then(marks => {
            if(marks) {
                marks = marks.filter(mark => mark.courseId == req.params.id);
                res.json(marks);
            } else {
                res.json({
                    message: "No marks found"
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    });

    app.post("/api/addMark", (req, res) => {
        Mark.create({
            studentId: req.body.studentId,
            courseId: req.body.courseId,
            studyYearId: req.body.studyYearId
        }).then(mark => {
            res.json(mark);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.get("/api/getStudentMarksByStudyYear", (req, res) => {
        Mark.findAll({
            include: [
                {
                    model: Course,
                    include: [Subject]
                }
            ]
        }).then(marks => {
            if(marks) {
                marks = marks.filter(mark => mark.studentId == req.query.studentId && mark.studyYearId == req.query.studyYearId);
                marks.map(mark => {
                    Subject.findByPk(mark.Course.subjectId)
                    .then(subject => {
                        mark.Subject = subject;
                    }).catch(error => {
                        console.log(error);
                        res.json({
                            message: error.message
                        })
                    })
                })
                res.json(marks);
            }else {
                res.json({
                    message: "No mark found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json(error);
        })
    })

    app.post("/api/updateMark/:id", (req, res) => {
        Mark.findByPk(req.params.id)
        .then(mark => {
            if(mark) {
                mark.update(req.body)
                .catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            } else {
                res.json({
                    message: "No mark found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })
}