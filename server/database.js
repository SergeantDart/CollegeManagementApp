const {Sequelize} = require("sequelize");
//mysql://b863e53f76cacf:0ac90ebd@eu-cdbr-west-01.cleardb.com/heroku_568bdcec68cff9b?reconnect=true
const sequelize = new Sequelize("heroku_568bdcec68cff9b", "b863e53f76cacf", "0ac90ebd", {
    host: "eu-cdbr-west-01.cleardb.com",
    dialect: "mysql"
});

sequelize.authenticate()
.then(() => {
    console.log("Connected to the DB...");
})
.catch(error => console.log(error));

module.exports = {
    sequelize
};
