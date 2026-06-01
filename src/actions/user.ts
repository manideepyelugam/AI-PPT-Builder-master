"use server";

import { client } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ReturnProps } from "@/lib/types";
import { getServerSession } from "next-auth";
import { User } from "@prisma/client";

type UserReturnProps = ReturnProps & {
  user?: User;
};

export const onAuthenticateUser = async (): Promise<UserReturnProps> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { status: 403 };
    }

    const bypassPayments = process.env.DEV_BYPASS_PAYMENTS === "true";

    const userExists = await client.user.findUnique({
      where: { id: session.user.id },
      include: {
        PurchasedProjects: { select: { id: true } },
      },
    });

    if (userExists) {
      // In dev bypass mode, treat every user as subscribed
      const user = bypassPayments
        ? { ...userExists, subscription: true }
        : userExists;
      return { status: 200, user: user as User };
    }

    return { status: 400, error: "User not found in database" };
  } catch (error) {
    return { status: 500, error: "Internal server error: " + error };
  }
};

export const updateUser = async (
  lemonSqueezyAPIKey: string,
  storeID: string,
  webhookSecret: string
): Promise<UserReturnProps> => {
  try {
    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const updatedUser = await client.user.update({
      where: { id: checkUser.user.id },
      data: { lemonSqueezyAPIKey, storeID, webhookSecret },
    });

    if (!updatedUser) {
      return { status: 400, error: "Something went wrong" };
    }

    return { status: 200, user: updatedUser };
  } catch (error) {
    return { status: 500, error: "Internal Server Error: " + error };
  }
};

export const addTemplateToUser = async (
  projectId: string
): Promise<UserReturnProps> => {
  try {
    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const project = await client.project.findUnique({ where: { id: projectId } });

    if (!project) {
      return { status: 404, error: "Project not found" };
    }

    const user = await client.user.findUnique({
      where: { id: checkUser.user.id },
      include: { PurchasedProjects: true },
    });

    if (!user) {
      return { status: 404, error: "User not found" };
    }

    const alreadyPurchased = user.PurchasedProjects.some((p) => p.id === projectId);

    if (alreadyPurchased) {
      return { status: 400, error: "User already owns this template" };
    }

    const updatedUser = await client.user.update({
      where: { id: checkUser.user.id },
      data: { PurchasedProjects: { connect: { id: projectId } } },
    });

    if (!updatedUser) {
      return { status: 400, error: "Something went wrong" };
    }

    return { status: 200, user: updatedUser };
  } catch (error) {
    return { status: 500, error: "Internal Server Error: " + error };
  }
};
