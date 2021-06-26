const auth = require("../middleware/auth");
const {sequelize} = require("../database");
const Faculty = require("../models/Faculty");

module.exports = function(app) {

    app.get("/api/getFaculties", (req, res) => {
        Faculty.findAll()
        .then(faculties => {
            res.json(faculties);
        }).catch(error => {
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/countFaculties", (req, res) => {
        Faculty.count()
        .then(facultiesCount => {
            res.json(facultiesCount);
        }).catch(error => res.json({
            message: error.message
        }))
    });

}