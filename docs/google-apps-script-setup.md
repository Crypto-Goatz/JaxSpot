# Google Apps Script Backend Setup Guide

This guide will help you deploy the JAX Platform backend using Google Apps Script and Google Sheets.

## Prerequisites

- Google account
- Access to Google Drive, Google Sheets, and Google Apps Script

## Step 1: Create a New Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Rename it to "JAX Platform Database"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
   - The ID is: `1ABC123DEF456GHI789JKL`

## Step 2: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Rename the project to "JAX Platform API"
4. Delete the default `myFunction()` code
5. Copy and paste the entire content from `scripts/google-apps-script-backend.js`

## Step 3: Configure the Script

1. In the Apps Script editor, update the `CONFIG` object:
   \`\`\`javascript
   const CONFIG = {
     API_KEY: "your-secure-api-key-here", // Change this!
     JWT_SECRET: "your-secure-jwt-secret-here", // Change this!
     SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
   }
   \`\`\`

2. Make sure to use strong, unique values for `API_KEY` and `JWT_SECRET`

## Step 4: Deploy as Web App

1. Click the "Deploy" button in the top right
2. Choose "New deployment"
3. Click the gear icon next to "Type" and select "Web app"
4. Fill in the deployment settings:
   - **Description**: "JAX Platform API v1"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. Click "Deploy"
6. Copy the web app URL (it will look like: `https://script.google.com/macros/s/ABC123.../exec`)

## Step 5: Update Environment Variables

1. In your Next.js project, create or update `.env.local`:
   \`\`\`env
   NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   NEXT_PUBLIC_GAS_API_KEY=your-secure-api-key-here
   \`\`\`

2. Replace `YOUR_SCRIPT_ID` with your actual script ID
3. Use the same API key you set in the Google Apps Script

## Step 6: Test the Setup

1. Start your Next.js development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to your application
3. Try registering a new account
4. Check your Google Spreadsheet - you should see new sheets created automatically:
   - Users
   - JaxPicks
   - PlatformApps
   - UserSessions
   - UsageLogs

## Step 7: Verify Data

1. Open your Google Spreadsheet
2. You should see the following sheets with sample data:
   - **Users**: Will contain registered users
   - **JaxPicks**: Contains sample JAX trading picks
   - **PlatformApps**: Contains the platform applications
   - **UserSessions**: Tracks user login sessions
   - **UsageLogs**: Logs app usage analytics

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Make sure the API key in your `.env.local` matches the one in Google Apps Script
   - Restart your Next.js development server after changing environment variables

2. **"CORS error" or network issues**
   - Ensure the Google Apps Script is deployed with "Anyone" access
   - Check that the web app URL is correct in your environment variables

3. **"UNAUTHORIZED" errors**
   - Try logging out and logging back in
   - Clear your browser's localStorage
   - Check that sessions are being created in the UserSessions sheet

4. **Sheets not being created**
   - Make sure the Google Apps Script has permission to access Google Sheets
   - Check the Apps Script execution transcript for errors

### Testing the API Directly

You can test the API directly using curl or Postman:

\`\`\`bash
# Test registration
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "auth_register",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "password": "testpassword123"
    },
    "apiKey": "your-secure-api-key-here"
  }'
\`\`\`

### Performance Considerations

- Google Apps Script has execution time limits (6 minutes for web apps)
- For production use, consider implementing caching and pagination
- Monitor your quota usage in the Google Cloud Console

## Security Notes

1. **Change the default API key and JWT secret** - never use the defaults in production
2. **Use HTTPS only** - Google Apps Script provides HTTPS by default
3. **Implement rate limiting** if needed for production use
4. **Regularly backup your spreadsheet** data

## Next Steps

1. **Set up monitoring**: Use Google Apps Script's built-in logging
2. **Implement backup strategy**: Regular exports of your spreadsheet data
3. **Add more features**: Extend the API with additional endpoints as needed
4. **Scale considerations**: For high traffic, consider migrating to a dedicated database

## Support

If you encounter issues:
1. Check the Google Apps Script execution transcript
2. Verify your environment variables
3. Test the API endpoints directly
4. Check the browser console for client-side errors

The backend is now ready to support your JAX Platform with user authentication, JAX picks management, and platform analytics!
\`\`\`

Now let me create the environment configuration file:
