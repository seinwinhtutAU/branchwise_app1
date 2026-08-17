import React from "react";
import { AlertTriangle } from "lucide-react";

export function ConfigurationError() {
  return (
    <div className="flex h-full items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-warning-50">
          <AlertTriangle className="h-5 w-5 text-warning-600" />
        </div>
        <h1 className="text-lg font-semibold text-neutral-900">Supabase isn&apos;t configured</h1>
        <p className="mt-1 text-sm text-neutral-500">
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">frontend/.env</code> is missing
          {" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">SUPABASE_URL</code> and{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">SUPABASE_ANON_KEY</code>, so sign-in can&apos;t
          work yet.
        </p>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-neutral-600">
          <li>
            Copy <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">.env.example</code> to{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">.env</code> in <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">frontend/</code>
          </li>
          <li>Fill in your Supabase project&apos;s URL and anon key (Project Settings → API)</li>
          <li>Restart the dev server</li>
        </ol>
      </div>
    </div>
  );
}
