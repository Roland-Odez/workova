"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Clock, Bug, Zap, Square } from "lucide-react";
import { format } from "date-fns";
import { getWorkspaceTasks, WorkspaceTask } from "@/app/actions/workspace";
import { useAppSelector } from "@/lib/hooks";

const typeIcons: Record<string, { icon: typeof Bug; color: string }> = {
    BUG: { icon: Bug, color: "text-red-500 dark:text-red-400" },
    FEATURE: { icon: Zap, color: "text-blue-500 dark:text-blue-400" },
    TASK: { icon: Square, color: "text-green-500 dark:text-green-400" },
    IMPROVEMENT: { icon: MessageSquare, color: "text-amber-500 dark:text-amber-400" },
};

const statusColors = {
    TODO: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
    IN_PROGRESS: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
    DONE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
};

const RecentActivity = () => {
    const { selectedWorkspace } = useAppSelector((state) => state.workspace);
    const [tasks, setTasks] = useState<WorkspaceTask[]>([]);

    useEffect(() => {
        async function loadTasks() {
            if (!selectedWorkspace?.id) {
                setTasks([]);
                return;
            }

            try {
                const nextTasks = await getWorkspaceTasks(selectedWorkspace.id);
                setTasks(
                    [...nextTasks].sort(
                        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    )
                );
            } catch (error) {
                console.error("Failed to load recent activity:", error);
                setTasks([]);
            }
        }

        void loadTasks();
    }, [selectedWorkspace?.id]);

    const activityTasks = useMemo(() => tasks.slice(0, 6), [tasks]);

    return (
        <div className="bg-white dark:bg-zinc-950 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg transition-all overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
                <h2 className="text-lg text-zinc-800 dark:text-zinc-200">Recent Activity</h2>
            </div>

            <div className="p-0">
                {activityTasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-zinc-600 dark:text-zinc-500" />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">No recent activity</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {activityTasks.map((task) => {
                            const TypeIcon = typeIcons[task.type]?.icon || Square;
                            const iconColor = typeIcons[task.type]?.color || "text-gray-500 dark:text-gray-400";

                            return (
                                <div key={task.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                                            <TypeIcon className={`w-4 h-4 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-zinc-800 dark:text-zinc-200 truncate">{task.title}</h4>
                                                <span className={`ml-2 px-2 py-1 rounded text-xs ${statusColors[task.status] || "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"}`}>
                                                    {task.status.replace("_", " ")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                                <span className="capitalize">{task.type.toLowerCase()}</span>
                                                <span>{task.project_name}</span>
                                                <span>{format(new Date(task.updated_at), "MMM d, h:mm a")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;