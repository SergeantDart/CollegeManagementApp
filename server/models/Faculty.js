const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Cycle = require("./Cycle");

const Faculty = sequelize.define("Faculty", {
    facultyId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    facultyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyAnualTuition: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cycleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});

Faculty.belongsTo(Cycle, {foreignKey: "cycleId"});
Cycle.hasMany(Faculty, {foreignKey: "cycleId"});

module.exports = Faculty;