"use client"
import type { User } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { setTheme } from "@/lib/features/theme/themeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { applyTheme } from "@/lib/utils"
import { ChevronDown, Moon, Search, Sun } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import {
    DropdownMenu,
    DropdownMenuContent,
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

    const handleToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        dispatch(setTheme(newTheme));
        applyTheme(newTheme);
    };
  return (
    <div className="flex items-center justify-between py-4 px-4 md:px-12 flex-1 bg-sidebar">
        <div>
            <InputGroup className="max-w-md w-sm">
                <InputGroupInput placeholder="Search project and tasks" />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>
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
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  )
}

export default Navbar