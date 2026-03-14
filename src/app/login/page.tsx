import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

function LoginFallback() {
  return (
    <div className="mx-auto max-w-md py-20">
      <h1 className="mb-6 text-3xl font-semibold">Admin Login</h1>

      <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
        Loading login…
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}