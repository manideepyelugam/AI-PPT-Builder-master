import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@prisma/client";
import React from "react";
import SearchBar from "./upperInfoSearchBar";
import TheamSwicher from "../mode-toggle";
import NewProjectButton from "./newProjectButton";

const UpperInfobar = ({ user }: { user: User }) => {
  return (
    <header className="border-border-subtle  supports-[backdrop-filter]:bg-background/70 sticky top-0 z-10 flex h-20 shrink-0 items-center gap-3 border-b px-4 backdrop-blur lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-full" />
      <div className="min-w-0 flex-1">
        <SearchBar />
      </div>
      <div className="flex items-center gap-2">
        <TheamSwicher />
        <NewProjectButton user={user} />
      </div>
    </header>
  );
};

export default UpperInfobar;
