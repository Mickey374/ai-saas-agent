"use client";

import { Message, useChat } from "@ai-sdk/react";
import { Button } from "../ui/button";
import Markdown from "react-markdown";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flag";
import { BotIcon, LetterText } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

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
  // Scroll to Bottom Logic
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, append, status } =
    useChat({
      maxSteps: 5,
      body: {
        videoId: videoId,
      },
    });

  const isScriptGenerationEnabled = useSchematicFlag(
    FeatureFlag.SCRIPT_GENERATION
  );
  // const isImageGenerationEnabled = useSchematicFlag(
  //   FeatureFlag.IMAGE_GENERATION
  // );
  // const isTitleGenerationEnabled = useSchematicFlag(
  //   FeatureFlag.TITLE_GENERATIONS
  // );

  // Scroll to Bottom
  useEffect(() => {
    if (bottomRef.current && messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle Toast Notification
  useEffect(() => {
    let toastId;

    switch (status) {
      case "submitted":
        toastId = toast("AI is thinking", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;
      case "streaming":
        toastId = toast("AI is replying", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;
      case "error":
        toastId = toast("AI encountered an error", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;
      case "ready":
        toast.dismiss(toastId);
        break;
      default:
        break;
    }
  }, [status]);

  const isVideoAnalysisEnabled = useSchematicFlag(FeatureFlag.ANALYSE_VIDEO);

  const generateScript = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-script-${randomId}`,
      role: "user",
      content: `Generate a step-by-step shooting script for this video that I can use on my own channel
                  to produce a video that is similar to this one. Don't do any other steps such as generating
                  an image, just generate the script only!`,
    };

    append(userMessage);
  };

  const generateImage = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-image-${randomId}`,
      role: "user",
      content: `Generate an image or thumbnail for this video. 
                  Don't do any other steps such as generating a script, just generate the image only!`,
    };

    append(userMessage);
  };

  const generateTitle = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-title-${randomId}`,
      role: "user",
      content: `Generate a title for this video that I can use on my own channel. 
                  Don't do any other steps such as generating a script, just generate the title only!`,
    };

    append(userMessage);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          AI Agent
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" ref={messageContainerRef}>
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
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
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
              placeholder={
                !isVideoAnalysisEnabled
                  ? "Upgrade to analyse video"
                  : "Ask any question about your video!"
              }
              className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              type="submit"
              disabled={
                status === "streaming" ||
                status === "submitted" ||
                !isVideoAnalysisEnabled
              }
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white dark:text-gray-800 text-sm rounded-lg dark:bg-gray-200 dark:hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "streaming"
                ? "AI is replying"
                : status === "submitted"
                  ? "AI is thinking"
                  : "Send"}
            </Button>
          </form>

          <div className="flex gap-2">
            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 
              bg-gray-100 hover:bg-gray-200 
              dark:bg-gray-800 dark:hover:bg-gray-700 
              rounded-full transition-colors 
              disabled:opacity-50 disabled:cursor-not-allowed
              dark:disabled:opacity-70
              text-gray-900 dark:text-gray-100
              dark:border dark:border-gray-600"
              onClick={generateScript}
              type="button"
              disabled={!isScriptGenerationEnabled}
            >
              <LetterText className="w-4 h-4 dark:text-gray-300" />
              {isScriptGenerationEnabled ? (
                <span>Generate Script</span>
              ) : (
                <span className="dark:text-gray-400">
                  Upgrade to generate a script
                </span>
              )}
            </button>

            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 
              bg-gray-100 hover:bg-gray-200 
              dark:bg-gray-800 dark:hover:bg-gray-700 
              rounded-full transition-colors 
              disabled:opacity-50 disabled:cursor-not-allowed
              dark:disabled:opacity-70
              text-gray-900 dark:text-gray-100
              dark:border dark:border-gray-600"
              onClick={generateTitle}
              type="button"
              disabled={!isScriptGenerationEnabled}
            >
              <LetterText className="w-4 h-4 dark:text-gray-300" />
              {isScriptGenerationEnabled ? (
                <span>Generate Title</span>
              ) : (
                <span className="dark:text-gray-400">
                  Upgrade to generate a title
                </span>
              )}
            </button>

            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 
              bg-gray-100 hover:bg-gray-200 
              dark:bg-gray-800 dark:hover:bg-gray-700 
              rounded-full transition-colors 
              disabled:opacity-50 disabled:cursor-not-allowed
              dark:disabled:opacity-70
              text-gray-900 dark:text-gray-100
              dark:border dark:border-gray-600"
              onClick={generateImage}
              type="button"
              disabled={!isScriptGenerationEnabled}
            >
              <LetterText className="w-4 h-4 dark:text-gray-300" />
              {isScriptGenerationEnabled ? (
                <span>Generate Image</span>
              ) : (
                <span className="dark:text-gray-400">
                  Upgrade to generate an image or images
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAgentChat;
