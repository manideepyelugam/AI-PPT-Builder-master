"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Project, User } from "@prisma/client";
import React from "react";
import NavMain from "./navMain";
import { data } from "@/lib/constant";
import RecentOpen from "./recentOpen";
import NavFooter from "./navFooter";

const AppSidebar = ({
  recentProjects,
  user,
  ...props
}: { recentProjects: Project[] } & {
  user: User;
} & React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-background/10 max-w-[255px]"
      {...props}
    >
      <div className="w-full h-[80px] border-b ">

      </div>
      <SidebarContent className="gap-y-2 mt-6 px-2">
        <NavMain items={data.navMain} />
        <div className="h-[1px] w-full bg-black/20"></div>
        <RecentOpen recentProjects={recentProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter prismaUser={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
