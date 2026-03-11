"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { dummyWorkspaces } from "@/public/assets/dummyData"
import { Plus } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"




const CreateProjectDialog = () => {
    const currentWorkspace = dummyWorkspaces[0]
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
            <Plus /> New Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Create New Project</DialogTitle>
            <DialogDescription  className="text-sm text-zinc-600 dark:text-zinc-400">
              {currentWorkspace && (
                        <><span>In workspace:</span> <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span></>
                )}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="project-name">Projet Name</Label>
              <Input id="project-name" name="name" placeholder="Enter project name"  />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe your project" />
            </Field>
          </FieldGroup>
          <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-status">Status</FieldLabel>
                  <Select defaultValue="PLANNING">
                    <SelectTrigger id="small-form-status">
                      <SelectValue  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="PLANNING">Planning</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="HOLD">Hold</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-prioty">Prioty</FieldLabel>
                  <Select defaultValue="LOW">
                    <SelectTrigger id="small-form-prioty">
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
                <Field>
                    <Label htmlFor="project-start-date">Start Date</Label>
                    <Input id="project-start-date" name="start_date" className="text-zinc-900 dark:text-zinc-200" type="date" />
                </Field>
                <Field>
                    <Label htmlFor="project-end-date">End Date</Label>
                    <Input id="project-end-date" name="end_date" className="text-zinc-900 dark:text-zinc-200" type="date" />
                </Field>
          </div>
          <Field>
              <FieldLabel htmlFor="small-form-plead">Project Lead</FieldLabel>
              <Select defaultValue="no">
              <SelectTrigger id="small-form-plead">
                  <SelectValue />
              </SelectTrigger>
              <SelectContent>
                  <SelectGroup>
                  <SelectItem value="no">No lead</SelectItem>
                  <SelectItem value="breezyroland@gmail.com">breezyroland@gmail.com</SelectItem>
                  </SelectGroup>
              </SelectContent>
              </Select>
          </Field>
          <Field>
            <FieldLabel>Team Members</FieldLabel>
            <Combobox
                multiple
                autoHighlight
                items={frameworks}
                defaultValue={[]}
                highlightItemOnHover
                modal={true}
                >
                <ComboboxChips ref={anchor} className="w-full max-w-md z-50">
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

export default CreateProjectDialog