import { getAllSellableProjects } from "@/actions/projects";
import NotFound from "@/components/global/not-found";
import PageHeader from "@/components/global/page-header";
import Projects from "@/components/global/projects";
import { Project } from "@prisma/client";
import React from "react";

const TemplatesPage = async () => {
  const allSellableProjects = await getAllSellableProjects();
  const projectData = allSellableProjects.data as Project[];

  return (
    <div className="relative flex w-full flex-col gap-8 p-4 md:p-6">
      <PageHeader
        title="Templates"
        description="Browse the marketplace — buy or sell presentation templates"
      />
      {allSellableProjects.data && projectData.length > 0 ? (
        <Projects projects={projectData} />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default TemplatesPage;
