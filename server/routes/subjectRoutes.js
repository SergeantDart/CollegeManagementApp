const Subject = require("../models/Subject");
const Course = require("../models/Course");
const Exam =require("../models/Exam");
const Mark = require("../models/Mark");
const PresenceSheet = require("../models/PresenceSheet");
const Presence = require("../models/Presence");

module.exports = function(app) {

    app.post("/api/addSubject", (req, res) => {
        Subject.create({
            subjectName: req.body.subjectName,
            subjectTheoryMarks: req.body.subjectTheoryMarks,
            subjectPracticalMarks: req.body.subjectPracticalMarks,
            subjectIsOptional: req.body.subjectIsOptional,
            subjectCreditScore: req.body.subjectCreditScore,
            subjectDescription: req.body.subjectDescription
        }).then(subject => {
            res.json(subject);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getSubjects", (req, res) => {
        Subject.findAll({offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(subjects => {
            if(subjects) {
                res.json(subjects);
            }else {
                res.json({
                    message: "No subjects found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getFilteredSubjects", (req, res) => {
        Subject.findAll()
        .then(subjects => {
            if(subjects) {
                subjects = subjects.filter(subject => subject.subjectName.startsWith(req.query.keyword));
                res.json(subjects);
            }else {
                res.json({
                    message: "No subjects found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });


    app.get("/api/getSubject/:id", (req, res) => {
        Subject.findByPk(req.params.id)
        .then(subject => {
            if(subject) {
                res.json(subject);
            }else {
                res.json({
                    message: "No subject found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getSubjectByExamId/:examId", (req, res) => {
        Exam.findByPk(req.params.examId, {
            include: [
                {
                    model: Course
                }
            ]}).then(exam => {
            if(exam) {
                Course.findByPk(exam.courseId, {
                    include: [
                        {
                            model: Subject
                        }
                    ]}).then(course => {
                    if(course) {
                        res.json(course.Subject);
                    }else {
                        res.json({
                            message: "No course found..."
                        });
                    }
                })
            }else {
                res.json({
                    message: "No exam found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.post("/api/updateSubject/:id", (req, res) => {
        Subject.findByPk(req.params.id)
        .then(subject => {
            if(subject) {
                subject.update(req.body)
                .then(subject => {
                    res.json(subject);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            }else {
                res.json({
                    message: "No subject found"
                })
            }    
        }).catch(error => {
            console.log(error);
            res.status(400).json({
                message: error.message
            });
        })
    });

    app.delete("/api/deleteSubject/:id", (req, res) => {
        Course.findAll({
            where: {
                subjectId: req.params.id
            }
        }).then(courses => {
            if(courses) {
                courses.map(course => {
                    PresenceSheet.findAll({
                        where: {
                            courseId: course.courseId
                        }
                    }).then(presenceSheets => {
                        if(presenceSheets) {
                            presenceSheets.map(presenceSheet => {
                                Presence.findAll({
                                    where: {
                                        presenceSheetId: presenceSheet.presenceSheetId
                                    }
                                }).then(presences => {
                                    if(presences) {
                                        presences.map(presence => {
                                            presence.destroy()
                                            .catch(error => {
                                                console.log(error)
                                            })
                                        });
                                    }
                                }).catch(error => {
                                    console.log(error);
                                })
                            });
                        }  
                    }).then(() => {
                        Mark.findAll({
                            where: {
                                courseId: course.courseId
                            }
                        }).then(marks => {
                            if(marks) {
                                marks.map(mark => {
                                    mark.destroy()
                                    .catch(error => {
                                        console.log(error);
                                    })
                                });
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    }).then(() => {
                        Exam.findOne({
                            where: {
                                courseId: course.courseId
                            }
                        }).then(exam => {
                            if(exam) {
                                exam.destroy()
                                .catch(error => {
                                    console.log(error);
                                })
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                    }).then(() => {
                        course.destroy()
                        .catch(error => {
                            console.log(error);
                        })
                    }).catch(error => {
                        console.log(error);
                    })
                });
            }
        }).then(() => {
            Subject.findByPk(req.params.id)
            .then(subject => {
                if(subject) {
                    subject.destroy()
                    .then(subject => {
                        res.json(subject);
                    }).catch(error => {
                        res.json({
                            message: error.message
                        })
                    })
                }else {
                    res.json({
                        message: "No subject found"
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })       

    app.get("/api/countSubjects", (req, res) => {
        Subject.count()
        .then(subjectsCount => res.json(subjectsCount))
        .catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        });
    });


}