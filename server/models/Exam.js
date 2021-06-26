const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Course = require("./Course");

const Exam = sequelize.define("Exam", {
    examId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    examDescription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    examDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    examIsOnline: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    }
});

Exam.belongsTo(Course, {foreignKey: "courseId"});
Course.hasOne(Exam, {foreignKey: "courseId"});

module.exports = Exam;
