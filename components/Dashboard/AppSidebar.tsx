"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { format, differenceInDays, parseISO } from "date-fns";
import Loader from "../common/Loader";
import Link from "next/link";

type Video = {
  _id: string;
  _creationTime: number;
  videoId: string;
  userId: string;
};

// Function to group videos by date
const groupVideosByDate = (videos: Video[]) => {
  const now = new Date();
  const groups: { [key: string]: any[] } = {
    Today: [],
    "Last 7 days": [],
    "Last 30 days": [],
    Older: [],
  };

  // Now loop through the videos and group them
  videos.forEach((video) => {
    const creationDateTime = new Date(video._creationTime);
    const daysDifference = differenceInDays(now, creationDateTime);

    if (daysDifference === 0) groups["Today"].push(video);
    else if (daysDifference <= 7) groups["Last 7 Days"].push(video);
    else if (daysDifference <= 30) groups["Last 30 Days"].push(video);
    else groups["Older"].push(video);
  });

  return groups;
};

export default function AppSidebar() {
  const { user } = useUser();
  if (!user) return null;

  const videos = useQuery(api.videos.listVideos, {
    userId: user?.id ?? "",
  });

  if (videos === undefined) return <Loader />;

  const groupedVideos = groupVideosByDate(videos || []);
  console.log("groupedVideos", groupedVideos);
  return (
    <Sidebar className="w-64 h-full border-r bg-white dark:bg-gray-900">
      <SidebarHeader />
      <SidebarContent>
        {Object.entries(groupedVideos).map(([groupName, groupVideos]) => {
          if (groupVideos.length === 0) return null;
          return (
            <SidebarGroup key={groupName}>
              <h3 className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {groupName}
              </h3>
              <div className="space-y-1">
                {groupVideos.map((video) => (
                  <Link
                    key={video._id}
                    href={`/video/${video.videoId}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {format(
                      parseISO(video._creationTime),
                      "MMM d, yyyy - HH:mm"
                    )}
                  </Link>
                ))}
              </div>
            </SidebarGroup>
          );
        })}

        {/* {Object.entries(groupedVideos).map(([groupName, groupVideos]) => return {
          if (groupVideos.length === 0) return null;
          <SidebarGroup key={groupName}>
            <h3 className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              {groupName}
            </h3>
            <div className="space-y-1">
              {groupVideos.map((video) => (
                <a
                  key={video._id}
                  href={`/video/${video.videoId}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {format(parseISO(video._creationTime), "MMM d, yyyy - HH:mm")}
                </a>
              ))}
            </div>
          </SidebarGroup>
})} */}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
