const User = require("../models/User");
const UserRole = require("../models/UserRole");

//token auth middleware
module.exports = auth = (req, res, next) => {
    let token = req.cookies.auth;
    User.findByToken(token, (error, user) => {
        if(error) {
            res.json({
                isAuth: false,
                authMessage: error.message
            });
        }else if(!user) {
            res.json({
                isAuth: false,
                authMessage: "No user currently signed-in..."
            });
        }else {
            UserRole.findOne({where: {userRoleId: user.userRoleId}})
            .then(role => {
                req.token = token;
                req.user = user;
                req.permission = role.userRoleName;
                next();
            }).catch(error => {
                return res.json({
                    isAuth: false,
                    authMessage: error.message
                });
            })

        }
    });
}

