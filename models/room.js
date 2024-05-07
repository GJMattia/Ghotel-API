const mongoose = require('mongoose')
const Schema = mongoose.Schema

const furni = new Schema({
    furniID: { type: Number, required: true },
    rotation: { type: Boolean, default: false },
    state: { type: Boolean, default: false },
    height: { type: Number, required: true },
    dice: { type: Number, required: false }
});

const room = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    roomName: String,
    roomDescription: String,
    chat: Number,
    floorColor: String,
    wallType: Number,
    roomSize: Number,
    room: [[furni]]
},
    {
        timestamps: true,
    });



module.exports = mongoose.model('room', room);