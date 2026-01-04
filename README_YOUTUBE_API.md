# YouTube Data API v3 Testing Guide

## Overview
This guide explains how to test YouTube Data API v3 to see what data is available for automatically filling channel listing fields.

## Setup

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Add API Key to Environment Variables

Add to your `.env` file:

```env
YOUTUBE_API_KEY=your_api_key_here
```

### 3. Test the API

Use the test endpoint to check what data is available:

```bash
# Test with channel handle (@username)
curl "http://localhost:3000/api/test/youtube-channel?channelUrl=https://www.youtube.com/@mkbhd"

# Test with channel URL (c/username)
curl "http://localhost:3000/api/test/youtube-channel?channelUrl=https://www.youtube.com/c/mkbhd"

# Test with channel ID
curl "http://localhost:3000/api/test/youtube-channel?channelUrl=https://www.youtube.com/channel/UCBJycsmduvYEL83R_U4JriQ"
```

## What Data is Available?

### ✅ Available from YouTube Data API v3:

- **Subscribers** (`subscriberCount`)
- **Creation Date** (`publishedAt`)
- **Lifetime Views** (`viewCount`)
- **Language** (`defaultLanguage`)
- **Country** (`country`)
- **Channel Title, Description, Thumbnails**
- **Video Count** (`videoCount`)
- **Privacy Status, Made for Kids status**

### ❌ NOT Available from YouTube Data API v3:

- **Views in last 28 days** - Only total views available
- **Shorts views in last 90 days** - Not available
- **Revenue data** - Requires YouTube Analytics API + OAuth authentication
- **Copyright strikes** - Private data, not accessible via API
- **Community strikes** - Private data, not accessible via API
- **Monetization status directly** - Requires OAuth to check eligibility
- **Content type/category** - Must infer from content analysis
- **Channel type** - Must infer from content analysis

## For Revenue Data (If Needed)

To get revenue data, you would need:

1. **YouTube Analytics API** (separate from Data API)
2. **OAuth 2.0 authentication** - Channel owner must authorize your app
3. The channel owner must grant access to their analytics data

This is much more complex and requires:
- OAuth flow implementation
- User consent and authorization
- Higher API quota costs
- More complex error handling

## Testing Instructions

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Call the test endpoint with a YouTube channel URL

3. Check your **server console** for detailed logs showing:
   - Full API response structure
   - Extracted data mapping
   - What fields can be automatically filled
   - What fields are NOT available

4. The API response will also be returned as JSON, but the console logs show the complete structure

## Example Response

The test endpoint will return:
- `extractedData`: Clean, formatted data available from the API
- `mapping`: How the API data maps to our database fields
- `fullApiResponse`: Complete raw API response
- `notes`: Summary of what's available and what's not

## Next Steps

Based on the test results, we can:
1. Implement auto-fill for available fields (subscribers, creation date, lifetime views, language)
2. Keep manual input for unavailable fields (revenue, strikes, time-based views)
3. Consider YouTube Analytics API integration if revenue data is critical (requires OAuth)

