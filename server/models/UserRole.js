const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");

const UserRole = sequelize.define("UserRole", {
    userRoleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    userRoleName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userRoleDescription: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = UserRole;