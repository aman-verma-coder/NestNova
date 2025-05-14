# NestNova

NestNova is a comprehensive property listing and booking platform that connects travelers with unique accommodations around the world. Similar to Airbnb, it allows hosts to list their properties and travelers to discover and book stays based on their preferences. The platform features a robust admin approval system to ensure quality listings and a seamless user experience for both hosts and travelers.

## Features

### For Travelers
- **Browse Listings**: Explore properties with detailed descriptions, high-resolution images, amenities, pricing, and availability calendars
- **Advanced Search**: Find perfect accommodations using powerful search filters by title, description, location, country, price range, or amenities
- **Category Filtering**: Discover properties by categories like Trending, Beaches, Pools, Mountains, Iconic Cities, Countryside, Luxury, and Budget-friendly options
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
- **Passport.js Integration**: Secure local authentication strategy
- **Session Management**: Persistent sessions with express-session
- **Role-Based Access Control**: Different permission levels for travelers, hosts, and admins
- **Password Security**: Bcrypt hashing for secure password storage

### Search & Filter System
- **MongoDB Aggregation**: Powerful query pipeline for complex searches
- **Geospatial Queries**: Location-based search functionality
- **Text Search**: Full-text search capabilities for listing content
- **Filter Combinations**: Multiple filter criteria can be combined for precise results

## Technologies Used

### Backend
- **Node.js & Express**: Server-side JavaScript framework for building fast and scalable web applications
- **MongoDB**: NoSQL database for flexible and efficient storage of listings, users, reviews, and bookings
- **Mongoose**: Elegant MongoDB object modeling for Node.js with built-in type casting and validation
- **Passport.js**: Authentication middleware for Node.js with various strategies
- **Joi**: Schema validation for request data validation and sanitization
- **Multer & Cloudinary**: Image upload handling and cloud storage for property photos
- **Express-session**: Session management for user authentication state

### Frontend
- **EJS**: Embedded JavaScript templates for dynamic server-side rendering
- **Bootstrap 5**: Frontend CSS framework for responsive and modern UI components
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

## Installation & Setup

### Prerequisites
- Node.js (v20.7.0 recommended)
- MongoDB (local or Atlas)
- npm or yarn package manager
- Accounts for third-party services (Cloudinary, Mapbox, Razorpay)

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```
ATLAS_DB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPBOX_TOKEN=your_mapbox_token
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
│   ├── listings.js    # Listing-related controllers
│   ├── users.js       # User authentication and profile controllers
│   ├── reviews.js     # Review management controllers
│   └── admin.js       # Admin panel controllers
├── models/           # Database models and schemas
│   ├── listing.js     # Listing schema and methods
│   ├── user.js        # User schema with authentication
│   ├── review.js      # Review schema and validation
│   └── booking.js     # Booking schema and payment integration
├── public/           # Static assets (CSS, JS, images)
│   ├── css/           # Stylesheets
│   ├── js/            # Client-side JavaScript
│   └── images/        # Static images and icons
├── routes/           # Application routes
│   ├── listings.js    # Listing routes
│   ├── users.js       # Authentication routes
│   ├── reviews.js     # Review routes
│   └── admin.js       # Admin panel routes
├── utils/            # Utility functions and helpers
│   ├── middleware.js  # Custom middleware functions
│   ├── validators.js  # Input validation helpers
│   └── helpers.js     # Miscellaneous helper functions
├── views/            # EJS templates
│   ├── layouts/       # Page layouts and partials
│   ├── listings/      # Listing-related views
│   ├── users/         # User profile and authentication views
│   └── admin/         # Admin panel views
├── app.js            # Main application file
├── cloudConfig.js    # Cloudinary configuration
├── middleware.js     # Custom middleware
├── schema.js         # Joi validation schemas
└── package.json      # Project dependencies
```

## API Endpoints

### Authentication
- `POST /signup`: Register a new user with email verification
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
- `GET /admin/listings`: View all listings for approval
- `POST /admin/listings/:id/approve`: Approve a listing
- `POST /admin/listings/:id/reject`: Reject a listing with feedback
- `GET /admin/users`: Manage user accounts
- `GET /admin/bookings`: View all bookings platform-wide

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Bootstrap](https://getbootstrap.com/) - Frontend framework
- [Mapbox](https://www.mapbox.com/) - Maps and location data
- [Cloudinary](https://cloudinary.com/) - Cloud-based image management
- [Razorpay](https://razorpay.com/) - Payment gateway solution
- [Passport.js](http://www.passportjs.org/) - Authentication middleware