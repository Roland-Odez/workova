export type Priority = "LOW" | "MEDIUM" | "HIGH"
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"
export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "HOLD"
export type ProjectMember = {
  id: string
  userId: string
  projectId: string
  user: User
}
export type Comment = {
  id: string
  message: string
  userId: string
  taskId: string
  createdAt: string
}
export type WorkspaceMember = {
  id: string
  userId: string
  workspaceId: string
  message: string
  role: "ADMIN" | "MEMBER"
  user: User
}