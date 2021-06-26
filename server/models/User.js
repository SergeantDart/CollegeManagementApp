const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRole = require("./UserRole");

const SALT_NO = 10;
const SECRET = "asdasdnuasnd128en8nasd";

const User = sequelize.define("User", {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true   
        },
        userEmail: {
            type: DataTypes.STRING,
            unique: true
        },
        userPassword: {
            type: DataTypes.STRING,
        },
        userRoleId: {
            type: DataTypes.INTEGER,
            references: {
                model: UserRole,
                key: "userRoleId"
            }
        },
        userToken: {
            type: DataTypes.STRING
        }
    }, {
    hooks: {
        beforeCreate: (user) => {
            return new Promise((resolve, reject) => {
                bcrypt.genSalt(SALT_NO, (error, salt) =>{
                    if(error) {
                        reject(error);
                    }else {
                        bcrypt.hash(user.userPassword, salt, (error, hashedPassword) => {
                            if(error) {
                                reject(error);
                            }else {
                                user.userPassword = hashedPassword;
                                resolve();
                            }
                        });
                    }
                });
            });  
        },
        beforeUpdate: (user) => {
            return new Promise((resolve, reject) => {
                if (user.changed("userPassword")) {
                    bcrypt.genSalt(SALT_NO, (error, salt) =>{
                        if(error) {
                            console.log(error);
                            reject(error);
                        }else {
                            bcrypt.hash(user.userPassword, salt, (error, hashedPassword) => {
                                if(error) {
                                    console.log(error);
                                    reject(error);
                                }else {
                                    user.userPassword = hashedPassword;
                                    resolve();
                                }
                            });
                        }
                    });
                } else {
                    resolve();
                }
                
            });
        },
        beforeDestroy: (user) => {
            return new Promise((resolve, reject) => {
                user.update({
                    userRoleId: null
                }).then(() => {
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            });
        }
    }
});

//*********using ES5 style functions to keep track of the ~~THIS~~ scope************//

User.prototype.comparePasswords = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.userPassword, (error, isMatch) => {
        if(error) {
            callback(error, null);
        }else {
            callback(null, isMatch);
        }
    });
}

User.prototype.generateToken = async function(callback) {
    var token = jwt.sign(this.userId, SECRET);
    this.userToken = token;
    await this.save()
    .then(response =>
        callback(null, response))
    .catch(error =>
        callback(error, null));
}


User.prototype.deleteToken = async function(callback) {
    this.userToken = "";
    await this.save()
    .then(response =>
        callback(null, response))
    .catch(error =>
        callback(error, null));
}

User.findByToken = function(token, callback) {
    jwt.verify(token, SECRET, function(error, decoded) {
        if(error) {
            return callback(error, null);
        }else {
            User.findOne({where: {userToken: token}})
            .then(user => {
                return callback(null, user);
            })
            .catch(error => {
                return callback(error, null);
            });
        }
    });
}

module.exports = User;