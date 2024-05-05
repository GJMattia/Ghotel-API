const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    sprite: {
        type: Number,
        default: 0
    },
    badges: {
        type: [Number],
        default: [0, 1]
    },
    motto: {
        type: String,
        default: 'motto'
    }

}, {
    timestamps: true,
});





module.exports = mongoose.model('account', account);