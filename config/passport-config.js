const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

// Configure passport strategies
module.exports = function () {
    // Local Strategy (already set up in app.js)
    passport.use(new LocalStrategy(User.authenticate()));

    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with the same email
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            user = await User.findOne({ email: email });

            if (user) {
                // Update existing user with Google ID
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }

            // Create new user
            const newUser = new User({
                username: profile.displayName.replace(/\s+/g, '') + Math.floor(Math.random() * 1000),
                email: email,
                googleId: profile.id,
                avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
            });

            // Generate random password for the user
            const password = Math.random().toString(36).slice(-8);
            await User.register(newUser, password);

            return done(null, newUser);
        } catch (err) {
            return done(err);
        }
    }));

    // Facebook OAuth Strategy
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this Facebook ID
            let user = await User.findOne({ facebookId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with the same email
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            user = await User.findOne({ email: email });

            if (user) {
                // Update existing user with Facebook ID
                user.facebookId = profile.id;
                await user.save();
                return done(null, user);
            }

            // Create new user
            const newUser = new User({
                username: profile.displayName.replace(/\s+/g, '') + Math.floor(Math.random() * 1000),
                email: email,
                facebookId: profile.id,
                avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
            });

            // Generate random password for the user
            const password = Math.random().toString(36).slice(-8);
            await User.register(newUser, password);

            return done(null, newUser);
        } catch (err) {
            return done(err);
        }
    }));

    // Twitter OAuth Strategy
    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL,
        includeEmail: true
    }, async (token, tokenSecret, profile, done) => {
        try {
            // Check if user already exists with this Twitter ID
            let user = await User.findOne({ twitterId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with the same email
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            user = await User.findOne({ email: email });

            if (user) {
                // Update existing user with Twitter ID
                user.twitterId = profile.id;
                await user.save();
                return done(null, user);
            }

            // Create new user
            const newUser = new User({
                username: profile.username + Math.floor(Math.random() * 1000),
                email: email,
                twitterId: profile.id,
                avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
            });

            // Generate random password for the user
            const password = Math.random().toString(36).slice(-8);
            await User.register(newUser, password);

            return done(null, newUser);
        } catch (err) {
            return done(err);
        }
    }));

    // Serialize and deserialize user (already set up in app.js)
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};