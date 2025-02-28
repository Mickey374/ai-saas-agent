"use client";

import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { FeatureFlag } from "@/features/flag";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function ThumbnailGeneration({ videoId }: { videoId: string }) {
  const { user } = useUser();

  const images = useQuery(api.images.getImages, {
    videoId,
    userId: user?.id ?? "",
  });

  return (
    <div className="rounded-xl flex flex-col p-4 border mt-4 shadow-lg">
      <div className="min-w-52">
        <Usage
          featureFlag={FeatureFlag.IMAGE_GENERATION}
          title="Thumbnail Generation"
        />
      </div>

      {/* Simple horizontal scroll for now */}
      <div
        className={`flex gap-4 overflow-x-auto ${images?.length ? "mt-4" : ""}`}
      >
        {images?.map(
          (image, index) =>
            image.url && (
              <div
                key={index}
                className="flex-none w-[200px] rounded-lg overflow-x-auto bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  loading="lazy"
                  src={image.url}
                  alt={`Thumbnail ${index}`}
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
            )
        )}

        {/* If No Images Generated */}
        {!images?.length && (
          <div className="text-center py-8 px-4 mt-4 border-2 border-dashed bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
            <p className="text-gray-400 dark:text-gray-500">
              No Thumbnails Generated for this video
            </p>
            <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
              Generate Images to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThumbnailGeneration;
