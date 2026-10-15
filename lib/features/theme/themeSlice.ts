"use client"

import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  // Check localStorage first
  if (typeof window === "undefined") return "dark"
  const stored = localStorage?.getItem("theme");
  if (stored) return stored;

  // Fallback to system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const initialState = {
  theme: getInitialTheme(),
};

// Slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;
    },
    setTheme: (state, action) => {
      const theme = action.payload;
      state.theme = theme;
    },
    loadTheme: (state) => {
      const theme = getInitialTheme();
      state.theme = theme;
    },
  },
});

export const { toggleTheme, setTheme, loadTheme } = themeSlice.actions;
export default themeSlice.reducer;