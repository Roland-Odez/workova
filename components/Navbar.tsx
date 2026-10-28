"use client"
import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import type { User } from "@/types/user"
import { searchWorkspaceItems, type WorkspaceSearchResults } from "@/app/actions/workspace"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { setTheme } from "@/lib/features/theme/themeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { applyTheme } from "@/lib/utils"
import { signOut } from "@/app/actions/auth"
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, ListTodo, LogOut, Moon, Search, Sun } from 'lucide-react'
import { toast } from "sonner"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

type NavbarProps = {
    user: User | null;
    summary: {
        projectCount: number;
        recentProjects: { id: string; name: string }[];
        taskCount: number;
        todoCount: number;
        inProgressCount: number;
        completedCount: number;
        recentTasks: { id: string; title: string; status: string; projectName: string }[];
    };
}

const Navbar = ({ user, summary }: NavbarProps) => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme.theme);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<(WorkspaceSearchResults & { query: string }) | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isSigningOut, startSignOut] = useTransition();
    const normalizedSearchQuery = searchQuery.trim();
    const currentSearchResults = searchResults?.query === normalizedSearchQuery ? searchResults : null;
    const showSearchResults = searchOpen && normalizedSearchQuery.length >= 2;
    const isSearching = normalizedSearchQuery.length >= 2 && (!currentSearchResults || isPending);
    const displayName = user?.name.trim() || "Account";
    const initials = displayName
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
    const memberSince = createdAt && !Number.isNaN(createdAt.getTime())
        ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(createdAt)
        : "Unavailable";

    useEffect(() => {
        if (normalizedSearchQuery.length < 2) return;

        let cancelled = false;
        const timeoutId = window.setTimeout(() => {
            void searchWorkspaceItems(normalizedSearchQuery)
                .then((results) => {
                    if (!cancelled) {
                        startTransition(() => setSearchResults({ ...results, query: normalizedSearchQuery }));
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        startTransition(() => setSearchResults({
                            projects: [],
                            tasks: [],
                            error: "Search could not be completed. Try again.",
                            query: normalizedSearchQuery,
                        }));
                    }
                });
        }, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [normalizedSearchQuery, startTransition]);

    const handleToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        dispatch(setTheme(newTheme));
        applyTheme(newTheme);
    };

    const handleSignOut = () => {
        startSignOut(async () => {
            const result = await signOut();
            if (result?.error) toast.error(result.error);
        });
    };
  return (
    <div className="flex items-center justify-between py-4 px-4 md:px-12 flex-1 bg-sidebar">
        <div
            className="relative w-full max-w-md"
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setSearchOpen(false);
                }
            }}
        >
            <InputGroup>
                <InputGroupAddon>
                    <Search aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                    type="search"
                    aria-label="Search projects and tasks"
                    aria-controls="navbar-search-results"
                    aria-expanded={showSearchResults}
                    autoComplete="off"
                    placeholder="Search projects and tasks"
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setSearchOpen(true);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") setSearchOpen(false);
                    }}
                />
            </InputGroup>
            {showSearchResults && (
                <div
                    id="navbar-search-results"
                    role="region"
                    aria-label="Search results"
                    aria-live="polite"
                    className="absolute left-0 top-full z-50 mt-2 max-h-[min(70vh,36rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-lg"
                >
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {isSearching
                            ? "Searching projects and tasks..."
                            : currentSearchResults?.error
                                ? currentSearchResults.error
                                : `${currentSearchResults?.projects.length ?? 0} projects · ${currentSearchResults?.tasks.length ?? 0} tasks`}
                    </div>
                    {isSearching ? (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">Searching…</div>
                    ) : currentSearchResults?.error ? null : currentSearchResults && currentSearchResults.projects.length === 0 && currentSearchResults.tasks.length === 0 ? (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                            No projects or tasks match “{normalizedSearchQuery}”.
                        </div>
                    ) : (
                        <>
                            {currentSearchResults?.projects.length ? (
                                <section aria-label="Project matches" className="py-1">
                                    <h2 className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">Projects</h2>
                                    {currentSearchResults.projects.map((project) => (
                                        <Link
                                            key={project.id}
                                            href={`/project-detail?id=${encodeURIComponent(project.id)}`}
                                            className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                                        >
                                            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium">{project.name}</span>
                                                <span className="block truncate text-xs text-muted-foreground">
                                                    {project.workspace_name} · {project.status.replaceAll("_", " ").toLowerCase()} · {project.progress}% complete
                                                </span>
                                            </span>
                                            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        </Link>
                                    ))}
                                </section>
                            ) : null}
                            {currentSearchResults?.tasks.length ? (
                                <section aria-label="Task matches" className="border-t border-border py-1">
                                    <h2 className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">Tasks</h2>
                                    {currentSearchResults.tasks.map((task) => (
                                        <Link
                                            key={task.id}
                                            href={`/task-detail?taskId=${encodeURIComponent(task.id)}`}
                                            className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                                        >
                                            <ListTodo className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium">{task.title}</span>
                                                <span className="block truncate text-xs text-muted-foreground">
                                                    {task.project_name} · {task.workspace_name} · {task.status.replaceAll("_", " ").toLowerCase()} · {task.priority.toLowerCase()} priority
                                                </span>
                                            </span>
                                            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        </Link>
                                    ))}
                                </section>
                            ) : null}
                        </>
                    )}
                </div>
            )}
        </div>

        <div className="flex items-center gap-3">
            <div>
                <Button variant="outline" className="rounded-full" size="icon" onClick={handleToggle}>
                    <Moon  className="absolute text-gray-500 h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <Sun  className="h-[1.2rem] text-orange-400 w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 gap-2 rounded-full px-2" aria-label="Open account menu">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.image} alt={displayName} />
                            <AvatarFallback>{initials || "U"}</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-80 max-w-[calc(100vw-1rem)]">
                    <DropdownMenuLabel className="p-3 font-normal">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user?.image} alt={displayName} />
                                <AvatarFallback>{initials || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{displayName}</p>
                                <p className="truncate text-xs text-muted-foreground">{user?.email || "No email available"}</p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="space-y-3 px-3 py-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Email status</span>
                            <span>{user?.emailVerified ? "Verified" : "Not verified"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Member since</span>
                            <span>{memberSince}</span>
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="space-y-4 px-3 py-2">
                        <section aria-label="Project overview">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-sm font-semibold">Projects</h3>
                                <span className="text-xs text-muted-foreground">{summary.projectCount} total</span>
                            </div>
                            {summary.recentProjects.length > 0 ? (
                                <ul className="space-y-1">
                                    {summary.recentProjects.map((project) => (
                                        <li key={project.id} className="truncate text-sm text-muted-foreground">
                                            {project.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No projects yet</p>
                            )}
                        </section>
                        <section aria-label="Task overview">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-sm font-semibold">My tasks</h3>
                                <span className="text-xs text-muted-foreground">{summary.taskCount} assigned</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="rounded-sm bg-muted px-2 py-1.5">
                                    <p className="font-semibold">{summary.todoCount}</p>
                                    <p className="text-muted-foreground">To do</p>
                                </div>
                                <div className="rounded-sm bg-muted px-2 py-1.5">
                                    <p className="font-semibold">{summary.inProgressCount}</p>
                                    <p className="text-muted-foreground">In progress</p>
                                </div>
                                <div className="rounded-sm bg-muted px-2 py-1.5">
                                    <p className="font-semibold">{summary.completedCount}</p>
                                    <p className="text-muted-foreground">Done</p>
                                </div>
                            </div>
                            {summary.recentTasks.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                    {summary.recentTasks.map((task) => (
                                        <li key={task.id} className="min-w-0">
                                            <p className="truncate text-sm">{task.title}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {task.projectName} · {task.status.replaceAll("_", " ").toLowerCase()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" disabled={isSigningOut} onSelect={handleSignOut}>
                        <LogOut className="h-4 w-4" />
                        {isSigningOut ? "Signing out..." : "Sign out"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  )
}

export default Navbar