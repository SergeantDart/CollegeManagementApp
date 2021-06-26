const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const PresenceSheet = require("./PresenceSheet");
const Student = require("./Student");

const Presence = sequelize.define("Presence", {
    
    presenceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    presenceSheetId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    presenceStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
    }
});

Presence.belongsTo(Student, {foreignKey: "studentId"});
Student.hasMany(Presence, {foreignKey: "studentId"});

Presence.belongsTo(PresenceSheet, {foreignKey: "presenceSheetId"});
PresenceSheet.hasMany(Presence, {foreignKey: "presenceSheetId"});

module.exports = Presence;