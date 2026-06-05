"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
const strengthClasses = [
  "bg-red-400 text-red-200",
  "bg-amber-400 text-amber-200",
  "bg-lime-400 text-lime-200",
  "bg-emerald-400 text-emerald-200",
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nameOk = name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordStrength = getStrength(password);
  const passwordOk = password.length >= 8;
  const canSubmit = nameOk && emailOk && passwordOk;
  const step = nameOk ? (emailOk ? (passwordOk ? 3 : 2) : 1) : 0;
  const strengthIndex = Math.max(passwordStrength - 1, 0);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!canSubmit) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
        return;
      }

      setError(data.error ?? "Unable to create your account.");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Secure signup"
      title="Create your account"
      subtitle="Start with a workspace built for Maharashtra climate decisions."
    >
      <div className="mb-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition",
              i < step ? "bg-emerald-400" : i === step ? "bg-emerald-500/40" : "bg-white/10",
            ].join(" ")}
          />
        ))}
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              required
              className="h-12 w-full rounded-lg border border-white/10 bg-[#08111d] px-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10"
            />
            {name && <FieldStatus valid={nameOk} />}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Work email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organisation.com"
              required
              className="h-12 w-full rounded-lg border border-white/10 bg-[#08111d] px-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10"
            />
            {email && <FieldStatus valid={emailOk} />}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              className="h-12 w-full rounded-lg border border-white/10 bg-[#08111d] px-10 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 rounded-md p-1 text-slate-500 transition -translate-y-1/2 hover:bg-white/8 hover:text-slate-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>

          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={[
                      "h-1 flex-1 rounded-full transition",
                      i < passwordStrength ? strengthClasses[strengthIndex].split(" ")[0] : "bg-white/10",
                    ].join(" ")}
                  />
                ))}
              </div>
              <p className={["mt-1.5 text-xs", strengthClasses[strengthIndex].split(" ")[1]].join(" ")}>
                {strengthLabels[strengthIndex]}
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-900 disabled:text-emerald-200 disabled:shadow-none"
        >
          {loading ? "Creating..." : "Create account"}
          {!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-xs uppercase tracking-wide text-slate-600">MahaInsight</span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-300 transition hover:text-emerald-200">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function FieldStatus({ valid }: { valid: boolean }) {
  const Icon = valid ? Check : X;

  return (
    <span
      className={[
        "absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full",
        valid ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300",
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
  );
}
