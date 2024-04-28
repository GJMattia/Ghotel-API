const Account = require('../models/account');


module.exports = {
    createAccount,
    getAccount,
    buyFurni,
    createRoom,
    placeFurni,
    clearRoom,
    pickUpFurni,
    rotateFurni,
    useFurni,
    clearInventory,
    deleteRoom,
    roomColor
};

async function roomColor(req, res) {
    try {
        const colors = [
            'red',
            'dodgerblue',
            'green',
            'orange',
            'purple',
            'white',
            'brown',
            'darkred',
            'black'
        ];
        let random = Math.floor(Math.random() * 9);
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.rooms[req.body.roomIndex].floorColor = colors[random];
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error rotating furni', error);
        res.status(500).json({ error: 'there was an error rotating the furni' })
    }
};


async function deleteRoom(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.rooms.splice(req.body.roomIndex, 1);
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error creating room', error);
        res.status(500).json({ error: 'there was a bad error' })
    }
};

async function clearInventory(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.inventory = [];
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error clearing inventory', error);
        res.status(500).json({ error: 'there was an error clearing your inventory' })
    }
};


async function useFurni(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.rooms[req.body.roomIndex].room[req.body.tileID][req.body.furniIndex].state = !userAccount.rooms[req.body.roomIndex].room[req.body.tileID][req.body.furniIndex].state;
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error using furni', error);
        res.status(500).json({ error: 'there was an error using the furni' })
    }
};


async function rotateFurni(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.rooms[req.body.roomIndex].room[req.body.tileID][req.body.furniIndex].rotation = !userAccount.rooms[req.body.roomIndex].room[req.body.tileID][req.body.furniIndex].rotation;
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error rotating furni', error);
        res.status(500).json({ error: 'there was an error rotating the furni' })
    }
};

async function pickUpFurni(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        if (req.body.furniID === 47) {
            userAccount.inventory.push(1);
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID].splice(req.body.furniIndex, 1);
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID - 13].splice(0, 1);
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID - 12].splice(0, 1);
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID + 1].splice(0, 1);
        } else if (req.body.furniID === 48 || req.body.furniID === 49 || req.body.furniID === 50) {
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID].splice(req.body.furniIndex, 1);
        } else {
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID].splice(req.body.furniIndex, 1);
            userAccount.inventory.push(req.body.furniID);
        };
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error clearing room', error);
        res.status(500).json({ error: 'there was an error clearing the room' })
    }
}

async function clearRoom(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.rooms[req.body.roomIndex].room = Array.from({ length: req.body.roomSize }, () => []);
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error clearing room', error);
        res.status(500).json({ error: 'there was an error clearing the room' })
    }
};

async function placeFurni(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        let p1 = {
            furniID: 47,
            rotation: false,
            state: false,
            height: req.body.furniHeight
        };
        let p2 = {
            furniID: 48,
            rotation: false,
            state: false,
            height: req.body.furniHeight
        };
        let p3 = {
            furniID: 49,
            rotation: false,
            state: false,
            height: req.body.furniHeight
        };
        let p4 = {
            furniID: 50,
            rotation: false,
            state: false,
            height: req.body.furniHeight
        };

        let newFurni = {
            furniID: req.body.furniID,
            rotation: false,
            state: false,
            height: req.body.furniHeight
        };

        if (req.body.furniID === 1) {
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID].push(p1);
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID - 13].push(p2);
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID - 12].push(p4);
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID + 1].push(p3);
        } else {
            userAccount.rooms[req.body.roomIndex].room[req.body.tileID].push(newFurni);
        }
        let furniIndex = userAccount.inventory.indexOf(req.body.furniID);
        userAccount.inventory.splice(furniIndex, 1);
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error creating room', error);
        res.status(500).json({ error: 'there was a bad error' })
    }
};

async function createRoom(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        const newRoom = {
            roomName: req.body.roomName,
            roomDescription: req.body.roomDescription,
            chat: 0,
            floorColor: req.body.floorColor,
            room: Array.from({ length: req.body.roomSize }, () => []),
            roomSize: req.body.roomSize
        }
        userAccount.rooms.push(newRoom);
        await userAccount.save();
        res.json(userAccount);
    } catch (error) {
        console.error('Error creating room', error);
        res.status(500).json({ error: 'there was a bad error' })
    }
};

async function buyFurni(req, res) {
    try {
        const userAccount = await Account.findOne({ user: req.user._id });
        userAccount.credits = userAccount.credits - req.body.itemPrice
        for (let i = 0; i < 10; i++) {
            userAccount.inventory.push(req.body.itemID);
        };
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