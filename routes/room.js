const express = require('express');
const router = express.Router();
const roomCtrl = require('../controllers/room');



router.get('/:roomID', roomCtrl.getRoomData);

router.get('/user/rooms', roomCtrl.getUserRooms);

router.post('/create/room', roomCtrl.createRoom);

router.put('/place/furni', roomCtrl.placeFurni);

router.put('/pick/furni', roomCtrl.pickFurni);

router.put('/rotate/furni', roomCtrl.rotateFurni);

router.put('/use/furni', roomCtrl.useFurni);

router.put('/clear/room', roomCtrl.clearRoom);

router.delete('/:roomID', roomCtrl.deleteRoom);

router.put('/room/color', roomCtrl.roomColor);

router.put('/search/user', roomCtrl.searchUser)

module.exports = router;