const moment = require("moment");
const Course = require("../models/Course");
const StudyGroup = require("../models/StudyGroup");
const Professor = require("../models/Professor");
const Subject = require("../models/Subject");
const Exam = require("../models/Exam");
const Student = require("../models/Student");
const Mark = require("../models/Mark");
const PresenceSheet = require("../models/PresenceSheet");
const Presence = require("../models/Presence");

module.exports = function(app) {

    app.get("/api/getCourses", (req, res) => {
        Course.findAll({include: [
            {
                model: StudyGroup
            },
            {
                model: Professor
            },
            {
                model: Subject
            }
        ], offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(courses => {
            if(courses) {
                res.json(courses);
            }else {
                res.json({
                    message: "No courses found..."
                });
            }
        }).catch(error => {
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getCoursesByStudyGroup/:id", (req, res) => {
        Course.findAll({include: [
            {
                model: StudyGroup
            },
            {
                model: Professor
            },
            {
                model: Subject
            }
        ]})
        .then(courses => {
            if(courses) {
                courses = courses.filter(course => course.StudyGroup.studyGroupId == req.params.id);
                res.json(courses);
            }else {
                res.json({
                    message: "No courses found..."
                });
        }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getCoursesByProfessorEmail/:email", (req, res) => {
        Course.findAll({
            include: [
                {
                    model: StudyGroup
                },
                {
                    model: Professor
                },
                {
                    model: Subject
                }
            ]
        }).then(courses => {
            if(courses) {
                courses = courses.filter(course => course.Professor.professorEmail == req.params.email);
                res.json(courses);
            }else {
                res.json({
                    message: "no courses found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })

    app.get("/api/getCoursesByStudentEmail/:email", (req, res) => {
        Student.findOne({
            where: {
                studentEmail: req.params.email
            }
        }).then(student => {
            if(student) {
                Course.findAll({
                    include: [
                        {
                            model: StudyGroup
                        },
                        {
                            model: Professor
                        },
                        {
                            model: Subject
                        }
                    ]
                }).then(courses => {
                    if(courses) {
                        courses = courses.filter(course => course.studyGroupId == student.studyGroupId);
                        res.json(courses);
                    }else {
                        res.json({
                            message: "No courses found"
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            }else {
                res.json({
                    message: error.message
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.get("/api/getCoursesByProfessorId/:id", (req, res) => {
        Course.findAll({include: [
                {
                    model: StudyGroup
                },
                {
                    model: Professor
                },
                {
                    model: Subject
                }
        ]}).then(courses => {
            if(courses) {
                courses = courses.filter(course => course.Professor.professorId == req.params.id);
                res.json(courses);
            }else {
                res.json({
                    message: "No courses found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.get("/api/getCoursesByStudentId/:id", (req, res) => {
        Student.findByPk(req.params.id)
        .then(student => {
            if(student) {
                Course.findAll({include: [
                    {
                        model: StudyGroup
                    },
                    {
                        model: Professor
                    },
                    {
                        model: Subject
                    }
                ]}).then(courses => {
                    if(courses) {
                        courses = courses.filter(course => course.studyGroupId == student.studyGroupId);
                        res.json(courses);
                    }else {
                        res.json({
                            message: "No courses found"
                        })
                    }
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            } else {
                res.json({
                    message: "No student found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })

    app.get("/api/getCoursesBySubjectId/:id", (req, res) => {
        Course.findAll({include: [
            {
                model: Professor
            }
        ]}).then(courses => {
            if(courses) {
                courses = courses.filter(course => course.subjectId == req.params.id);
                res.json(courses);
            }else {
                res.json({
                    message: "No courses found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })
    

    app.get("/api/getCourse/:id", (req, res) => {
        Course.findByPk(req.params.id, {include: [
            {
                model: StudyGroup,
                required: true
            },
            {
                model: Professor,
                required: true
            },
            {
                model: Subject,
                required: true
            }
        ]}).then(course => {
            if(course) {
                res.json(course);
            }else {
                res.json({
                    message: "No course found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    });

    app.post("/api/updateCourse/:id", (req, res) => {
        Course.findByPk(req.params.id)
        .then(course => {
            if(course) {
                if(course.studyGroupId !== req.body.studyGroupId) {
                    Student.findAll({
                        where: {
                            studyGroupId: req.body.studyGroupId
                        }
                    }).then(students => {
                        if(students) {
                            students.map(student => {
                                Mark.create({
                                    studentId: student.studentId,
                                    courseId: course.courseId,
                                    studyYearId: student.studyYearId
                                }).catch(error => {
                                    console.log(error)
                                })
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                }
                course.update(req.body)
                .then(course => {
                    res.json(course);
                }).catch(error => {
                    res.json({
                        message: error.message
                    });
                })
            }else {
                res.json({
                    message: "No course was found..."
                });
            }  
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.delete("/api/deleteCourse/:id", (req, res) => {
        PresenceSheet.findAll({
            where: {
                courseId: req.params.id
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
                                    console.log(error);
                                })
                            });
                        }
                    })
                })
            }
        }).then(() => {
            Mark.findAll({
                where : {
                    courseId: req.params.id
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
            }).catch(error => {
                console.log(error);
            })
        }).then(() => {
            Exam.findAll({
                where: {
                    courseId: req.params.id
                }
            }).then(exams => {
                if(exams) {
                    exams.map(exam => {
                        exam.destroy()
                        .catch(error => {
                            console.log(error);
                        })
                    });
                }
            }).catch(error => {
                console.log(error);
            })
        }).then(() => {
            Course.findByPk(req.params.id)
            .then(course => {
                if(course) {
                    course.destroy()
                    .then(course => {
                        res.json(course);
                    })
                }else {
                    res.json({
                        message: "No course found..."
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })

    app.post("/api/addCourse", (req, res) => {
        Course.create({
            courseName: req.body.courseName,
            courseDescription: req.body.courseDescription,
            courseTime: moment(req.body.courseTime, "dddd HH:mm"),
            subjectId: req.body.subjectId,
            professorId: req.body.professorId,
            studyGroupId: req.body.studyGroupId
        }).then(course => {
            Student.findAll({
                where: {
                    studyGroupId: course.studyGroupId
                }
            }).then(students => {
                if(students) {
                    students.map(student => {
                        Mark.create({
                            studentId: student.studentId,
                            courseId: course.courseId,
                            studyYearId: student.studyYearId
                        })
                    });
                }
                res.json(course);
            }).catch(error => {
                console.log(error);
                res.json({
                    message: error.message
                }); 
            })
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })


    app.get("/api/countCourses", (req, res) => {
        Course.count()
        .then(coursesCount => {
            res.json(coursesCount);
        }).catch(error => res.json({
            message: error.message
        }))
    });

}