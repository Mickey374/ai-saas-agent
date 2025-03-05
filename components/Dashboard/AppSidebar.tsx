"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";

export default function AppSidebar() {
  return (
    <Sidebar className="w-64 h-full border-r bg-white dark:bg-gray-900">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <h3 className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            Videos
          </h3>
          <div className="space-y-1"></div>
        </SidebarGroup>
        );
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
