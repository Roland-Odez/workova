"use client";

import { getUserTasks, UserTasks } from "@/app/actions/user";
import {
    getWorkspaceProjects,
    WorkspaceProject,
} from "@/app/actions/workspace";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/hooks";
import { User } from "@/types/user";
import {
    AlertTriangle,
    CheckCircle,
    FolderOpen,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

type StatsType = {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    myTasks: number;
    overdueIssues: number;
};

const StatsBoard = ({ user }: { user: User }) => {
    const [stats, setStats] = useState<StatsType | null>(null);

    const { selectedWorkspace } = useAppSelector(
        (state) => state.workspace
    );

    const statCards = [
        {
            icon: FolderOpen,
            title: "Total Projects",
            value: stats?.totalProjects ?? 0,
            subtitle: `projects in ${selectedWorkspace?.name ?? "workspace"}`,
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-500",
        },
        {
            icon: CheckCircle,
            title: "Completed Projects",
            value: stats?.completedProjects ?? 0,
            subtitle: `of ${stats?.totalProjects ?? 0} total`,
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-500",
        },
        {
            icon: Users,
            title: "My Tasks",
            value: stats?.myTasks ?? 0,
            subtitle: "assigned to me",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-500",
        },
        {
            icon: AlertTriangle,
            title: "Overdue",
            value: stats?.overdueIssues ?? 0,
            subtitle: "need attention",
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-500",
        },
    ];

    useEffect(() => {
        if (!selectedWorkspace?.id || !user?.id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStats(null);
            return;
        }

        async function getDashboardStats() {
            try {
                const [myProjects, myTasks] = await Promise.all([
                    getWorkspaceProjects(selectedWorkspace?.id as string),
                    getUserTasks(user?.id),
                ]);

                setStats({
                    totalProjects: myProjects.length,

                    activeProjects: myProjects.filter(
                        (p: WorkspaceProject) =>
                            p.status !== "CANCELLED" &&
                            p.status !== "COMPLETED"
                    ).length,

                    completedProjects: myProjects.filter(
                        (p: WorkspaceProject) =>
                            p.status === "COMPLETED"
                    ).length,

                    myTasks: myTasks.length,

                    overdueIssues: myTasks.filter(
                        (t: UserTasks) =>
                            t.due_date &&
                            new Date(t.due_date) < new Date()
                    ).length,
                });
            } catch (error) {
                console.error("Failed to load dashboard stats:", error);
            }
        }

        void getDashboardStats();
    }, [selectedWorkspace?.id, user?.id]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-9">
            {stats ? (
                statCards.map(
                    (
                        {
                            icon: Icon,
                            title,
                            value,
                            subtitle,
                            bgColor,
                            textColor,
                        },
                        i
                    ) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-zinc-950 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-200 rounded-md"
                        >
                            <div className="p-6 py-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                            {title}
                                        </p>

                                        <p className="text-3xl font-bold text-zinc-800 dark:text-white">
                                            {value}
                                        </p>

                                        {subtitle && (
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                                {subtitle}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className={`p-3 rounded-xl ${bgColor}`}
                                    >
                                        <Icon
                                            size={20}
                                            className={textColor}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )
            ) : (
                statCards.map((s) => (
                    <Skeleton
                        key={s.title}
                        className="h-32 w-full rounded-md"
                    />
                ))
            )}
        </div>
    );
};

export default StatsBoard;