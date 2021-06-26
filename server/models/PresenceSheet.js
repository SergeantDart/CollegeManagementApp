const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Course = require("./Course");

const PresenceSheet = sequelize.define("PresenceSheet", {
    
    presenceSheetId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    presenceSheetDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    presenceSheetRemarks: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

PresenceSheet.belongsTo(Course, {foreignKey: "courseId"});
Course.hasMany(PresenceSheet, {foreignKey: "courseId"});

module.exports = PresenceSheet;