const auth = require("../middleware/auth");
const {sequelize} = require("../database");
const StudyYear = require("../models/StudyYear");


module.exports = function(app) {

    app.get("/api/getStudyYears", (req, res) => {
        StudyYear.findAll()
        .then(studyYears => {
            if(studyYears) {
                res.json(studyYears)
            }else {
                res.json({
                    message: "No study years found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                error: error.message
            });
        })
    });

}