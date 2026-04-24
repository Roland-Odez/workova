"use client";

import { ReactNode, useEffect } from "react";
import {
  clearStoredWorkspaceId,
  getStoredWorkspaceId,
  loadWorkspace,
  selectWorkspace,
  storeSelectedWorkspaceId,
  WorkspaceType,
} from "./workspaceSlice";
import { useAppDispatch } from "@/lib/hooks";

export default function WorkspaceHydrator({ workspaces, children }: {workspaces: WorkspaceType[], children: ReactNode}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!workspaces?.length) {
      dispatch(loadWorkspace([]));
      clearStoredWorkspaceId();
      return;
    }

    dispatch(loadWorkspace(workspaces));

    const storedWorkspaceId = getStoredWorkspaceId();
    const nextSelectedWorkspace =
      workspaces.find((workspace) => workspace.id === storedWorkspaceId) ?? workspaces[0];

    dispatch(selectWorkspace(nextSelectedWorkspace));
    storeSelectedWorkspaceId(nextSelectedWorkspace.id);
  }, [workspaces, dispatch]);

  return children;
}
