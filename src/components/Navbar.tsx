"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  BookOpen,
  Trophy,
  Bot,
  Flame,
  Star,
  LogOut,
  Menu,
  X,
  Compass,
  Users,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { DemoSwitcher } from "./DemoSwitcher";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoBar, setShowDemoBar] = useState(false);

  const isChild = user?.role === "CHILD";
  const isParent = user?.role === "PARENT";
  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-babyBlue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-babyBlue-500 to-babyBlue-300 flex items-center justify-center text-white shadow-bubbly group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-gold-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-charcoal-900 tracking-tight">
                      Noor<span className="text-babyBlue-500">Kids</span>
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-gold-400 text-charcoal-900 rounded-full">
                      نور
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium block -mt-0.5">
                    Gamified Islamic Learning
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {!user && (
                <>
                  <Link
                    href="/"
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname === "/" ? "bg-babyBlue-50 text-babyBlue-600" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/#paths"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 transition-all"
                  >
                    5 Learning Paths
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 transition-all"
                  >
                    How It Works
                  </Link>
                </>
              )}

              {isChild && (
                <>
                  <Link
                    href="/child/dashboard"
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                      pathname.startsWith("/child/dashboard")
                        ? "bg-babyBlue-500 text-white shadow-sm"
                        : "text-slate-700 hover:bg-babyBlue-50"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Island</span>
                  </Link>
                  <Link
                    href="/child/courses"
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                      pathname.startsWith("/child/courses") || pathname.startsWith("/child/lessons")
                        ? "bg-babyBlue-500 text-white shadow-sm"
                        : "text-slate-700 hover:bg-babyBlue-50"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>5 Paths</span>
                  </Link>
                  <Link
                    href="/child/badges"
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                      pathname.startsWith("/child/badges")
                        ? "bg-babyBlue-500 text-white shadow-sm"
                        : "text-slate-700 hover:bg-babyBlue-50"
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-gold-500" />
                    <span>Trophy Room</span>
                  </Link>
                  <Link
                    href="/child/chat"
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                      pathname.startsWith("/child/chat")
                        ? "bg-babyBlue-500 text-white shadow-sm"
                        : "text-slate-700 hover:bg-babyBlue-50"
                    }`}
                  >
                    <Bot className="w-4 h-4 text-babyBlue-600" />
                    <span>NoorBot AI</span>
                  </Link>
                </>
              )}

              {isParent && (
                <>
                  <Link
                    href="/parent/dashboard"
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                      pathname.startsWith("/parent")
                        ? "bg-mint-500 text-white shadow-sm"
                        : "text-slate-700 hover:bg-mint-50"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Parent Portal</span>
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                      pathname === "/admin/dashboard"
                        ? "bg-charcoal-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    <span>Admin Stats</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname.startsWith("/admin/users")
                        ? "bg-charcoal-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    href="/admin/courses"
                    className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname.startsWith("/admin/courses")
                        ? "bg-charcoal-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Courses & Lessons
                  </Link>
                  <Link
                    href="/admin/quizzes"
                    className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname.startsWith("/admin/quizzes")
                        ? "bg-charcoal-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Quizzes
                  </Link>
                  <Link
                    href="/admin/badges"
                    className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname.startsWith("/admin/badges")
                        ? "bg-charcoal-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Badges
                  </Link>
                </>
              )}
            </nav>

            {/* Right side widgets & Auth actions */}
            <div className="flex items-center gap-3">
              {/* Quick Demo Toggle Pill */}
              <button
                onClick={() => setShowDemoBar(!showDemoBar)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-gold-100 to-amber-100 border border-gold-300 text-amber-900 hover:scale-105 transition-all shadow-sm"
                title="Toggle Instant Demo Role Switcher"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-spin" />
                <span>Demo Switcher</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoBar ? "rotate-180" : ""}`} />
              </button>

              {/* Child XP & Streak Badge */}
              {isChild && user?.childProfile && (
                <div className="flex items-center gap-2 bg-babyBlue-50 border border-babyBlue-200 rounded-full px-3 py-1 shadow-sm">
                  {/* Streak flame */}
                  <div className="flex items-center gap-1 text-orange-600 font-black text-xs">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-600" />
                    <span>{user.childProfile.currentStreak}d</span>
                  </div>

                  <div className="w-px h-4 bg-babyBlue-200" />

                  {/* Level & XP */}
                  <div className="flex items-center gap-1 text-amber-700 font-black text-xs">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-500" />
                    <span>Lvl {user.childProfile.level}</span>
                    <span className="text-[10px] text-slate-500">({user.childProfile.xpPoints} XP)</span>
                  </div>
                </div>
              )}

              {/* User Dropdown / Login buttons */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-bold text-charcoal-900 block leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-babyBlue-600 tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-babyBlue-600 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-bold bg-babyBlue-500 hover:bg-babyBlue-600 text-white rounded-xl shadow-bubbly transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Demo Switcher Bar */}
        {showDemoBar && (
          <div className="bg-babyBlue-50 border-t border-b border-babyBlue-200 py-2.5 px-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-7xl mx-auto">
              <DemoSwitcher compact={true} />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3">
            <DemoSwitcher compact={true} />

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    Home
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-babyBlue-600"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-babyBlue-600"
                  >
                    Register
                  </Link>
                </>
              ) : isChild ? (
                <>
                  <Link
                    href="/child/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/child/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    5 Learning Paths
                  </Link>
                  <Link
                    href="/child/badges"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    Trophy Room
                  </Link>
                  <Link
                    href="/child/chat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    NoorBot AI
                  </Link>
                </>
              ) : isParent ? (
                <>
                  <Link
                    href="/parent/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    Parent Overview
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    Admin Stats
                  </Link>
                  <Link
                    href="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    Users
                  </Link>
                  <Link
                    href="/admin/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-sm font-bold text-slate-700"
                  >
                    Courses & Lessons
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
