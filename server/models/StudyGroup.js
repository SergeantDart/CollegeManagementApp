const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Faculty = require("./Faculty");
const StudyYear = require("./StudyYear");

const StudyGroup = sequelize.define("StudyGroup", {
        studyGroupId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true   
        },
        studyGroupDescription: {
            type: DataTypes.STRING,
            allowNull: true
        },
        facultyId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        
        studyYearId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
});

StudyGroup.belongsTo(Faculty, {foreignKey: "facultyId"});
Faculty.hasMany(StudyGroup, {foreignKey: "facultyId"});

StudyGroup.belongsTo(StudyYear, {foreignKey: "studyYearId"});
StudyYear.hasMany(StudyGroup, {foreignKey: "studyYearId"});

module.exports = StudyGroup;