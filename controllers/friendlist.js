const User = require('../models/user');
const FriendList = require('../models/friendlist');

module.exports = {
    createFriendList,
    getUsers,
    sendFriendRequest,
    getFriendRequests,
    deleteRequest,
    acceptRequest,
    getFriendList,
    removeFriend
};

async function removeFriend(req, res) {
    try {
        const deleteID = req.params.deleteID;
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });
        const indexToDelete = userList.friends.findIndex(request => request._id == deleteID);

        if (indexToDelete !== -1) {
            userList.friends.splice(indexToDelete, 1);
            await userList.save();
        }
        res.json({ message: 'question deleted successfully' })
    } catch (error) {
        console.error('Error deleting note', error);
        res.status(500).json({ error: 'Failed to delete question' })
    }

}

async function getFriendList(req, res) {
    try {
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });
        let friends = userList.friends;
        res.json(friends);
    } catch (error) {
        console.error('Error deleting note', error);
        res.status(500).json({ error: 'Failed to delete question' })
    }
}


async function acceptRequest(req, res) {
    try {
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });
        const newFriend = { ID: req.body.ID, name: req.body.name };
        userList.friends.push(newFriend);
        await userList.save();
        res.json({ message: 'Friend added!' })
    } catch (error) {
        console.error('Error deleting note', error);
        res.status(500).json({ error: 'Failed to delete question' })
    }
}

async function deleteRequest(req, res) {
    try {
        const requestID = req.params.requestID;
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });
        const indexToDelete = userList.requests.findIndex(request => request._id == requestID);

        if (indexToDelete !== -1) {
            userList.requests.splice(indexToDelete, 1);
            await userList.save();
        }
        res.json({ message: 'question deleted successfully' })
    } catch (error) {
        console.error('Error deleting note', error);
        res.status(500).json({ error: 'Failed to delete question' })
    }
}

async function getFriendRequests(req, res) {
    try {
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });
        let requests = userList.requests;
        res.json(requests)
    } catch (error) {
        console.error('error creating sheet', error)
    }
}

async function sendFriendRequest(req, res) {
    try {
        let username = req.user.name;
        let userID = req.user._id;
        let friendID = req.body.friendID;
        const Friend = await FriendList.findOne({ user: friendID });
        const newRequest = { ID: userID, name: username };
        Friend.requests.push(newRequest);
        await Friend.save();
    } catch (error) {
        console.error('error creating sheet', error)
    }
};


async function getUsers(req, res) {
    try {
        const users = await FriendList.find({}).populate('user', 'name');
        res.json(users);
    } catch (error) {
        console.error('error creating sheet', error)
    }
}


async function createFriendList(req, res) {
    try {
        const userID = req.body.userID;
        const newFriendList = await FriendList.create({ user: userID });
        res.json(newFriendList);
    } catch (error) {
        console.error('error creating sheet', error)
    }
};

