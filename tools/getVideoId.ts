import { getVideoDetails } from "@/actions/getVideoDetails";
import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl";
import { tool } from "ai";
import { z } from "zod";

const getVideoId = tool({
  description: `Extract the video id from the video.`,
  parameters: z.object({
    url: z
      .string()
      .describe(
        "The Youtube video URL to extract the video id from. This is the part after `v=` in the URL."
      ),
  }),
  execute: async ({ url }) => {
    const videoUrl = await getVideoIdFromUrl(url);

    if (!videoUrl) throw new Error("Video details not found.");

    return { videoUrl };
  },
});

export default getVideoId;
