const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listings.js");
const auditLogger = require("../utils/auditLogger.js");

module.exports.renderSignupForm = (req, res) => {
    // res.send("All Ok");
    res.render("users/signup.ejs");
};

module.exports.signupPost = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Log the registration action
        await auditLogger.log({
            user: registeredUser.username,
            action: "register",
            resourceType: "user",
            resourceId: registeredUser._id.toString(),
            ipAddress: req.ip,
            status: "success",
            details: { email: registeredUser.email }
        });

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to NestNova");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

// Render booking details page
module.exports.renderBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('listing');

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/users/bookings');
        }

        // Check if the logged-in user is the owner of the booking
        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to view this booking');
            return res.redirect('/users/bookings');
        }

        res.render('users/booking-details.ejs', { booking });
    } catch (error) {
        req.flash('error', 'Failed to load booking details: ' + error.message);
        res.redirect('/users/bookings');
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginPost = async (req, res) => {
    // Log the login action
    await auditLogger.log({
        user: req.user.username,
        action: "login",
        resourceType: "user",
        resourceId: req.user._id.toString(),
        ipAddress: req.ip,
        status: "success",
        details: { browser: req.headers["user-agent"] }
    });

    req.flash("success", "Welcome to NestNova! You are now logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logoutPost = (req, res, next) => {
    // Store user info before logout for audit logging
    const username = req.user.username;
    const userId = req.user._id.toString();

    req.logout((err) => {
        if (err) {
            return next(err);
        }

        // Log the logout action
        auditLogger.log({
            user: username,
            action: "logout",
            resourceType: "user",
            resourceId: userId,
            ipAddress: req.ip,
            status: "success"
        }).catch(err => console.error("Error logging logout:", err));

        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
};

// Import recommendation service
const RecommendationService = require("../services/recommendationService.js");

// Profile methods
module.exports.renderProfile = async (req, res) => {
    try {
        // Find the user with populated data
        const user = await User.findById(req.user._id);

        // Get user's bookings
        const bookings = await Booking.find({ user: req.user._id })
            .populate('listing')
            .sort({ createdAt: -1 });

        // Get user's listings
        const listings = await Listing.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        // Get personalized recommendations
        const recommendations = await RecommendationService.getRecommendations(req.user._id, 4);

        res.render("users/profile.ejs", { bookings, listings, recommendations });
    } catch (error) {
        req.flash("error", "Failed to load profile: " + error.message);
        res.redirect("/listings");
    }
};

// Render booking details page
module.exports.renderBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('listing');

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/users/bookings');
        }

        // Check if the logged-in user is the owner of the booking
        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to view this booking');
            return res.redirect('/users/bookings');
        }

        res.render('users/booking-details.ejs', { booking });
    } catch (error) {
        req.flash('error', 'Failed to load booking details: ' + error.message);
        res.redirect('/users/bookings');
    }
};


module.exports.updateProfile = async (req, res) => {
    try {
        const { username, email, phone, bio } = req.body;
        const user = await User.findById(req.user._id);

        // Update user fields
        user.username = username;
        user.email = email;
        user.phone = phone;
        user.bio = bio;

        // Handle avatar upload if provided
        if (req.file) {
            user.avatar = req.file.path;
        }

        await user.save();

        // Log the profile update action
        await auditLogger.log({
            user: req.user.username,
            action: "update",
            resourceType: "user_profile",
            resourceId: req.user._id.toString(),
            ipAddress: req.ip,
            status: "success",
            details: { updated_fields: Object.keys(req.body) }
        });

        req.flash("success", "Profile updated successfully");
        res.redirect("/profile");
    } catch (error) {
        req.flash("error", "Profile update failed: " + error.message);
        res.redirect("/profile");
    }
};

// Render booking details page
module.exports.renderBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('listing');

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/users/bookings');
        }

        // Check if the logged-in user is the owner of the booking
        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to view this booking');
            return res.redirect('/users/bookings');
        }

        res.render('users/booking-details.ejs', { booking });
    } catch (error) {
        req.flash('error', 'Failed to load booking details: ' + error.message);
        res.redirect('/users/bookings');
    }
};



module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            req.flash("error", "New passwords do not match");
            return res.redirect("/listings");
        }

        // Change the password using Passport-Local-Mongoose's changePassword method
        const user = await User.findById(req.user._id);
        await user.changePassword(currentPassword, newPassword);

        // Log the password change action
        await auditLogger.log({
            user: req.user.username,
            action: "change_password",
            resourceType: "user",
            resourceId: req.user._id.toString(),
            ipAddress: req.ip,
            status: "success"
        });

        req.flash("success", "Password changed successfully");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", "Failed to change password: " + error.message);
        res.redirect("/listings");
    }
};

// Render booking details page
module.exports.renderBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('listing');

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/users/bookings');
        }

        // Check if the logged-in user is the owner of the booking
        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to view this booking');
            return res.redirect('/users/bookings');
        }

        res.render('users/booking-details.ejs', { booking });
    } catch (error) {
        req.flash('error', 'Failed to load booking details: ' + error.message);
        res.redirect('/users/bookings');
    }
};


module.exports.updateNotifications = async (req, res) => {
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

        // Log the notification preferences update
        await auditLogger.log({
            user: req.user.username,
            action: "update_notifications",
            resourceType: "user_preferences",
            resourceId: req.user._id.toString(),
            ipAddress: req.ip,
            status: "success",
            details: { preferences: user.notificationPreferences }
        });

        req.flash("success", "Notification preferences updated");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", "Failed to update notification preferences");
        res.redirect("/listings");
    }
};

// Render booking details page
module.exports.renderBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('listing');

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/users/bookings');
        }

        // Check if the logged-in user is the owner of the booking
        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to view this booking');
            return res.redirect('/users/bookings');
        }

        res.render('users/booking-details.ejs', { booking });
    } catch (error) {
        req.flash('error', 'Failed to load booking details: ' + error.message);
        res.redirect('/users/bookings');
    }
};



// View another user's profile
module.exports.viewUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/listings");
        }

        // Get user's public listings
        const listings = await Listing.find({
            owner: user._id,
            status: 'approved'
        }).sort({ createdAt: -1 });

        res.render("users/public-profile.ejs", {
            profileUser: user,
            listings
        });
    } catch (error) {
        req.flash("error", "Failed to load profile: " + error.message);
        res.redirect("/listings");
    }
};

// Render booking details page
module.exports.renderBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('listing');

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/users/bookings');
        }

        // Check if the logged-in user is the owner of the booking
        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to view this booking');
            return res.redirect('/users/bookings');
        }

        res.render('users/booking-details.ejs', { booking });
    } catch (error) {
        req.flash('error', 'Failed to load booking details: ' + error.message);
        res.redirect('/users/bookings');
    }
};



module.exports.renderBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate({
            path: "listing",
            select: "title price location"
        }).sort({ createdAt: -1 });

        res.render("users/bookings.ejs", { bookings });
    } catch (error) {
        req.flash("error", "Unable to fetch bookings.");
        res.redirect("/profile");
    }
};

// Cancel a booking
module.exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/users/bookings');
        }

        // Check if the logged-in user is the owner of the booking
        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to cancel this booking');
            return res.redirect('/users/bookings');
        }

        // Check if the booking is already cancelled or completed
        if (booking.status === 'cancelled' || booking.status === 'completed') {
            req.flash('error', `Booking is already ${booking.status}. Cannot cancel.`);
            return res.redirect('/users/bookings');
        }

        // Update booking status to cancelled
        booking.status = 'cancelled';
        await booking.save();

        // Log the booking cancellation action
        await auditLogger.log({
            user: req.user.username,
            action: "cancel",
            resourceType: "booking",
            resourceId: booking._id.toString(),
            ipAddress: req.ip,
            status: "success",
            details: { before: { status: "pending or confirmed" }, after: { status: "cancelled" } }
        });

        req.flash('success', 'Booking cancelled successfully.');
        res.redirect('/users/bookings');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to cancel booking: ' + error.message);
        res.redirect('/users/bookings');
    }
};


// Render booking details page
module.exports.renderBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('listing');

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/users/bookings');
        }

        // Check if the logged-in user is the owner of the booking
        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to view this booking');
            return res.redirect('/users/bookings');
        }

        res.render('users/booking-details.ejs', { booking });
    } catch (error) {
        req.flash('error', 'Failed to load booking details: ' + error.message);
        res.redirect('/users/bookings');
    }
};