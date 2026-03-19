import { Comment } from "."
import { User } from "./user"

export type Task = {
  id: string
  projectId: string
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  type: "FEATURE" | "BUG" | "TASK" | "IMPROVEMENT"
  priority: "LOW" | "MEDIUM" | "HIGH"
  assigneeId: string
  due_date: string|Date|number
  createdAt: string
  updatedAt: string
  assignee: User
  comments: Comment[]
}