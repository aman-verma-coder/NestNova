const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.js');
const { isLoggedIn } = require('../middleware.js');

// All wishlist routes require authentication
router.use(isLoggedIn);

// Index - show all wishlists
router.get('/', wishlistController.renderWishlists);

// New - form to create new wishlist
router.get('/new', wishlistController.renderNewWishlistForm);

// Create - add new wishlist to DB
router.post('/', wishlistController.createWishlist);

// Show - details for one specific wishlist
router.get('/:id', wishlistController.showWishlist);

// Delete - remove wishlist
router.delete('/:id', wishlistController.deleteWishlist);

// Add listing to wishlist
router.post('/:wishlistId/listings/:listingId', wishlistController.addToWishlist);

// Remove listing from wishlist
router.delete('/:wishlistId/listings/:listingId', wishlistController.removeFromWishlist);

// Quick add to default wishlist (from listing page)
router.post('/quick-add/:listingId', wishlistController.quickAddToWishlist);

module.exports = router;