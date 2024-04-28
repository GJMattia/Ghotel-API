const mongoose = require('mongoose')
const Schema = mongoose.Schema

const furni = new Schema({
    furniID: { type: Number, required: true },
    rotation: { type: Boolean, default: false },
    state: { type: Boolean, default: false },
    height: { type: Number, required: true }
});

const account = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    credits: {
        type: Number,
        default: 5000
    },
    inventory: {
        type: [Number],
        default: []
    },
    rooms: {
        type: [{
            roomName: String,
            roomDescription: String,
            chat: Number,
            floorColor: String,
            roomSize: Number,
            room: [[furni]]
        }],
    }
}, {
    timestamps: true,
});





module.exports = mongoose.model('account', account);