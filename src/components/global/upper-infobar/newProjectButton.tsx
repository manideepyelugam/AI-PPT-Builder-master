"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NewProjectButton = ({ user }: { user: User }) => {
  const router = useRouter();

  return (
    <Button
      className="gap-2 font-medium shadow-sm"
      size="default"
      disabled={!user.subscription}
      onClick={() => router.push("/create-page")}
    >
      <Plus className="size-4" />
      New Project
    </Button>
  );
};

export default NewProjectButton;
