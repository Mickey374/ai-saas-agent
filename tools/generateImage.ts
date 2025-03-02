import { DalleImageGeneration } from "@/actions/DalleImageGeneration";
import { FeatureFlag } from "@/features/flag";
import { client } from "@/lib/schematic";
import { tool } from "ai";
import { z } from "zod";

const generateImage = (videoId: string, userId: string) =>
  tool({
    description: "Generate an image from a YouTube video transcript.",
    parameters: z.object({
      prompt: z.string().describe("The prompt to generate an image for."),
      videoId: z
        .string()
        .describe(
          "The Youtube video ID to generate an image for. This is the part after `v=` in the URL."
        ),
    }),
    execute: async ({ prompt }) => {
      const schematicCtx = {
        company: { id: userId },
        user: { id: userId },
      };
      const isImageGenerationEnabled = await client.checkFlag(
        schematicCtx,
        FeatureFlag.IMAGE_GENERATION
      );

      if (!isImageGenerationEnabled) {
        return {
          error:
            "Image generation is disabled. Please upgrade your account to enable this feature.",
        };
      }

      const image = await DalleImageGeneration(prompt, videoId);
      return { image };
    },
  });

export default generateImage;
