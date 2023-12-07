const mongoose = require('mongoose')
const Schema = mongoose.Schema


const account = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    credits: {
        type: Number,
        default: 500
    },
    inventory: {
        type: [Number],
        default: []
    },
    rooms: []
}, {
    timestamps: true,
});



module.exports = mongoose.model('account', account);