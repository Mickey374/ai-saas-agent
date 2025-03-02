"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flag";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { Innertube } from "youtubei.js";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
}
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const youtube = await Innertube.create({
  lang: "en",
  location: "US",
  retrieve_player: false,
});

function formatTimeStamp(start_ms: number): string {
  const minutes = Math.floor(start_ms / 60000);
  const seconds = (start_ms % 60000) / 1000;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface TranscriptEntry {
  text: string;
  timestamp: string;
}

async function fetchTranscript(videoId: string): Promise<TranscriptEntry[]> {
  try {
    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();

    const transcript: TranscriptEntry[] =
      transcriptData.transcript.content?.body?.initial_segments.map(
        (segment) => ({
          text: segment.snippet.text ?? "N/A",
          timestamp: formatTimeStamp(Number(segment.start_ms)),
        })
      ) ?? [];

    return transcript;
  } catch (error) {
    throw new Error("Error fetching transcript: " + error);
  }
}

export async function getYoutubeTranscript(videoId: string) {
  console.log("🚀 Starting getYoutubeTranscript function");
  const user = await currentUser();

  if (!user?.id) {
    console.error("❌ User not found");
    throw new Error("User not found");
  }

  console.log(
    `📹 Fetching transcript for video ID: ${videoId} for user ID: ${user.id}`
  );

  // Check if existing transcript is cached in the DB
  const existingTranscript = await convex.query(
    api.transcript.getTranscriptByVideoId,
    { videoId, userId: user.id }
  );

  if (existingTranscript) {
    console.log(`✅ Found cached transcript for video ${videoId}`);
    return {
      transcript: existingTranscript.transcript,
      cache: "This video has already been transcribed - Accessing cache...",
    };
  }

  try {
    console.log(
      `🔄 No cached transcript found for video ${videoId}, fetching new transcript`
    );
    const transcript = await fetchTranscript(videoId);

    // Store the transcript in the DB
    console.log(`💾 Storing new transcript for video ${videoId} in the DB`);
    await convex.mutation(api.transcript.storeTranscript, {
      videoId,
      userId: user.id,
      transcript,
    });

    console.log(`📊 Tracking transcription event for user ID: ${user.id}`);
    await client.track({
      event: featureFlagEvents[FeatureFlag.TRANSCRIPTION].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });

    console.log(`✅ Successfully transcribed and cached video ${videoId}`);
    return {
      transcript,
      cache: "This video was transcribed and cached in the DB",
    };
  } catch (error) {
    console.error("❌ Error fetching transcript", error);
    return {
      // Changed from throw to return to maintain consistent return type
      transcript: [],
      cache: "Error fetching transcript",
    };
  }
}
