import { getAllProjects } from "@/actions/projects";
import NotFound from "@/components/global/not-found";
import PageHeader from "@/components/global/page-header";
import Projects from "@/components/global/projects";
import { Project } from "@prisma/client";
import React from "react";

const DashboardPage = async () => {
  const allProjects = await getAllProjects();
  const projectData = allProjects.data as Project[];

  return (
    <div className="relative flex w-full flex-col gap-8 p-4 md:p-6">
      <PageHeader
        title="Projects"
        description="All of your work in one place"
      />
      {allProjects.data && projectData.length > 0 ? (
        <Projects projects={projectData} />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default DashboardPage;
