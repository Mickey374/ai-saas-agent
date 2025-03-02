import { NextResponse } from "next/server";
// import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { currentUser } from "@clerk/nextjs/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getVideoDetails } from "@/actions/getVideoDetails";
import fetchTranscript from "@/tools/fetchTranscript";
import generateImage from "@/tools/generateImage";

const googleGenerativeAI = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  headers: {
    "google-beta": "token-efficient-tools-2025-02-19",
  },
});

// const anthropic = createAnthropic({
//   apiKey: process.env.CLAUDE_API_KEY,
//   headers: {
//     "anthropic-beta": "token-efficient-tools-2025-02-19",
//   },
// });

// const claudeModel = anthropic("claude-3-7-sonnet-20250219");
const geminiModel = googleGenerativeAI("gemini-2.0-flash");

export async function POST(req: Request) {
  const { messages, videoId } = await req.json();

  const user = await currentUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const videoDetails = await getVideoDetails(videoId);

  const systemMessage = `You are an AI assistant designed to generate insights, summaries, or responses based on a specific video. The video ID is \`${videoId}\`, referred to as \`${videoDetails?.title || "Selected Video"}\`.  
- Keep responses concise, clear, and engaging.  
- Do not provide personal information or access to sensitive data.
- Do not use the video ID directly in responses.
- Use emojis to improve readability and interaction.  
- If an error occurs, guide the user to retry or upgrade if required (direct them to "Manage Plan" in the header).  
- If previous data exists, explain that it's stored in the database for efficiency rather than calling it a "cache."  
- Always prioritize clarity and accessibility in your explanations.  
Format responses for Notion compatibility including headings paraphrasing the topic with some few emojis.`;

  const result = streamText({
    model: geminiModel,
    messages: [{ content: systemMessage, role: "system" }, ...messages],
    tools: {
      fetchTranscript: fetchTranscript,
      generateImage: generateImage(videoId, user.id),
    },
  });

  return result.toDataStreamResponse();
}
