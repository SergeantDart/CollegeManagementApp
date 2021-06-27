const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Faculty = require("./Faculty");
const User = require("./User");
const StudyYear = require("./StudyYear");
const StudyGroup = require("./StudyGroup");


const Student = sequelize.define("Student", {
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true   
        },
        studentFirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        studentLastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        studentDob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        studentEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        studentAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        studentPhone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        studentIsTaxed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        studyGroupId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            defaultValue: null
        },
        facultyId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        studyYearId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        }
    }, {
    hooks: {
        beforeValidate: (student) => {
            return new Promise((resolve, reject) => {
                User.findByPk(student.userId)
                .then(user => {
                    if(!user && student._options.isNewRecord) {
                        User.create({
                            userEmail: student.studentEmail,
                            userPassword: "123456",
                            userRoleId: 3
                        }).then(user => {
                            student.userId = user.userId;
                            resolve();
                        }).catch(error => {
                            reject(error);
                        });
                    }else if(student.changed("studentEmail")) {
                        user.update({
                            userEmail: student.studentEmail,
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
        beforeDestroy: (student) => {
            return new Promise((resolve, reject) => {
                const aux = student.userId;
                student.update({
                    userId: null,
                    studyYearId: null,
                    facultyId: null
                }).then(() => {
                    console.log(aux);
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

Student.belongsTo(StudyYear, {foreignKey: "studyYearId"});
StudyYear.hasMany(Student, {foreignKey: "studyYearId"});

Student.belongsTo(Faculty, {foreignKey: "facultyId"});
Faculty.hasMany(Student, {foreignKey: "facultyId"});

Student.belongsTo(User, {foreignKey: "userId"});
User.hasOne(Student, {foreignKey: "userId"});

Student.belongsTo(StudyGroup, {foreignKey: "studyGroupId"});
StudyGroup.hasMany(Student, {foreignKey: "studyGroupId"});

module.exports = Student;