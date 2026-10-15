"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { getNeonSignedUser, getUserTasks, UserTasks } from "@/app/actions/user";
import { getWorkspaceProjects, getWorkspaceTasks, WorkspaceProject, WorkspaceTask } from "@/app/actions/workspace";
import { useAppSelector } from "@/lib/hooks";

export default function TasksSummary() {
    const { selectedWorkspace } = useAppSelector((state) => state.workspace);
    const [workspaceTasks, setWorkspaceTasks] = useState<WorkspaceTask[]>([]);
    const [myTasks, setMyTasks] = useState<UserTasks[]>([]);

    useEffect(() => {
        async function loadTasks() {
            if (!selectedWorkspace?.id) {
                setWorkspaceTasks([]);
                setMyTasks([]);
                return;
            }

            try {
                const [{ user }, workspaceProjects, nextTasks] = await Promise.all([
                    getNeonSignedUser(),
                    getWorkspaceProjects(selectedWorkspace.id),
                    getWorkspaceTasks(selectedWorkspace.id),
                ]);

                setWorkspaceTasks(nextTasks);

                if (!user?.id) {
                    setMyTasks([]);
                    return;
                }

                const projectIds = new Set(workspaceProjects.map((project: WorkspaceProject) => project.id));
                const assigned = await getUserTasks(user.id);
                setMyTasks(assigned.filter((task) => projectIds.has(task.project_id)));
            } catch (error) {
                console.error("Failed to load task summary:", error);
                setWorkspaceTasks([]);
                setMyTasks([]);
            }
        }

        void loadTasks();
    }, [selectedWorkspace?.id]);

    const overdueTasks = useMemo(
        () => workspaceTasks.filter(
            (task) => task.due_date && new Date(task.due_date) < new Date() && task.status !== "DONE"
        ),
        [workspaceTasks]
    );
    const inProgressIssues = useMemo(
        () => workspaceTasks.filter((task) => task.status === "IN_PROGRESS"),
        [workspaceTasks]
    );

    const summaryCards = useMemo(
        () => [
            {
                title: "My Tasks",
                count: myTasks.length,
                icon: User,
                color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
                items: myTasks.slice(0, 3).map((task) => ({
                    id: task.task_id ?? task.title,
                    title: task.title,
                    type: task.type,
                    priority: task.priority,
                })),
            },
            {
                title: "Overdue",
                count: overdueTasks.length,
                icon: AlertTriangle,
                color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
                items: overdueTasks.slice(0, 3).map((task) => ({
                    id: task.id ?? task.title,
                    title: task.title,
                    type: task.type,
                    priority: task.priority,
                })),
            },
            {
                title: "In Progress",
                count: inProgressIssues.length,
                icon: Clock,
                color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
                items: inProgressIssues.slice(0, 3).map((task) => ({
                    id: task.id ?? task.title,
                    title: task.title,
                    type: task.type,
                    priority: task.priority,
                })),
            },
        ],
        [inProgressIssues, myTasks, overdueTasks]
    );

    return (
        <div className="space-y-6">
            {summaryCards.map((card) => (
                <div key={card.title} className="bg-white dark:bg-zinc-950 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 rounded-lg overflow-hidden">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                <card.icon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                            </div>
                            <div className="flex items-center justify-between flex-1">
                                <h3 className="text-sm font-medium text-gray-800 dark:text-white">{card.title}</h3>
                                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${card.color}`}>
                                    {card.count}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        {card.items.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">
                                No {card.title.toLowerCase()}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {card.items.map((issue) => (
                                    <div key={issue.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                                        <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {issue.title || "Task"}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400 capitalize mt-1">
                                            {issue.type || "task"} • {issue.priority || "medium"} priority
                                        </p>
                                    </div>
                                ))}
                                {card.count > 3 && (
                                    <button className="flex items-center justify-center w-full text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white mt-2">
                                        View {card.count - 3} more <ArrowRight className="w-3 h-3 ml-2" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}