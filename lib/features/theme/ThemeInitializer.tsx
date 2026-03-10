"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setTheme } from "@/lib/features/theme/themeSlice";
import { applyTheme, getStoredTheme } from "@/lib/utils";

export default function ThemeInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const theme = getStoredTheme();

    dispatch(setTheme(theme));
    applyTheme(theme);
  }, [dispatch]);

  return null;
}