"use client"

import { createSlice } from "@reduxjs/toolkit";

export const SELECTED_WORKSPACE_STORAGE_KEY = "selectedWorkspaceId";

export type WorkspaceType = {
    id: string
    name: string
    slug: string
    owner_id: string
    image_url: string
}
type StateType = {
    selectedWorkspace: WorkspaceType|null
    workspaces: WorkspaceType[]|null
}

const initialState: StateType = {
  selectedWorkspace: null,
  workspaces: null
};

export function getStoredWorkspaceId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(SELECTED_WORKSPACE_STORAGE_KEY);
}

export function storeSelectedWorkspaceId(workspaceId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SELECTED_WORKSPACE_STORAGE_KEY, workspaceId);
}

export function clearStoredWorkspaceId() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SELECTED_WORKSPACE_STORAGE_KEY);
}



// Slice
const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    selectWorkspace: (state, action) => {
      state.selectedWorkspace = action.payload;
    },
    loadWorkspace: (state, action) => {
      state.workspaces = action.payload;
    },
  },
});

export const { selectWorkspace, loadWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
