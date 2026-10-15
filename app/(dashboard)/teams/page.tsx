"use client"

import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import InviteMemberDialog from "@/components/InviteMemberDialog";
import { UsersIcon, Search, Shield, Activity } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { getWorkspaceProjects, getWorkspaceUsers, WorkspaceProject, WorkspaceUser } from "@/app/actions/workspace";
import { Skeleton } from "@/components/ui/skeleton";

const Team = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [members, setMembers] = useState<WorkspaceUser[]|[]>([]);
    const [projects, setProjects] = useState<WorkspaceProject[]| []>([]);
    const [loading, setLoading] = useState(true);
    const { selectedWorkspace } = useAppSelector((state) => state.workspace);
    const filteredMembers = members.filter(
        (user) =>
            user?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        async function getProjects(){
            if (!selectedWorkspace?.id) {
                setProjects([]);
                setMembers([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const [projects, members] = await Promise
                .all([getWorkspaceProjects(selectedWorkspace.id),
                    getWorkspaceUsers(selectedWorkspace.id)])
                setProjects(projects)
                setMembers(members)
            } finally {
                setLoading(false)
            }
        }

        getProjects()
    }, [selectedWorkspace?.id]);

    const renderMemberSkeletons = () => (
        <div className="max-w-4xl w-full">
            <div className="hidden sm:block overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50 dark:bg-zinc-900/50">
                        <tr>
                            <th className="px-6 py-2.5 text-left font-medium text-sm">
                                Name
                            </th>
                            <th className="px-6 py-2.5 text-left font-medium text-sm">
                                Email
                            </th>
                            <th className="px-6 py-2.5 text-left font-medium text-sm">
                                Role
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <tr key={index}>
                                <td className="px-6 py-2.5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="size-7 rounded-full" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </td>
                                <td className="px-6 py-2.5 whitespace-nowrap">
                                    <Skeleton className="h-4 w-44" />
                                </td>
                                <td className="px-6 py-2.5 whitespace-nowrap">
                                    <Skeleton className="h-6 w-16" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="p-4 border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Skeleton className="size-9 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-44" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">Team</h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        Manage team members and their contributions
                    </p>
                </div>

                <InviteMemberDialog />
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4">
                {/* Total Members */}
                <div className="max-sm:w-full dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
                    <div className="flex items-center justify-between gap-8 md:gap-22">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Total Members</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{members.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/10">
                            <UsersIcon className="size-4 text-blue-500 dark:text-blue-200" />
                        </div>
                    </div>
                </div>

                {/* Active Projects */}
                <div className="max-sm:w-full dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
                    <div className="flex items-center justify-between gap-8 md:gap-22">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Active Projects</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {projects.filter((p) => p.status !== "CANCELLED" && p.status !== "COMPLETED").length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
                            <Activity className="size-4 text-emerald-500 dark:text-emerald-200" />
                        </div>
                    </div>
                </div>

                {/* Total Tasks */}
                <div className="max-sm:w-full dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
                    <div className="flex items-center justify-between gap-8 md:gap-22">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Completed projects</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{projects.filter((p) => p.status === 'COMPLETED').length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-500/10">
                            <Shield className="size-4 text-purple-500 dark:text-purple-200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <InputGroup className="max-w-md w-sm mr-4">
                <InputGroupInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search members" />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>

            {/* Team Members */}
            <div className="w-full">
                {loading ? (
                    renderMemberSkeletons()
                ) : filteredMembers.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {members.length === 0
                                ? "No team members yet"
                                : "No members match your search"}
                        </h3>
                        <p className="text-gray-500 dark:text-zinc-400 mb-6">
                            {members.length === 0
                                ? "Invite team members to start collaborating"
                                : "Try adjusting your search term"}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-4xl w-full">
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-800">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                                <thead className="bg-gray-50 dark:bg-zinc-900/50">
                                    <tr>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">
                                            Name
                                        </th>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">
                                            Email
                                        </th>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">
                                            Role
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                    {filteredMembers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-2.5 whitespace-nowrap flex items-center gap-3">
                                                <Image
                                                    src={user.user.image || '/favicon.ico'}
                                                    alt={user.user.name}
                                                    width={36}
                                                    height={36}
                                                    className="size-7 rounded-full bg-gray-200 dark:bg-zinc-800"
                                                />
                                                <span className="text-sm text-zinc-800 dark:text-white truncate">
                                                    {user.user?.name || "Unknown User"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                                                {user.user.email}
                                            </td>
                                            <td className="px-6 py-2.5 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-md ${user.role === "ADMIN"
                                                            ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
                                                            : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                                                        }`}
                                                >
                                                    {user.role || "User"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-3">
                            {filteredMembers.map((user) => (
                                <div
                                    key={user.id}
                                    className="p-4 border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Image
                                            src={user.user.image || '/favicon.ico'}
                                            width={36}
                                            height={36}
                                            alt={user.user.name}
                                            className="size-9 rounded-full bg-gray-200 dark:bg-zinc-800"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {user.user?.name || "Unknown User"}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-zinc-400">
                                                {user.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-md ${user.role === "ADMIN"
                                                    ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
                                                    : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                                                }`}
                                        >
                                            {user.role || "User"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};

export default Team;
