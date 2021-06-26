const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Faculty = require("./Faculty");

const Department = sequelize.define("Department", {
    departmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    departmentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departmentDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});

Department.belongsTo(Faculty, {foreignKey: "facultyId"});
Faculty.hasMany(Department, {foreignKey: "facultyId"});

module.exports = Department;