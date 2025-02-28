import { getYoutubeTranscript } from "@/actions/getYoutubeTranscript";
import { tool } from "ai";
import { z } from "zod";

const fetchTranscript = (videoId: string) =>
  tool({
    description: "Fetch Transcript",
    parameters: z.object({
      videoId: z
        .string()
        .describe(
          "The ID of the video for which the transcript is to be fetched."
        ),
    }),
    execute: async ({ videoId }) => {
        console.log("Fetching transcript for video: ", videoId);
        return {
            transcript: transcript.transcript,
            cache: transcript.cache
        }
  });
