"use server";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { FeatureFlag, featureFlagEvents } from "@/features/flag";
import { checkFeatureUsageLimit } from "@/lib/checkFeatureUsageLimit";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";

export interface VideoResponse {
  success: boolean;
  data?: Doc<"videos">;
  error?: string;
}

export const createOrGetVideo = async (
  videoId: string,
  userId: string
): Promise<VideoResponse> => {
  const convex = getConvexClient();
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }

  // Check if the user has access to the feature
  const featureCheck = await checkFeatureUsageLimit(
    user.id,
    featureFlagEvents[FeatureFlag.ANALYSE_VIDEO].event
  );

  if (!featureCheck.success) {
    return {
      success: false,
      error: featureCheck.error,
    };
  }

  // Create or get the video
  try {
    const video = await convex.query(api.videos.getVideoById, {
      videoId,
      userId,
    });

    if (!video) {
      // Analyse Event
      console.log(
        "🚀 Video does not exist in the database. Creating video entry 🎥"
      );

      const newVideoId = await convex.mutation(api.videos.createVideoEntry, {
        videoId,
        userId,
      });

      const newVideo = await convex.query(api.videos.getVideoById, {
        videoId: newVideoId,
        userId,
      });

      // Track the Event in Schematic
      console.log("🚀 Tracking Analyse Video Event 📊");
      await client.track({
        event: featureFlagEvents[FeatureFlag.ANALYSE_VIDEO].event,
        company: {
          id: userId,
        },
        user: {
          id: userId,
        },
      });

      return {
        success: true,
        data: newVideo!,
      };
    } else {
      console.log("🚀 Video found in the database 🎥");
      return {
        success: true,
        data: video,
      };
    }
  } catch (error) {
    console.error("Error creating or getting video:", error);
    return {
      success: false,
      error: "Error creating or getting video. Please try again later",
    };
  }
};
