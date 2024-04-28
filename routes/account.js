const express = require('express');
const router = express.Router();
const accountCtrl = require('../controllers/account');



router.post('/', accountCtrl.createAccount);

router.get('/getaccount', accountCtrl.getAccount);

router.put('/:accountID', accountCtrl.buyFurni);

router.put('/create/room', accountCtrl.createRoom);

router.put('/place/furni', accountCtrl.placeFurni);

router.put('/clear/room', accountCtrl.clearRoom);

router.put('/pickup/furni', accountCtrl.pickUpFurni);

router.put('/rotate/furni', accountCtrl.rotateFurni);

router.put('/use/furni', accountCtrl.useFurni);

router.put('/clear/inventory', accountCtrl.clearInventory);

router.put('/delete/room', accountCtrl.deleteRoom);

router.put('/room/color', accountCtrl.roomColor);

module.exports = router;