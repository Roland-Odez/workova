"use server";

import { createWorkspace } from "../workspace/create";
import { getNeonSignedUser } from "../user";
import { auth } from "@/lib/server";
import { redirect } from "next/navigation";

type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signInWithEmail(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState | null> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email) {
    return { error: "Email address is required." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  const { error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    return { error: error.message || "Failed to sign in. Please try again." };
  }

  redirect("/");
}

export async function signUpWithEmail(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState | null> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name) {
    return { error: "Name is required." };
  }

  if (!email) {
    return { error: "Email address is required." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const { error } = await auth.signUp.email({
    name,
    email,
    password,
  });
  console.log(error)

  if (error) {
    return { error: error.message || "Failed to create account." };
  }

  redirect("/create-workspace");
}

export async function createOrganisation(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState | null> {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const logo = formData.get("logo");

  if (!name) {
    return { error: "Organisation name is required." };
  }

  if (!slug) {
    return { error: "Organisation slug is required." };
  }

  const currentUser = await getNeonSignedUser();

  if (currentUser.error || !currentUser.user) {
    return { error: currentUser.error || "You must be signed in to create an organisation." };
  }

  try {
    await createWorkspace({
      name,
      slug,
      logo: logo instanceof File ? logo : null,
      owner: currentUser.user.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create organisation.";

    if (message.toLowerCase().includes("duplicate key")) {
      return { error: "This organisation slug is already in use." };
    }

    return { error: message };
  }

  redirect("/");
}
