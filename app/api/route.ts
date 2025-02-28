import { NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { currentUser } from "@clerk/nextjs/server";

const anthropic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  headers: {
    "anthropic-beta": "token-efficient-tools-2025-02-19",
  },
});

const model = anthropic("claude-3-7-sonnet-20250219");

export async function POST(req: Request) {
  const { messages, videoId } = await req.json();
  const user = await currentUser();

  console.log(videoId);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // const systemMessage = ``;

  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}
