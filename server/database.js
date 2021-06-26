const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("college_management_system", "root", "Conditii101", {
    host: "localhost",
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
