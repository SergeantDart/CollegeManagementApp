const Course = require("../models/Course");
const Exam = require("../models/Exam");
const moment = require("moment");
const Professor = require("../models/Professor");
const Student = require("../models/Student");

module.exports = function(app) {;

    app.post("/api/addExam", (req, res) => {
        Exam.findOne({
            where: {
                courseId: req.body.courseId
            }
        }).then(exam => {
            if(!exam) {
                Exam.create({
                    examDescription: req.body.examDescription,
                    examDate: moment(req.body.examDate, "DD/MM/YYYY"),
                    examIsOnline: req.body.examIsOnline,
                    courseId: req.body.courseId
                }).then(exam => {
                    res.json(exam);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            }else {
                res.json({
                    message: "Exam already programmed"
                });
            }
        })  
    })

    app.get("/api/getExamByCourseId/:id", (req, res) => {
        Exam.findOne({
            where: {
                courseId: req.params.id
            }
        }).then(exam => {
            if(exam) {
                res.json(exam);
            }else {
                res.json({
                    message: "no exam found"
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })

    app.get("/api/getExam/:id", (req, res) => {
        Exam.findByPk(req.params.id, { 
            include: [
            {
                model: Course,
                required: true
            }    
        ]}).then(exam => {
            if(exam) {
                res.json(exam);
            } else {
                res.json({
                    message: "No exam found"
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    });

    app.get("/api/getExams", (req, res) => {
        Exam.findAll({include: [
            {
                model: Course
            }
        ], offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(exams => {
            if(exams) {
                res.json(exams);
            }else {
                res.json({
                    message: "No exams found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getFilteredExams", (req, res) => {
        Exam.findAll({include: [
            {
                model: Course
            }
        ],})
        .then(exams => {
            if(exams) {
                exams = exams.filter(exam => exam.Course.courseName.startsWith(req.query.keyword) || exam.Course.studyGroupId == parseInt(req.query.keyword));
                res.json(exams);
            }else {
                res.json({
                    message: "No exams found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });


    app.post("/api/updateExam/:id", (req, res) => {
        Exam.findByPk(req.params.id)
        .then(exam => {
            if(exam) {
                exam.update(req.body)
                .then(exam => {
                    res.json(exam);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            } else {
                res.json({
                    message: "No exam found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })

    app.delete("/api/deleteExam/:id", (req, res) => {
        Exam.findByPk(req.params.id)
        .then(exam => {
            if(exam) {
                exam.destroy()
                .then(exam => {
                    res.json(exam);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    })
                })
            } else {
                res.json({
                    message: "No exam found"
                })
            }
        })
    })

    app.get("/api/getExamsByProfessorEmail/:professorEmail", (req, res) => {
        Exam.findAll({
            include: [
                {
                model: Course,
                include: [Professor]
                }
            ]
        }).then(exams => {
            if(exams) {
                exams = exams.filter(exam => exam.Course.Professor.professorEmail == req.params.professorEmail)
                res.json(exams);
            }else {
                res.json({
                    message: "No exams found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.get("/api/getExamsByStudentEmail/:studentEmail", (req, res) => {
        Student.findOne({
            where: {
                studentEmail: req.params.studentEmail
            }
        }).then(student => {
            if(student) {
                Exam.findAll({
                    include: [
                        {
                            model: Course
                        }
                    ]
                }).then(exams => {
                    if(exams) {
                        exams = exams.filter(exam => exam.Course.studyGroupId == student.studyGroupId);
                        res.json(exams);
                    } else {
                        res.json({
                            message: "No exams found"
                        });
                    }
                }).catch(error => {
                    console.log(error);
                })
            }else {
                res.json({
                    message: "No exams found"
                }); 
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })      
    })

    app.get("/api/countExams", (req, res) => {
        Exam.count()
        .then(examsCount => {
            res.json(examsCount);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })
}