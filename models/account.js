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
    rooms: {
        type: [[Number]],
        default: Array.from({ length: 104 }, () => [])
    }
}, {
    timestamps: true,
});



module.exports = mongoose.model('account', account);