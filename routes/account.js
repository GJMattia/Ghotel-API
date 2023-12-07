const express = require('express');
const router = express.Router();
const accountCtrl = require('../controllers/account');



router.post('/', accountCtrl.createAccount);

router.get('/getaccount', accountCtrl.getAccount);



module.exports = router;