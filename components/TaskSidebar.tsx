import { CaretRightIcon } from "@phosphor-icons/react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { IoCheckboxOutline } from "react-icons/io5"

const TaskSidebar = () => {

      const getTaskStatusColor = (status: any) => {
            switch (status) {
                case 'DONE':
                    return 'bg-green-500';
                case 'IN_PROGRESS':
                    return 'bg-yellow-500';
                case 'TODO':
                    return 'bg-gray-500 dark:bg-zinc-500';
                default:
                    return 'bg-gray-400 dark:bg-zinc-400';
            }
        };
  return (
    <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="hover:bg-gray-50 dark:hover:bg-zinc-800/60 p-2">
                <div className="flex items-center gap-3">
                  <IoCheckboxOutline size={18} className="text-gray-500 font-bold dark:text-zinc-400" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">My Tasks</h3>
                  <span className="bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded">0</span>
                </div>
                <CaretRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <Link href={`/taskDetails`} className="w-full rounded-lg transition-all duration-200 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white" >
                    <div className="flex items-center gap-2 px-3 py-2 w-full min-w-0">
                        <div className={`w-2 h-2 rounded-full ${getTaskStatusColor("IN_PROGRESS")} shrink-0`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                                market page
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-500 lowercase">
                                todo
                            </p>
                        </div>
                    </div>
                </Link>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
  )
}

export default TaskSidebar