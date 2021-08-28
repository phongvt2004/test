const Groups = require('../models/groups')
const Users = require('../models/users')
var cache = require('memory-cache');
class GroupController {
    getGroup(req, res, next) {
        Groups.findOne({name: req.params.name})
            .then((group) => {res.json(group)})
    }
    getGroupList(groupIds) {
        console.log(groupIds)
        if(groupIds == 'all' || !groupIds) {
            return Groups.find()
        } else {
            var groupList = []
            groupList = groupIds.map((groupId) => {
                return Groups.findOne({_id: groupId})
            })
            return Promise.all(groupList)
        }

    }
    createGroup(req, res, next) {
        const group = new Groups(req.body)
        var userId
        var groupCreated
        group
            .save()
            .then((group) => {
                groupCreated = group
                return Users.findOne({username: group.leader})
            })
            .then((user) => {
                user.groupIds.push(groupCreated._id)
                userId = user._id
                cache.put('user', user)
                return Users.updateOne({_id: user._id}, user)
            })
            .then(() => {res.redirect('/me/group/'+userId)})
    }

    createGroupConfirm(req, res, next) {
        Groups.findOne({name: req.body.name})
            .then(user => {
                if(!user) {
                    next();
                } else {
                    res.json({msg: 'Name already exists'})
                }
            })
            .catch(next)
    }

    updateGroups(req, res, next) {
        Groups.updateOne({_id: req.params.id}, req.body)
            .then(res.json({success: true}))
            .catch(next)
    }

    deleteGroup(req, res, next) {
        Groups.deleteOne({_id: req.params.id})
            .then(res.json({success: true}))
            .catch(next)
    }
}

module.exports = new GroupController;