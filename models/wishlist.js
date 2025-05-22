const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listings: [{
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: 'My Wishlist'
    },
    description: {
        type: String,
        default: ''
    }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;