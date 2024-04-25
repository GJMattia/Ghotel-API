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

module.exports = router;