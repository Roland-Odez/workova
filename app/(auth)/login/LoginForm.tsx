"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

import { signInWithEmail, signInWithGoogle } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;
type LoginErrors = Partial<Record<keyof LoginValues, string[]>>;

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGooglePending, startGoogleTransition] = useTransition();

  const handleGoogleSignIn = () => {
    setGoogleError(null);
    startGoogleTransition(async () => {
      const result = await signInWithGoogle();
      if (result?.error) setGoogleError(result.error);
    });
  };

  const handleChange = (field: keyof LoginValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));

    if (fieldErrors[field]?.length) {
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      event.preventDefault();
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});
  };

  return (
    <div className="auth-page-background flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-white/70 bg-white shadow-xl shadow-black/10 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30">
        <div className="flex h-fit w-full flex-col items-center gap-3 rounded-tl-md rounded-tr-md rounded-br-3xl rounded-bl-3xl bg-white p-6 shadow-lg dark:bg-zinc-900">
          <div className="flex flex-col items-center">
            <h1 className="text-base font-bold text-zinc-950 dark:text-zinc-50">Sign in to Workova</h1>
            <p className="mb-6 text-xs text-zinc-500 dark:text-zinc-400">
              Welcome back! Please sign in to continue
            </p>
          </div>

          <Button
            className="mb-4 w-full cursor-pointer rounded-sm border border-zinc-300 bg-transparent p-1 text-zinc-900 shadow-md hover:bg-zinc-50 hover:shadow-lg dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            type="button"
            disabled={isPending || isGooglePending}
            onClick={handleGoogleSignIn}
          >
            <FcGoogle />
            <p>{isGooglePending ? "Connecting to Google..." : "Continue with Google"}</p>
          </Button>
          <FieldError className="mb-3 w-full" errors={googleError ? [{ message: googleError }] : []} />

          <div className="mb-3 flex w-full items-center justify-center gap-2">
            <div className="h-px w-full rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <p className="text-xs text-zinc-500 dark:text-zinc-500">Or</p>
            <div className="h-px w-full rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          <form action={formAction} className="flex w-full flex-col gap-3" noValidate onSubmit={handleSubmit}>
            <Field
              className="mb-4 max-w-sm"
              data-invalid={fieldErrors.email?.length ? true : undefined}
            >
              <Label htmlFor="email" className="text-zinc-800 dark:text-zinc-200">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={values.email}
                disabled={isPending}
                onChange={(event) => handleChange("email", event.target.value)}
                aria-invalid={fieldErrors.email?.length ? true : undefined}
                className="border border-zinc-300 bg-white p-1 text-zinc-950 shadow-sm shadow-zinc-200 outline-none placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:shadow-black/20 dark:placeholder:text-zinc-500"
              />
              <FieldError errors={fieldErrors.email?.map((message) => ({ message }))} />
            </Field>

            <Field
              className="mb-3 max-w-sm"
              data-invalid={fieldErrors.password?.length ? true : undefined}
            >
              <Label htmlFor="password" className="text-zinc-800 dark:text-zinc-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  value={values.password}
                  disabled={isPending}
                  onChange={(event) => handleChange("password", event.target.value)}
                  aria-invalid={fieldErrors.password?.length ? true : undefined}
                  className="border border-zinc-300 bg-white p-1 pr-10 text-zinc-950 shadow-sm shadow-zinc-200 outline-none placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:shadow-black/20 dark:placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 transition-colors hover:text-zinc-800 disabled:pointer-events-none dark:text-zinc-400 dark:hover:text-zinc-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError errors={fieldErrors.password?.map((message) => ({ message }))} />
            </Field>

            <div className="-mt-2 mb-2 flex w-full justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                Forgot password?
              </Link>
            </div>

            <FieldError className="mb-3" errors={state?.error ? [{ message: state.error }] : []} />

            <Button
              className="mb-3 w-full cursor-pointer rounded-sm p-2 shadow-sm hover:opacity-20"
              type="submit"
              disabled={isPending}
            >
              <p className="text-white">{isPending ? "Signing in..." : "Continue"}</p>
            </Button>
          </form>
        </div>

        <div className="flex h-full w-full justify-center py-4 pb-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-zinc-900 dark:text-zinc-100">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
