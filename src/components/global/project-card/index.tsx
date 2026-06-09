"use client";

import { itemVatiants, themes } from "@/lib/constant";
import { useSlideStore } from "@/store/useSlideStore";
import { JsonValue } from "@prisma/client/runtime/library";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import ThumbnailPreview from "./thumbnailPreview";
import { timeAgo } from "@/lib/utils";
import AlertDialogBox from "../alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteProject, recoverProject } from "@/actions/projects";
import { buyTemplate } from "@/actions/lemonSqueezy";
import { addTemplateToUser } from "@/actions/user";

type ProjectCardProps = {
  projectId: string;
  title: string;
  createdAt: string;
  isDeleted: boolean;
  slideData: JsonValue;
  themeName: string;
};

const ProjectCard = ({
  projectId,
  title,
  createdAt,
  isDeleted,
  slideData,
  themeName,
}: ProjectCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { setSlides } = useSlideStore();

  const handleNavigation = () => {
    if (pathname.includes("templates")) {
      router.push(`/templates/${projectId}`);
    } else {
      setSlides(JSON.parse(JSON.stringify(slideData)));
      router.push(`/presentation/${projectId}`);
    }
  };

  const currentTheme =
    themes.find((theme) => theme.name === themeName) || themes[0];

  const handleRecover = async () => {
    try {
      setLoading(true);

      if (!projectId) {
        toast.error(`${title}`, { description: "Project not found." });
        return;
      }

      const response = await recoverProject(projectId);

      if (response.status !== 200) {
        toast.error("Oops!", {
          description: response.error || "Something went wrong!",
        });
        return;
      }

      toast.success(`${title}`, {
        description: "Project recovered successfully.",
      });
    } catch (error) {
      console.error("Error recovering project:", error);
      toast.error("Oops!", {
        description: "Something went wrong! Please contact support",
      });
    } finally {
      setLoading(false);
      setOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      if (!projectId) {
        toast.error(`${title}`, { description: "Project not found." });
        return;
      }

      const response = await deleteProject(projectId);

      if (response.status !== 200) {
        toast.error("Oops!", {
          description: response.error || "Failed to delete project.",
        });
        return;
      }

      toast.success(`${title}`, {
        description: "Project deleted successfully.",
      });
    } catch (error) {
      console.error("Error recovering project:", error);
      toast.error("Oops!", {
        description: "Something went wrong! Please contact support",
      });
    } finally {
      setLoading(false);
      setOpen(false);
      router.refresh();
    }
  };

  const handleBuy = async () => {
    try {
      setLoading(true);

      const res = await buyTemplate(projectId);

      if (res.status !== 200) {
        toast.error("Payment Failed", {
          description: "Something went wrong! Please contact support",
        });
        return;
      } else {
        addTemplateToUser(projectId);
      }

      router.push(res.data as string);

      toast.success("Payment Successful", {
        description: "You can now use the template",
      });
    } catch (error) {
      console.error("Error recovering project:", error);
      toast.error("Oops!", {
        description: "Something went wrong! Please contact support",
      });
    } finally {
      setLoading(false);
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <motion.div
      variants={itemVatiants}
      className={`group bg-card border-border hover:border-foreground/20 flex w-full flex-col gap-3 rounded-xl border p-3 transition-[border-color,box-shadow,transform] hover:shadow-sm ${!isDeleted && "cursor-pointer"}`}
    >
      <div
        className="border-border-subtle relative object-contain aspect-[16/9] cursor-pointer overflow-hidden rounded-lg border"
        onClick={handleNavigation}
      >
        <ThumbnailPreview
          theme={currentTheme}
          slide={JSON.parse(JSON.stringify(slideData))?.[0]}
        />
      </div>
      <div className="w-full px-1">
        <div className="space-y-1.5">
          <h3 className="text-foreground line-clamp-1 text-sm font-medium">
            {title}
          </h3>
          <div className="flex w-full mt-5 items-center justify-between gap-2">
            <p
              suppressHydrationWarning
              className="text-muted-foreground text-xs"
            >
              {timeAgo(createdAt)}
            </p>
            {!pathname.includes("templates") ? (
              isDeleted ? (
                <AlertDialogBox
                  discription="This will recover your project and restore all your data"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  loading={loading}
                  open={open}
                  loadingText="Recovering"
                  onClick={handleRecover}
                  handleOpen={() => setOpen(!open)}
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={loading}
                    className="h-7 px-3 text-xs"
                  >
                    Recover
                  </Button>
                </AlertDialogBox>
              ) : (
                <AlertDialogBox
                  discription="This will delete your project and send it to trash"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  loading={loading}
                  open={open}
                  loadingText="Deleting"
                  onClick={handleDelete}
                  handleOpen={() => setOpen(!open)}
                >
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loading}
                    className="text-destructive-foreground h-7 px-3 cursor-pointer text-xs"
                  >
                    Delete
                  </Button>
                </AlertDialogBox>
              )
            ) : (
              <AlertDialogBox
                discription="This template will cost you $4.99"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                loading={loading}
                open={open}
                loadingText="Buying"
                onClick={handleBuy}
                handleOpen={() => setOpen(!open)}
              >
                <Button
                  size="sm"
                  variant="default"
                  disabled={loading}
                  className="h-7 px-3 text-xs"
                >
                  Buy
                </Button>
              </AlertDialogBox>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
