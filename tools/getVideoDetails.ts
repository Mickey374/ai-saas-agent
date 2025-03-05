import { getVideoDetails } from "@/actions/getVideoDetails";
import { tool } from "ai";
import { z } from "zod";

const generateVideoDetails = tool({
  description: `Get details of a YouTube video.`,
  parameters: z.object({
    videoId: z
      .string()
      .describe(
        "The Youtube video ID to get details for. This is the part after `v=` in the URL."
      ),
  }),
  execute: async ({ videoId }) => {
    const videoDetails = await getVideoDetails(videoId);

    if (!videoDetails) throw new Error("Video details not found.");

    return { videoDetails };
  },
});

export default generateVideoDetails;
