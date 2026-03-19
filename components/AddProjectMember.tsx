import { SubmitEventHandler, useState } from "react";
import { UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { dummyWorkspaces } from "@/public/assets/dummyData";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "./ui/button";

const AddProjectMember = () => {

    const searchParams = useSearchParams();

    const id = searchParams.get('id');
    const currentWorkspace = dummyWorkspaces[0]

    const project = currentWorkspace?.projects.find((p) => p.id === id);
    const projectMembersEmails = project?.members.map((member) => member.user.email);

    const [email, setEmail] = useState('');

    const handleSubmit: SubmitEventHandler<SubmitEvent> = async (e) => {
        e.preventDefault();
        
    };

    return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Add Member to Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
                <div className="mb-4">
                    <p className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Add Member to Project
                    </p>
                    {currentWorkspace && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                            Adding to Project: <span className="text-blue-600 dark:text-blue-400">{project?.name}</span>
                        </p>
                    )}
                </div>
            </DialogTitle>
          </DialogHeader>
            <Field>
                <FieldLabel htmlFor="member">Select a member</FieldLabel>
                <Select onValueChange={(val) => setEmail(val)}>
                <SelectTrigger id="member">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                      {currentWorkspace?.members
                                    .filter((member) => projectMembersEmails?.includes(member.user.email))
                                    .map((member) => (
                                        <SelectItem key={member.user.id} value={member.user.email}>{member.user.email}</SelectItem>
                                    ))}
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
    );
};

export default AddProjectMember;