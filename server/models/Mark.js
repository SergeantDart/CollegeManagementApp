const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Student = require("./Student");
const Course = require("./Course");
const StudyYear = require("./StudyYear");

const Mark = sequelize.define("Mark", {
    markId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    theoryMarkScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    practicalMarkScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    isGraded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    studyYearId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

Mark.belongsTo(Student, {foreignKey: "studentId"}); 
Student.hasMany(Mark, {foreignKey: "studentId"});

Mark.belongsTo(Course, {foreignKey: "courseId"});
Course.hasMany(Mark, {foreignKey: "courseId"});

Mark.belongsTo(StudyYear, {foreignKey: "studyYearId"});
StudyYear.hasMany(Mark, {foreignKey: "studyYearId"});


module.exports = Mark;