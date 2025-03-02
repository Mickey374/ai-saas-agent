"use server";

import { VideoDetails } from "@/types/types";
import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getVideoDetails(videoId: string) {
  console.log("Fetching Video details for Video: ", videoId);

  try {
    const videoResponse = await youtube.videos.list({
      part: ["snippet", "contentDetails", "statistics"],
      id: [videoId],
    });

    const videoDetails = videoResponse.data.items?.[0];
    // console.log(JSON.stringify(videoDetails, null, 2));

    if (!videoDetails) throw new Error("Video not found");

    // Get the Channel details
    const channelResponse = await youtube.channels.list({
      part: ["snippet", "statistics"],
      id: [videoDetails.snippet?.channelId || ""],
      key: process.env.YOUTUBE_API_KEY,
    });

    const channelDetails = channelResponse.data.items?.[0];

    if (!channelDetails) throw new Error("Channel not found");

    console.log("Fetched Video details for Video: ", videoId);

    const video: VideoDetails = {
      id: videoDetails.id || "",
      title: videoDetails.snippet?.title || "Unknown Title",
      description: videoDetails.snippet?.description || "No Description",
      publishedAt: videoDetails.snippet?.publishedAt || "Unknown Date",
      thumbnail: videoDetails.snippet?.thumbnails?.maxres?.url || "",
      viewCount: videoDetails.statistics?.viewCount || "0",
      likeCount: videoDetails.statistics?.likeCount || "0",
      dislikeCount: videoDetails.statistics?.dislikeCount || "0",
      commentCount: videoDetails.statistics?.commentCount || "0",
      channel: {
        id: channelDetails.id || "",
        name: channelDetails.snippet?.title || "Unknown Channel",
        thumbnail: channelDetails.snippet?.thumbnails?.default?.url || "",
        subscriberCount: channelDetails.statistics?.subscriberCount || "0",
        videoCount: channelDetails.statistics?.videoCount || "0",
        viewCount: channelDetails.statistics?.viewCount || "0",
      },
      channelUrl: `https://www.youtube.com/channel/${channelDetails.id}`,
      duration: videoDetails.contentDetails?.duration || "0",
    };

    return video;
  } catch (error) {
    throw new Error("Error fetching video details: " + error);
  }
}
