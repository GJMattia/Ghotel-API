const Account = require('../models/account');


module.exports = {
    createAccount,
    getAccount,
    buyFurni,
    createRoom,
    placeFurni,
    clearRoom
};

async function clearRoom(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.rooms = userAccount.rooms.map(() => []);
        await userAccount.save();
        res.json('success');
    } catch (error) {
        console.error('Error clearing room', error);
        res.status(500).json({ error: 'there was an error clearing the room' })
    }

}

async function placeFurni(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.rooms[req.body.tileID].push(req.body.furniID);
        const removeFurniIndex = userAccount.inventory.indexOf(req.body.furniID);
        if (removeFurniIndex !== -1) {
            userAccount.inventory.splice(removeFurniIndex, 1);
        };
        await userAccount.save();
        res.json('success');
    } catch (error) {
        console.error('Error creating room', error);
        res.status(500).json({ error: 'there was a bad error' })
    }

}

async function createRoom(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        const room = Array.from({ length: req.body.roomSize }, () => []);
        userAccount.rooms.push(room);
        await userAccount.save();
        res.json('success');
    } catch (error) {
        console.error('Error creating room', error);
        res.status(500).json({ error: 'there was a bad error' })
    }
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