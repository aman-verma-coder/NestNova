# Social Authentication Setup Guide

## Overview
This guide will help you set up social authentication (Google, Facebook, and Twitter) for the NestNova application.

## Prerequisites
- Node.js and npm installed
- MongoDB database set up
- Basic understanding of OAuth 2.0

## Installation
The required packages have already been installed:
- passport-google-oauth20
- passport-facebook
- passport-twitter

## Configuration Steps

### 1. Google OAuth Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add authorized JavaScript origins: `http://localhost:8080`
8. Add authorized redirect URIs: `http://localhost:8080/auth/google/callback`
9. Click "Create"
10. Copy the Client ID and Client Secret
11. Update the `.env` file with your credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
   ```

### 2. Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add the "Facebook Login" product to your app
4. In the Facebook Login settings, add the following OAuth Redirect URI: `http://localhost:8080/auth/facebook/callback`
5. Navigate to the app's basic settings to get the App ID and App Secret
6. Update the `.env` file with your credentials:
   ```
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   FACEBOOK_CALLBACK_URL=http://localhost:8080/auth/facebook/callback
   ```

### 3. Twitter OAuth Setup
1. Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or select an existing one
3. Navigate to the app settings
4. Enable "3-legged OAuth" and set the callback URL to: `http://localhost:8080/auth/twitter/callback`
5. Get the API Key (Consumer Key) and API Secret (Consumer Secret)
6. Update the `.env` file with your credentials:
   ```
   TWITTER_CONSUMER_KEY=your_consumer_key
   TWITTER_CONSUMER_SECRET=your_consumer_secret
   TWITTER_CALLBACK_URL=http://localhost:8080/auth/twitter/callback
   ```

## Testing
1. Start your application: `npm start`
2. Navigate to the login page: `http://localhost:8080/login`
3. Click on the social login buttons to test the authentication

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**
   - Ensure the callback URLs in your OAuth provider settings exactly match the ones in your `.env` file

2. **Invalid Credentials**
   - Double-check that you've copied the correct credentials to your `.env` file

3. **Missing Scope Permissions**
   - For Google and Facebook, ensure you've requested the necessary scopes (email, profile, etc.)

4. **HTTPS Requirements**
   - Some OAuth providers require HTTPS for production. For local development, HTTP is usually acceptable.

## Production Considerations

For production deployment:

1. Update the callback URLs in both the OAuth provider settings and your `.env` file to use your production domain
2. Ensure your production environment uses HTTPS
3. Set appropriate security measures for your OAuth credentials

## Additional Resources

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Twitter OAuth Documentation](https://developer.twitter.com/en/docs/authentication/oauth-1-0a)