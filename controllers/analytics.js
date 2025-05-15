const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");

// Get analytics data for the admin dashboard
module.exports.getDashboardAnalytics = async (req, res) => {
    try {
        // Get counts for various entities
        const totalListings = await Listing.countDocuments({});
        const approvedListings = await Listing.countDocuments({ status: "approved" });
        const pendingListings = await Listing.countDocuments({ status: "pending" });
        const rejectedListings = await Listing.countDocuments({ status: "rejected" });

        const totalUsers = await User.countDocuments({});
        const adminUsers = await User.countDocuments({ isAdmin: true });
        const activeUsers = await User.countDocuments({ isActive: true });

        const totalReviews = await Review.countDocuments({});
        const pendingReviews = await Review.countDocuments({ status: "pending" });
        const approvedReviews = await Review.countDocuments({ status: "approved" });

        const totalBookings = await Booking.countDocuments({});
        const pendingBookings = await Booking.countDocuments({ status: "pending" });
        const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
        const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });
        const completedBookings = await Booking.countDocuments({ status: "completed" });

        // Calculate total revenue from completed bookings
        const bookings = await Booking.find({ status: "completed" });
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

        // Get listing categories distribution
        const categoryDistribution = await Listing.aggregate([
            { $match: { status: "approved" } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get recent bookings
        const recentBookings = await Booking.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: "listing",
                select: "title price"
            })
            .populate({
                path: "user",
                select: "username email"
            });

        // Get recent user registrations
        const recentUsers = await User.find({})
            .sort({ _id: -1 })
            .limit(5);

        // Return all analytics data
        return {
            counts: {
                listings: { total: totalListings, approved: approvedListings, pending: pendingListings, rejected: rejectedListings },
                users: { total: totalUsers, admin: adminUsers, active: activeUsers },
                reviews: { total: totalReviews, pending: pendingReviews, approved: approvedReviews },
                bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings, cancelled: cancelledBookings, completed: completedBookings }
            },
            revenue: totalRevenue,
            categoryDistribution,
            recentBookings,
            recentUsers
        };
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
    }
};

// Get audit log data with pagination and filtering
module.exports.getAuditLogs = async (filters = {}, page = 1, limit = 20) => {
    try {
        const AuditLog = require("../models/auditLog.js");

        // Convert page and limit to numbers if they're strings
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 20;

        // Ensure page is at least 1
        page = Math.max(1, page);

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build query based on filters
        let query = {};

        // Apply basic filters
        if (filters.user) query.user = filters.user;
        if (filters.action) query.action = filters.action;
        if (filters.resourceType) query.resourceType = filters.resourceType;
        if (filters.resourceId) query.resourceId = filters.resourceId;
        if (filters.status) query.status = filters.status;

        // Handle date range filtering
        if (filters.startDate || filters.endDate) {
            query.timestamp = {};
            if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
            if (filters.endDate) {
                // Set end date to end of day
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                query.timestamp.$lte = endDate;
            }
        }

        // Handle search across multiple fields
        if (filters.search) {
            const searchRegex = new RegExp(filters.search, 'i');
            query.$or = [
                { user: searchRegex },
                { action: searchRegex },
                { resourceType: searchRegex },
                { resourceId: searchRegex }
            ];
        }

        // Get total count for pagination
        const total = await AuditLog.countDocuments(query);

        // Get logs with pagination
        const logs = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        };
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return {
            message: "Error fetching audit logs: " + error.message,
            logs: [],
            pagination: {
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
            }
        };
    }
};



// Generate reports
module.exports.generateReport = async (reportType) => {
    let reportData = {};

    switch (reportType) {
        case "listings":
            reportData = await getListingsReport();
            break;
        case "bookings":
            reportData = await getBookingsReport();
            break;
        case "users":
            reportData = await getUsersReport();
            break;
        case "revenue":
            reportData = await getRevenueReport();
            break;
        default:
            throw new Error("Invalid report type");
    }

    return reportData;
};

// Helper functions for reports
async function getListingsReport() {
    const listings = await Listing.find({}).populate("owner", "username email");
    return { listings };
}

async function getBookingsReport() {
    const bookings = await Booking.find({})
        .populate("listing", "title price location")
        .populate("user", "username email");
    return { bookings };
}

async function getUsersReport() {
    const users = await User.find({});
    return { users };
}

async function getRevenueReport() {
    const bookings = await Booking.find({ status: "completed" })
        .populate("listing", "title price location")
        .populate("user", "username email");

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Group revenue by month
    const revenueByMonth = {};
    bookings.forEach(booking => {
        const month = new Date(booking.createdAt).toLocaleString('default', { month: 'long' });
        if (!revenueByMonth[month]) {
            revenueByMonth[month] = 0;
        }
        revenueByMonth[month] += booking.totalPrice;
    });

    return { totalRevenue, revenueByMonth, bookings };
}