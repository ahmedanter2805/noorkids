"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, Mail, Lock, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CHILD" | "PARENT">("CHILD");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(7);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
          age: role === "CHILD" ? age : undefined,
          phoneNumber: role === "PARENT" ? phoneNumber : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to register.");
        setIsLoading(false);
        return;
      }

      if (role === "CHILD") {
        router.push("/child/dashboard");
      } else {
        router.push("/parent/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-babyBlue-50/50 via-white to-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-6">
          <DemoSwitcher />
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-babyBlue-500 text-white mx-auto flex items-center justify-center shadow-bubbly mb-4">
            <Sparkles className="w-8 h-8 text-gold-300" />
          </div>
          <h2 className="text-3xl font-black text-charcoal-900 tracking-tight">
            Join NoorKids
          </h2>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            Start a fun, rewarding Islamic journey today!
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="mt-6 grid grid-cols-2 gap-3 p-1 bg-babyBlue-100/70 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole("CHILD")}
            className={`py-2.5 rounded-xl text-xs font-black transition-all ${
              role === "CHILD"
                ? "bg-white text-babyBlue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            I am a Young Learner (Child)
          </button>
          <button
            type="button"
            onClick={() => setRole("PARENT")}
            className={`py-2.5 rounded-xl text-xs font-black transition-all ${
              role === "PARENT"
                ? "bg-white text-mint-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            I am a Parent / Guardian
          </button>
        </div>

        <div className="mt-6 bg-white border-2 border-babyBlue-200 rounded-3xl p-8 shadow-card-soft">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === "CHILD" ? "Zaid Ahmad" : "Maryam & Kareem"}
                  className="w-full bg-slate-50 border border-babyBlue-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="zaid@example.com"
                  className="w-full bg-slate-50 border border-babyBlue-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400"
                />
              </div>
            </div>

            {role === "CHILD" ? (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Age ({age} years old)
                </label>
                <input
                  type="range"
                  min="4"
                  max="14"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full accent-babyBlue-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-1">
                  <span>4 yrs</span>
                  <span>7 yrs</span>
                  <span>10 yrs</span>
                  <span>14 yrs</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-babyBlue-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
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
                  className="w-full bg-slate-50 border border-babyBlue-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-babyBlue-500 hover:bg-babyBlue-600 disabled:opacity-50 text-white font-black text-sm shadow-bubbly hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isLoading ? "Creating Account..." : "Create Account & Start"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-black text-babyBlue-600 hover:text-babyBlue-700 underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
