import { getYoutubeTranscript } from "@/actions/getYoutubeTranscript";
import { tool } from "ai";
import { z } from "zod";

const fetchTranscript = tool({
  description: "Fetch the transcript for a video in segments.",
  parameters: z.object({
    videoId: z
      .string()
      .describe(
        "The ID of the video for which the transcript is to be fetched."
      ),
  }),
  execute: async ({ videoId }) => {
    const transcript = await getYoutubeTranscript(videoId);
    return {
      cache: transcript.cache,
      transcript: transcript.transcript,
      // transcript: transcript,
    };
  },
});

export default fetchTranscript;
