"use client";

import { AuthView, NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";

type PasswordRecoveryViewProps = {
  view: "FORGOT_PASSWORD" | "RESET_PASSWORD";
};

const authViewPaths = {
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  SIGN_IN: "login",
};

export default function PasswordRecoveryView({
  view,
}: PasswordRecoveryViewProps) {
  const router = useRouter();

  const navigateWithoutResetToken = (href: string) => {
    const destination = new URL(href, window.location.origin);
    destination.searchParams.delete("token");

    router.replace(
      `${destination.pathname}${destination.search}${destination.hash}`
    );
  };

  return (
    <div className="auth-page-background flex min-h-screen w-full items-center justify-center px-4 py-10">
      <NeonAuthUIProvider
        authClient={authClient}
        basePath="/"
        baseURL={
          typeof window === "undefined" ? "" : window.location.origin
        }
        credentials={{ confirmPassword: true, forgotPassword: true }}
        navigate={navigateWithoutResetToken}
        replace={navigateWithoutResetToken}
        viewPaths={authViewPaths}
      >
        <AuthView view={view} />
      </NeonAuthUIProvider>
    </div>
  );
}
