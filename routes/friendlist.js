const express = require('express');
const router = express.Router();
const friendListCtrl = require('../controllers/friendlist');



router.get('/', friendListCtrl.getUsers);

router.get('/getrequests', friendListCtrl.getFriendRequests)

router.get('/getfriendlist', friendListCtrl.getFriendList)

router.post('/', friendListCtrl.createFriendList);

router.post('/request', friendListCtrl.sendFriendRequest);

router.post('/:requestID', friendListCtrl.acceptRequest);

router.delete('/:requestID', friendListCtrl.deleteRequest)


module.exports = router;