import { Priority, ProjectMember, ProjectStatus } from "."

export type Project = {
  id: string
  name: string
  description: string
  priority: Priority
  status: ProjectStatus
  start_date: string
  end_date: string
  team_lead: string
  workspaceId: string
  progress: number
  createdAt: string
  updatedAt: string
  tasks: Task[]
  members: ProjectMember[]
}