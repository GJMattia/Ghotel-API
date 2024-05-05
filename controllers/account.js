const Account = require('../models/account');
const User = require('../models/user');

module.exports = {
    createAccount,
    getAccount,
    buyFurni,
    clearInventory,
    changeSprite,
    getSprite
};

async function getSprite(req, res) {
    try {
        const user = await User.findOne({ name: req.params.username }).select('name');
        const account = await Account.findOne(
            { user: user._id },
            { sprite: 1, badges: 1, motto: 1 }
        ).lean();


        account.username = user.name;
        res.json(account);
    } catch (error) {
        console.error('Error changing sprite', error);
        res.status(500).json({ error: 'error changing sprite' })
    }
};


async function changeSprite(req, res) {
    try {
        const account = await Account.findOne({ user: req.user._id }, { sprite: 1 });
        account.sprite = req.body.sprite;
        await account.save();
        res.json(account.sprite);
    } catch (error) {
        console.error('Error changing sprite', error);
        res.status(500).json({ error: 'error changing sprite' })
    }
};

async function clearInventory(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.inventory = [];
        await userAccount.save();
        res.json(userAccount.inventory);
    } catch (error) {
        console.error('Error clearing inventory', error);
        res.status(500).json({ error: 'there was an error clearing your inventory' })
    }
};


async function buyFurni(req, res) {
    try {
        const account = await Account.findOne(
            { user: req.user._id },
            { credits: 1, inventory: 1 }
        );
        account.credits = account.credits - req.body.itemPrice
        // for (let i = 0; i < 2; i++) {

        // };

        account.inventory.push(req.body.itemID);
        await account.save();
        res.json({ credits: account.credits, inventory: account.inventory });
    } catch (error) {
        console.error('Error buying furni', error);
        res.status(500).json({ error: 'Failed to buy furni' })
    }
};


async function getAccount(req, res) {
    try {
        const account = await Account.findOne({ user: req.user._id });

        res.json(account);
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