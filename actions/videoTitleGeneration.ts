"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flag";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
// import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";

const convexClient = getConvexClient();

export async function videoTitleGeneration(
  videoId: string,
  videoSummary: string,
  considerations: string
) {
  const user = await currentUser();

  if (!user?.id) throw new Error("User not found.");

  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  // });
  const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
  });

  try {
    console.log("Generating title for video", videoId);
    console.log("Video summary", videoSummary);
    console.log("Considerations", considerations);

    const response = await mistral.chat.complete({
      model: "mistral-tiny",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful YouTube video creator assistant that creates high quality SEO friendly concise video titles.",
        },
        {
          role: "user",
          content: `Please provide ONE concise YouTube title (and nothing else) for this video. Focus on the main points and key takeaways, it should be SEO friendly and 100 characters or less:\n\n${videoSummary}\n\n${considerations}`,
        },
      ],
      temperature: 0.5,
      maxTokens: 500,
    });

    console.log("🎥 Title generation response", response);
    const title =
      ((response?.choices &&
        response.choices[0]?.message?.content) as string) ||
      "Unable to generate title.";
    // response.choices[0]?.message?.content || "Unable to generate title.";

    if (!title) {
      return {
        error: "Failed generating title",
      };
    }

    await convexClient.mutation(api.titles.generate, {
      videoId,
      userId: user.id,
      title: title,
    });

    // Track inside Schematic
    await client.track({
      event: featureFlagEvents[FeatureFlag.TITLE_GENERATIONS].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });

    console.log("✅ Title generated successfully", title);
    return title;
  } catch (error) {
    console.log("Error generating title", error);
    throw new Error("Failed generating title");
  }

  return "This is a placeholder title.";
}
