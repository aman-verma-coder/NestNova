const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const userController = require("../controllers/user.js");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signupPost));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }), userController.loginPost);

router.get("/logout", userController.logoutPost);

// Profile routes
router.get("/profile", isLoggedIn, wrapAsync(userController.renderProfile));
router.post("/users/update-profile", isLoggedIn, upload.single('avatar'), wrapAsync(userController.updateProfile));
router.get("/users/bookings", isLoggedIn, wrapAsync(userController.renderBookings));
// Public profile route
router.get("/users/:username", wrapAsync(userController.viewUserProfile));
// Change password route
router.post("/users/change-password", isLoggedIn, wrapAsync(userController.changePassword));

// Update notification preferences
router.post("/users/update-notifications", isLoggedIn, wrapAsync(userController.updateNotifications));

// Booking routes
router.get("/users/bookings/:id", isLoggedIn, wrapAsync(userController.renderBookingDetails));
router.post("/users/bookings/:id/cancel", isLoggedIn, wrapAsync(userController.cancelBooking));

module.exports = router;