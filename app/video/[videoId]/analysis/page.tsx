"use client";

import { AppSidebar } from "@/components/app-sidebar";
import AiAgentChat from "@/components/Dashboard/AiAgentChat";
import ThumbnailGeneration from "@/components/Dashboard/ThumbnailGeneration";
import TitleGeneration from "@/components/Dashboard/TitleGeneration";
import Transcription from "@/components/Dashboard/Transcription";
import Usage from "@/components/Dashboard/Usage";
import YoutubeVideoDetails from "@/components/Dashboard/YoutubeVideoDetails";
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
import { Youtube } from "lucide-react";
import { useParams } from "next/navigation";

export default function AnalysisPage() {
  const params = useParams<{ videoId: string }>();
  const { videoId } = params;

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
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-5">
            {/* <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" /> */}
            <Usage
              featureFlag={FeatureFlag.ANALYSE_VIDEO}
              title="Analyze Video"
              className="aspect-video max-w-auto rounded-xl bg-muted/50 p-2"
            />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
            <div className="aspect-video max-w-auto rounded-xl bg-muted/50" />
          </div>
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
              <div className="order-1 lg:order-2 p-2">
                <p>Right Side</p>
                <AiAgentChat videoId={videoId} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
