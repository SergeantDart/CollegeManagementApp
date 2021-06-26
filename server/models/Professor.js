const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const User = require("./User");
const Department = require("./Department");

const Professor = sequelize.define("Professor", {
    professorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    professorFirstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    professorLastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    professorDob: {
        type: DataTypes.DATE,
        allowNull: false
    },
    professorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    professorAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    professorPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    professorSalary: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    hooks: {
        beforeValidate: (professor) => {
            return new Promise((resolve, reject) => {
                User.findByPk(professor.userId)
                .then(user => {
                    if(!user && professor._options.isNewRecord) {
                        User.create({
                            userEmail: professor.professorEmail,
                            userPassword: "123456",
                            userRoleId: 2
                        }).then(user => {
                            professor.userId = user.userId;
                            resolve();
                        }).catch(error => {
                            reject(error);
                        });
                    }else if(professor.changed("professorEmail")) {
                        user.update({
                            userEmail: professor.professorEmail,
                            userToken: null
                        }).then(() => {
                            resolve();
                        }).catch(error => {
                            reject(error);
                        })
                    }else {
                        resolve();
                    }   
                });       
            });
        },
        beforeDestroy: (professor) => {
            return new Promise((resolve, reject) => {
                const aux = professor.userId;
                professor.update({
                    userId: null,
                    departmentId: null
                }).then(() => {
                    User.findOne({where: {userId: aux}})
                    .then(user => {
                        console.log(user);
                        if(user) {
                            user.destroy()
                            .then(() => {
                                resolve();
                            }).catch(error => {
                                reject(error);
                            });
                        }else {
                            reject(Error("user not found"));
                        }
                    }).catch(error => {
                        reject(error);
                })
            }).catch(error => {
                reject(error);
            })
        })
    }
}});

Professor.belongsTo(User, {foreignKey: "userId"});
User.hasOne(Professor, {foreignKey: "userId"});

Professor.belongsTo(Department, {foreignKey: "departmentId"});
Department.hasMany(Professor, {foreignKey: "departmentId"});

module.exports = Professor;