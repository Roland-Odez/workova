"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { format } from "date-fns";

const CreateTaskDialog = ({projectId}: {projectId:string|null}) => {
      const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "TASK",
        status: "TODO",
        priority: "MEDIUM",
        assigneeId: "",
        due_date: "",
    });


  const anchor = useComboboxAnchor()
  const frameworks = [
      "breezyroland@gmail.com",
      "johndoe@example.com",
      "destinyayomah@gmail.com"
    ] as const
  return (
     <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus /> New Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Create New Task</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="task-title">Title</Label>
              <Input id="task-title" name="title" placeholder="task title" onChange={(val) => setFormData({ ...formData, title: val.target.value })} />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" onChange={(val) => setFormData({ ...formData, description: val.target.value })} />
            </Field>
          </FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="task-type">Type</FieldLabel>
              <Select defaultValue="BUG" onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger id="task-type">
                  <SelectValue  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="BUG">Bug</SelectItem>
                    <SelectItem value="FEATURE">Feature</SelectItem>
                    <SelectItem value="TASK">Task</SelectItem>
                    <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
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
          <Field>
            <FieldLabel>Assignee</FieldLabel>
            <Combobox
                multiple
                autoHighlight
                items={frameworks}
                defaultValue={[]}
                highlightItemOnHover
                modal={true}
                name='assigneeId'
                >
                <ComboboxChips ref={anchor} className="w-full max-w-md z-50" onChange={(val) => setFormData({ ...formData, assigneeId: val?.target?.nodeValue as string })}>
                    <ComboboxValue>
                    {(values) => (
                        <>
                        {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput />
                        </>
                    )}
                    </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList className="w-full">
                    {(item) => (
                        <ComboboxItem key={item} value={item}>
                        {item}
                        </ComboboxItem>
                    )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
          </Field>
           <div className="grid grid-cols-2 gap-4">
            <Field>
                <FieldLabel htmlFor="task-status">Status</FieldLabel>
                <Select onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger id="task-status">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                      <SelectItem value="TODO">To do</SelectItem>
                      <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectGroup>
                </SelectContent>
                </Select>
            </Field>
            <div className="space-y-1">
                <label className="text-sm font-medium">Due Date</label>
                <div className="flex items-center gap-2 mt-2">
                    {/* <CalendarIcon className="size-5 text-zinc-500 dark:text-zinc-400" /> */}
                    <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full rounded-sm dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-zinc-900 dark:text-zinc-200 text-sm mt-1" />
                </div>
                {formData.due_date && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {format(new Date(formData.due_date), "PPP")}
                    </p>
                )}
            </div>
           </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default CreateTaskDialog