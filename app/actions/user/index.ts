"use server";

import { getAuthContext } from "@/lib/auth";
import type { User } from "@/types/user";

type SignedUserResult = {
  user: User | null;
  error?: string;
};

export async function getNeonSignedUser(): Promise<SignedUserResult> {
  try {
    const context = await getAuthContext();

    if (!context.user) {
      return {
        user: null,
        error: "No signed-in user found.",
      };
    }

    return { user: context.user as User };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : "Unable to fetch signed user.",
    };
  }
}
