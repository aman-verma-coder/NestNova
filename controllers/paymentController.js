const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const Listing = require('../models/listings');
const Booking = require('../models/booking'); // Import the Booking model

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

// console.log("DEBUG: RAZORPAY_ID_KEY:", process.env.RAZORPAY_ID_KEY);
// console.log("DEBUG: RAZORPAY_SECRET_KEY:", process.env.RAZORPAY_SECRET_KEY);
// console.log("DEBUG: razorpayInstance after initialization:", razorpayInstance);

const renderProductPage = async (req, res) => {

    try {

        res.render('product');

    } catch (error) {
        console.log(error.message);
    }

}

const createOrder = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ success: false, msg: 'Please login to continue' });
        }

        const amount = req.body.amount * 100;
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: req.user.email,
            notes: {
                listingId: req.body.listingId,
                userId: req.user._id
            }
        }

        razorpayInstance.orders.create(options,
            (err, order) => {
                if (!err) {
                    res.status(200).send({
                        success: true,
                        msg: 'Order Created',
                        order_id: order.id,
                        amount: amount,
                        key_id: RAZORPAY_ID_KEY,
                        product_name: req.body.name,
                        description: req.body.description,
                        contact: req.user.phone || '',
                        name: req.user.username,
                        email: req.user.email
                    });
                } else {
                    res.status(400).send({ success: false, msg: 'Something went wrong!' });
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}

const handlePaymentSuccess = async (req, res) => {
    try {
        const { paymentId, orderId, listingId } = req.body;

        if (!paymentId || !orderId || !listingId) {
            return res.status(400).send({ success: false, msg: 'Missing required parameters' });
        }

        // Get listing details
        const listing = await Listing.findById(listingId).populate('owner');
        if (!listing) {
            return res.status(404).send({ success: false, msg: 'Listing not found' });
        }

        // Create and save booking to database
        const newBooking = new Booking({
            listing: listingId,
            user: req.user._id,
            checkIn: new Date(), // Default to today
            checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
            guests: 2, // Default value
            totalPrice: listing.price,
            status: 'pending',
            paymentId: paymentId,
            orderId: orderId
        });

        await newBooking.save();

        // Redirect to the booking success page
        return res.status(200).json({
            success: true,
            redirectUrl: `/booking-success?paymentId=${paymentId}&listingId=${listingId}&orderId=${orderId}`
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ success: false, msg: 'Server error' });
    }
}

const renderBookingSuccess = async (req, res) => {
    try {
        const { paymentId, listingId, orderId } = req.query;

        if (!paymentId || !listingId || !orderId) {
            req.flash('error', 'Missing booking information');
            return res.redirect('/listings');
        }

        // Get listing details
        const listing = await Listing.findById(listingId).populate('owner');
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }

        // Find the booking in the database
        const booking = await Booking.findOne({
            paymentId: paymentId,
            orderId: orderId,
            listing: listingId
        });

        if (!booking) {
            // If booking not found, create a temporary one for display purposes
            const tempBooking = {
                paymentId,
                orderId,
                amount: listing.price * 100, // Convert to paise for consistency
                checkIn: new Date().toLocaleDateString(), // Default to today
                checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Default to 7 days from now
                guests: 2 // Default value
            };

            // Render with temporary booking
            return res.render('listings/booking-success.ejs', {
                listing,
                booking: tempBooking,
                paymentId,
                currentUser: req.user // Pass the currentUser to the template
            });
        }

        // Add amount property to the booking object for consistency with the template
        booking.amount = booking.totalPrice * 100;

        // Render the booking success page with all necessary information
        res.render('listings/booking-success.ejs', {
            listing,
            booking,
            paymentId,
            currentUser: req.user // Pass the currentUser to the template
        });
    } catch (error) {
        console.log(error.message);
        req.flash('error', 'Failed to load booking details');
        res.redirect('/listings');
    }
}


// Cancel booking and process refund
const cancelBooking = async (req, res) => {
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

        // Calculate 50% refund amount in paise
        const refundAmount = Math.round(booking.totalPrice * 0.5 * 100);

        // Check if the booking is already cancelled or completed
        if (booking.status === 'cancelled' || booking.status === 'completed') {
            req.flash('error', `Booking is already ${booking.status}. Cannot cancel.`);
            return res.redirect('/users/bookings');
        }

        // Implement Razorpay refund logic
        if (booking.paymentId) {
            console.log('DEBUG: Attempting Razorpay refund...');
            console.log('DEBUG: razorpayInstance:', razorpayInstance);
            console.log('DEBUG: razorpayInstance.payments:', razorpayInstance.payments);
            console.log('DEBUG: Type of razorpayInstance.payments:', typeof razorpayInstance.payments);
            console.log('DEBUG: Content of razorpayInstance.payments:', razorpayInstance.payments);
            await razorpayInstance.payments.refund(booking.paymentId, {
                amount: refundAmount,
                speed: 'optimum'
            });
            console.log('DEBUG: Razorpay refund successful.');
            // Refund successful, update booking status
            booking.status = 'cancelled';
            await booking.save();
            req.flash('success', `Booking cancelled successfully. A refund of Rs ${(refundAmount / 100).toFixed(2)} will be processed.`);
        } else {
            // No payment ID, just update status
            booking.status = 'cancelled';
            await booking.save();
            req.flash('success', 'Booking cancelled successfully. No payment was recorded for this booking.');
        }

        res.redirect('/users/bookings');
    } catch (error) {
        console.log(error.message);
        req.flash('error', 'Failed to cancel booking: ' + error.message);
        res.redirect('/users/bookings');
    }
};

module.exports = {
    renderProductPage,
    createOrder,
    handlePaymentSuccess,
    renderBookingSuccess,
    cancelBooking
}