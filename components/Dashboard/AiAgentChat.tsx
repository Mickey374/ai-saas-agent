"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "../ui/button";
import Markdown from "react-markdown";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result?: Record<string, unknown>;
}

interface ToolPart {
  type: "tool-invocation";
  toolInvocation: ToolInvocation;
}

const formatToolInvocation = (part: ToolPart) => {
  if (!part.toolInvocation) return "No tool invocation found";
  return `🛠️ Tool: ${part.toolInvocation.toolName} 🔧`;
};

function AiAgentChat({ videoId }: { videoId: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
    body: {
      videoId: videoId,
    },
  });
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          AI Agent
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Welcome to AI Agent Chat
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask any question about your video!
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === "user"
                    ? "bg-blue-500 text-white dark:bg-gray-200"
                    : "bg-gray-100 dark:bg-gray-800"
                } px-4 py-2 rounded-lg text-sm`}
              >
                {message.parts && message.role === "assistant" ? (
                  // System message
                  <div className="space-y-3">
                    {message.parts.map((part, i) =>
                      part.type === "text" ? (
                        <div
                          key={i}
                          className="prose dark:prose-invert prose-sm max-w-none"
                        >
                          <Markdown>{message.content}</Markdown>
                        </div>
                      ) : part.type === "tool-invocation" ? (
                        <div
                          key={i}
                          className="bg-white/50 dark:bg-gray-800 rounded-lg p-2 space-y-2 text-gray-800 dark:text-gray-200"
                        >
                          <div className="font-medium text-xs">
                            {formatToolInvocation(part as ToolPart)}
                          </div>

                          {(part as ToolPart).toolInvocation.result && (
                            <pre className="text-xs bg-white/75 p-2 rounded overflow-auto max-h-40">
                              {JSON.stringify(
                                (part as ToolPart).toolInvocation.result,
                                null,
                                2
                              )}
                            </pre>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  // User message
                  <div className="prose dark:prose-invert prose-sm max-w-none text-white dark:text-gray-800">
                    <Markdown>{message.content}</Markdown>
                  </div>
                )}
                {/* {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <div
                      key={i}
                      className="prose dark:prose-invert prose-sm max-w-none"
                    >
                      <Markdown>{message.content}</Markdown>
                    </div>
                  ) : part.type === "tool-invocation" ? (
                    <div
                      key={i}
                      className="bg-white/50 dark:bg-gray-800 rounded-lg p-2 space-y-2 text-gray-800 dark:text-gray-200"
                    ></div>
                  ) : null
                )} */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              // disabled
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white dark:text-gray-800 text-sm rounded-lg dark:bg-gray-200 dark:hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AiAgentChat;
