const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const User = require("../models/User");

const Document = sequelize.define("Document", {

    documentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    documentTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    documentDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    documentStoragePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});


Document.belongsTo(User, {foreignKey: "userId"});
User.hasMany(Document, {foreignKey: "userId"});

module.exports = Document;