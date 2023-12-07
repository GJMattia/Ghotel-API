const Account = require('../models/account');


module.exports = {
    createAccount,
    getAccount,
    buyFurni
};

async function buyFurni(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.credits = userAccount.credits - req.body.itemPrice
        userAccount.inventory.push(req.body.itemID)
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error buying furni', error);
        res.status(500).json({ error: 'Failed to buy furni' })
    }
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