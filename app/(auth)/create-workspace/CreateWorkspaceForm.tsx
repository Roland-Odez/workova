"use client";

import { ChangeEvent, useActionState, useEffect, useMemo, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

import { createOrganisation } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateOrganisationForm = () => {
  const [state, formAction, isPending] = useActionState(createOrganisation, null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const logoPreview = useMemo(() => {
    if (!logoFile) {
      return null;
    }

    return URL.createObjectURL(logoFile);
  }, [logoFile]);

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setLogoFile(file);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value;
    setName(nextName);
    setSlug(nextName.toLowerCase().trim().split(/\s+/).join("-"));
  };

  return (
    <div className="auth-page-background min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/70 bg-white p-6 shadow-xl shadow-black/10 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Create Workspace
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Set up your organisation details to get your workspace ready.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <Field className="gap-3">
            <Label className="text-zinc-800 dark:text-zinc-200">Logo</Label>
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/60">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoPreview}
                      alt="Organisation logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500">
                      <ImagePlus className="h-8 w-8" />
                      <span className="text-xs">Preview</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isPending}
                    onChange={handleLogoChange}
                  />
                  <Button asChild type="button" className="rounded-xl" disabled={isPending}>
                    <label htmlFor="logo" className="cursor-pointer">
                      <Upload className="h-4 w-4" />
                      Upload logo
                    </label>
                  </Button>
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                    Upload a square logo or brand mark. PNG, JPG, or SVG works best.
                  </p>
                </div>
              </div>
            </div>
          </Field>

          <Field className="gap-2">
            <Label htmlFor="name" className="text-zinc-800 dark:text-zinc-200">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={name}
              disabled={isPending}
              onChange={handleNameChange}
              placeholder="Organisation name"
              className="border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </Field>

          <Field className="gap-2">
            <Label htmlFor="slug" className="text-zinc-800 dark:text-zinc-200">
              Slug
            </Label>
            <Input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              disabled={isPending}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="my-slug"
              className="border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </Field>

          <FieldError errors={state?.error ? [{ message: state.error }] : []} />
          {state?.success ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.success}</p>
          ) : null}

          <Button type="submit" disabled={isPending} className="w-full rounded-xl sm:w-auto">
            {isPending ? "Creating Workspace..." : "Create workspace"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganisationForm;
