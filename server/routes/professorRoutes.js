const auth = require("../middleware/auth");
const {sequelize} = require("../database");
const moment = require("moment");
const Professor = require("../models/Professor");
const Department = require("../models/Department");
const Course = require("../models/Course");
const Mark = require("../models/Mark")
const PresenceSheet = require("../models/PresenceSheet");
const Presence = require("../models/Presence");
const Exam = require("../models/Exam");

module.exports = function(app) {

    app.get("/api/getProfessors", (req, res) => {
        Professor.findAll({include: [
            {
                model: Department
            }], offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(professors => {
            if(professors) {
                res.json(professors);
            }else {
                res.json({
                    message: "No professors found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getFilteredProfessors", (req, res) => {
        Professor.findAll({include: [
            {
                model: Department
            }]
        }).then(professors => {
            if(professors) {
                professors = professors.filter(professor => professor.professorFirstName.startsWith(req.query.keyword) || professor.professorLastName.startsWith(req.query.keyword));
                res.json(professors);
            }else {
                res.json({
                    message: "No professors found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getProfessorsByDepartmentId/:id", (req, res) => {
        Professor.findAll({
            where: {
                departmentId: req.params.id
            }
        }).then(professors => {
            if(professors) {
                res.json(professors);
            }else {
                res.json({
                    message: "No professors found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.post("/api/addProfessor", (req, res) => {
        Professor.create({
            professorFirstName: req.body.professorFirstName,
            professorLastName: req.body.professorLastName,
            professorEmail: req.body.professorEmail,
            professorDob: moment(req.body.professorDob, "DD/MM/YYYY"),
            professorAddress: req.body.professorAddress,
            professorPhone: req.body.professorPhone,
            professorSalary: req.body.professorSalary,
            userId: null,
            departmentId: req.body.departmentId
        }).then(professor => {
            res.json(professor);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    });

    app.get("/api/getProfessor/:id", (req, res) => {
        Professor.findOne({where: {professorId: req.params.id}}, {include : [
            {
                model: Department
            }]})
            .then(professor => {
            if(professor) {
                res.json(professor);
            }else {
                res.json({
                    message: "No professor found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getProfessorByEmail/:email", (req, res) => {
        Professor.findOne({
            where: {
                professorEmail: req.params.email
            }
        }).then(professor => {
            if(professor) {
                res.json(professor);
            }else {
                res.json({
                    message: "No professor found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        });
    })
    app.post("/api/updateProfessor/:id", (req, res) => {
        Professor.findByPk(req.params.id)
        .then(professor => {
            if(professor) {
                professor.update(req.body)
                .then(professor => {
                    res.json(professor);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            }    
        }).catch(error => {
            console.log(error);
            res.status(400).json({
                message: error.message
            });
        })
    });

    app.delete("/api/deleteProfessor/:id", (req, res) => {
        //delete professor courses
        Course.findAll({
            where: {
                professorId: req.params.id
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
            Professor.findByPk(req.params.id)
            .then(professor => {
                if(professor) {
                    professor.destroy()
                    .then(professor => {
                        res.json(professor);
                    }).catch(error => {
                        console.log(error);
                    })
                }else {
                    res.json({
                        message: "No professor found"
                    })
                }
            })
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    });
    app.get("/api/countProfessors", (req, res) => {
        Professor.count()
        .then(professorsCount => res.json(professorsCount))
        .catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        });
    });
}