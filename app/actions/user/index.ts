"use server";

import { getAuthContext } from "@/lib/auth";
import { sql } from "@/lib/db";
import type { User } from "@/types/user";

type SignedUserResult = {
  user: User | null;
  error?: string;
};

export type UserTasks = {
  task_id: string
  project_id: string
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  type: "FEATURE" | "BUG" | "TASK" | "IMPROVEMENT"
  priority: "LOW" | "MEDIUM" | "HIGH"
  due_date: string
  created_at: string
  updated_at: string

  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

type UserTaskRow = {
  task_id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  type: "FEATURE" | "BUG" | "TASK" | "IMPROVEMENT";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  email: string;
  image: string | null;
};

export async function getNeonSignedUser(): Promise<SignedUserResult> {
  try {
    const context = await getAuthContext();

    if (!context.user) {
      return {
        user: null,
        error: "No signed-in user found.",
      };
    }

    return { user: context.user as User };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : "Unable to fetch signed user.",
    };
  }
}

export async function getUserTasks(userId: string) {
  if (!userId) {
    return [] as UserTasks[];
  }

  const result = await sql`
    SELECT
      t.id AS task_id,
      t.project_id,
      t.title,
      t.description,
      t.status,
      t.type,
      t.priority,
      t.assignee_id,
      t.due_date,
      t.created_at,
      t.updated_at,
      u.id AS user_id,
      u.name,
      u.email,
      u.image
    FROM tasks t
    INNER JOIN neon_auth."user" u
      ON u.id = t.assignee_id
    WHERE t.assignee_id = ${userId}
    ORDER BY t.created_at DESC
  `;

  return (result as UserTaskRow[]).map((row) => ({
    task_id: row.task_id,
    project_id: row.project_id,
    title: row.title,
    description: row.description ?? "",
    status: row.status,
    type: row.type,
    priority: row.priority,
    assignee_id: row.assignee_id,
    due_date: row.due_date ?? "",
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: {
      id: row.user_id,
      name: row.name,
      email: row.email,
      image: row.image,
    },
  })) as UserTasks[];
}
