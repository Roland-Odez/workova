"use server";

import cloudinary from "@/lib/cloundinary";

import { ensureWorkspacesTable } from ".";
import { sql } from "../../../lib/db";

type CreateWorkspaceInput = {
  name: string;
  slug: string;
  logo?: File | null;
  owner: string;
};

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
  owner,
}: CreateWorkspaceInput) {
  await ensureWorkspacesTable();

  const imageUrl = await uploadWorkspaceLogo(logo);

  const workspace = await sql`
    INSERT INTO workspaces (name, slug, image_url, owner_id)
    VALUES (${name}, ${slug}, ${imageUrl}, ${owner})
    RETURNING id, name, slug, image_url, owner_id, created_at, updated_at
  `;

  return workspace;
}
