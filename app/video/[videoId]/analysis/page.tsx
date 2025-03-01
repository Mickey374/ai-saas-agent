"use client";

import { AppSidebar } from "@/components/app-sidebar";
import AiAgentChat from "@/components/Dashboard/AiAgentChat";
import ThumbnailGeneration from "@/components/Dashboard/ThumbnailGeneration";
import TitleGeneration from "@/components/Dashboard/TitleGeneration";
import Transcription from "@/components/Dashboard/Transcription";
import Usage from "@/components/Dashboard/Usage";
import YoutubeVideoDetails from "@/components/Dashboard/YoutubeVideoDetails";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FeatureFlag } from "@/features/flag";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Doc } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { createOrGetVideo } from "@/actions/createOrGetVideo";

export default function AnalysisPage() {
  const params = useParams<{ videoId: string }>();
  const { videoId } = params;
  const { user } = useUser();

  const [video, setVideo] = useState<Doc<"videos"> | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!user?.id) return;

    if (!videoId) return;

    const fetchVideo = async () => {
      const response = await createOrGetVideo(videoId as string, user.id);

      if (!response.success) {
        // toast.error("Error creating or getting video", {
        //   description: response.error,
        //   duration: 10000,
        // });
      } else {
        setVideo(response.data!);
      }
    };
    fetchVideo();
  }, [videoId, user]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Your Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    Welcome,{" "}
                    <strong className="text-primary">{user?.fullName}</strong>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-3">
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <DataStatsOne />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
          </div> */}
          <DataStatsOne />
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
              <div className="order-2 lg:order-1 flex flex-col p-2">
                {/* Analysis Section */}
                <div className="flex flex-col gap-4 border border-gray-200 rounded-xl p-4">
                  <Usage
                    featureFlag={FeatureFlag.ANALYSE_VIDEO}
                    title="Analyze Video"
                  />
                </div>

                {/* Youtube Video Detais */}
                <YoutubeVideoDetails videoId={videoId} />

                {/* Thumbnail Generation */}
                <ThumbnailGeneration videoId={videoId} />

                {/* Title Generation */}
                <TitleGeneration videoId={videoId} />

                {/* Transcription  */}
                <Transcription videoId={videoId} />
              </div>
              <div className="order-1 lg:order-2 p-2 lg:sticky lg:top-20 h-[500px] md:h-[calc(100vh-6rem)]">
                {/* AI Agent Chat */}
                <AiAgentChat videoId={videoId} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
