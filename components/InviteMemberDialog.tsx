"use client";

import { useState, useTransition } from "react";
import { MailIcon, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { addWorkspaceMember } from "@/app/actions/workspace";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function InviteMemberDialog({ onMemberAdded }: { onMemberAdded: () => Promise<void> }) {
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [pending, startTransition] = useTransition();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedWorkspace) return;
    startTransition(async () => {
      try {
        const result = await addWorkspaceMember(
          selectedWorkspace.id,
          email,
          role,
        );
        if (result.error) {
          toast.error(result.error);
          return;
        }

        await onMemberAdded();
        toast.success(result.success);
        setEmail("");
        setOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not add member.");
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus /> Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle className="flex gap-2">
              <UserPlus />
              Invite team member
            </DialogTitle>
            <DialogDescription>
              Adding to {selectedWorkspace?.name || "your workspace"}. The
              person must already have an account.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block">Email</span>
              <div className="relative">
                <MailIcon className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                <Input
                  required
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="person@example.com"
                />
              </div>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block">Role</span>
              <select
                className="w-full rounded border p-2"
                value={role}
                onChange={(e) => setRole(e.target.value as "ADMIN" | "MEMBER")}
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={pending || !selectedWorkspace} type="submit">
              {pending ? "Adding…" : "Add member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
