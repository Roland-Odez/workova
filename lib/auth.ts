import { redirect } from "next/navigation";

import { auth } from "@/lib/server";
import type { User } from "@/types/user";
import { sql } from "./db";

type WorkspaceAccessRole = "OWNER" | "ADMIN" | "MEMBER";

export type AuthContext = {
  isAuthenticated: boolean;
  user: User | null;
};

function mapSessionUser(sessionUser: {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: boolean | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}): User {
  return {
    id: String(sessionUser.id),
    name: sessionUser.name ?? "",
    email: sessionUser.email ?? "",
    image: sessionUser.image ?? undefined,
    emailVerified: sessionUser.emailVerified ?? undefined,
    createdAt: sessionUser.createdAt ?? new Date().toISOString(),
    updatedAt: sessionUser.updatedAt ?? new Date().toISOString(),
  };
}

async function hasWorkspaceAccess(
  userId: string,
  workspaceId: string
): Promise<boolean> {

  const result = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM workspaces w
      WHERE w.id = ${workspaceId}
      AND (
        w.owner_id = ${userId}
        OR EXISTS (
          SELECT 1
          FROM workspace_members wm
          WHERE wm.workspace_id = ${workspaceId}
          AND wm.user_id = ${userId}
        )
      )
    ) AS has_access
  ` as { has_access: boolean }[];

  return result[0]?.has_access ?? false;
}

export async function getAuthContext(): Promise<AuthContext> {
  try {
    const { data, error } = await auth.getSession();

    if (error || !data?.user) {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    const user = mapSessionUser(data.user);

    return {
      isAuthenticated: true,
      user,
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
}

export async function requireAuthenticatedAppAccess() {
  const context = await getAuthContext();

  if (!context.isAuthenticated) {
    redirect("/login");
  }

  return context;
}