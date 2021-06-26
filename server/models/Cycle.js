const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");

const Cycle = sequelize.define("Cycle", {
    cycleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    cycleDegree: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cycleDuration: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Cycle;