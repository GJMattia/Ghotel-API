const express = require('express');
const router = express.Router();
const friendListCtrl = require('../controllers/friendlist');



router.get('/', friendListCtrl.getUsers);

router.get('/getrequests', friendListCtrl.getFriendRequests);

router.get('/getfriendlist', friendListCtrl.getFriendList);

router.get('/getrequestssent', friendListCtrl.getRequestsSent);

router.get('/getuserroom', friendListCtrl.getUserRoom);

router.post('/', friendListCtrl.createFriendList);

router.post('/request', friendListCtrl.sendFriendRequest);

router.post('/:requestID', friendListCtrl.acceptRequest);

router.delete('/:requestID', friendListCtrl.deleteRequest);

router.delete('/friends/:deleteID', friendListCtrl.removeFriend);



module.exports = router;