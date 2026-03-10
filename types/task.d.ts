import { Comment } from "."

export type Task = {
  id: string
  projectId: string
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  type: "FEATURE" | "BUG" | "TASK" | "IMPROVEMENT"
  priority: "LOW" | "MEDIUM" | "HIGH"
  assigneeId: string
  due_date: string
  createdAt: string
  updatedAt: string
  assignee: User
  comments: Comment[]
}