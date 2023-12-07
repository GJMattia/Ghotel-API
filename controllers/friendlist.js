const FriendList = require('../models/friendlist');

module.exports = {
    getUserRoom,
    getRequestsSent,
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
        const indexToDelete = userList.friends.findIndex(request => request.ID == deleteID);

        if (indexToDelete !== -1) {
            userList.friends.splice(indexToDelete, 1);
            await userList.save();
        }


        //Bottom Half
        const friendsList = await FriendList.findOne({ user: deleteID });
        const otherIndexToDelete = friendsList.friends.findIndex(request => request.ID == userID);

        if (otherIndexToDelete !== -1) {
            friendsList.friends.splice(otherIndexToDelete, 1);
            await friendsList.save();
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
        //User side
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });
        const newFriend = { ID: req.body.ID, name: req.body.name, room: req.body.room };
        userList.friends.push(newFriend);
        await userList.save();

        //Friend Side
        const user2List = await FriendList.findOne({ user: req.body.ID });
        const userFriend = { ID: userID, name: req.user.name, room: userList.room };
        user2List.friends.push(userFriend);
        await user2List.save();
        res.json({ message: 'Friend added!' })
    } catch (error) {
        console.error('Error deleting note', error);
        res.status(500).json({ error: 'Failed to delete question' })
    }
};


async function deleteRequest(req, res) {
    try {

        const requestID = req.params.requestID;
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });


        const requestInfo = userList.requests.find(request => request._id == requestID);
        const friendList = await FriendList.findOne({ user: requestInfo.ID });

        //This looks up the request inside the friends requestsSent and deletes it
        friendList.requestsSent = friendList.requestsSent.filter(requestSent => requestSent.ID != userID);
        await friendList.save();

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

async function getRequestsSent(req, res) {
    try {
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });
        let requestsSent = userList.requestsSent;
        res.json(requestsSent);
    } catch (error) {
        console.error('error creating sheet', error)
    }
}

async function getUserRoom(req, res) {
    try {
        const userID = req.user._id;
        const userList = await FriendList.findOne({ user: userID });
        let userRoom = userList.room;
        res.json(userRoom);
    } catch (error) {
        console.error('error creating sheet', error)
    }
}

async function sendFriendRequest(req, res) {
    try {



        //Adding Friend Request to Friends Requests
        let username = req.user.name;
        let userID = req.user._id;
        let User = await FriendList.findOne({ user: userID });
        let userRoom = User.room
        let friendID = req.body.friendID;
        let friendName = req.body.friendName
        let friendRoom = req.body.room
        const Friend = await FriendList.findOne({ user: friendID });
        const newRequest = { ID: userID, name: username, room: userRoom };
        Friend.requests.push(newRequest);
        await Friend.save();


        //Adding Request Send to User Side 
        const newRequestSent = { ID: friendID, name: friendName, room: friendRoom };
        User.requestsSent.push(newRequestSent);
        await User.save();

        res.json({ message: 'Request Sent Successfully' })
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
        const newFriendList = await FriendList.create({ user: userID, room: Math.floor(Math.random() * 9999) + 1 });
        res.json(newFriendList);
    } catch (error) {
        console.error('error creating sheet', error)
    }
};



