"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { setTheme } from "@/lib/features/theme/themeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { Moon, Search, Sun } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

const Navbar = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme.theme);

    const handleToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        dispatch(setTheme(newTheme));
    };
    console.log(theme)
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
            <div>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </div>
    </div>
  )
}

export default Navbar