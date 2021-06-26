const moment = require("moment");
const Student = require("../models/Student");
const StudyYear = require("../models/StudyYear");
const Faculty = require("../models/Faculty");
const StudyGroup = require("../models/StudyGroup");
const Course = require("../models/Course");
const Mark = require("../models/Mark");
const Presence = require("../models/Presence");

module.exports = function(app) {

    app.get("/api/getStudents", (req, res) => {
        Student.findAll({include: [
            {
                model: StudyYear
            },
            {
                model: Faculty
            }], offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(students => {
            if(students) {
                res.json(students);
            }else {
                res.json({
                    message: "No students found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getStudentByEmail/:email", (req, res) => {
        Student.findOne({
            where: {
                studentEmail: req.params.email
            }
        }).then(student => {
            if(student) {
                res.json(student);
            }else {
                res.json({
                    message: "No students found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.get("/api/getStudentsByStudyGroup/:id", (req, res) => {
        Student.findAll({where: {studyGroupId: req.params.id}})
        .then(students => {
            if(students) {
                res.json(students);
            }else {
                res.json({
                    message: "No students found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        });
    });

    app.post("/api/addStudent", (req, res) => {
        Student.create({
            studentFirstName: req.body.studentFirstName,
            studentLastName: req.body.studentLastName,
            studentEmail: req.body.studentEmail,
            studentDob: moment(req.body.studentDob, "DD/MM/YYYY"),
            studentAddress: req.body.studentAddress,
            studentPhone: req.body.studentPhone,
            studentIsTaxed: req.body.studentIsTaxed,
            studyGroupId: req.body.studyGroupId,
            userId: null,
            studyYearId: req.body.studyYearId,
            facultyId: req.body.facultyId
        }).then(student => {
            Course.findAll({
                where: {
                    studyGroupId: student.studyGroupId
                }
            }).then(courses => {
                if(courses) {
                    courses.map(course => {
                        Mark.create({
                            studentId: student.studentId,
                            courseId: course.courseId,
                            studyYearId: student.studyYearId
                        }).catch(error => {
                            console.log(error);
                            res.json({
                                message: error.message
                            })
                        }).catch(error => {
                            console.log(error);
                            res.json({
                                message: error.message
                            })
                        })
                    })
                }else {
                    res.json({
                        message: "No courses found"
                    })
                }
            }).then(() => {
                res.json(student);
            }).catch(error => {
                console.log(error);
                res.json({
                    message: error.message
                });
            })
        }).catch(error => {
            res.json({
                message: error.message
            })
        });
    });


    app.get("/api/getStudent/:id", (req, res) => {
        Student.findOne({where: {studentId: req.params.id}}, {include : [
            {
                model: Faculty
            },
            {
                model: StudyGroup
            },
            {
                model: StudyYear
            }
        ]}).then(student => {
            if(student) {
                res.json(student);
            }else {
                res.json({
                    message: "No student found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.post("/api/updateStudent/:id", (req, res) => {
        Student.findByPk(req.params.id)
        .then(student => {
            if(student) {
                if(req.body.studyGroupId != student.studyGroupId) {
                    Course.findAll({
                        where: {
                            studyGroupId: student.studyGroupId
                        }
                    }).then(courses => {
                        if(courses) {
                            courses.map(course => {
                                Mark.findOne({
                                    where: {
                                        studentId: student.studentId,
                                        courseId: course.courseId
                                    }
                                }).then(mark => {
                                    if(mark) {
                                        mark.destroy()
                                        .catch(error => {
                                            console.log(error);
                                            res.json({
                                                message: error.message
                                            })
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
                    }).then(() => {
                        Course.findAll({
                            where: {
                                studyGroupId: req.body.studyGroupId
                            }
                        }).then(courses => {
                            if(courses) {
                                courses.map(course => {
                                    Mark.create({
                                        courseId: course.courseId,
                                        studentId: student.studentId,
                                        studyYearId: req.body.studyYearid || student.studyYearId
                                    }).catch(error => {
                                        console.log(error);
                                        res.json({
                                            message: error.message
                                        })
                                    })
                                })
                            }
                        }).catch(error => {
                            console.log(error);
                            res.json({
                                message: error.message
                            })
                        })
                    }).then(() => {
                        student.update(req.body)
                        .then(student => {
                            res.json(student);
                        }).catch(error => {
                            console.log(error);
                            res.json({
                                message: error.message
                            })
                        })
                    }).catch(error => {
                        console.log(error);
                        res.json({
                            message: error.message
                        });
                    })
                } 
            }else {
                res.json({
                    message: "No student was found..."
                });
            }    
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.delete("/api/deleteStudent/:id", (req, res) => {
        Presence.findAll({
            where: {
                studentId: req.params.id
            }
        }).then(presences => {
            if(presences) {
                presences.map(presence => {
                    presence.destroy()
                    .catch(error => {
                        console.log(error);
                    })
                })
            }
        }).then(() => {
            Mark.findAll({
                where: {
                    studentId: req.params.id
                }
            }).then(marks => {
                if(marks) {
                    marks.map(mark => {
                        mark.destroy()
                        .catch(error => {
                            console.log(error);
                        })
                    })
                }
            })
        }).then(() => {
            Student.findByPk(req.params.id)
            .then(student => {
                if(student) {
                    student.destroy()
                    .then(student => {
                        res.json(student);
                    })
                }else {
                    res.json({
                        message: "No student found..."
                    })
                }
            }).catch(error => {
                console.log(error);
                res.json({
                    message: error.message
                })
            })
        })
    });

    app.get("/api/countStudents", (req, res) => {
        Student.count()
        .then(studentsCount => res.json(studentsCount))
        .catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        });
    })
}
