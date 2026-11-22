"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ShieldCheck, HeartHandshake, UserCheck, Smile } from "lucide-react";

export const DemoSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { loginAsDemo, user, isLoading } = useAuth();

  return (
    <div
      className={`bg-white/95 backdrop-blur-md border-2 border-babyBlue-200 rounded-2xl shadow-bubbly p-3 transition-all ${
        compact ? "py-2 px-3" : "p-4"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-400 text-charcoal-900 flex items-center justify-center font-bold text-xs shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-900" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-babyBlue-700 block">
              Quick Demo Login
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Instant evaluation switch
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Child 1: Omar */}
          <button
            onClick={() => loginAsDemo("CHILD_OMAR")}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              user?.email === "omar@noorkids.com"
                ? "bg-babyBlue-500 text-white ring-2 ring-babyBlue-300 shadow-md scale-105"
                : "bg-babyBlue-50 hover:bg-babyBlue-100 text-babyBlue-800 border border-babyBlue-200"
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-babyBlue-600" />
            <span>Omar (Child, Lvl 3)</span>
          </button>

          {/* Child 2: Sara */}
          <button
            onClick={() => loginAsDemo("CHILD_SARA")}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              user?.email === "sara@noorkids.com"
                ? "bg-pink-500 text-white ring-2 ring-pink-300 shadow-md scale-105"
                : "bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200"
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-pink-500" />
            <span>Sara (Child, Lvl 1)</span>
          </button>

          {/* Parent */}
          <button
            onClick={() => loginAsDemo("PARENT")}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              user?.role === "PARENT"
                ? "bg-mint-600 text-white ring-2 ring-mint-300 shadow-md scale-105"
                : "bg-mint-50 hover:bg-mint-100 text-mint-800 border border-mint-200"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-mint-600" />
            <span>Parent (Maryam)</span>
          </button>

          {/* Admin */}
          <button
            onClick={() => loginAsDemo("ADMIN")}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              user?.role === "ADMIN"
                ? "bg-charcoal-900 text-gold-400 ring-2 ring-gold-400 shadow-md scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            <span>Admin (Ustadh)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
