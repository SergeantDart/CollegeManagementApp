
const auth = require("../middleware/auth");
const {sequelize} = require("../database");
const User = require("../models/User");
const UserRole = require("../models/UserRole");

module.exports = function(app) {

    //user registration
    app.post("/api/addUser", (req, res) => {
        User.create(req.body)
       .then(user => {
            res.status(200).json(user)
       }).catch(error => {
            console.log(error);
            res.status(400).json({
                message: error.message
            });
        })
    });

    app.post("/api/updateUser/:id", (req, res) => {
        User.findByPk(req.params.id)
        .then(user => {
            if(user) {
                user.update({
                    userPassword: req.body.userPassword,
                    userToken: null
                })
                .then(user => {
                    res.json(user);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            }else {
                res.json({
                    message: "no user found..."
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        });
    })
    
    //user login with token cookie storage in browser and mySQL
    app.post("/api/loginUser", (req, res) => {
        User.findOne({where: {"userEmail": req.body.userEmail}})
        .then(user => {
            if(!user) {
                return res.json({
                    isAuth: false,
                    logInMessage: "User not found..."
                });
            }else {
                user.comparePasswords(req.body.userPassword, (error, isMatch) => {
                    if(error) {
                        return res.json({
                            isAuth: false,
                            logInMessage: error.message
                        });
                    }else if(!isMatch) {
                        return res.json({
                            isAuth: false,
                            logInMessage: "Wrong password..." 
                        });
                    }else {
                        user.generateToken((error, user) => {
                            if(error) {
                                console.log("done");
                                return res.json({
                                    isAuth: false,
                                    logInMessage: error.message
                                });  
                            }else {
                                console.log(user);
                                UserRole.findOne({where: {userRoleId: user.userRoleId}})
                                .then(role => {
                                    return res.cookie("auth", user.userToken).json({
                                        isAuth: true,
                                        user: {
                                            userId: user.userId,
                                            userEmail: user.userEmail,
                                            userRole: role.userRoleName
                                        }
                                    });
                                }).catch(error => {
                                    return res.json({
                                        isAuth: false,
                                        logInMessage: error.message
                                    });
                                })
         
                            }
                        });
                    }
                });
            }
        })
        .catch(error => {
            res.json({
                isAuth: false,
                message: error
            });
        })
    });

    app.get("/api/authUser", auth, (req, res) => {
        res.json({
            isAuth: true,
            user: {
                userId: req.user.userId,
                userEmail: req.user.userEmail,
                userRole: req.permission
            }
        });
    });
    
    //user logout with verification of active connection by comparing browser and mySQL tokens
    app.get("/api/logoutUser", auth, (req, res) => {
        req.user.deleteToken((error, user) => {
            if(error) {
                return res.json({
                    isLoggedOut: false,
                    user: {},
                    logOutMessage: error.message
                });
            }else {
                return res.json({
                    isLoggedOut: true,
                    user: {},
                    logOutMessage: "User logged out..."
                });
            }
        });
    });

    app.get("/api/getUser/:id", (req, res) => {
        User.findOne({where: {userId: req.params.id}})
        .then(user => {
            if(user) {
                return res.status(200).json(user);
            }else {
                return res.status(400).json({
                    message: "user not found"
                });
            }
        }).catch(error => {
            console.log(error);
            res.status(400).json({
                message: error.message
            });
        })
    })
    
}