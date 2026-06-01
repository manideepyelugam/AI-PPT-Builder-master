"use client";

import { getProjectById } from "@/actions/projects";
import { themes } from "@/lib/constant";
import { useSlideStore } from "@/store/useSlideStore";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "./_components/navbar/navbar";
import LayoutPreview from "./_components/editor-sidebar/left-sidebar/layoutPreview";
import Editor from "./_components/editor/editor";
import EditorSidebar from "./_components/editor-sidebar/right-sidebar";
import EditorSkeleton from "./_components/editor/EditorSkeleton";
import TextFormatToolbar from "@/components/global/editor/textFormatToolbar";
import BottomEditorToolbar from "./_components/editor/bottomEditorToolbar";
import { Project } from "@prisma/client";

const SIDEBAR_WIDTH = 300;

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const { setCurrentTheme, setProject, setSlides } =
    useSlideStore();

  useEffect(() => {
    (async () => {
      try {
        const response = await getProjectById(params.presentationID as string);

        if (response.status !== 200 || !response.data) {
          toast.error("Unable to fetch project.");
          router.push("/dashboard");
          return;
        }

        const projectData = response.data as Project;
        const findTheme = themes.find((t) => t.name === projectData.themeName);

        // Apply theme to slides only — do NOT call setTheme() which changes the app shell
        setCurrentTheme(findTheme || themes[0]);
        setProject(projectData);
        setSlides(JSON.parse(JSON.stringify(projectData.slides)));
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      setProject(null);
      setSlides([]);
    };
  }, [params.presentationID, router, setCurrentTheme, setProject, setSlides]);

  if (isLoading) {
    return <EditorSkeleton />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Fixed navbar — h-14 = 56px */}
      <Navbar presentationID={params.presentationID as string} />

      {/* Fixed left sidebar — starts below navbar */}
      <LayoutPreview />

      {/* Main editor — clean app shell bg, theme applied only inside slide containers */}
      <main
        className="bg-muted/40 flex min-h-screen flex-col pt-14 pb-16"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        <Editor isEditable={true} />
      </main>

      {/* Right floating icon panel */}
      <EditorSidebar />

      {/* Bottom add/zoom toolbar */}
      <BottomEditorToolbar sidebarWidth={SIDEBAR_WIDTH} />

      {/* Floating text format toolbar (portal) */}
      <TextFormatToolbar />
    </DndProvider>
  );
};

export default Page;
