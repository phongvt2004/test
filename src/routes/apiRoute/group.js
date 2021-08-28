const express = require('express');
const router = express.Router();
const chatRoute = require('./chat')
var cache = require('memory-cache');
const { mongooseToObject } = require('../../util/mongoose')
const GroupController = require('../../app/controllers/GroupController')
const MemberController = require('../../app/controllers/MemberController')

router.use('/chat', chatRoute)
router.post('/create', GroupController.createGroup)
router.get('/join/:groupId', MemberController.addMember)
// router.get('/:id', checkTypeQuestion, GroupController.getGroup)

module.exports = router