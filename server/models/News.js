const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");


const News = sequelize.define("News", {
    newsId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    newsAuthorName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    newsTitle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    newsPicturePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    newsText: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = News;