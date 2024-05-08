const express = require('express');
const router = express.Router();
const accountCtrl = require('../controllers/account');


router.post('/', accountCtrl.createAccount);

router.get('/getaccount', accountCtrl.getAccount);

router.put('/buy/furni', accountCtrl.buyFurni);

router.put('/clear/inventory', accountCtrl.clearInventory);

router.put('/change/sprite', accountCtrl.changeSprite);

router.get('/user/:username', accountCtrl.getSprite);

router.put('/change/badges', accountCtrl.changeBadges);

router.put('/change/motto', accountCtrl.changeMotto);

router.put('/send/credits', accountCtrl.sendCredits);

router.put('/get/credits', accountCtrl.getCredits);


module.exports = router;