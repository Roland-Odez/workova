"use server";

import { WorkspaceType } from "@/lib/features/worskspace/workspaceSlice";
import { sql } from "../../../lib/db";
import { Priority, ProjectStatus } from "@/types";
import { getNeonSignedUser } from "../user";
import { revalidatePath } from "next/cache";

export type WorkspaceUser = {
  id: string;
  role: "ADMIN" | "MEMBER";
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

type WorkspaceUserRow = {
  member_id: string;
  role: "ADMIN" | "MEMBER";
  joined_at: string;
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type WorkspaceProject = {
  id: string
  name: string
  description: string
  priority: Priority
  status: ProjectStatus
  start_date: string
  end_date: string
  team_lead: string
  workspace_id: string
  progress: number
  created_at: string
  updated_at: string
}

export type WorkspaceTask = { id:string; project_id:string; title:string; status:"TODO"|"IN_PROGRESS"|"DONE"; type:string; priority:string; due_date:string|null; updated_at:string; project_name:string; assignee_name:string|null };

export type WorkspaceSearchProject = {
  id: string;
  name: string;
  status: string;
  progress: number;
  workspace_name: string;
};

export type WorkspaceSearchTask = {
  id: string;
  title: string;
  status: string;
  type: string;
  priority: string;
  project_id: string;
  project_name: string;
  workspace_name: string;
};

export type WorkspaceSearchResults = {
  projects: WorkspaceSearchProject[];
  tasks: WorkspaceSearchTask[];
  error?: string;
};

export async function ensureWorkspacesTable() {
  await sql`
    CREATE EXTENSION IF NOT EXISTS pgcrypto
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      settings JSONB NOT NULL DEFAULT '{}'::jsonb,
      owner_id TEXT,
      image_url TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function getUserWorkspaces(userId: string) {
  const result = await sql`
    SELECT w.id, w.name, w.slug, w.owner_id, image_url
    FROM workspaces w
    WHERE w.owner_id = ${userId}

    UNION

    SELECT w.id, w.name, w.slug, w.owner_id, image_url
    FROM workspaces w
    INNER JOIN workspace_members wm
      ON wm.workspace_id = w.id
    WHERE wm.user_id = ${userId}
  `;

  return result as WorkspaceType[];
}

export async function searchWorkspaceItems(query: string): Promise<WorkspaceSearchResults> {
  const normalizedQuery = query.trim().slice(0, 100);
  if (normalizedQuery.length < 2) return { projects: [], tasks: [] };

  const { user } = await getNeonSignedUser();
  if (!user) return { projects: [], tasks: [] };

  const pattern = `%${normalizedQuery}%`;

  try {
    const [projectRows, taskRows] = await Promise.all([
      sql`
        SELECT p.id, p.name, p.status, p.progress, w.name AS workspace_name
        FROM projects p
        INNER JOIN workspaces w ON w.id = p.workspace_id
        WHERE (
          w.owner_id = ${user.id}
          OR EXISTS (
            SELECT 1
            FROM workspace_members wm
            WHERE wm.workspace_id = w.id AND wm.user_id = ${user.id}
          )
        )
          AND (p.name ILIKE ${pattern} OR COALESCE(p.description, '') ILIKE ${pattern})
        ORDER BY p.updated_at DESC
        LIMIT 6
      `,
      sql`
        SELECT t.id, t.title, t.status, t.type, t.priority, t.project_id,
          p.name AS project_name, w.name AS workspace_name
        FROM tasks t
        INNER JOIN projects p ON p.id = t.project_id
        INNER JOIN workspaces w ON w.id = p.workspace_id
        WHERE (
          w.owner_id = ${user.id}
          OR EXISTS (
            SELECT 1
            FROM workspace_members wm
            WHERE wm.workspace_id = w.id AND wm.user_id = ${user.id}
          )
        )
          AND (
            t.title ILIKE ${pattern}
            OR COALESCE(t.description, '') ILIKE ${pattern}
            OR p.name ILIKE ${pattern}
          )
        ORDER BY t.updated_at DESC
        LIMIT 8
      `,
    ]);

    return {
      projects: projectRows as WorkspaceSearchProject[],
      tasks: taskRows as WorkspaceSearchTask[],
    };
  } catch {
    return { projects: [], tasks: [], error: "Search could not be completed. Try again." };
  }
}

export async function getWorkspaceUsers(workspaceId: string) {
  if (!workspaceId) {
    return [] as WorkspaceUser[];
  }

  const result = await sql`
    SELECT
      wm.id AS member_id,
      wm.role,
      wm.created_at AS joined_at,
      u.id,
      u.name,
      u.email,
      u.image
    FROM workspace_members wm
    INNER JOIN neon_auth."user" u
      ON u.id = wm.user_id
    WHERE wm.workspace_id = ${workspaceId}
    ORDER BY wm.created_at DESC
  `;

  return (result as WorkspaceUserRow[]).map((row) => ({
    id: row.member_id,
    role: row.role,
    created_at: row.joined_at,
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      image: row.image ?? undefined,
    },
  })) as WorkspaceUser[];
}

export async function getWorkspaceProjects(workspaceId: string){
  if (!workspaceId) {
    return [] as WorkspaceProject[];
  }

  const result = await sql`
    SELECT
      id,
      name,
      description,
      priority,
      status,
      start_date,
      end_date,
      team_lead,
      workspace_id,
      progress,
      created_at,
      updated_at
    FROM projects
    WHERE workspace_id = ${workspaceId}::uuid
    ORDER BY created_at DESC
  `;

  return result as WorkspaceProject[];
}

export async function getWorkspaceTasks(workspaceId: string) {
  if (!workspaceId) return [] as WorkspaceTask[];
  const rows = await sql`SELECT t.id,t.project_id,t.title,t.status,t.type,t.priority,t.due_date,t.updated_at,p.name AS project_name,u.name AS assignee_name FROM tasks t JOIN projects p ON p.id=t.project_id LEFT JOIN neon_auth."user" u ON u.id=t.assignee_id WHERE p.workspace_id=${workspaceId}::uuid ORDER BY t.updated_at DESC`;
  return rows as WorkspaceTask[];
}

export async function addWorkspaceMember(workspaceId: string, email: string, role: "ADMIN" | "MEMBER" = "MEMBER") {
  const currentUser = await getNeonSignedUser();
  if (!currentUser.user) return { error: "You must be signed in." };
  const access = await sql`SELECT EXISTS(SELECT 1 FROM workspaces WHERE id=${workspaceId}::uuid AND owner_id=${currentUser.user.id}::uuid) AS allowed` as { allowed: boolean }[];
  if (!access[0]?.allowed) return { error: "Only the workspace owner can add members." };
  const users = await sql`SELECT id FROM neon_auth."user" WHERE lower(email)=lower(${email.trim()})` as { id: string }[];
  if (!users[0]) return { error: "No account exists for that email yet." };
  await sql`INSERT INTO workspace_members (workspace_id,user_id,role) VALUES (${workspaceId}::uuid,${users[0].id}::uuid,${role}) ON CONFLICT (workspace_id,user_id) DO UPDATE SET role=EXCLUDED.role`;
  revalidatePath("/teams");
  return { success: "Member added to workspace." };
}
