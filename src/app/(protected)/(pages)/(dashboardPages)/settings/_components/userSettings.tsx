"use client";

import { updateUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type UserSettingsProps = {
  User?: User;
};

const UserSettings = ({ User }: UserSettingsProps) => {
  if (!User) {
    redirect("/");
  }

  const router = useRouter();
  const [lemonSqueezyAPIKey, setLemonSqueezyAPIKey] = useState<string>(
    User.lemonSqueezyAPIKey || ""
  );
  const [storeID, setStoreID] = useState<string>(User.storeID || "");
  const [webhookSecret, setWebhookSecret] = useState<string>(
    User.webhookSecret || ""
  );

  const handleReset = () => {
    router.refresh();
    setLemonSqueezyAPIKey(User.lemonSqueezyAPIKey || "");
    setStoreID(User.storeID || "");
    setWebhookSecret(User.webhookSecret || "");
    toast.success("Reset Profile", {
      description: "Changes have been discarded successfully.",
    });
  };

  const handleSave = async () => {
    const updatedProfile = await updateUser(
      lemonSqueezyAPIKey,
      storeID,
      webhookSecret
    );

    if (updatedProfile.status !== 200) {
      toast.error("Error Updating Profile", {
        description: updatedProfile.error,
      });
      return;
    }

    toast.success("Profile Updated", {
      description: "Changes have been saved successfully.",
    });

    router.refresh();
  };

  return (
    <div className="bg-card border-border mr-16 mb-12 rounded-2xl border px-8 py-10 shadow-sm">
      <div className="border-border flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Image
            src={User.image || ""}
            alt="User PFP"
            width={48}
            height={48}
            className="size-12 rounded-full"
          />
          <div>
            <h1 className="text-foreground text-xl font-semibold tracking-tight">
              {User.name}
            </h1>
            <div className="text-muted-foreground text-sm">{User.email}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5">
        <div className="grid gap-2">
          <Label htmlFor="lemon-key" className="text-foreground">
            Lemon Squeezy API Key
          </Label>
          <Input
            id="lemon-key"
            type="text"
            placeholder="Lemon Squeezy API Key"
            value={lemonSqueezyAPIKey}
            onChange={(e) => setLemonSqueezyAPIKey(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="store-id" className="text-foreground">
            Store ID
          </Label>
          <Input
            id="store-id"
            type="text"
            placeholder="Store ID"
            value={storeID}
            onChange={(e) => setStoreID(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="webhook" className="text-foreground">
            Web Hook Secret
          </Label>
          <Input
            id="webhook"
            type="text"
            placeholder="Web Hook Secret"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-foreground">Subscription</Label>
          <Input
            type="text"
            className={cn(
              "cursor-default",
              User.subscription &&
                "text-emerald-600 dark:text-emerald-400 font-medium"
            )}
            value={User.subscription ? "Subscribed" : "Not Subscribed"}
            readOnly
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-foreground">Joined On</Label>
            <Input
              type="text"
              className="cursor-default"
              value={new Date(User.createdAt).toLocaleDateString()}
              readOnly
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-foreground">Updated On</Label>
            <Input
              type="text"
              className="cursor-default"
              value={new Date(User.updatedAt).toLocaleDateString()}
              readOnly
            />
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-3 md:flex-row">
          <Button
            variant="outline"
            className="h-11 w-full font-medium"
            onClick={handleReset}
          >
            Discard Changes
          </Button>
          <Button
            className="h-11 w-full font-medium"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
