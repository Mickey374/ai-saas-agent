"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "../ui/button";
import {ReactMarkdown} from "react-markdown";

function AiAgentChat({ videoId }: { videoId: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
    body: {
      videoId: videoId,
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {messages.map((message, index) => (
          <div key={index} className="flex gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div className="flex flex-col gap-1">
              <div className="bg-gray-300 h-5 w-20" />
              <div className="bg-gray-300 h-5 w-40" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-1 border border-gray-300 rounded-lg p-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AiAgentChat;
