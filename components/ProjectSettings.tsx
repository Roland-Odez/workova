import { format } from "date-fns";
import { Save } from "lucide-react";
import { SubmitEventHandler, useEffect, useState } from "react";
import { Project } from "@/types/project";
import { Field, FieldLabel } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import AddProjectMember from "./AddProjectMember";

export default function ProjectSettings({ project }: {project: Project}) {


    const [formData, setFormData] = useState<any>({
        name: "New Website Launch",
        description: "Initial launch for new web platform.",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "2025-10-10",
        end_date: "2025-10-15",
        progress: 30,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit :SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

    };

    useEffect(() => {
        if (project) setFormData(project);
    }, [project]);

    const inputClasses = "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";

    const cardClasses = "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

    const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Details */}
            <div className={cardClasses}>
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">Project Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <Field>
                        <Label htmlFor="project-name" className={labelClasses}>Project Name</Label>
                        <Input id="project-name" value={formData.name} name="name" placeholder="Project Name" onChange={(val) => setFormData({ ...formData, name: val.target.value })} />
                    </Field>

                    {/* Description */}
                    <Field>
                        <Label htmlFor="project-desc" className={labelClasses}>Description</Label>
                        <Input id="project-desc" value={formData.name} name="description" placeholder="Project Description" onChange={(val) => setFormData({ ...formData, description: val.target.value })} />
                    </Field>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <Select defaultValue="PLANNING" onValueChange={(val) => setFormData({ ...formData, status: val })}>
                            <SelectTrigger id="status">
                                <SelectValue  />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectItem value="PLANNING">Planning</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="ON_HOLD">On hold</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="task-prioty">Prioty</FieldLabel>
                            <Select defaultValue="LOW" onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                            <SelectTrigger id="task-prioty">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectItem value="LOW">LOW</SelectItem>
                                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                                <SelectItem value="HIGH">HIGH</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClasses}>Start Date</label>
                            <input type="date" value={format(formData.start_date, "yyyy-MM-dd")} onChange={(e) => setFormData({ ...formData, start_date: new Date(e.target.value) })} className={inputClasses} />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClasses}>End Date</label>
                            <input type="date" value={format(formData.end_date, "yyyy-MM-dd")} onChange={(e) => setFormData({ ...formData, end_date: new Date(e.target.value) })} className={inputClasses} />
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Progress: {formData.progress}%</label>
                        <input type="range" min="0" max="100" step="5" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} className="w-full accent-blue-500 dark:accent-blue-400" />
                    </div>

                    {/* Save Button */}
                    <button type="submit" disabled={isSubmitting} className="ml-auto flex items-center text-sm justify-center gap-2 bg-linear-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded" >
                        <Save className="size-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>

            {/* Team Members */}
            <div className="space-y-6">
                <div className={cardClasses}>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
                            Team Members <span className="text-sm text-zinc-600 dark:text-zinc-400">({project.members.length})</span>
                        </h2>
                        <AddProjectMember />
                    </div>

                    {/* Member List */}
                    {project.members.length > 0 && (
                        <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                            {project.members.map((member, index) => (
                                <div key={index} className="flex items-center justify-between px-3 py-2 rounded dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-300" >
                                    <span> {member?.user?.email || "Unknown"} </span>
                                    {project.team_lead === member.user.id && <span className="px-2 py-0.5 rounded-xs ring ring-zinc-200 dark:ring-zinc-600">Team Lead</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}