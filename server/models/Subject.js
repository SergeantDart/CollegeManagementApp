const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");

const Subject = sequelize.define("Subject", {
    subjectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    subjectName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subjectTheoryMarks: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subjectPracticalMarks: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subjectIsOptional: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    subjectCreditScore: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subjectDescription: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Subject;