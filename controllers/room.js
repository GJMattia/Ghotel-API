const Room = require('../models/room');
const Account = require('../models/account');
const User = require('../models/user');

module.exports = {
    createRoom,
    getUserRooms,
    getRoomData,
    placeFurni,
    pickFurni,
    rotateFurni,
    useFurni,
    clearRoom,
    deleteRoom,
    roomColor,
    searchUser,
    wallType,
    editRoom
};

async function editRoom(req, res) {
    try {
        const room = await Room.findOne({ _id: req.body.roomID }).select('roomName roomDescription');

        room.roomName = req.body.roomName;
        room.roomDescription = req.body.roomDescription;

        await room.save();
        res.json(room);
    } catch (error) {
        console.error('Error rotating furni', error);
        res.status(500).json({ error: 'there was an error rotating the furni' })
    }
};



async function wallType(req, res) {
    try {
        const room = await Room.findOne({ _id: req.body.roomID }).select('wallType');
        room.wallType = req.body.wallType;
        await room.save();
        res.json(room.wallType);
    } catch (error) {
        console.error('Error rotating furni', error);
        res.status(500).json({ error: 'there was an error rotating the furni' })
    }
};

async function searchUser(req, res) {
    try {
        const user = await User.findOne({ name: req.body.userSearch }).select('userid');
        if (!user) {
            return res.json(null);
        };
        const rooms = await Room.find({ user: user._id }).select('roomName _id');
        res.json(rooms);
    } catch (error) {
        console.error('Error searching user', error);
        res.status(500).json({ error: 'error searching user' })
    }
}

async function roomColor(req, res) {
    try {
        const room = await Room.findOne({ _id: req.body.roomID }).select('floorColor');
        room.floorColor = req.body.color;
        await room.save();
        res.json(room.floorColor);
    } catch (error) {
        console.error('Error rotating furni', error);
        res.status(500).json({ error: 'there was an error rotating the furni' })
    }
};


async function deleteRoom(req, res) {
    try {
        await Room.deleteOne({ _id: req.params.roomID });
        const userRooms = await Room.find({ user: req.user._id }).select('roomName _id');
        res.json(userRooms);
    } catch (error) {
        console.error('Error getting room', error);
        res.status(500).json({ error: 'error getting room' })
    }
};

async function clearRoom(req, res) {
    try {
        const room = await Room.findOne({ _id: req.body.roomID }).select('room');
        room.room = Array.from({ length: 104 }, () => []);
        await room.save();
        res.json(room.room);
    } catch (error) {
        console.error('Error clearing room', error);
        res.status(500).json({ error: 'there was an error clearing the room' })
    }
};

async function useFurni(req, res) {
    try {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        const room = await Room.findOne({ _id: req.body.roomID }).select('room');
        let item = room.room[req.body.tileID][req.body.furniIndex];



        if (req.body.furniID === 26 && !item.state) {
            item.state = true;
            item.dice = randomNumber;
            await room.save();
            res.json({ tile: room.room[req.body.tileID], tileID: req.body.tileID });
        } else if (req.body.furniID === 26 && item.state) {
            item.state = false;
            item.dice = 0;
            await room.save();
            res.json({ tile: room.room[req.body.tileID], tileID: req.body.tileID });
        }
        else {
            item.state = !item.state;
            await room.save();
            res.json({ tile: room.room[req.body.tileID], tileID: req.body.tileID });
        }
    } catch (error) {
        console.error('error using furni', error);
        res.status(500).json({ error: 'error using furni' })
    }
};

async function rotateFurni(req, res) {
    try {
        const room = await Room.findOne({ _id: req.body.roomID }).select('room');
        room.room[req.body.tileID][req.body.furniIndex].rotation = !room.room[req.body.tileID][req.body.furniIndex].rotation;
        await room.save();
        res.json({ tile: room.room[req.body.tileID], tileID: req.body.tileID });
    } catch (error) {
        console.error('error picking furni', error);
        res.status(500).json({ error: 'error picking furni' })
    }
};

async function pickFurni(req, res) {
    try {
        const room = await Room.findOne({ _id: req.body.roomID }).select('room');
        room.room[req.body.tileID].splice(req.body.furniIndex, 1);
        await room.save();
        res.json({ tile: room.room[req.body.tileID], tileID: req.body.tileID });
    } catch (error) {
        console.error('error picking furni', error);
        res.status(500).json({ error: 'error picking furni' })
    }
};

async function placeFurni(req, res) {
    try {
        const room = await Room.findOne({ _id: req.body.roomID }).select('room');
        //Petal Patch
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

        //regular furni
        let newFurni = {
            furniID: req.body.furniID,
            rotation: false,
            state: false,
            height: req.body.furniHeight
        };

        let dice = {
            furniID: req.body.furniID,
            rotation: false,
            state: false,
            height: req.body.furniHeight,
            dice: 0
        };

        let tile = req.body.tileID;

        if (req.body.furniID === 26) {
            room.room[req.body.tileID].push(dice);
            await room.save();
            res.json(room.room[tile]);
        } else if (req.body.furniID === 1) {
            room.room[tile].push(p1);
            room.room[tile - 13].push(p2);
            room.room[tile - 12].push(p4);
            room.room[tile + 1].push(p3);
            await room.save();
            res.json({ tile1: room.room[tile], tile2: room.room[tile - 13], tile3: room.room[tile - 12], tile4: room.room[tile + 1] })

        } else {
            room.room[req.body.tileID].push(newFurni);
            await room.save();
            res.json(room.room[tile]);
        }
    } catch (error) {
        console.error('Error placing furni', error);
        res.status(500).json({ error: 'error placing furni' })
    }
};

async function getRoomData(req, res) {
    try {
        const room = await Room.findOne({ _id: req.params.roomID }).populate('user', 'name');
        res.json(room);
    } catch (error) {
        console.error('Error getting room', error);
        res.status(500).json({ error: 'error getting room' })
    }
};

async function getUserRooms(req, res) {
    try {
        const user = req.user._id;
        const userRooms = await Room.find({ user: user }).select('roomName _id');
        res.json(userRooms);
    } catch (error) {
        console.error('Error getting user rooms', error);
        res.status(500).json({ error: 'no user rooms' })
    }
};


async function createRoom(req, res) {
    try {
        const user = req.user._id;
        await Room.create({
            user: user,
            roomName: req.body.roomName,
            roomDescription: req.body.roomDescription,
            chat: Math.floor(Math.random() * 3000) + 1,
            floorColor: req.body.floorColor,
            wallType: req.body.wallType,
            roomSize: req.body.roomSize,
            room: Array.from({ length: req.body.roomSize }, () => [])
        });

        const userRooms = await Room.find({ user: user }).select('roomName _id');
        res.json(userRooms)
    } catch (error) {
        console.error('error creating room', error)
    }
};

