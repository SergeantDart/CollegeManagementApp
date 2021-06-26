const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");

const StudyYear = sequelize.define("StudyYear", {
    studyYearId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    studyYearOrder: {
        type: DataTypes.STRING,
        allowNull: false
    },
    studyYearDescription: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = StudyYear;