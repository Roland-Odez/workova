import cloudinary from "@/lib/cloundinary";
import { sql } from "../../../lib/db";
import { WorkspaceType } from "@/lib/features/worskspace/workspaceSlice";

type CreateWorkspaceInput = {
  name: string;
  slug: string;
  logo?: File | null;
  owner: string;
};

async function ensureWorkspacesTable() {
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

async function uploadWorkspaceLogo(logo?: File | null) {
  if (!logo || logo.size === 0) {
    return "";
  }

  const bytes = await logo.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "workova/organisations",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          console.log('error', error)
          return;
        }

        resolve(result?.secure_url ?? "");
      }
    );

    stream.end(buffer);
  });
}

export async function createWorkspace({
  name,
  slug,
  logo,
  owner
}: CreateWorkspaceInput) {
  await ensureWorkspacesTable();

  const imageUrl = await uploadWorkspaceLogo(logo);

  const workspace = await sql`
    INSERT INTO workspaces (name, slug, image_url, owner_id)
    VALUES (${name}, ${slug}, ${imageUrl}, ${owner})
    RETURNING id, name, slug, image_url, owner_id, created_at, updated_at
  `;

  console.log("workspace",workspace)
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