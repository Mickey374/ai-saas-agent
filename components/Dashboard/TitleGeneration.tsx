"use client";

import { FeatureFlag } from "@/features/flag";
import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { Clipboard } from "lucide-react";


const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
//   toast.success("Copied to Clipboard");
};

function TitleGeneration({ videoId }: { videoId: string }) {
  const { user } = useUser();
  const title = []; //TODO Pull from Convex DB

  const { value: isTitleGenerationEnabled } = useSchematicEntitlement(
    FeatureFlag.TITLE_GENERATIONS
  );

  return (
    <div className="p-4 border mt-4 border-gray-200 dark:border-gray-800 rounded-xl shadow-lg">
      <div className="min-w-52">
        <Usage featureFlag={FeatureFlag.TITLE_GENERATIONS} title="Titles" />
      </div>

      {/* Simple horizontal scroll for now */}
      <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto">
        {title?.map((title, index) => (
          <div
            key={index}
            className="group relative p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-100 dark:hover:border-blue-300 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                {title.title}
              </p>

              <button
                onClick={() => copyToClipboard(title.title)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                title="Copy To Clipboard"
              >
                <Clipboard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* If No Titles Generated */}
      {!title?.length && !!isTitleGenerationEnabled && (
        <div className="text-center py-8 px-4 mt-4 border-2 border-dashed bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
          <p className="text-gray-400 dark:text-gray-500">
            No Titles Generated for this video
          </p>
          <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
            Generate Titles to see them here
          </p>
        </div>
      )}
    </div>
  );
}

export default TitleGeneration;
