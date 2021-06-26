const auth = require("../middleware/auth");
const {sequelize} = require("../database");
const PresenceSheet = require("../models/PresenceSheet");
const Presence = require("../models/Presence");
const moment = require("moment");
const Course = require("../models/Course");
const Student = require("../models/Student");

module.exports = function(app) {

    app.post("/api/addPresenceSheet", (req, res) => {
        let studentPresences = [];
        PresenceSheet.create({
            courseId: req.body.courseId,
            presenceSheetDate: moment(req.body.presenceSheetDate, "DD/MM/YYYY"),
            presenceSheetRemarks: req.body.presenceSheetRemarks
        }).then(presenceSheet => {
            Course.findOne({where: {courseId: presenceSheet.courseId}
            }).then(course => {
                console.log(course);
                Student.findAll({where: {studyGroupId: course.studyGroupId}})
                .then(students => {
                    if(students) {
                        students.map(student => {
                            Presence.create({
                                presenceSheetId: presenceSheet.presenceSheetId,
                                studentId: student.studentId
                            }).then(presence => {
                                studentPresences.push(presence);
                            })
                        });
                    }
                })
            })
            res.json(presenceSheet);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        });
    })

    app.post("/api/updatePresence/:presenceId", (req, res) => {
        Presence.findOne({where: {presenceId: req.params.presenceId}})
        .then(presence => {
            if(presence) {
                presence.update(req.body)
                .then(presence => {
                    res.json(presence);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            }else {
                res.json({
                    message: "No student found"
                })
            }
        }).catch(error => {
            console.log(error)
            res.json({
                message: error.message
            });
        })
    })


    app.get("/api/getPresencesByPresenceSheet/:id", (req, res) => {
        Presence.findAll({
            where: {
                presenceSheetId: req.params.id
            }, 
            include: [
            {
                model: Student,
                required: true
            }           
        ]}).then(presences => {
            if(presences) {
                res.json(presences)
            }else {
                res.json({
                    message: "No presence found"
                });
            }
        }).catch(error => {
            res.json({
                message: error.message
            });
        })
    })

    app.get("/api/getStudentPresencesByCourseId", (req, res) => {
        Presence.findAll({
            include: [
                {
                    model: PresenceSheet
                }
            ]
        }).then(presences => {
            if(presences) {
                presences = presences.filter(presence => presence.studentId == req.query.studentId && presence.PresenceSheet.courseId == req.query.courseId);
                res.json(presences);
            }else {
                res.json({
                    message: "No presence found"
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.get("/api/getPresenceSheetsByCourseId/:id", (req, res) => {
        PresenceSheet.findAll({
            where: {
                courseId: req.params.id
            }
        }).then(presenceSheets => {
            if(presenceSheets) {
                res.json(presenceSheets);
            }else {
                res.json([])
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })

    app.delete("/api/deletePresenceSheet/:id", (req, res) => {
        Presence.find({where : {
            presenceSheetId: req.params.id
        }}).then(presences => {
            if(presences) {
                presences.map(presence => {
                    presence.destroy()
                });
                PresenceSheet.findByPk(req.params.id)
                .then(presenceSheet => {
                    presenceSheet.destroy()
                    .then(presenceSheet => {
                        res.json(presenceSheet);
                    }).catch(error => {
                        console.log(error);
                        res.json({
                            message: error.message
                        })
                    })
                })
            }else {
                res.json({
                    message: "No presences found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })
}
    

