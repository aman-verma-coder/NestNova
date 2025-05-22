const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['booking', 'review', 'system', 'message'],
        required: true
    },
    relatedTo: {
        // Can be a booking, listing, review, etc.
        itemType: {
            type: String,
            enum: ['booking', 'listing', 'review', 'user'],
            required: true
        },
        itemId: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index to improve query performance
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;