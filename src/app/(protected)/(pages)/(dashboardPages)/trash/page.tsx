import React from "react";
import DeleteAllButton from "./_components/deleteAllButton";
import { getDeletedProjects } from "@/actions/projects";
import NotFound from "@/components/global/not-found";
import PageHeader from "@/components/global/page-header";
import Projects from "@/components/global/projects";
import { Project } from "@prisma/client";

const Page = async () => {
  const deletedProjects = await getDeletedProjects();
  const projectData = (deletedProjects.data as Project[]) || [];

  return (
    <div className="relative flex flex-col gap-8 p-4 md:p-6">
      <PageHeader
        title="Trash"
        description="Recover or permanently delete projects"
        actions={projectData.length > 0 ? <DeleteAllButton Projects={projectData} /> : null}
      />
      {projectData.length > 0 ? <Projects projects={projectData} /> : <NotFound />}
    </div>
  );
};

export default Page;
