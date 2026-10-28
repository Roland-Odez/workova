"use client"

import { useState, useEffect, useCallback } from "react";
import { ArrowLeftIcon, SettingsIcon, BarChart3Icon, CalendarIcon, FileStackIcon, ZapIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import ProjectTasks from "@/components/ProjectTask";
import { getProjectById, getProjectMembers, getProjectTasksWithUser, ProjectMember, ProjectRecord, ProjectTasksAndUser } from "@/app/actions/project";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectDetailSkeleton() {
    return (
        <div className="space-y-5 max-w-6xl mx-auto" aria-label="Loading project details" aria-busy="true">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-7" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid grid-cols-2 gap-6 sm:flex sm:flex-wrap">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex min-w-40 flex-1 justify-between rounded border border-zinc-200 p-4 dark:border-zinc-800">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-7 w-12" />
                        </div>
                        <Skeleton className="size-4" />
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-24" />
                ))}
            </div>
            <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
}

export default function ProjectDetail() {

    const params = useSearchParams();
    const id = params.get('id');
    const tab = params.get('tab');

    const router = useRouter();

    const [project, setProject] = useState<ProjectRecord|null>(null);
    const [tasks, setTasks] = useState<ProjectTasksAndUser[]|[]>([]);
    const [members, setMembers] = useState<ProjectMember[]|[]>([])
    const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null);
    const activeTab = tab ?? "tasks";
    const loadProject = useCallback(async () => {
        if (!id) {
            setProject(null);
            setTasks([]);
            setMembers([]);
            setLoadedProjectId(null);
            return;
        }
        const [nextProject, nextTasks, nextMembers] = await Promise.all([getProjectById(id), getProjectTasksWithUser(id), getProjectMembers(id)]);
        setProject(nextProject);
        setTasks(nextTasks);
        setMembers(nextMembers);
        setLoadedProjectId(id);
    }, [id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadProject();
    }, [loadProject]);

    const statusColors: Record<string, string> = {
        PLANNING: "bg-zinc-200 text-zinc-900 dark:bg-zinc-600 dark:text-zinc-200",
        ACTIVE: "bg-emerald-200 text-emerald-900 dark:bg-emerald-500 dark:text-emerald-900",
        ON_HOLD: "bg-amber-200 text-amber-900 dark:bg-amber-500 dark:text-amber-900",
        COMPLETED: "bg-blue-200 text-blue-900 dark:bg-blue-500 dark:text-blue-900",
        CANCELLED: "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-900",
    };

    if (id && loadedProjectId !== id) {
        return <ProjectDetailSkeleton />;
    }

    if (!project) {
        return (
            <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
                <p className="text-3xl md:text-5xl mt-40 mb-10">Project not found</p>
                <button onClick={() => router.push('/projects')} className="mt-4 px-4 py-2 rounded bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600" >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-6xl mx-auto text-zinc-900 dark:text-white">
            {/* Header */}
            <div className="flex max-md:flex-col gap-4 flex-wrap items-start justify-between max-w-6xl">
                <div className="flex items-center gap-4">
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400" onClick={() => router.push('/projects')}>
                        <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-medium">{project?.name}</h1>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${project.status ? statusColors[project.status] : ""}`} >
                            {project?.status?.replace("_", " ")}
                        </span>
                    </div>
                </div>
                <CreateTaskDialog projectId={project.id} onCreated={loadProject} />
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 sm:flex flex-wrap gap-6">
                {[
                    { label: "Total Tasks", value: tasks.length, color: "text-zinc-900 dark:text-white" },
                    { label: "Completed", value: tasks.filter((t) => t.status === "DONE").length, color: "text-emerald-700 dark:text-emerald-400" },
                    { label: "In Progress", value: tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "TODO").length, color: "text-amber-700 dark:text-amber-400" },
                    { label: "Team Members", value: members?.length || 0, color: "text-blue-700 dark:text-blue-400" },
                ].map((card, idx) => (
                    <div key={idx} className=" dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex justify-between sm:min-w-60 p-4 py-2.5 rounded">
                        <div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">{card.label}</div>
                            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                        </div>
                        <ZapIcon className={`size-4 ${card.color}`} />
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div>
                <div className="inline-flex flex-wrap max-sm:grid grid-cols-3 gap-2 border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
                    {[
                        { key: "tasks", label: "Tasks", icon: FileStackIcon },
                        { key: "calendar", label: "Calendar", icon: CalendarIcon },
                        { key: "analytics", label: "Analytics", icon: BarChart3Icon },
                        { key: "settings", label: "Settings", icon: SettingsIcon },
                    ].map((tabItem) => (
                        <button key={tabItem.key} 
                        onClick={() => { 
                            router.replace(`/project-detail?id=${id}&tab=${tabItem.key}`)
                        }} className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${activeTab === tabItem.key ? "bg-zinc-100 dark:bg-zinc-800/80" : "hover:bg-zinc-50 dark:hover:bg-zinc-700"}`} >
                            <tabItem.icon className="size-3.5" />
                            {tabItem.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {activeTab === "tasks" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectTasks tasks={tasks} />
                        </div>
                    )}
                    {activeTab === "analytics" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <div className="grid grid-cols-2 gap-4">{[["To do", tasks.filter(t=>t.status === "TODO").length],["In progress", tasks.filter(t=>t.status === "IN_PROGRESS").length],["Completed",tasks.filter(t=>t.status === "DONE").length],["Overdue",tasks.filter(t=>t.due_date && new Date(t.due_date) < new Date() && t.status !== "DONE").length]].map(([label,value])=><div key={String(label)} className="rounded border border-zinc-200 p-5 dark:border-zinc-800"><p className="text-sm text-zinc-500">{label}</p><p className="text-2xl font-semibold">{value}</p></div>)}</div>
                        </div>
                    )}
                    {activeTab === "calendar" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <div className="space-y-3">{tasks.filter(t=>t.due_date).sort((a,b)=>new Date(a.due_date!).getTime()-new Date(b.due_date!).getTime()).map(task=><div key={task.id} className="flex justify-between rounded border border-zinc-200 p-4 dark:border-zinc-800"><span>{task.title}</span><span className="text-sm text-zinc-500">{new Date(task.due_date!).toLocaleDateString()}</span></div>)}{!tasks.some(t=>t.due_date) && <p className="text-zinc-500">No tasks have due dates yet.</p>}</div>
                        </div>
                    )}
                    {activeTab === "settings" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <div className="rounded border border-zinc-200 p-5 dark:border-zinc-800"><h2 className="font-medium">Project team</h2><div className="mt-4 space-y-2">{members.map(member=><div key={member.id} className="flex justify-between"><span>{member.user.name}</span><span className="text-sm text-zinc-500">{member.user.email}</span></div>)}{!members.length && <p className="text-zinc-500">No members added yet.</p>}</div></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
