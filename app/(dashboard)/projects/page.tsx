"use client"

import { getWorkspaceProjects, WorkspaceProject } from '@/app/actions/workspace'
import CreateProjectDialog from '@/components/CreateProjectDialog'
import ProjectCard from '@/components/ProjectCard'
import { Field } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppSelector } from '@/lib/hooks'
import { PROJECTS_UPDATED_EVENT } from '@/lib/project-events'
import { FolderOpen, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const Projects = () => {
    const { selectedWorkspace } = useAppSelector((state) => state.workspace);
    const [projects, setProjects] = useState<WorkspaceProject[]| []>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [priority, setPrioty] = useState<"ALL_PRIORITY"|"LOW"|"MEDIUM"|"HIGH">('ALL_PRIORITY')
    const [status, setStatus] = useState<"ALL_STATUS"|"PLANNING"|"ACTIVE"|"COMPLETED"|"ON_HOLD"|"CANCELLED">('ALL_STATUS')

    const filteredProjects = useMemo(() => {
        let filtered = projects;

        if (searchTerm) {
            filtered = filtered.filter(
                (project) =>
                    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (status !== "ALL_STATUS") {
            filtered = filtered.filter((project) => project.status === status);
        }

        if (priority !== "ALL_PRIORITY") {
            filtered = filtered.filter(
                (project) => project.priority === priority
            );
        }

        return filtered;
    }, [searchTerm, priority, status, projects]);

    useEffect(() => {
        async function getProjects(){
            if (!selectedWorkspace?.id) {
                setProjects([]);
                setLoading(false);
                return;
            }

            setLoading(true)
            try {
                const projects = await getWorkspaceProjects(selectedWorkspace.id)
                setProjects(projects)
            } finally {
                setLoading(false)
            }
        }

        getProjects()
        const handleProjectsUpdated = () => {
            void getProjects()
        }
        window.addEventListener(PROJECTS_UPDATED_EVENT, handleProjectsUpdated)
        return () => window.removeEventListener(PROJECTS_UPDATED_EVENT, handleProjectsUpdated)
    }, [selectedWorkspace?.id]);

    const renderProjectSkeletons = () => (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-zinc-950 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-lg p-5"
                >
                    <div className="mb-3 space-y-3">
                        <Skeleton className="h-5 w-3/5" />
                        <div className="space-y-2">
                            {/* <Skeleton className="h-4 w-full" /> */}
                            <Skeleton className="h-4 w-3/5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-5 w-20 rounded" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-14" />
                            <Skeleton className="h-3 w-8" />
                        </div>
                        <Skeleton className="h-1.5 w-full rounded" />
                    </div>
                </div>
            ))}
        </>
    );

  return (
    <div>
        <section className='flex items-center justify-between'>
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1"> Projects </h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm"> Manage and track your projects </p>
            </div>

            <CreateProjectDialog />
        </section>
        <section className='flex items-center mt-8'>
            <InputGroup className="max-w-md w-sm mr-4">
                <InputGroupInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search projects" />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>
            <div className="flex items-center gap-4">
                <Field>
                  <Select defaultValue="ALL_STATUS" value={status} onValueChange={(value) => setStatus(value as typeof status)} >
                    <SelectTrigger id="small-form-status">
                      <SelectValue  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ALL_STATUS">All status</SelectItem>
                        <SelectItem value="PLANNING">Planning</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="ON_HOLD">Hold</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Select defaultValue="ALL_PRIORITY" value={priority} onValueChange={(value) => setPrioty(value as typeof priority)}>
                    <SelectTrigger id="small-form-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ALL_PRIORITY">All priority</SelectItem>
                        <SelectItem value="LOW">LOW</SelectItem>
                        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                        <SelectItem value="HIGH">HIGH</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
            </div>
        </section>
        <section className='mt-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!loading ? (
                    filteredProjects.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                <FolderOpen className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                No projects found
                            </h3>

                            <p className="text-gray-500 dark:text-zinc-400 mb-6 text-sm">
                                Create your first project to get started
                            </p>

                            <CreateProjectDialog />
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))
                    )
                ) : (
                    renderProjectSkeletons()
                )}
            </div>
        </section>
    </div>
  )
}

export default Projects
