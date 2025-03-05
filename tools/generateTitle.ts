import { videoTitleGeneration } from "@/actions/videoTitleGeneration";
import { tool } from "ai";
import { z } from "zod";

const generateTitle = tool({
  description: `Generate a title for the video.`,
  parameters: z.object({
    videoId: z.string().describe("The Youtube video ID to get title for. "),
    videoSummary: z
      .string()
      .describe("The Youtube video summary to generate the title for."),
    considerations: z
      .string()
      .describe("Any additional considerations to generate the title."),
  }),
  execute: async ({ videoId, videoSummary, considerations }) => {
    const title = await videoTitleGeneration(
      videoId,
      videoSummary,
      considerations
    );

    if (!title) throw new Error("Title not found.");
    return { title };
  },
});

export default generateTitle;
