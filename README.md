# NestNova

NestNova is a comprehensive property listing and booking platform that connects travelers with unique accommodations around the world. Similar to Airbnb, it allows hosts to list their properties and travelers to discover and book stays based on their preferences. The platform features a robust admin approval system to ensure quality listings and a seamless user experience for both hosts and travelers.

## Features

### For Travelers
- **Browse Listings**: Explore properties with detailed descriptions, high-resolution images, amenities, pricing, and availability calendars
- **Advanced Search**: Find perfect accommodations using powerful search filters by title, description, location, country, price range, or amenities
- **Category Filtering**: Discover properties by categories like Trending, Beaches, Pools, Mountains, Iconic Cities, Countryside, Luxury, and Budget-friendly options
- **Personalized Recommendations**: Receive tailored property suggestions based on your browsing history, previous bookings, and preferences
- **User Authentication**: Create an account, log in securely, manage your profile, and track your booking history
- **Wishlist Creation**: Save favorite properties to revisit later during your planning process
- **Reviews & Ratings**: Leave detailed reviews and ratings for properties you've stayed at to help other travelers
- **Secure Payments**: Book properties with confidence using the integrated Razorpay payment gateway with multiple payment options
- **Interactive Maps**: View property locations with Mapbox integration to explore the neighborhood and nearby attractions
- **Responsive Design**: Enjoy a seamless experience across desktop, tablet, and mobile devices

### For Hosts
- **List Properties**: Create detailed listings with comprehensive descriptions, multiple high-resolution images, and competitive pricing
- **Manage Listings**: Edit, update, or remove your property listings with an intuitive dashboard interface
- **Approval System**: Listings go through an admin approval process to ensure quality and authenticity
- **Booking Management**: Track and manage booking requests, confirmations, and cancellations
- **Host Dashboard**: Access analytics on listing performance, views, and booking statistics
- **Communication Tools**: Interact with potential guests through the integrated messaging system

### For Admins
- **Admin Dashboard**: Comprehensive control panel to manage all aspects of the platform
- **Listing Approval Workflow**: Review and approve/reject property listings with detailed feedback options
- **User Management**: Manage user accounts, permissions, and resolve user-related issues
- **Content Moderation**: Monitor and moderate reviews and user-generated content
- **Analytics & Reporting**: Access platform-wide statistics, booking trends, and revenue reports
- **System Configuration**: Manage platform settings, categories, and featured listings

## Architecture & Technical Details

### Application Architecture
- **MVC Pattern**: Follows Model-View-Controller architecture for clean code organization
- **RESTful API**: Well-structured API endpoints for client-server communication
- **Server-Side Rendering**: Uses EJS templates for fast initial page loads and SEO benefits
- **Responsive Design**: Mobile-first approach ensuring compatibility across all devices

### Authentication System
- **Passport.js Integration**: Secure local authentication strategy with passport-local-mongoose
- **Session Management**: Persistent sessions with express-session and connect-mongo
- **Role-Based Access Control**: Different permission levels for travelers, hosts, and admins
- **Password Security**: Secure password storage and authentication

### Search & Filter System
- **MongoDB Queries**: Powerful query capabilities for complex searches
- **Geospatial Queries**: Location-based search functionality with Mapbox integration
- **Text Search**: Full-text search capabilities for listing content
- **Filter Combinations**: Multiple filter criteria can be combined for precise results

### Notification System
- **User Preferences**: Customizable notification settings
- **Event Triggers**: Automated notifications for bookings, reviews, and messages
- **Multi-channel Delivery**: Email and in-app notifications

## Technologies Used

### Backend
- **Node.js & Express**: Server-side JavaScript framework for building fast and scalable web applications
- **MongoDB**: NoSQL database for flexible and efficient storage of listings, users, reviews, and bookings
- **Mongoose**: Elegant MongoDB object modeling for Node.js with built-in type casting and validation
- **Passport.js**: Authentication middleware for Node.js with various strategies
- **Joi**: Schema validation for request data validation and sanitization
- **Multer & Cloudinary**: Image upload handling and cloud storage for property photos
- **Express-session & Connect-mongo**: Session management with MongoDB storage

### Frontend
- **EJS & EJS-mate**: Embedded JavaScript templates for dynamic server-side rendering
- **Bootstrap**: Frontend CSS framework for responsive and modern UI components
- **JavaScript**: Client-side interactivity and form validation
- **Mapbox GL JS**: Interactive maps for property locations with custom markers
- **AJAX**: Asynchronous requests for seamless user experience

### Payment Integration
- **Razorpay**: Secure payment gateway for handling transactions
- **Webhook Integration**: Real-time payment status updates

### DevOps & Deployment
- **Git & GitHub**: Version control and collaborative development
- **Environment Variables**: Configuration management for different environments
- **Error Handling**: Comprehensive error logging and monitoring
- **Nodemon**: Development server with auto-restart capability

## Installation & Setup

### Prerequisites
- Node.js (v20.7.0 recommended)
- MongoDB (local or Atlas)
- npm package manager
- Accounts for third-party services (Cloudinary, Mapbox, Razorpay)

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```
ATLAS_DB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAP_TOKEN=your_mapbox_token
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
PORT=8080
```

### Installation Steps

1. Clone the repository
   ```
   git clone https://github.com/aman-verma-coder/NestNova
   cd NestNova
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables as described above

4. Start the development server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:8080`

### Database Setup

The application will automatically connect to your MongoDB instance using the connection string provided in the environment variables. The required collections will be created automatically as needed.

## Project Structure

```
├── controllers/       # Route controllers for handling business logic
│   ├── listing.js     # Listing-related controllers
│   ├── user.js        # User authentication and profile controllers
│   ├── review.js      # Review management controllers
│   ├── admin.js       # Admin panel controllers
│   ├── notification.js # Notification management
│   ├── wishlist.js    # Wishlist functionality
│   └── paymentController.js # Payment processing
├── models/            # Database models and schemas
│   ├── listings.js    # Listing schema and methods
│   ├── user.js        # User schema with authentication
│   ├── review.js      # Review schema and validation
│   ├── booking.js     # Booking schema and payment integration
│   ├── notification.js # Notification schema
│   ├── wishlist.js    # Wishlist schema
│   └── auditLog.js    # Audit logging functionality
├── public/            # Static assets (CSS, JS, images)
│   ├── css/           # Stylesheets
│   ├── Js/            # Client-side JavaScript
│   └── images/        # Static images and icons
├── routes/            # Application routes
│   ├── listing.js     # Listing routes
│   ├── user.js        # Authentication routes
│   ├── review.js      # Review routes
│   ├── admin.js       # Admin panel routes
│   ├── notification.js # Notification routes
│   ├── wishlist.js    # Wishlist routes
│   ├── paymentRoute.js # Payment processing routes
│   └── footer.js      # Footer page routes
├── utils/             # Utility functions and helpers
│   ├── ExpressError.js # Custom error handling
│   ├── wrapAsync.js   # Async function wrapper
│   └── auditLogger.js # Audit logging utility
├── views/             # EJS templates
│   ├── layout/        # Page layouts and partials
│   ├── listings/      # Listing-related views
│   ├── users/         # User profile and authentication views
│   ├── admin/         # Admin panel views
│   ├── includes/      # Reusable view components
│   ├── partials/      # Partial view components
│   └── pages/         # Static pages (About, Privacy, T&C)
├── app.js             # Main application file
├── cloudConfig.js     # Cloudinary configuration
├── middleware.js      # Custom middleware
├── schema.js          # Joi validation schemas
└── package.json       # Project dependencies
```

## API Endpoints

### Authentication
- `POST /signup`: Register a new user
- `POST /login`: Log in an existing user with secure session management
- `GET /logout`: Log out the current user and clear session
- `GET /profile`: View user profile information
- `PUT /profile`: Update user profile details

### Listings
- `GET /listings`: Get all approved listings with pagination
- `GET /listings/search`: Search listings with multiple filters
- `GET /listings/category/:category`: Filter listings by category
- `GET /listings/:id/show`: View a specific listing with details
- `GET /listings/new`: Form to create a new listing (host only)
- `POST /listings/new`: Create a new listing with validation
- `GET /listings/:id/edit`: Form to edit a listing (owner or admin only)
- `PUT /listings/:id/edit`: Update a listing with validation
- `DELETE /listings/:id/delete`: Delete a listing (owner or admin only)

### Reviews
- `POST /listings/:id/review`: Add a review to a listing with rating
- `PUT /listings/:id/review/:reviewId`: Edit an existing review
- `DELETE /listings/:id/review/:reviewId`: Delete a review

### Bookings
- `POST /listings/:id/book`: Create a new booking request
- `GET /bookings`: View all user bookings
- `GET /bookings/:id`: View a specific booking details
- `PUT /bookings/:id/cancel`: Cancel a booking

### Admin
- `GET /admin/dashboard`: Admin dashboard with statistics
- `GET /admin/listings`: Manage all listings
- `PUT /admin/listings/:id/approve`: Approve a pending listing
- `PUT /admin/listings/:id/reject`: Reject a listing with feedback
- `GET /admin/users`: Manage user accounts

### Wishlist
- `POST /wishlist/add`: Add a listing to wishlist
- `GET /wishlist`: View all wishlist items
- `DELETE /wishlist/remove`: Remove a listing from wishlist

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Mapbox](https://www.mapbox.com/)
- [Cloudinary](https://cloudinary.com/)
- [Razorpay](https://razorpay.com/)