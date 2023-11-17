const mongoose = require('mongoose')
const Schema = mongoose.Schema



const friendList = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    friends: [{
        ID: String,
        name: String,
    }],
    requests: [{
        ID: String,
        name: String,
    }],
    requestsSent: [{
        ID: String,
        name: String,
    }],
}, {
    timestamps: true,
});



module.exports = mongoose.model('friendList', friendList);