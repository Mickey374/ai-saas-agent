"use client";

import { getVideoDetails } from "@/actions/getVideoDetails";
import { VideoDetails } from "@/types/types";
import { Calendar, Eye, MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";

const formatSubscriberCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(0) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(0) + "K";
  }
  return count.toString();
};

function YoutubeVideoDetails({ videoId }: { videoId: string }) {
  const [video, setVideo] = useState<VideoDetails | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const video = await getVideoDetails(videoId);
      setVideo(video);
    };

    fetchVideoDetails();
  }, [videoId]);

  if (!video)
    return (
      <div className="flex justify-center items-center p-4">
        <Loader />
      </div>
    );

  return (
    <div className="@container bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mt-2">
      <div className="flex flex-col gap-8 w-full">
        <div className="flex-shrink-0 w-full">
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={500}
            height={500}
            layout="responsive"
            className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          />
        </div>

        {/* Video Details */}
        <div className="flex-grow space-y-4">
          <h1 className="text-lg font-bold @lg:text-2xl text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
            {video.title}
          </h1>

          {/* Channel Info */}
          <div className="flex items-center gap-4">
            <Image
              src={video.channel.thumbnail}
              alt={video.channel.name}
              width={40}
              height={40}
              className="rounded-full w-10 h-10 @md:w-12 @md:h-12 border-2 border-gray-100 dark:border-gray-700"
            />

            <div>
              <p className="text-base @md:text-lg font-semibold text-gray-900 dark:text-gray-300">
                {video.channel.name}
              </p>
              <p className="text-sm @md:text-lg font-semibold text-gray-900 dark:text-gray-300">
                {formatSubscriberCount(Number(video.channel.subscriberCount))}{" "}
                subscribers
              </p>
            </div>
          </div>

          {/* Video Stats  */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Published
                </p>
              </div>
              <p className="font-base text-gray-900 dark:text-gray-200">
                {new Date(video.publishedAt).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Views
                </p>
              </div>
              <p className="font-base text-gray-900 dark:text-gray-200">
                {video.viewCount}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Likes
                </p>
              </div>
              <p className="font-base text-gray-900 dark:text-gray-200">
                {video.likeCount}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comments
                </p>
              </div>
              <p className="font-base text-gray-900 dark:text-gray-200">
                {video.commentCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YoutubeVideoDetails;
