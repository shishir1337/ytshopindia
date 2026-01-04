import { NextResponse } from "next/server";

/**
 * Test endpoint to check YouTube Data API v3 response format
 * This endpoint fetches channel data and logs it to console
 * 
 * Usage: GET /api/test/youtube-channel?channelUrl=https://www.youtube.com/@channelname
 * 
 * Note: You'll need to set YOUTUBE_API_KEY in your .env file
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channelUrl = searchParams.get("channelUrl");

    if (!channelUrl) {
      return NextResponse.json(
        { error: "channelUrl parameter is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "YOUTUBE_API_KEY not configured",
          message:
            "Please add YOUTUBE_API_KEY to your .env file. Get one from: https://console.cloud.google.com/apis/credentials",
        },
        { status: 500 }
      );
    }

    // Extract channel ID from URL
    // Supports formats:
    // - https://www.youtube.com/@channelname
    // - https://www.youtube.com/c/channelname
    // - https://www.youtube.com/channel/CHANNEL_ID
    // - https://youtube.com/@channelname
    let channelId = channelUrl;

    // Extract username/handle from @ format
    const handleMatch = channelUrl.match(/@([^/?]+)/);
    if (handleMatch) {
      const handle = handleMatch[1];
      
      // First, get channel ID from handle using search
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
        handle
      )}&key=${apiKey}&maxResults=1`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      console.log("=== YouTube Search API Response ===");
      console.log(JSON.stringify(searchData, null, 2));
      
      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].snippet.channelId;
        console.log(`\n=== Found Channel ID: ${channelId} ===\n`);
      } else {
        return NextResponse.json(
          {
            error: "Channel not found",
            searchData,
          },
          { status: 404 }
        );
      }
    } else if (channelUrl.includes("/channel/")) {
      channelId = channelUrl.split("/channel/")[1].split("?")[0].split("/")[0];
    } else if (channelUrl.includes("/c/") || channelUrl.includes("/user/")) {
      const username = channelUrl.split("/c/")[1] || channelUrl.split("/user/")[1];
      const cleanUsername = username.split("?")[0].split("/")[0];
      
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
        cleanUsername
      )}&key=${apiKey}&maxResults=1`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      console.log("=== YouTube Search API Response ===");
      console.log(JSON.stringify(searchData, null, 2));
      
      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].snippet.channelId;
        console.log(`\n=== Found Channel ID: ${channelId} ===\n`);
      }
    }

    // Fetch channel details
    // Using multiple parts to get all available data
    const parts = [
      "snippet", // Basic info: title, description, thumbnails, publishedAt, country, defaultLanguage
      "statistics", // Stats: viewCount, subscriberCount, videoCount, hiddenSubscriberCount
      "contentDetails", // Content details: relatedPlaylists
      "brandingSettings", // Branding: channel (title, description), image
      "status", // Status: privacyStatus, isLinked, longUploadsStatus, madeForKids
    ].join(",");

    const channelUrl_final = `https://www.googleapis.com/youtube/v3/channels?part=${parts}&id=${channelId}&key=${apiKey}`;

    console.log("\n=== Fetching Channel Data ===");
    console.log(`URL: ${channelUrl_final.replace(apiKey, "API_KEY_HIDDEN")}\n`);

    const channelResponse = await fetch(channelUrl_final);
    const channelData = await channelResponse.json();

    console.log("=== YouTube Channels API Response (Full) ===");
    console.log(JSON.stringify(channelData, null, 2));

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json(
        {
          error: "Channel not found",
          channelData,
        },
        { status: 404 }
      );
    }

    const channel = channelData.items[0];

    // Extract and format the data we need
    const extractedData = {
      // Available from API
      channelId: channel.id,
      title: channel.snippet?.title,
      description: channel.snippet?.description,
      publishedAt: channel.snippet?.publishedAt, // Creation date
      country: channel.snippet?.country,
      defaultLanguage: channel.snippet?.defaultLanguage,
      customUrl: channel.snippet?.customUrl,
      thumbnails: channel.snippet?.thumbnails,
      
      // Statistics (available)
      subscriberCount: channel.statistics?.subscriberCount, // Subscribers
      viewCount: channel.statistics?.viewCount, // Lifetime views
      videoCount: channel.statistics?.videoCount,
      hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount,
      
      // Status (available)
      privacyStatus: channel.status?.privacyStatus,
      isLinked: channel.status?.isLinked,
      longUploadsStatus: channel.status?.longUploadsStatus,
      madeForKids: channel.status?.madeForKids,
      
      // NOT Available from YouTube Data API v3:
      // - Views in last 28 days (only total views available)
      // - Shorts views in last 90 days
      // - Revenue data (requires YouTube Analytics API + OAuth)
      // - Copyright strikes (private data)
      // - Community strikes (private data)
      // - Monetization status directly (requires OAuth to check)
      // - Content type/category (can infer from content but not directly available)
    };

    console.log("\n=== Extracted Data (What We Can Use) ===");
    console.log(JSON.stringify(extractedData, null, 2));

    console.log("\n=== Mapping to Our Database Fields ===");
    const mapping = {
      subscribers: extractedData.subscriberCount?.toString(),
      creationDate: extractedData.publishedAt,
      lifetimeViews: extractedData.viewCount?.toString(),
      language: extractedData.defaultLanguage,
      category: extractedData.country, // Can use country as category or infer
      // These fields are NOT available from API:
      viewsLast28Days: "NOT AVAILABLE - Only total views available",
      shortsViews90Days: "NOT AVAILABLE",
      revenueLast28Days: "NOT AVAILABLE - Requires YouTube Analytics API + OAuth",
      lifetimeRevenue: "NOT AVAILABLE - Requires YouTube Analytics API + OAuth",
      copyrightStrike: "NOT AVAILABLE - Private data",
      communityStrike: "NOT AVAILABLE - Private data",
      monetized: "NOT DIRECTLY AVAILABLE - Requires OAuth to check",
      channelType: "Can infer from content but not directly available",
      contentType: "Can infer from content but not directly available",
    };
    console.log(JSON.stringify(mapping, null, 2));

    return NextResponse.json({
      success: true,
      message: "Check server console for detailed logs",
      extractedData,
      mapping,
      fullApiResponse: channelData,
      notes: {
        availableFromAPI: [
          "Subscribers (subscriberCount)",
          "Creation Date (publishedAt)",
          "Lifetime Views (viewCount)",
          "Language (defaultLanguage)",
          "Country (country)",
          "Channel Title, Description, Thumbnails",
        ],
        notAvailableFromAPI: [
          "Views in last 28 days (only total views)",
          "Shorts views in last 90 days",
          "Revenue data (requires YouTube Analytics API + OAuth)",
          "Copyright/Community strikes (private data)",
          "Monetization status directly (requires OAuth)",
          "Content type/category (must infer from content)",
        ],
      },
    });
  } catch (error: any) {
    console.error("Error fetching YouTube channel data:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        details: error,
      },
      { status: 500 }
    );
  }
}

