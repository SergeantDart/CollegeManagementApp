const StudyYear = require("../models/StudyYear");
const StudyGroup = require("../models/StudyGroup");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Exam = require("../models/Exam");
const PresenceSheet = require("../models/PresenceSheet");
const Mark = require("../models/Mark");
const Presence = require("../models/Presence");

module.exports = function(app) {


    app.post("/api/addStudyGroup", (req, res) => {
        StudyGroup.create({
            studyGroupId: req.body.studyGroupId,
            studyGroupDescription: req.body.studyGroupDescription,
            facultyId: req.body.facultyId,
            studyYearId: req.body.studyYearId
        }).then(studyGroup => {
            res.json(studyGroup);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.post("/api/updateStudyGroup/:id", (req, res) => {
        StudyGroup.findByPk(req.params.id)
        .then(studyGroup => {
            if(studyGroup) {
                if(studyGroup.studyYearId != req.body.studyYearId) {
                    Student.findAll({
                        where: {
                            studyGroupId: req.params.id
                        }
                    }).then(students => {
                        if(students) {
                            students.map(student => {
                                student.update({
                                    studyYearId: req.body.studyYearId
                                }).catch(error => {
                                    console.log(error);
                                })
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                }
                studyGroup.update(req.body)
                .then(studyGroup => {
                    res.json(studyGroup);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            }    
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getStudyGroups", (req, res) => {
        StudyGroup.findAll({include: [
            {
                model: Faculty
            },
            {
                model: StudyYear
            }], offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(studyGroups => {
            if(studyGroups) {
                res.json(studyGroups)
            }else {
                res.json({
                    message: "No study groups found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                error: error.message
            });
        })
    });

    app.get("/api/getFilteredStudyGroups", (req, res) => {
        StudyGroup.findAll({include: [
            {
                model: Faculty
            },
            {
                model: StudyYear
            }]
        }).then(studyGroups => {
            if(studyGroups) {
                studyGroups = studyGroups.filter(studyGroup => studyGroup.studyGroupId == parseInt(req.query.keyword) || studyGroup.Faculty.facultyName.startsWith(req.query.keyword));
                res.json(studyGroups);
            }else {
                res.json({
                    message: "No study groups found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getStudyGroup/:id", (req, res) => {
        StudyGroup.findOne({where: {studyGroupId: req.params.id}}, {include : [
            {
                model: Faculty
            },
            {
                model: StudyYear
            }
        ]})
        .then(studyGroup => {
            if(studyGroup) {
                res.json(studyGroup);
            }else {
                res.json({
                    message: "No study group found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                errror: error.message
            });
        })
    });

    app.get("/api/countStudyGroups", (req, res) => {
        StudyGroup.count()
        .then(studyGroupsCount => {
            res.json(studyGroupsCount)
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        });
    });

    app.delete("/api/deleteStudyGroup/:id", (req, res) => {

        //destroy course
        Course.findAll({
            where: {
                studyGroupId: req.params.id
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
                })
            }
        }).then(() => {
            Student.findAll({
                where: {
                    studyGroupId: req.params.id
                }
            }).then(students => {
                if(students) {
                    students.map(student => {
                        student.destroy()
                        .catch(error => {
                            console.log(error);
                        })
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        }).then(() => {
            StudyGroup.findByPk(req.params.id)
            .then(studyGroup => {
                if(studyGroup) {
                    studyGroup.destroy()
                    .then(studyGroup => {
                        res.json(studyGroup)
                    }).catch(error => {
                        console.log(error);
                    })
                }else {
                    res.json({
                        message: "no study group found"
                    });
                }
            }).catch(error => {
                console.log(error)
            })
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        });

        //destroy students
        Student.findAll({where: {studyGroupId: req.params.id}
        }).then(students => {
            if(students) {
                students.map(student => {
                    student.destroy()
                    .catch(error => {
                        console.log(error);
                    });
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        });
        
        //destroy study group
        StudyGroup.findByPk(req.params.id)
        .then(studyGroup => {
            if(studyGroup) {
                studyGroup.destroy()
                .then(response => {
                    res.json(response);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            } else {
                res.json({
                    message: "No study group found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })


    app.get("/api/getLastStudyGroupId", (req, res) => {
        StudyGroup.max("studyGroupId")
        .then(studyGroupId => {
              if(studyGroupId) {
                  res.json(studyGroupId);
              }else {
                  res.json(1)
              }
          }).catch(error => {
              console.log(error);
              res.json({
                  message: error.message
              });
          })
    });

    app.get("/api/getStudyGroupsMatched", (req, res) => {
        Student.findOne({where: {studentId: parseInt(req.query.studentId)}})
        .then(student => {
            if(student) {
                StudyGroup.findAll({include : [
                    {
                        model: Faculty
                    },
                    {
                        model: StudyYear
                    }
                ]}, {where: {facultyId: student.facultyId, studyYearId: student.studyYearId}}).then(studyGroups => {
                    if(studyGroups) {
                        res.json(studyGroups)
                    }else {
                        res.json({
                            message: "No study groups found..."
                        })
                    }
                }).catch(error => {
                    console.log(error);
                    res.json({
                        error: error.message
                    });
                })
            }else {
                res.json({
                    message: "No student found..."
                })
            }
        })
        
    });
}