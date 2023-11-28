const mongoose = require('mongoose')
const Schema = mongoose.Schema



const friendList = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    friends: [{
        ID: String,
        name: String,
        room: Number
    }],
    requests: [{
        ID: String,
        name: String,
        room: Number
    }],
    requestsSent: [{
        ID: String,
        name: String,
        room: Number
    }],
    room: {
        type: Number
    }
}, {
    timestamps: true,
});



module.exports = mongoose.model('friendList', friendList);