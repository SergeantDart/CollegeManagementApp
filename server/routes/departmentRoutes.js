const Faculty = require("../models/Faculty");
const Professor = require("../models/Professor");
const Department = require("../models/Department");
const Course = require("../models/Course");
const Mark = require("../models/Mark")
const PresenceSheet = require("../models/PresenceSheet");
const Presence = require("../models/Presence");
const Exam = require("../models/Exam");


module.exports = function(app) {

    
    app.post("/api/addDepartment", (req, res) => {
        Department.create({
            departmentId: req.body.departmentId,
            departmentName: req.body.departmentName,
            departmentDescription: req.body.departmentDescription,
            facultyId: req.body.facultyId
        }).then(department => {
            res.json(department);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    });

    app.get("/api/getDepartments", (req, res) => {
        Department.findAll({include : [
            {
                model: Faculty
            }], offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(departments => {
            if(departments) {
                res.json(departments);
            }else {
                res.json({
                    message: "No departments found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });



    app.get("/api/getDepartment/:id", (req, res) => {
        Department.findByPk(req.params.id)
        .then(exam => {
            if(exam) {
                res.json(exam);
            }else {
                res.json({
                    message: "No department found"
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })

    app.post("/api/updateDepartment/:id", (req, res) => {
        Department.findByPk(req.params.id)
        .then(department => {
            if(department) {
                department.update(req.body)
                .then(department => {
                    res.json(department);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            } else {
                res.json({
                    message: "No department found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    })

    app.delete("/api/deleteDepartment/:id", (req, res) => {
        Professor.findAll({
            where: {
                departmentId: req.params.id
            }
        }).then(professors => {
            if(professors) {
                professors.map(professor => {
                    Course.findAll({
                        where: {
                            professorId: professor.professorId
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
                        professor.destroy()
                        .catch(error => {
                            console.log(error);
                        })
                    }).catch(error => {
                        console.log(error)
                    })
                });
            }
        }).then(() => {
            Department.findByPk(req.params.id)
            .then(department => {
                if(department) {
                    department.destroy()
                    .then(department => {
                        res.json(department)
                    })
                }else {
                    res.json({
                        message: "no department found"
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
        });
    })
                    

    app.get("/api/countDepartments", (req, res) => {
        Department.count()
        .then(departmentsCount => {
            res.json(departmentsCount);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })
}