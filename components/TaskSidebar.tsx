import { CaretRightIcon } from "@phosphor-icons/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getNeonSignedUser, UserTasks } from "@/app/actions/user";
import { getWorkspaceProjects, getWorkspaceTasks } from "@/app/actions/workspace";
import { useAppSelector } from "@/lib/hooks";

const TaskSidebar = () => {
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const [tasks, setTasks] = useState<UserTasks[]>([]);

  useEffect(() => {
    async function loadTasks() {
      if (!selectedWorkspace?.id) {
        setTasks([]);
        return;
      }

      try {
        const [{ user }, workspaceProjects, workspaceTasks] = await Promise.all([
          getNeonSignedUser(),
          getWorkspaceProjects(selectedWorkspace.id),
          getWorkspaceTasks(selectedWorkspace.id),
        ]);

        if (!user?.id) {
          setTasks([]);
          return;
        }

        const projectIds = new Set(workspaceProjects.map((project) => project.id));
        const userTasks = workspaceTasks.filter((task) => {
          const taskProjectId = task.project_id;
          return projectIds.has(taskProjectId) && task.assignee_name === user.name;
        });

        const userAssignedTasks = await getUserTasks(user.id);
        const filtered = userAssignedTasks.filter((task) => projectIds.has(task.project_id));
        setTasks(filtered.length ? filtered : userTasks.map((task) => ({
          task_id: task.id,
          project_id: task.project_id,
          title: task.title,
          description: "",
          status: task.status,
          type: task.type,
          priority: task.priority,
          due_date: task.due_date ?? "",
          created_at: task.updated_at,
          updated_at: task.updated_at,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image ?? null,
          },
        } as UserTasks)));
      } catch (error) {
        console.error("Failed to load task sidebar items:", error);
        setTasks([]);
      }
    }

    void loadTasks();
  }, [selectedWorkspace?.id]);

  const visibleTasks = useMemo(() => tasks.slice(0, 3), [tasks]);

  const getTaskStatusColor = (status: UserTasks["status"]) => {
    switch (status) {
      case "DONE":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      case "TODO":
        return "bg-gray-500 dark:bg-zinc-500";
      default:
        return "bg-gray-400 dark:bg-zinc-400";
    }
  };

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="hover:bg-gray-50 dark:hover:bg-zinc-800/60 p-2">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">My Tasks</h3>
              <span className="bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded">{tasks.length}</span>
            </div>
            <CaretRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            {visibleTasks.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500 dark:text-zinc-400">No tasks assigned.</div>
            ) : (
              visibleTasks.map((task) => (
                <Link key={task.task_id} href={`/task-detail?taskId=${task.task_id}&projectId=${task.project_id}`} className="w-full rounded-lg transition-all duration-200 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white" >
                  <div className="flex items-center gap-2 px-3 py-2 w-full min-w-0">
                    <div className={`w-2 h-2 rounded-full ${getTaskStatusColor(task.status)} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 lowercase">{task.type}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

async function getUserTasks(userId: string) {
  const { getUserTasks: fetchUserTasks } = await import("@/app/actions/user");
  return fetchUserTasks(userId);
}

export default TaskSidebar;