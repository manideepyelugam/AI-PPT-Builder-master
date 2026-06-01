"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavMain = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) => {
  const pathname = usePathname();

  return (
    <SidebarGroup className="p-0">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={`${pathname.includes(item.url) && "bg-sidebar-accent text-sidebar-accent-foreground"} hover:bg-sidebar-accent/60 cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <item.icon className="text-lg" />
                <Link
                  href={item.url}
                  className={`text-lg ${pathname.includes(item.url) && "font-bold"} w-full`}
                >
                  <span>{item.title}</span>
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
