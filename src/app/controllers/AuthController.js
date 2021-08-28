
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token');
var cache = require('memory-cache');
const saltRounds = 10;

class AuthController {
    login(req, res, next) {
        Users.findOne({username: req.body.username})
            .then(user => {
                if(user) {
                    bcrypt.compare(req.body.password, user.password)
                        .then(function(result) {
                            if(result) {
                                cache.put('user', user)
                                res.redirect('/')
                            } else {
                                res.json({success:false, username: "", msg : "Password incorrect"})
                            }
                        });
                } else {
                    res.json({success:false, username: "", msg: "User not found"})
                }
            })
            .catch(next)
    }

    register(req, res, next) {
        bcrypt.hash(req.body['password'], saltRounds)
            .then(function(hash) {
                req.body.password = hash;
                const user = new Users(req.body)
                user
                    .save()
                    .then((user) => {
                        cache.put('user', user)
                        res.redirect('/')
                    })
                    .catch(next)
            })
    }

    registerConfirm(req, res, next) {
        Users.findOne({username: req.body.username})
            .then(user => {
                if(!user) {
                    Users.findOne({email: req.body.email})
                        .then(user => {
                            if(!user) {
                                next();
                            } else {
                                res.json({msg: 'Email already exists'})
                            }
                        })
                    
                } else {
                    res.json({msg: 'Username already exists'})
                }
            })
            .catch(next)
        }

    logout(req, res, next) {
        cache.clear()
        res.redirect('/')
    }
}

module.exports = new AuthController;