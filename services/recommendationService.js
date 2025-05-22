const UserActivity = require('../models/userActivity');
const Listing = require('../models/listings');
const Booking = require('../models/booking');

/**
 * Recommendation service to provide personalized listing recommendations
 * based on user browsing history, bookings, and preferences
 */
class RecommendationService {
    /**
     * Track a user's view of a listing
     * @param {String} userId - The user's ID
     * @param {String} listingId - The listing's ID
     */
    static async trackListingView(userId, listingId) {
        try {
            // Find or create user activity record
            let userActivity = await UserActivity.findOne({ user: userId });

            if (!userActivity) {
                userActivity = new UserActivity({ user: userId, viewedListings: [] });
            }

            // Check if listing is already in viewedListings
            const existingViewIndex = userActivity.viewedListings.findIndex(
                item => item.listing.toString() === listingId
            );

            if (existingViewIndex >= 0) {
                // Update existing record
                userActivity.viewedListings[existingViewIndex].viewCount += 1;
                userActivity.viewedListings[existingViewIndex].lastViewed = Date.now();
            } else {
                // Add new record
                userActivity.viewedListings.push({
                    listing: listingId,
                    viewCount: 1,
                    lastViewed: Date.now()
                });
            }

            // Update listing category preference
            const listing = await Listing.findById(listingId);
            if (listing && listing.category) {
                const categoryIndex = userActivity.preferredCategories.findIndex(
                    item => item.category === listing.category
                );

                if (categoryIndex >= 0) {
                    userActivity.preferredCategories[categoryIndex].weight += 1;
                } else {
                    userActivity.preferredCategories.push({
                        category: listing.category,
                        weight: 1
                    });
                }

                // Update location preference if available
                if (listing.location) {
                    const locationIndex = userActivity.preferredLocations.findIndex(
                        item => item.location === listing.location
                    );

                    if (locationIndex >= 0) {
                        userActivity.preferredLocations[locationIndex].weight += 1;
                    } else {
                        userActivity.preferredLocations.push({
                            location: listing.location,
                            weight: 1
                        });
                    }
                }
            }

            await userActivity.save();
            return true;
        } catch (error) {
            console.error('Error tracking listing view:', error);
            return false;
        }
    }

    /**
     * Track a user's search query
     * @param {String} userId - The user's ID
     * @param {String} query - The search query
     */
    static async trackSearchQuery(userId, query) {
        try {
            let userActivity = await UserActivity.findOne({ user: userId });

            if (!userActivity) {
                userActivity = new UserActivity({ user: userId });
            }

            userActivity.searchQueries.push({
                query,
                timestamp: Date.now()
            });

            await userActivity.save();
            return true;
        } catch (error) {
            console.error('Error tracking search query:', error);
            return false;
        }
    }

    /**
     * Get personalized recommendations for a user
     * @param {String} userId - The user's ID
     * @param {Number} limit - Maximum number of recommendations to return
     * @returns {Array} - Array of recommended listings
     */
    static async getRecommendations(userId, limit = 5) {
        try {
            const userActivity = await UserActivity.findOne({ user: userId });

            if (!userActivity ||
                (!userActivity.viewedListings.length &&
                    !userActivity.preferredCategories.length)) {
                // If no activity data, return trending listings
                return await Listing.find({
                    status: 'approved',
                    category: 'Trending'
                })
                    .sort({ _id: -1 })
                    .limit(limit);
            }

            // Get user's bookings to exclude from recommendations
            const userBookings = await Booking.find({ user: userId });
            const bookedListingIds = userBookings.map(booking => booking.listing.toString());

            // Get preferred categories sorted by weight
            const preferredCategories = userActivity.preferredCategories
                .sort((a, b) => b.weight - a.weight)
                .map(item => item.category);

            // Get preferred locations sorted by weight
            const preferredLocations = userActivity.preferredLocations
                .sort((a, b) => b.weight - a.weight)
                .map(item => item.location);

            // Build recommendation query
            const recommendationQuery = { status: 'approved' };

            // Exclude already booked listings
            if (bookedListingIds.length > 0) {
                recommendationQuery._id = { $nin: bookedListingIds };
            }

            // If we have preferred categories, use them
            if (preferredCategories.length > 0) {
                recommendationQuery.category = { $in: preferredCategories.slice(0, 3) };
            }

            // If we have preferred locations, use them
            if (preferredLocations.length > 0) {
                recommendationQuery.location = { $in: preferredLocations.slice(0, 3) };
            }

            // Get recommendations based on preferences
            let recommendations = await Listing.find(recommendationQuery)
                .sort({ _id: -1 })
                .limit(limit);

            // If we don't have enough recommendations, get more without location filter
            if (recommendations.length < limit && preferredLocations.length > 0) {
                const remainingLimit = limit - recommendations.length;
                const existingIds = recommendations.map(rec => rec._id);

                const additionalQuery = {
                    status: 'approved',
                    _id: { $nin: [...bookedListingIds, ...existingIds] }
                };

                if (preferredCategories.length > 0) {
                    additionalQuery.category = { $in: preferredCategories };
                }

                const additionalRecs = await Listing.find(additionalQuery)
                    .sort({ _id: -1 })
                    .limit(remainingLimit);

                recommendations = [...recommendations, ...additionalRecs];
            }

            // If we still don't have enough, get trending listings
            if (recommendations.length < limit) {
                const remainingLimit = limit - recommendations.length;
                const existingIds = recommendations.map(rec => rec._id);

                const trendingRecs = await Listing.find({
                    status: 'approved',
                    _id: { $nin: [...bookedListingIds, ...existingIds] },
                    category: 'Trending'
                })
                    .sort({ _id: -1 })
                    .limit(remainingLimit);

                recommendations = [...recommendations, ...trendingRecs];
            }

            return recommendations;
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return [];
        }
    }
}

module.exports = RecommendationService;