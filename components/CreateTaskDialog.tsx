"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createTask, getProjectMembers, ProjectMember, TaskPriority, TaskStatus, TaskType } from "@/app/actions/project";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function CreateTaskDialog({ projectId, onCreated }: { projectId: string | null; onCreated?: () => void }) {
  const [open, setOpen] = useState(false); const [members, setMembers] = useState<ProjectMember[]>([]); const [pending, startTransition] = useTransition();
  const [values, setValues] = useState({ title:"", description:"", type:"TASK" as TaskType, status:"TODO" as TaskStatus, priority:"MEDIUM" as TaskPriority, assigneeId:"", dueDate:"" });
  useEffect(() => { if (open && projectId) getProjectMembers(projectId).then(setMembers); }, [open, projectId]);
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!projectId) return; startTransition(async () => { const result=await createTask(projectId,values); if(result.error) toast.error(result.error); else { toast.success(result.success); setOpen(false); setValues({title:"",description:"",type:"TASK",status:"TODO",priority:"MEDIUM",assigneeId:"",dueDate:""}); onCreated?.(); } }); };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="outline" size="sm"><Plus /> New Task</Button></DialogTrigger><DialogContent className="sm:max-w-lg"><form onSubmit={submit}><DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader><div className="mt-5 space-y-4"><Input required value={values.title} placeholder="Task title" onChange={e=>setValues({...values,title:e.target.value})}/><Textarea value={values.description} placeholder="Description" onChange={e=>setValues({...values,description:e.target.value})}/><div className="grid grid-cols-2 gap-3"><select value={values.type} onChange={e=>setValues({...values,type:e.target.value as TaskType})} className="rounded border p-2"><option value="TASK">Task</option><option value="BUG">Bug</option><option value="FEATURE">Feature</option><option value="IMPROVEMENT">Improvement</option></select><select value={values.priority} onChange={e=>setValues({...values,priority:e.target.value as TaskPriority})} className="rounded border p-2"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div><div className="grid grid-cols-2 gap-3"><select value={values.status} onChange={e=>setValues({...values,status:e.target.value as TaskStatus})} className="rounded border p-2"><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option></select><select value={values.assigneeId} onChange={e=>setValues({...values,assigneeId:e.target.value})} className="rounded border p-2"><option value="">Unassigned</option>{members.map(member=><option key={member.user.id} value={member.user.id}>{member.user.name}</option>)}</select></div><Input type="date" value={values.dueDate} onChange={e=>setValues({...values,dueDate:e.target.value})}/></div><DialogFooter className="mt-6"><Button type="button" variant="outline" onClick={()=>setOpen(false)}>Cancel</Button><Button disabled={pending} type="submit">{pending?"Creating…":"Create Task"}</Button></DialogFooter></form></DialogContent></Dialog>;
}
