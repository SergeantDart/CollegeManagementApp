const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Professor = require("./Professor");
const Subject = require("./Subject");
const StudyGroup = require("./StudyGroup");


const Course = sequelize.define("Course", {
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    courseTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    courseDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    studyGroupId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    professorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});


Course.belongsTo(StudyGroup, {foreignKey: "studyGroupId"});
StudyGroup.hasMany(Course, {foreignKey: "studyGroupId"});

Course.belongsTo(Professor, {foreignKey: "professorId"});
Professor.hasMany(Course, {foreignKey: "professorId"});

Course.belongsTo(Subject, {foreignKey: "subjectId"});
Subject.hasMany(Course, {foreignKey: "subjectId"});


module.exports = Course;