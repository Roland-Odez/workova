"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { addTaskComment, getTaskById, getTaskComments, ProjectTasksAndUser, TaskComment } from "@/app/actions/project";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function TaskDetail() {
  const params=useSearchParams(); const taskId=params.get("taskId"); const [task,setTask]=useState<ProjectTasksAndUser|null>(null); const [comments,setComments]=useState<TaskComment[]>([]); const [message,setMessage]=useState(""); const [pending,startTransition]=useTransition();
  const load=useCallback(async()=>{ if(!taskId) return; const [nextTask,nextComments]=await Promise.all([getTaskById(taskId),getTaskComments(taskId)]); setTask(nextTask); setComments(nextComments); }, [taskId]);
  useEffect(()=>{ // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();},[load]);
  const post=()=>{ if(!taskId) return; startTransition(async()=>{const result=await addTaskComment(taskId,message); if(result.error) toast.error(result.error); else {setMessage(""); await load();}}); };
  if(!taskId || !task) return <div className="py-24 text-center text-zinc-500">Task not found or you do not have access.</div>;
  return <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3"><section className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800 lg:col-span-2"><h2 className="text-lg font-semibold">Discussion ({comments.length})</h2><div className="my-5 max-h-[55vh] space-y-4 overflow-y-auto">{comments.length ? comments.map(comment=><article key={comment.id} className="rounded bg-zinc-50 p-3 dark:bg-zinc-900"><div className="flex justify-between text-sm"><span className="font-medium">{comment.user.name}</span><span className="text-zinc-500">{format(new Date(comment.created_at),"MMM d, yyyy h:mm a")}</span></div><p className="mt-2 text-sm">{comment.message}</p></article>) : <p className="text-sm text-zinc-500">No comments yet.</p>}</div><Textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write a comment…"/><Button className="mt-3" disabled={pending || !message.trim()} onClick={post}>{pending?"Posting…":"Post comment"}</Button></section><aside className="h-fit rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"><h1 className="text-xl font-semibold">{task.title}</h1><p className="mt-3 text-sm text-zinc-500">{task.description || "No description."}</p><div className="mt-5 space-y-3 text-sm"><p><b>Status:</b> {task.status.replace("_"," ")}</p><p><b>Priority:</b> {task.priority}</p><p><b>Type:</b> {task.type}</p><p><b>Assignee:</b> {task.user?.name || "Unassigned"}</p><p><b>Due:</b> {task.due_date ? format(new Date(task.due_date),"MMM d, yyyy") : "No due date"}</p></div></aside></div>;
}
