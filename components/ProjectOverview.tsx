"use client"

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Calendar, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import CreateProjectDialog from "./CreateProjectDialog";
import { getWorkspaceProjects, WorkspaceProject } from "@/app/actions/workspace";
import { useAppSelector } from "@/lib/hooks";
import { PROJECTS_UPDATED_EVENT } from "@/lib/project-events";
import { Skeleton } from "./ui/skeleton";

const statusColors: Record<string, string> = {
    PLANNING: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
    ACTIVE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
    ON_HOLD: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
    COMPLETED: "bg-blue-200 text-blue-800 dark:bg-blue-500 dark:text-blue-900",
    CANCELLED: "bg-red-200 text-red-800 dark:bg-red-500 dark:text-red-900",
};

const priorityColors: Record<string, string> = {
    LOW: "border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-400",
    MEDIUM: "border-amber-300 text-amber-700 dark:border-amber-500 dark:text-amber-400",
    HIGH: "border-green-300 text-green-700 dark:border-green-500 dark:text-green-400",
};

const ProjectOverview = () => {
    const { selectedWorkspace } = useAppSelector((state) => state.workspace);
    const [projects, setProjects] = useState<WorkspaceProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getProjects = useCallback(async () => {
        if (!selectedWorkspace?.id) {
            setProjects([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const nextProjects = await getWorkspaceProjects(selectedWorkspace.id);
            setProjects(nextProjects);
        } finally {
            setLoading(false);
        }
    }, [selectedWorkspace?.id]);

    useEffect(() => {
        void getProjects();
        const handleProjectsUpdated = () => {
            void getProjects();
        };
        window.addEventListener(PROJECTS_UPDATED_EVENT, handleProjectsUpdated);
        return () => window.removeEventListener(PROJECTS_UPDATED_EVENT, handleProjectsUpdated);
    }, [getProjects]);

    return !loading ? (
        <div className="bg-white dark:bg-zinc-950 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 rounded-lg overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                <h2 className="text-md text-zinc-800 dark:text-zinc-300">Project Overview</h2>
                <Link href={'/projects'} className="text-sm text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 flex items-center">
                    View all <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>

            <div className="p-0">
                {projects?.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500 rounded-full flex items-center justify-center">
                            <FolderOpen size={32} />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">No projects yet</p>
                        <CreateProjectDialog />
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {projects.slice(0, 5).map((project) => {
                            const statusKey = project.status as keyof typeof statusColors;
                            const priorityKey = project.priority as keyof typeof priorityColors;
                            const displayStatus = project.status.replace("_", " ");

                            return (
                                <Link key={project.id} href={`/project-detail?id=${project.id}&tab=tasks`} className="block p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                                {project.description || "No description"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <span className={`text-xs px-2 py-1 rounded ${statusColors[statusKey] ?? "bg-zinc-200"}`}>
                                                {displayStatus}
                                            </span>
                                            <div className={`w-2 h-2 rounded-full border-2 ${priorityColors[priorityKey] ?? "border-zinc-300"}`} />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 mb-3">
                                        <div className="flex items-center gap-4">
                                            {project.end_date && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(project.end_date), "MMM d, yyyy")}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-zinc-500 dark:text-zinc-500">Progress</span>
                                            <span className="text-zinc-600 dark:text-zinc-400">{project.progress || 0}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded h-1.5">
                                            <div className="h-1.5 bg-blue-500 rounded" style={{ width: `${project.progress || 0}%` }} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    ) : (
        <Skeleton className="w-full h-60 rounded-md" />
    )
}

export default ProjectOverview;