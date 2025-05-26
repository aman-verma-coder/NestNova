const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Admin dashboard routes
router.get("/dashboard", isLoggedIn, isAdmin, wrapAsync(adminController.renderDashboard));

// Analytics routes
router.get("/analytics", isLoggedIn, isAdmin, wrapAsync(adminController.renderAnalytics));

// Audit logs routes
router.get("/audit-logs", isLoggedIn, isAdmin, wrapAsync(adminController.renderAuditLogs));

// Reviews management routes
router.get("/reviews", isLoggedIn, isAdmin, wrapAsync(adminController.renderReviews));
router.post("/reviews/:id/delete", isLoggedIn, isAdmin, wrapAsync(adminController.deleteReview));
router.post("/reviews/:id/approve", isLoggedIn, isAdmin, wrapAsync(adminController.approveReview));
router.post("/reviews/:id/reject", isLoggedIn, isAdmin, wrapAsync(adminController.rejectReview));

// Users management routes
router.get("/users", isLoggedIn, isAdmin, wrapAsync(adminController.renderUsers));
router.post("/users/:id/make-admin", isLoggedIn, isAdmin, wrapAsync(adminController.makeAdmin));
router.post("/users/:id/remove-admin", isLoggedIn, isAdmin, wrapAsync(adminController.removeAdmin));
router.post("/users/:id/toggle-status", isLoggedIn, isAdmin, wrapAsync(adminController.toggleUserStatus));

// Listings management routes
router.post("/listings/:id/approve", isLoggedIn, isAdmin, wrapAsync(adminController.approveListing));
router.post("/listings/:id/reject", isLoggedIn, isAdmin, wrapAsync(adminController.rejectListing));
router.post("/listings/:id/pending", isLoggedIn, isAdmin, wrapAsync(adminController.pendingListing));

// Bookings management routes
router.get("/bookings", isLoggedIn, isAdmin, wrapAsync(adminController.renderBookings));
router.post("/bookings/:id/confirm", isLoggedIn, isAdmin, wrapAsync(adminController.confirmBooking));
router.post("/bookings/:id/cancel", isLoggedIn, isAdmin, wrapAsync(adminController.cancelBooking));
router.post("/bookings/:id/complete", isLoggedIn, isAdmin, wrapAsync(adminController.completeBooking));

// Booking details route
router.get("/bookings/:id/details", isLoggedIn, isAdmin, wrapAsync(adminController.renderBookingDetails));

// Cancellations management routes
router.get("/cancellations", isLoggedIn, isAdmin, wrapAsync(adminController.renderCancellations));
router.post("/bookings/:id/process-refund", isLoggedIn, isAdmin, wrapAsync(adminController.processRefund));

// Reports generation routes
router.get("/reports/:reportType", isLoggedIn, isAdmin, wrapAsync(adminController.generateReport));

module.exports = router;