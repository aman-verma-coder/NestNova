const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const adminController = require("../controllers/admin.js");

// Dashboard routes
router.get("/dashboard", isLoggedIn, isAdmin, wrapAsync(adminController.renderDashboard));

// Listing management routes
router.post("/listings/:id/approve", isLoggedIn, isAdmin, wrapAsync(adminController.approveListing));
router.post("/listings/:id/reject", isLoggedIn, isAdmin, wrapAsync(adminController.rejectListing));
router.post("/listings/:id/pending", isLoggedIn, isAdmin, wrapAsync(adminController.pendingListing));

// User management routes
router.get("/users", isLoggedIn, isAdmin, wrapAsync(adminController.renderUserManagement));
router.post("/users/:id/toggle-status", isLoggedIn, isAdmin, wrapAsync(adminController.toggleUserStatus));
router.post("/users/:id/make-admin", isLoggedIn, isAdmin, wrapAsync(adminController.makeAdmin));
router.post("/users/:id/remove-admin", isLoggedIn, isAdmin, wrapAsync(adminController.removeAdmin));

// Review management routes
router.get("/reviews", isLoggedIn, isAdmin, wrapAsync(adminController.renderReviewManagement));
router.post("/reviews/:id/delete", isLoggedIn, isAdmin, wrapAsync(adminController.deleteReview));
router.post("/reviews/:id/edit", isLoggedIn, isAdmin, wrapAsync(adminController.editReview));

// Statistics route
router.get("/statistics", isLoggedIn, isAdmin, wrapAsync(adminController.renderStatistics));


module.exports = router;