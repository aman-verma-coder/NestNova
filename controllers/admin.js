const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const analyticsController = require("./analytics.js");
const auditLogger = require("../utils/auditLogger.js");
const Razorpay = require("razorpay");

// Render admin dashboard with pending listings and reviews
module.exports.renderDashboard = async (req, res) => {
    // Get all pending listings
    const pendingListings = await Listing.find({ status: "pending" }).populate("owner");

    // Get all listings for the admin to view
    const allListings = await Listing.find({}).populate("owner").sort({ status: 1 });

    // Get count of pending reviews that need moderation
    const pendingReviewsCount = await Review.countDocuments({ status: "pending" });

    // Get count of pending bookings that need confirmation
    const pendingBookingsCount = await Booking.countDocuments({ status: "pending" });

    // Get analytics data
    const analyticsData = await analyticsController.getDashboardAnalytics();

    res.render("admin/dashboard.ejs", {
        pendingListings,
        allListings,
        pendingReviewsCount,
        pendingBookingsCount,
        analyticsData
    });
};

// Render reviews management page
module.exports.renderReviews = async (req, res) => {
    // Get all reviews with populated author and listing information
    const reviews = await Review.find({}).populate("author").populate({
        path: "listingId",
        select: "title"
    }).sort({ status: 1, createdAt: -1 });

    res.render("admin/reviews.ejs", { reviews });
};

// Render users management page
module.exports.renderUsers = async (req, res) => {
    // Get all users with their listing counts
    const users = await User.find({});

    // Get listing counts for each user
    for (let user of users) {
        const listingCount = await Listing.countDocuments({ owner: user._id });
        user.listingCount = listingCount;
    }

    res.render("admin/users.ejs", { users });
};

// Approve a listing
module.exports.approveListing = async (req, res) => {
    const { id } = req.params;

    // Find the pending listing
    const listing = await Listing.findById(id);

    // Update the listing status directly instead of creating a new one
    listing.status = "approved";
    await listing.save();

    // Log the approval action
    await auditLogger.log({
        user: req.user.username,
        action: "approve",
        resourceType: "listing",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        changes: {
            before: { status: "pending" },
            after: { status: "approved" }
        }
    });

    req.flash("success", "Listing has been approved and is now visible to users");
    res.redirect("/admin/dashboard");
};

// Reject a listing
module.exports.rejectListing = async (req, res) => {
    const { id } = req.params;

    // Find the listing before deleting it
    const listing = await Listing.findById(id);

    // Remove from pending database without adding to main database
    await Listing.findByIdAndDelete(id);

    // Log the rejection action
    await auditLogger.log({
        user: req.user.username,
        action: "reject",
        resourceType: "listing",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        details: {
            title: listing ? listing.title : "Unknown listing",
            owner: listing && listing.owner ? listing.owner.toString() : "Unknown owner"
        }
    });

    req.flash("success", "Listing has been rejected");
    res.redirect("/admin/dashboard");
};

module.exports.pendingListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { status: "pending" });
    req.flash("success", "Listing status set to pending");
    res.redirect("/admin/dashboard");
}

// Delete a review
module.exports.deleteReview = async (req, res) => {
    const { id } = req.params;

    // Find the review to get the listing ID
    const review = await Review.findById(id);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect("/admin/reviews");
    }

    // Remove the review from the listing
    await Listing.findByIdAndUpdate(review.listingId, { $pull: { review: id } });

    // Delete the review
    await Review.findByIdAndDelete(id);

    req.flash("success", "Review has been deleted");
    res.redirect("/admin/reviews");
};

// Approve a review
module.exports.approveReview = async (req, res) => {
    const { id } = req.params;

    await Review.findByIdAndUpdate(id, { status: "approved" });

    // Log the review approval action
    await auditLogger.log({
        user: req.user.username,
        action: "approve",
        resourceType: "review",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        changes: {
            before: { status: "pending" },
            after: { status: "approved" }
        }
    });

    req.flash("success", "Review has been approved");
    res.redirect("/admin/reviews");
};

// Reject a review
module.exports.rejectReview = async (req, res) => {
    const { id } = req.params;

    await Review.findByIdAndUpdate(id, { status: "rejected" });

    // Log the review rejection action
    await auditLogger.log({
        user: req.user.username,
        action: "reject",
        resourceType: "review",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        changes: {
            before: { status: "pending" },
            after: { status: "rejected" }
        }
    });

    req.flash("success", "Review has been rejected");
    res.redirect("/admin/reviews");
};

// Make a user an admin
module.exports.makeAdmin = async (req, res) => {
    const { id } = req.params;

    // Get user info before update
    const user = await User.findById(id);
    await User.findByIdAndUpdate(id, { isAdmin: true });

    // Log the admin role assignment
    await auditLogger.log({
        user: req.user.username,
        action: "update",
        resourceType: "user",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        details: { role_change: "Granted admin privileges" },
        changes: {
            before: { isAdmin: false },
            after: { isAdmin: true }
        }
    });

    req.flash("success", "User has been made an admin");
    res.redirect("/admin/users");
};

// Remove admin privileges
module.exports.removeAdmin = async (req, res) => {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { isAdmin: false });

    req.flash("success", "Admin privileges have been removed");
    res.redirect("/admin/users");
};

// Toggle user active status
module.exports.toggleUserStatus = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    const newStatus = user.isActive === false ? true : false;

    await User.findByIdAndUpdate(id, { isActive: newStatus });

    // Log the user status change
    await auditLogger.log({
        user: req.user.username,
        action: "update",
        resourceType: "user",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        details: { username: user.username },
        changes: {
            before: { isActive: !newStatus },
            after: { isActive: newStatus }
        }
    });

    const statusMessage = newStatus ? "enabled" : "disabled";
    req.flash("success", `User has been ${statusMessage}`);
    res.redirect("/admin/users");
};

// Render bookings management page
module.exports.renderBookings = async (req, res) => {
    // Get all bookings with populated listing and user information
    const bookings = await Booking.find({}).populate({
        path: "listing",
        select: "title price location"
    }).populate({
        path: "user",
        select: "username email"
    }).sort({ createdAt: -1 });

    res.render("admin/bookings.ejs", { bookings });
};

// Render booking details page
module.exports.renderBookingDetails = async (req, res) => {
    const { id } = req.params;

    // Get the booking with populated listing and user information
    const booking = await Booking.findById(id).populate({
        path: "listing",
        select: "title price location image"
    }).populate({
        path: "user",
        select: "username email createdAt"
    });

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/admin/bookings");
    }

    res.render("admin/booking-details.ejs", { booking });
};

// Render cancellations management page
module.exports.renderCancellations = async (req, res) => {
    // Get all cancelled bookings with populated listing and user information
    const cancellations = await Booking.find({ status: "cancelled" }).populate({
        path: "listing",
        select: "title price location"
    }).populate({
        path: "user",
        select: "username email"
    }).sort({ updatedAt: -1 });

    res.render("admin/cancellations.ejs", { cancellations });
};

// Process refund for a cancelled booking
module.exports.processRefund = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking || booking.status !== "cancelled") {
        req.flash("error", "Booking not found or is not cancelled");
        return res.redirect("/admin/cancellations");
    }

    try {
        // Calculate 50% refund amount in paise (Razorpay uses paise)
        const refundAmount = Math.round(booking.totalPrice * 0.5 * 100);

        // Initialize Razorpay instance
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_ID_KEY,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        });

        // Process the refund if payment ID exists
        if (booking.paymentId) {
            await razorpayInstance.payments.refund(booking.paymentId, {
                amount: refundAmount,
                speed: 'optimum',
                notes: {
                    bookingId: booking._id.toString(),
                    reason: 'Cancellation refund - 50% of booking amount'
                }
            });

            // Update the booking to mark refund as processed
            await Booking.findByIdAndUpdate(id, { refundProcessed: true });

            // Log the refund processing action with amount details
            await auditLogger.log({
                user: req.user.username,
                action: "process_refund",
                resourceType: "booking",
                resourceId: id,
                ipAddress: req.ip,
                status: "success",
                changes: {
                    before: { refundProcessed: false },
                    after: { refundProcessed: true, refundAmount: (refundAmount / 100).toFixed(2) }
                }
            });

            req.flash("success", `Refund of ₹${(refundAmount / 100).toFixed(2)} (50% of booking amount) has been processed successfully`);
        } else {
            // No payment ID found, just mark as processed
            await Booking.findByIdAndUpdate(id, { refundProcessed: true });

            // Log the action
            await auditLogger.log({
                user: req.user.username,
                action: "process_refund",
                resourceType: "booking",
                resourceId: id,
                ipAddress: req.ip,
                status: "warning",
                changes: {
                    before: { refundProcessed: false },
                    after: { refundProcessed: true }
                },
                notes: "No payment ID found for this booking"
            });

            req.flash("warning", "Booking marked as refunded, but no payment ID was found to process actual refund");
        }

        res.redirect("/admin/cancellations");
    } catch (error) {
        console.error("Refund processing error:", error);
        req.flash("error", `Failed to process refund: ${error.message}`);
        res.redirect("/admin/cancellations");
    }
};

// Confirm a booking
module.exports.confirmBooking = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    await Booking.findByIdAndUpdate(id, { status: "confirmed" });

    // Log the booking confirmation action
    await auditLogger.log({
        user: req.user.username,
        action: "confirm",
        resourceType: "booking",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        changes: {
            before: { status: booking ? booking.status : "unknown" },
            after: { status: "confirmed" }
        }
    });

    req.flash("success", "Booking has been confirmed");
    res.redirect("/admin/bookings");
};

// Cancel a booking
module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    await Booking.findByIdAndUpdate(id, { status: "cancelled" });

    // Log the booking cancellation action
    await auditLogger.log({
        user: req.user.username,
        action: "cancel",
        resourceType: "booking",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        changes: {
            before: { status: booking ? booking.status : "unknown" },
            after: { status: "cancelled" }
        }
    });

    req.flash("success", "Booking has been cancelled");
    res.redirect("/admin/bookings");
};

// Mark a booking as completed
module.exports.completeBooking = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    await Booking.findByIdAndUpdate(id, { status: "completed" });

    // Log the booking completion action
    await auditLogger.log({
        user: req.user.username,
        action: "complete",
        resourceType: "booking",
        resourceId: id,
        ipAddress: req.ip,
        status: "success",
        changes: {
            before: { status: booking ? booking.status : "unknown" },
            after: { status: "completed" }
        }
    });

    req.flash("success", "Booking has been marked as completed");
    res.redirect("/admin/bookings");
};

// Render analytics dashboard
module.exports.renderAnalytics = async (req, res) => {
    const analyticsData = await analyticsController.getDashboardAnalytics();
    res.render("admin/analytics.ejs", { analyticsData });
};

// Render audit logs
module.exports.renderAuditLogs = async (req, res) => {
    // Get filter parameters from query string
    const filters = {};

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Apply resource type filter
    if (req.query.resourceType && req.query.resourceType !== 'all') {
        filters.resourceType = req.query.resourceType;
    }

    // Apply user type filter
    if (req.query.userType && req.query.userType !== 'all') {
        if (req.query.userType === 'admin') {
            // Filter for admin users
            filters.user = { $in: await User.find({ isAdmin: true }).distinct('username') };
        } else if (req.query.userType === 'regular') {
            // Filter for regular users
            filters.user = { $in: await User.find({ isAdmin: false }).distinct('username') };
        }
    }

    // Apply search filter
    if (req.query.search) {
        filters.search = req.query.search;
    }

    // Handle date filtering
    if (req.query.dateRange && req.query.dateRange !== 'all') {
        const now = new Date();

        if (req.query.dateRange === 'today') {
            filters.startDate = new Date(now.setHours(0, 0, 0, 0));
        } else if (req.query.dateRange === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
            startOfWeek.setHours(0, 0, 0, 0);
            filters.startDate = startOfWeek;
        } else if (req.query.dateRange === 'month') {
            filters.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
    }

    // Get audit logs with pagination
    const auditData = await analyticsController.getAuditLogs(filters, page, limit);

    // Add current query parameters to auditData for pagination links
    auditData.queryParams = { ...req.query };
    delete auditData.queryParams.page; // Remove page from query params to avoid duplication

    res.render("admin/audit-logs.ejs", { auditData });
};

// Get audit log details for a specific log entry
module.exports.getAuditLogDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const AuditLog = require("../models/auditLog.js");

        const logEntry = await AuditLog.findById(id);

        if (!logEntry) {
            return res.status(404).json({ error: "Log entry not found" });
        }

        // Return the log details as JSON
        res.json({
            ipAddress: logEntry.ipAddress,
            status: logEntry.status,
            details: logEntry.details,
            changes: logEntry.changes
        });
    } catch (error) {
        console.error("Error fetching audit log details:", error);
        res.status(500).json({ error: "Failed to fetch log details" });
    }
};

// Generate and download reports
module.exports.generateReport = async (req, res) => {
    const { reportType } = req.params;
    try {
        if (!reportType) {
            throw new Error("Report type is required");
        }
        const reportData = await analyticsController.generateReport(reportType);
        res.render("admin/report.ejs", { reportType, reportData });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin/analytics");
    }
};
