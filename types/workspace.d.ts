import { WorkspaceMember } from "."
import { Project } from "./project"
import { User } from "./user"

export type Workspace = {
  id: string
  name: string
  slug: string
  description: string | null
  settings: Record<string, unknown>
  ownerId: string
  createdAt: string
  updatedAt: string
  image_url: string
  members: WorkspaceMember[]
  projects: Project[]
  owner: User
}
