// "use client";

// import * as React from "react";
// import {
//   AudioWaveform,
//   BookOpen,
//   Bot,
//   Command,
//   Frame,
//   GalleryVerticalEnd,
//   Map,
//   PieChart,
//   Settings2,
//   SquareTerminal,
// } from "lucide-react";

// import { NavMain } from "@/components/nav-main";
// // import { NavProjects } from "@/components/nav-projects";
// import { NavUser } from "@/components/nav-user";
// // import { TeamSwitcher } from "@/components/team-switcher";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   // SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar";

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   teams: [
//     {
//       name: "Acme Inc",
//       logo: GalleryVerticalEnd,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Today",
//       url: "#",
//       icon: SquareTerminal,
//       isActive: true,
//       items: [
//         { title: "History", url: "#" },
//         { title: "Starred", url: "#" },
//         { title: "Settings", url: "#" },
//       ],
//     },
//     {
//       title: "Yesterday",
//       url: "#",
//       icon: Bot,
//       items: [
//         { title: "Genesis", url: "#" },
//         { title: "Explorer", url: "#" },
//         { title: "Quantum", url: "#" },
//       ],
//     },
//     {
//       title: "Last 7 Days",
//       url: "#",
//       icon: BookOpen,
//       items: [
//         { title: "Introduction", url: "#" },
//         { title: "Get Started", url: "#" },
//         { title: "Tutorials", url: "#" },
//         { title: "Changelog", url: "#" },
//       ],
//     },
//     {
//       title: "Past 30 Days",
//       url: "#",
//       icon: Settings2,
//       items: [
//         { title: "General", url: "#" },
//         { title: "Team", url: "#" },
//         { title: "Billing", url: "#" },
//         { title: "Limits", url: "#" },
//       ],
//     },
//   ],
//   projects: [
//     { name: "Design Engineering", url: "#", icon: Frame },
//     { name: "Sales & Marketing", url: "#", icon: PieChart },
//     { name: "Travel", url: "#", icon: Map },
//   ],
// };

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar
//       collapsible="icon"
//       {...props}
//       className="mt-16 h-[calc(100vh-64px)] overflow-y-auto border-r"
//     >
//       {/* <SidebarHeader>
//         <TeamSwitcher teams={data.teams} />
//       </SidebarHeader> */}
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//         {/* <NavProjects projects={data.projects} /> */}
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { differenceInDays } from "date-fns";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SquareTerminal, Clock, CalendarDays, History } from "lucide-react";

type Video = {
  _id: string;
  _creationTime: number;
  videoId: string;
  userId: string;
  title?: string;
};

const groupVideosByDate = (videos: Video[]) => {
  const now = new Date();
  const groups: Record<string, Video[]> = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    "Past 30 Days": [],
  };

  videos.forEach((video) => {
    const creationDate = new Date(video._creationTime);
    const diffDays = differenceInDays(now, creationDate);

    if (diffDays === 0) {
      groups["Today"].push(video);
    } else if (diffDays === 1) {
      groups["Yesterday"].push(video);
    } else if (diffDays <= 7) {
      groups["Last 7 Days"].push(video);
    } else if (diffDays <= 30) {
      groups["Past 30 Days"].push(video);
    }
  });

  return groups;
};

const getGroupIcon = (groupName: string) => {
  switch (groupName) {
    case "Today":
      return Clock;
    case "Yesterday":
      return History;
    case "Last 7 Days":
      return CalendarDays;
    case "Past 30 Days":
      return CalendarDays;
    default:
      return SquareTerminal;
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const videos = useQuery(api.videos.listVideos, {
    userId: user?.id ?? "",
  });

  const navItems = React.useMemo(() => {
    if (!videos) return [];

    const groupedVideos = groupVideosByDate(videos);
    return Object.entries(groupedVideos)
      .filter(([, items]) => items.length > 0)
      .map(([title, items]) => ({
        title: `${title} (${items.length})`,
        url: "#",
        icon: getGroupIcon(title),
        items: items.map((video) => ({
          title: video.title || `Video ${video.videoId.slice(0, 6)}`,
          url: `/video/${video.videoId}`,
        })),
      }));
  }, [videos]);

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="mt-16 h-[calc(100vh-64px)] overflow-y-auto border-r"
    >
      <SidebarContent>
        {videos ? (
          <NavMain items={navItems} />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            Loading videos...
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.fullName || "",
              email: user.primaryEmailAddress?.emailAddress || "",
              avatar: user.imageUrl,
            }}
          />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
