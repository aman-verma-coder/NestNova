const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String
    },
    bio: {
        type: String
    },
    phone: {
        type: String
    },
    notificationPreferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        bookingUpdates: {
            type: Boolean,
            default: true
        },
        reviewNotifications: {
            type: Boolean,
            default: true
        },
        messageNotifications: {
            type: Boolean,
            default: true
        },
        systemNotifications: {
            type: Boolean,
            default: true
        },
        marketingEmails: {
            type: Boolean,
            default: false
        }
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);