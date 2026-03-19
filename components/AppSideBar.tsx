"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CaretDownIcon, CheckIcon, PlusIcon} from '@phosphor-icons/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Image from "next/image"
import { MdSpaceDashboard } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import Link from "next/link"
import { usePathname } from "next/navigation"
import TaskSidebar from "./TaskSidebar";
import ProjectSidebar from "./ProjectSidebar";

const menuItems = [
        { name: 'Dashboard', href: '/', icon: MdSpaceDashboard },
        { name: 'Projects', href: '/projects', icon: FaFolderOpen },
        { name: 'Teams', href: '/teams', icon: FaUserGroup },
    ]

export function AppSidebar() {

  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="rounded-sm p-4 py-7">
                  <div className="flex gap-2">
                    <div className="h-9 w-9" >
                      <Image src={'/favicon.ico'} alt="workspace image" className="object-cover block" width={100} height={100}  />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">ai-org</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">1 workspace</p>
                    </div>
                  </div>
                  <CaretDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64 p-3">
                <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">Workspaces</p>
                <DropdownMenuItem className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="h-8 w-8" >
                      <Image src={'/favicon.ico'} alt="workspace image" className="object-cover block" width={100} height={100}  />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">ai-org</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">1 workspace</p>
                    </div>
                  </div>
                  <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                </DropdownMenuItem>
                <hr className="border-gray-200 dark:border-zinc-700 mt-2" />

                <div className="p-2 cursor-pointer rounded group hover:bg-gray-100 dark:hover:bg-zinc-800" >
                    <p className="flex items-center text-xs gap-2 my-1 w-full text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
                        <PlusIcon className="w-4 h-4" /> Create Workspace
                    </p>
                </div>
              </DropdownMenuContent>

            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <hr className="border-gray-200 dark:border-zinc-700 mt-2" />
      {/* body */}
      <SidebarContent>
        <SidebarGroup className="gap-2 py-2">
          {menuItems.map((item) => (
              <Link href={item.href} key={item.name} className={`flex items-center gap-3 py-2 px-4 text-gray-800 dark:text-zinc-100 cursor-pointer rounded transition-all  ${pathname === item.href ? 'bg-gray-100 dark:bg-zinc-900 dark:bg-linear-to-br dark:from-zinc-800 dark:to-zinc-800/50  dark:ring-zinc-800' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/60'}`} >
                  <item.icon size={16} />
                  <p className='text-sm truncate'>{item.name}</p>
              </Link>
          ))}
        </SidebarGroup>
        {/* taks sidebar */}
        <TaskSidebar />

        {/* project sidebar */}
        <ProjectSidebar />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}