"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Lock, LogIn, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DemoSwitcher } from "@/components/DemoSwitcher";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-babyBlue-50/50 via-white to-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick Demo Switcher Bar */}
        <div className="mb-8">
          <DemoSwitcher />
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-babyBlue-500 text-white mx-auto flex items-center justify-center shadow-bubbly mb-4">
            <Sparkles className="w-8 h-8 text-gold-300 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-charcoal-900 tracking-tight">
            Welcome Back!
          </h2>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            Sign in to your NoorKids account to continue your learning journey
          </p>
        </div>

        <div className="mt-8 bg-white border-2 border-babyBlue-200 rounded-3xl p-8 shadow-card-soft">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="omar@noorkids.com"
                  className="w-full bg-slate-50 border border-babyBlue-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-babyBlue-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-babyBlue-500 hover:bg-babyBlue-600 disabled:opacity-50 text-white font-black text-sm shadow-bubbly hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? "Signing in..." : "Sign In to NoorKids"}</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              New to NoorKids?{" "}
              <Link
                href="/register"
                className="font-black text-babyBlue-600 hover:text-babyBlue-700 underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
