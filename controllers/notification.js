const Notification = require('../models/notification.js');
const User = require('../models/user.js');

// Create a new notification
module.exports.createNotification = async (recipientId, content, type, itemType, itemId) => {
    try {
        // Check user notification preferences before creating notification
        const user = await User.findById(recipientId);

        // If user has disabled this type of notification, don't create it
        if (user && user.notificationPreferences) {
            // Check if email notifications are disabled
            if (!user.notificationPreferences.emailNotifications) {
                // Skip creating notification if email notifications are turned off
                return null;
            }

            // Check specific notification type preferences
            switch (type) {
                case 'booking':
                    if (!user.notificationPreferences.bookingUpdates) return null;
                    break;
                case 'review':
                    if (!user.notificationPreferences.reviewNotifications) return null;
                    break;
                case 'message':
                    if (!user.notificationPreferences.messageNotifications) return null;
                    break;
                case 'system':
                    if (!user.notificationPreferences.systemNotifications) return null;
                    break;
            }
        }

        const newNotification = new Notification({
            recipient: recipientId,
            content,
            type,
            relatedTo: {
                itemType,
                itemId
            }
        });

        await newNotification.save();
        return newNotification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};

// Get all notifications for a user
module.exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.render('users/notifications/index.ejs', { notifications });
    } catch (error) {
        req.flash('error', 'Unable to fetch notifications');
        res.redirect('/listings');
    }
};

// Mark notification as read
module.exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            req.flash('error', 'Notification not found');
            return res.redirect('/notifications');
        }

        notification.isRead = true;
        await notification.save();

        // Redirect to the related item based on type
        const { itemType, itemId } = notification.relatedTo;

        let redirectUrl = '/notifications';

        switch (itemType) {
            case 'booking':
                redirectUrl = `/bookings/${itemId}`;
                break;
            case 'listing':
                redirectUrl = `/listings/${itemId}/show`;
                break;
            case 'review':
                // Find the listing associated with this review
                const review = await Review.findById(itemId).populate('listingId');
                if (review && review.listingId) {
                    redirectUrl = `/listings/${review.listingId._id}/show`;
                }
                break;
            case 'user':
                // Could redirect to a user profile page if implemented
                break;
        }

        res.redirect(redirectUrl);
    } catch (error) {
        req.flash('error', 'Failed to mark notification as read');
        res.redirect('/notifications');
    }
};

// Mark all notifications as read
module.exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );

        req.flash('success', 'All notifications marked as read');
        res.redirect('/notifications');
    } catch (error) {
        req.flash('error', 'Failed to mark notifications as read');
        res.redirect('/notifications');
    }
};

// Delete a notification
module.exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);

        req.flash('success', 'Notification deleted');
        res.redirect('/notifications');
    } catch (error) {
        req.flash('error', 'Failed to delete notification');
        res.redirect('/notifications');
    }
};

// Get unread notification count (for navbar display)
module.exports.getUnreadCount = async (userId) => {
    try {
        return await Notification.countDocuments({ recipient: userId, isRead: false });
    } catch (error) {
        console.error('Error counting unread notifications:', error);
        return 0;
    }
};

// Render notification settings page
module.exports.renderNotificationSettings = async (req, res) => {
    try {
        res.render('users/notifications/settings.ejs');
    } catch (error) {
        req.flash('error', 'Unable to load notification settings');
        res.redirect('/notifications');
    }
};

// Update notification settings
module.exports.updateNotificationSettings = async (req, res) => {
    try {
        const {
            emailNotifications,
            bookingUpdates,
            reviewNotifications,
            messageNotifications,
            systemNotifications,
            marketingEmails
        } = req.body;

        const user = await User.findById(req.user._id);

        // Update notification preferences
        user.notificationPreferences = {
            emailNotifications: !!emailNotifications,
            bookingUpdates: !!bookingUpdates,
            reviewNotifications: !!reviewNotifications,
            messageNotifications: !!messageNotifications,
            systemNotifications: !!systemNotifications,
            marketingEmails: !!marketingEmails
        };

        await user.save();

        req.flash('success', 'Notification settings updated successfully');
        res.redirect('/notifications/settings');
    } catch (error) {
        req.flash('error', 'Failed to update notification settings');
        res.redirect('/notifications/settings');
    }
};