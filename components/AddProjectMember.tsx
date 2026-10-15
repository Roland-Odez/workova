import { SubmitEventHandler, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "./ui/button";
import { getProjectById, getProjectMembers, ProjectMember, ProjectRecord } from "@/app/actions/project";
import { getWorkspaceUsers, WorkspaceUser } from "@/app/actions/workspace";
import { useAppSelector } from "@/lib/hooks";

const AddProjectMember = () => {
    const searchParams = useSearchParams();
    const { selectedWorkspace } = useAppSelector((state) => state.workspace);
    const id = searchParams.get("id");

    const [project, setProject] = useState<ProjectRecord | null>(null);
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
    const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceUser[]>([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        async function loadData() {
            if (!selectedWorkspace?.id || !id) {
                setProject(null);
                setProjectMembers([]);
                setWorkspaceMembers([]);
                return;
            }

            try {
                const [nextProject, nextMembers, nextWorkspaceMembers] = await Promise.all([
                    getProjectById(id),
                    getProjectMembers(id),
                    getWorkspaceUsers(selectedWorkspace.id),
                ]);

                setProject(nextProject);
                setProjectMembers(nextMembers);
                setWorkspaceMembers(nextWorkspaceMembers);
            } catch (error) {
                console.error("Failed to load project members:", error);
            }
        }

        void loadData();
    }, [selectedWorkspace?.id, id]);

    const projectMembersEmails = new Set(projectMembers.map((member) => member.user.email));
    const availableMembers = workspaceMembers.filter((member) => !projectMembersEmails.has(member.user.email));

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!email) return;
    };

    return (
    <Dialog>
      <form onSubmit={handleSubmit}>
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
                    {project && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                            Adding to Project: <span className="text-blue-600 dark:text-blue-400">{project.name}</span>
                        </p>
                    )}
                </div>
            </DialogTitle>
          </DialogHeader>
            <Field>
                <FieldLabel htmlFor="member">Select a member</FieldLabel>
                <Select onValueChange={(val) => setEmail(val)}>
                <SelectTrigger id="member">
                    <SelectValue placeholder="Choose a workspace member" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                      {availableMembers.map((member) => (
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