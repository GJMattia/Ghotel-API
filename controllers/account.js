const Account = require('../models/account');


module.exports = {
    createAccount,
    getAccount
};


async function getAccount(req, res) {
    try {
        const userID = req.user._id;
        const userAccount = await Account.findOne({ user: userID });
        res.json(userAccount);
    } catch (error) {
        console.error('Error finding account', error);
        res.status(500).json({ error: 'Failed to find the account' })
    }
};


async function createAccount(req, res) {
    try {
        const userID = req.body.userID;
        const newAccount = await Account.create({ user: userID });
        res.json(newAccount);
    } catch (error) {
        console.error('error creating account', error)
    }
};