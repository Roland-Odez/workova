import ProjectOverview from '@/components/ProjectOverview'
import RecentActivity from '@/components/RecentActivity'
import StatsBoard from '@/components/StatsBoard'
import TasksSummary from '@/components/TaskSummary'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const Dashboard = () => {
  return (
    <div>
        <section className='flex items-center justify-between'>
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1"> Welcome back, Roland </h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm"> Here's what's happening with your projects today </p>
            </div>
            <div>
                <Button variant="outline" size="sm">
                    <Plus /> New Project
                </Button>
            </div>

            {/* <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} /> */}
        </section>
        <StatsBoard />
        <section className='grid grid-cols-3 gap-8'>
            <div className="lg:col-span-2 space-y-8">
                <ProjectOverview />
                <RecentActivity />
            </div>
            <div>
                <TasksSummary />
            </div>
        </section>
    </div>
  )
}

export default Dashboard