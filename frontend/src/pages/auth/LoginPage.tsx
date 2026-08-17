import React, { useState } from "react";
import { Boxes, MailCheck } from "lucide-react";
import { Navigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/services/supabase";

type Mode = "sign_in" | "sign_up";

export function LoginPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  // Signing in updates the auth store's session asynchronously (via
  // supabase's onAuthStateChange listener) — once it lands, leave /login.
  if (!isInitializing && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setCheckEmail(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (mode === "sign_in") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(signInError.message);
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
      } else if (!data.session) {
        // Email confirmation is required before a session is issued.
        setCheckEmail(true);
      }
    }

    setIsSubmitting(false);
  }

  if (checkEmail) {
    return (
      <div className="flex h-full items-center justify-center bg-neutral-50">
        <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
            <MailCheck className="h-5 w-5 text-primary-600" />
          </div>
          <h1 className="text-lg font-semibold text-neutral-900">Check your email</h1>
          <p className="mt-1 text-sm text-neutral-500">
            We sent a confirmation link to <span className="font-medium text-neutral-700">{email}</span>. Confirm
            your account, then sign in.
          </p>
          <Button variant="secondary" className="mt-5 w-full" onClick={() => switchMode("sign_in")}>
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-neutral-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-white">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold text-neutral-800">Branchwise</span>
        </div>

        <h1 className="text-lg font-semibold text-neutral-900">
          {mode === "sign_in" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {mode === "sign_in" ? "Access your operations workspace." : "Set up access to your operations workspace."}
        </p>

        <div className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Email</label>
            <input
              type="email"
              required
              autoCapitalize="none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 w-full rounded-md border border-neutral-200 px-3 text-sm focus:border-primary-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 w-full rounded-md border border-neutral-200 px-3 text-sm focus:border-primary-400"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-danger-600">{error}</p>}

        <Button type="submit" variant="primary" className="mt-5 w-full" loading={isSubmitting}>
          {mode === "sign_in" ? "Sign in" : "Create account"}
        </Button>

        <p className="mt-4 text-center text-xs text-neutral-500">
          {mode === "sign_in" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("sign_up")}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("sign_in")}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
