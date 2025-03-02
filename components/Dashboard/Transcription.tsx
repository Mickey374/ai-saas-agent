"use client";

// import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flag";
import { useCallback, useEffect, useState } from "react";
import { getYoutubeTranscript } from "@/actions/getYoutubeTranscript";

interface TranscriptEntry {
  text: string;
  timestamp: string;
}

function Transcription({ videoId }: { videoId: string }) {
  const [transcript, setTranscript] = useState<{
    transcript: TranscriptEntry[];
    cache: string;
  } | null>(null);

  console.log(videoId);

  const { featureUsageExceeded } = useSchematicEntitlement(
    FeatureFlag.TRANSCRIPTION
  );

  const handleGenerateTranscription = useCallback(
    async (videoId: string) => {
      if (featureUsageExceeded) {
        console.log(
          "Feature usage exceeded. Kindly upgrade your plan to continue using this feature."
        );
        return;
      }

      const response = await getYoutubeTranscript(videoId);

      setTranscript(response);
    },
    [featureUsageExceeded]
  );

  useEffect(() => {
    handleGenerateTranscription(videoId);
  }, [videoId, handleGenerateTranscription]);

  return (
    <div className="border p-4 pb-0 rounded-xl bg-white dark:bg-gray-900 flex flex-col shadow-lg">
      <div className="mb-4">
        <Usage featureFlag={FeatureFlag.TRANSCRIPTION} title="Transcription" />
      </div>

      {/* Transcription */}
      <div className="mb-4">
        {!featureUsageExceeded ? (
          <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4 bg-gray-50 dark:bg-gray-800 mt-4">
            {transcript ? (
              transcript.transcript.map((entry, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-sm text-gray-400 dark:text-gray-500 min-w-[50px]">
                    {entry.timestamp}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {entry.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No transcription available
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Transcription;
