import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

/**
 * Fetch YouTube channel data for auto-filling listing fields
 * Admin only endpoint
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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
            "Please add YOUTUBE_API_KEY to your .env file",
        },
        { status: 500 }
      );
    }

    // Extract channel ID from URL
    let channelId = channelUrl;

    // Extract username/handle from @ format
    const handleMatch = channelUrl.match(/@([^/?]+)/);
    if (handleMatch) {
      const handle = handleMatch[1];
      
      // Get channel ID from handle using search
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
        handle
      )}&key=${apiKey}&maxResults=1`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].snippet.channelId;
      } else {
        return NextResponse.json(
          { error: "Channel not found" },
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
      
      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].snippet.channelId;
      } else {
        return NextResponse.json(
          { error: "Channel not found" },
          { status: 404 }
        );
      }
    }

    // Fetch channel details
    const parts = [
      "snippet",
      "statistics",
      "status",
    ].join(",");

    const channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=${parts}&id=${channelId}&key=${apiKey}`;

    const channelResponse = await fetch(channelApiUrl);
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    const channel = channelData.items[0];

    // Download and save thumbnail image
    let thumbnailUrl = null;
    const thumbnail = channel.snippet?.thumbnails?.high || channel.snippet?.thumbnails?.default;
    
    if (thumbnail?.url) {
      try {
        // Download the image
        const imageResponse = await fetch(thumbnail.url);
        if (imageResponse.ok) {
          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          
          // Generate unique filename
          const timestamp = Date.now();
          const channelIdShort = channel.id.substring(0, 8);
          const filename = `channel_${channelIdShort}_${timestamp}.jpg`;
          
          // Create uploads directory if it doesn't exist
          const uploadsDir = join(process.cwd(), "public", "uploads", "channels");
          if (!existsSync(uploadsDir)) {
            mkdirSync(uploadsDir, { recursive: true });
          }
          
          // Save file
          const filepath = join(uploadsDir, filename);
          await writeFile(filepath, imageBuffer);
          
          // Return public URL
          thumbnailUrl = `/uploads/channels/${filename}`;
        }
      } catch (error) {
        console.error("Error downloading thumbnail:", error);
        // Continue without thumbnail if download fails
      }
    }

    // Format data for our form fields
    const formattedData = {
      // Available fields we can auto-fill
      subscribers: channel.statistics?.subscriberCount?.toString() || null,
      creationDate: channel.snippet?.publishedAt 
        ? new Date(channel.snippet.publishedAt).toISOString().split("T")[0]
        : null,
      lifetimeViews: channel.statistics?.viewCount?.toString() || null,
      language: channel.snippet?.defaultLanguage || null,
      videoCount: channel.statistics?.videoCount?.toString() || null,
      // Don't auto-fill category from country - let admin set it manually
      featuredImage: thumbnailUrl, // Auto-uploaded thumbnail
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
      channelInfo: {
        channelId: channel.id,
        title: channel.snippet?.title,
        description: channel.snippet?.description,
        customUrl: channel.snippet?.customUrl,
        country: channel.snippet?.country, // Include for reference but don't auto-fill
      },
    });
  } catch (error: any) {
    console.error("Error fetching YouTube channel data:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch YouTube channel data",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

