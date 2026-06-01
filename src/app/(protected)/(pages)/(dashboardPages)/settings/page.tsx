import { onAuthenticateUser } from "@/actions/user";
import PageHeader from "@/components/global/page-header";
import React from "react";
import UserSettings from "./_components/userSettings";

const Page = async () => {
  const checkUser = await onAuthenticateUser();

  return (
    <div className="relative flex flex-col gap-8 p-4 md:p-6">
      <PageHeader title="Settings" description="Manage your account and preferences" />
      <UserSettings User={checkUser.user} />
    </div>
  );
};

export default Page;
