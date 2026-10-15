"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { create_project } from "@/app/actions/project";
import {
  getWorkspaceUsers,
  type WorkspaceUser,
} from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/lib/hooks";
import { Textarea } from "./ui/textarea";

type CreateProjectActionState = {
  error?: string;
  project?: {
    id: string;
    name: string;
  };
  missingMembers?: string[];
};

const initialState: CreateProjectActionState | null = null;

const CreateProjectDialog = () => {
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const anchor = useComboboxAnchor();
  const formRef = useRef<HTMLFormElement>(null);
  const comboboxPortalRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("PLANNING");
  const [priority, setPriority] = useState("LOW");
  const [teamLead, setTeamLead] = useState("no");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const memberOptions = workspaceUsers.map((member) => member.user.id);
  const leadOptions = workspaceUsers.filter((member) => member.user.id);
  const memberLabelById = new Map(
    workspaceUsers.map((member) => [
      member.user.id,
      member.user.name || member.user.email,
    ])
  );

  const [state, formAction, isPending] = useActionState<CreateProjectActionState | null, FormData>(
    async (_prevState, formData) => {
      if (!selectedWorkspace?.id) {
        return { error: "Select a workspace before creating a project." };
      }

      formData.set("workspace_id", selectedWorkspace.id);
      formData.set("status", status);
      formData.set("priority", priority);

      if (teamLead === "no") {
        formData.delete("team_lead");
      } else {
        formData.set("team_lead", teamLead);
      }

      formData.delete("team_members");
      teamMembers.forEach((member) => formData.append("team_members", member));

      const result = await create_project(formData);
      return result as CreateProjectActionState;
    },
    initialState
  );

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      if (!selectedWorkspace?.id) {
        setWorkspaceUsers([]);
        setTeamLead("no");
        setTeamMembers([]);
        return;
      }

      setIsLoadingUsers(true);

      try {
        const users = await getWorkspaceUsers(selectedWorkspace.id);

        if (cancelled) {
          return;
        }

        setWorkspaceUsers(users);
        setTeamLead("no");
        setTeamMembers([]);
      } catch (error) {
        if (!cancelled) {
          setWorkspaceUsers([]);
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load workspace users."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingUsers(false);
        }
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [selectedWorkspace]);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.error) {
      toast.error(state.error);
      return;
    }

    if (state.project) {
      toast.success(`Project "${state.project.name}" created successfully.`);

      if (state.missingMembers?.length) {
        toast.message(
          `${state.missingMembers.length} member${state.missingMembers.length > 1 ? "s were" : " was"} not added because no matching workspace user was found.`
        );
      }

      formRef.current?.reset();
      setStatus("PLANNING");
      setPriority("LOW");
      setTeamLead("no");
      setTeamMembers([]);
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form ref={formRef} action={formAction}>
          <div ref={comboboxPortalRef} />
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Create New Project</DialogTitle>
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
              {selectedWorkspace?.name ? (
                <>
                  <span>In workspace:</span>{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {selectedWorkspace.name}
                  </span>
                </>
              ) : (
                "Create a project in your current workspace."
              )}
            </DialogDescription>
          </DialogHeader>

          <input type="hidden" name="workspace_id" value={selectedWorkspace?.id ?? ""} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="priority" value={priority} />
          {teamLead !== "no" ? <input type="hidden" name="team_lead" value={teamLead} /> : null}
          {teamMembers.map((member) => (
            <input key={member} type="hidden" name="team_members" value={member} />
          ))}

          <FieldGroup className="mt-4">
            <Field>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                name="name"
                placeholder="Enter project name"
                disabled={isPending}
              />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project"
                disabled={isPending}
              />
            </Field>
          </FieldGroup>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="small-form-status">Status</FieldLabel>
              <Select value={status} onValueChange={setStatus} disabled={isPending}>
                <SelectTrigger id="small-form-status" className="w-full">
                  <SelectValue />
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
              <FieldLabel htmlFor="small-form-priority">Priority</FieldLabel>
              <Select value={priority} onValueChange={setPriority} disabled={isPending}>
                <SelectTrigger id="small-form-priority" className="w-full">
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
              <Input
                id="project-start-date"
                name="start_date"
                className="text-zinc-900 dark:text-zinc-200"
                type="date"
                disabled={isPending}
              />
            </Field>

            <Field>
              <Label htmlFor="project-end-date">End Date</Label>
              <Input
                id="project-end-date"
                name="end_date"
                className="text-zinc-900 dark:text-zinc-200"
                type="date"
                disabled={isPending}
              />
            </Field>
          </div>

          <Field className="mt-4">
            <FieldLabel htmlFor="small-form-plead">Project Lead</FieldLabel>
            <Select
              value={teamLead}
              onValueChange={setTeamLead}
              disabled={isPending || isLoadingUsers}
            >
              <SelectTrigger id="small-form-plead" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="no">No lead</SelectItem>
                  {leadOptions.map((member) => (
                    <SelectItem key={member.user.id} value={member.user.id}>
                      {member.user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field className="mt-4">
            <FieldLabel>Team Members</FieldLabel>
            <Combobox
              multiple
              autoHighlight
              items={memberOptions}
              value={teamMembers}
              onValueChange={setTeamMembers}
              itemToStringLabel={(userId) => memberLabelById.get(userId) ?? userId}
              highlightItemOnHover
              disabled={isPending || isLoadingUsers}
            >
              <ComboboxChips ref={anchor} className="z-50 w-full max-w-md">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((value: string) => (
                        <ComboboxChip key={value}>
                          {memberLabelById.get(value) ?? value}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor} container={comboboxPortalRef}>
                <ComboboxEmpty>
                  {isLoadingUsers ? "Loading members..." : "No items found."}
                </ComboboxEmpty>
                <ComboboxList className="w-full">
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {memberLabelById.get(item) ?? item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <FieldError
            className="mt-4"
            errors={state?.error ? [{ message: state.error }] : []}
          />

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !selectedWorkspace?.id}>
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
