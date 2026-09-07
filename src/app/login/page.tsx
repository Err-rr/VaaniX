"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z" />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  function handleGoogleSignIn() {
    signInWithGoogle();
    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Logo className="scale-110" />
          <p className="mt-3 text-[15px] font-semibold text-foreground">Sign in to VoxAegis</p>
          <p className="text-[13px] text-foreground-muted">Secure access for authorized security personnel</p>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <Button variant="secondary" className="w-full justify-center gap-2.5" onClick={handleGoogleSignIn}>
            <GoogleIcon />
            Continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-foreground-faint">
          Access is restricted to verified organization accounts. By continuing you agree to your
          organization&apos;s acceptable use and data-handling policies.
        </p>
      </div>
    </div>
  );
}
