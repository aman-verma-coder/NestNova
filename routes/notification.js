const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.js');
const { isLoggedIn } = require('../middleware.js');

// All notification routes require authentication
router.use(isLoggedIn);

// Get all notifications for current user
router.get('/', notificationController.getUserNotifications);

// Notification settings routes
router.get('/settings', notificationController.renderNotificationSettings);
router.post('/settings', notificationController.updateNotificationSettings);

// Mark notification as read and redirect to related content
router.post('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.post('/read-all', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;