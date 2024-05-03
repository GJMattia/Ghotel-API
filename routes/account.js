const express = require('express');
const router = express.Router();
const accountCtrl = require('../controllers/account');


router.post('/', accountCtrl.createAccount);

router.get('/getaccount', accountCtrl.getAccount);

router.put('/buy/furni', accountCtrl.buyFurni);

router.put('/clear/inventory', accountCtrl.clearInventory);

router.put('/change/sprite', accountCtrl.changeSprite);


module.exports = router;