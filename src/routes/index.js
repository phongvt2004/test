const apiRoute = require('./apiRoute');
var cache = require('memory-cache');
const { mongooseToObject, multipleMongooseToObject } = require('../util/mongoose');
const GroupController = require('../app/controllers/GroupController');
const ChatController = require('../app/controllers/ChatController');
const Users = require('../app/models/users')
const axios = require('axios').default;
function route(app) {
    app.get('/test', function(req, res) {
        axios.post('https://study-group-user.herokuapp.com/users/status', {
            userId: '614e8257d6926d00033de9c9',
            isAmin: false,
            isConfirmMail: false,
        })
        .then(response => res.json(response.data))
    })
    app.use('/api', apiRoute)
    app.get('/', (req, res, next) => {
        if(cache.get('user')) {
            next()
        } else {
            res.redirect('/login')
        }
    } ,(req, res, next) => {
        let user = cache.get('user')
        res.render('home', {
            user: mongooseToObject(user)
        })
    })
    app.get('/login', (req, res, next) => {
        if(cache.get('user')) {
            res.redirect('/')
        } else {
            next()
        }
    },(req, res, next) => {
        res.render('auth/login')
    })
    app.get('/register', (req, res, next) => {
        res.render('auth/register')
    })
    app.get('/group/create/:userId', function(req, res) {
        Users.findOne({_id: req.params.userId})
            .then(user => {
                res.render('group/create', {
                    user: mongooseToObject(user)
            })
    })})
    app.get('/me/group/:userId', function(req, res) {
        Users.findOne({_id: req.params.userId})
            .then((user) => {
                console.log(user)
                return GroupController.getGroupList(user.groupIds)
            })
            .then(groupList => {
                res.render('me/group', {
                groups: multipleMongooseToObject(groupList)
            })
    })
    })
    app.get('/group/chat', ChatController.getAllChatMessage)
    app.get('/group/join/:userId', (req,res) => {
        Promise.all([Users.findOne({_id: req.params.userId}), GroupController.getGroupList('all')])
            .then(([user, groupList]) => {
                res.render('group/join', {
                    user: mongooseToObject(user),
                    groups: multipleMongooseToObject(groupList)
                })
            })
    })
    app.get('/group/delete/:groupId', GroupController.deleteGroup)
}

module.exports = route;