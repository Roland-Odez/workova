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
import { Field, FieldLabel } from "@/components/ui/field"
import { dummyWorkspaces } from "@/public/assets/dummyData"
import { MailIcon, UserPlus } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"




const InviteMemberDialog = () => {
    const currentWorkspace = dummyWorkspaces[0]
  return (
     <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <UserPlus className=" text-zinc-900 dark:text-zinc-200" />  Invite Member
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium flex items-center gap-2"><UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Invite Team Member</DialogTitle>
            <DialogDescription  className="text-sm text-zinc-600 dark:text-zinc-400">
              {currentWorkspace && (
                        <><span>Inviting to workspace:</span> <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span></>
                )}
            </DialogDescription>
          </DialogHeader>
          <InputGroup>
            <InputGroupInput type="email" placeholder="Enter your email" />
            <InputGroupAddon>
            <MailIcon />
            </InputGroupAddon>
         </InputGroup>
          <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select defaultValue="no">
                <SelectTrigger id="role">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    </SelectGroup>
                </SelectContent>
              </Select>
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

export default InviteMemberDialog