"use client";

import { buySubscription } from "@/actions/lemonSqueezy";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

const NavFooter = ({ prismaUser }: { prismaUser: User }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleUpgrading = async () => {
    try {
      setLoading(true);

      const res = await buySubscription(prismaUser.id);

      if (res.status !== 200) {
        toast.error("Payment Failed", {
          description: "Something went wrong! Please contact support",
        });
        return;
      }

      router.push(res.data as string);

      toast.success("Payment Successful", {
        description: "You can now use all features",
      });
    } catch (error) {
      console.error(error);
      toast.error("Payment Failed", {
        description: "Something went wrong! Please contact support",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="group-data-[collapsible=icon]:hover flex flex-col items-start gap-y-6">
          {!prismaUser.subscription && (
            <div className="bg-sidebar-accent/40 flex flex-col items-start gap-4 rounded-xl p-2 pb-3 group-data-[collapsible=icon]:hidden">
              <div className="flex flex-col items-start gap-1">
                <p className="text-base font-bold">
                  Get <span className="text-vivid">Creative AI</span>
                </p>
                <span className="dark:text-secondary-foreground/50 text-sm">
                  Unlock all features including AI and more
                </span>
              </div>
              <div className="bg-vivid-gradient w-full rounded-full p-[1px]">
                <Button
                  variant={"default"}
                  size={"lg"}
                  onClick={handleUpgrading}
                  className="bg-background/7 hover:bg-background text-primary w-full cursor-pointer rounded-full font-bold transition-all duration-300 ease-in-out hover:opacity-80"
                >
                  {loading ? "Upgrading" : "Get Creative AI"}
                </Button>
              </div>
            </div>
          )}
          <SidebarMenuButton
            size={"lg"}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent border-border border"
          >
            <Avatar className="size-8 rounded-full">
              <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? "User"} />
              <AvatarFallback className="rounded-full">
                {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">{session?.user?.name}</span>
              <span className="text-secondary-foreground/50 truncate text-xs">
                {session?.user?.email}
              </span>
            </div>
            <LogOut
              className="ml-auto size-4 cursor-pointer opacity-50 hover:opacity-100"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            />
          </SidebarMenuButton>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavFooter;
