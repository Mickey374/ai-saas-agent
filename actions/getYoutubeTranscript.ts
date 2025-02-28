import { currentUser } from "@clerk/nextjs/server";
import { Innertube } from "youtubei.js";

const youtube = await Innertube.create({
  lang: "en",
  location: "US",
  retrieve_player: false,
});

interface TranscriptEntry {
  text: string;
  timestamp: string;
}

async function fetchTranscript(videoId: string): Promise<TranscriptEntry[]> {
  try {
    const info = await youtube.getInfo(videoId);
    const transcript = await info.getTranscript();
    // return transcript.map((entry) => ({
    //   text: entry.text,
    //   timestamp: entry.timestamp
    // }));
    return [];
  } catch (error) {
    throw new Error("Error fetching transcript: " + error);
  }
}
export async function getYoutubeTranscript(videoId: string) {
  const user = await currentUser();

  if (!user?.id) {
    console;
    return new Error("User not found");
  }

  const transcript = await fetchTranscript(videoId);
  return {
    transcript,
    cache: "This was not cached",
  };
  return new Response("Success");
}
