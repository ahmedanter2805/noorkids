"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  BookOpen,
  Trophy,
  Flame,
  Star,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface AdminStats {
  totalUsers: number;
  totalChildren: number;
  totalParents: number;
  totalCourses: number;
  totalLessons: number;
  totalQuizzes: number;
  totalQuizResults: number;
  totalBadges: number;
  averageQuizScore: number;
  totalXPInPlatform: number;
  avgStreak: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        setStats(json.stats || null);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Sparkles className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-100 via-white to-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        {/* Admin Header Banner */}
        <div className="bg-gradient-to-r from-charcoal-900 via-slate-800 to-charcoal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 border border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gold-400 text-charcoal-900 flex items-center justify-center font-black shadow-md">
                <ShieldCheck className="w-8 h-8 text-amber-950" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-gold-400 block">
                  Platform Administration
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  NoorKids Control Center
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                  Platform metrics, user governance, curriculum curation, and gamification controls.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/courses"
                className="px-4 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-charcoal-900 font-black text-xs shadow-sm transition-all"
              >
                Manage Lessons
              </Link>
              <Link
                href="/admin/users"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-xs transition-all"
              >
                View Users
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Analytics KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-card-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Total Children
              </span>
              <div className="w-10 h-10 rounded-2xl bg-babyBlue-100 text-babyBlue-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-black text-charcoal-900 block">
              {stats?.totalChildren || 0}
            </span>
            <span className="text-[11px] text-slate-500 font-bold mt-1 block">
              Enrolled Young Explorers
            </span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-card-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Parents
              </span>
              <div className="w-10 h-10 rounded-2xl bg-mint-100 text-mint-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-black text-charcoal-900 block">
              {stats?.totalParents || 0}
            </span>
            <span className="text-[11px] text-slate-500 font-bold mt-1 block">
              Active Guardians
            </span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-card-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Curriculum
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-black text-charcoal-900 block">
              {stats?.totalLessons || 0}
            </span>
            <span className="text-[11px] text-slate-500 font-bold mt-1 block">
              Across {stats?.totalCourses || 5} Learning Paths
            </span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-card-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Avg Quiz Score
              </span>
              <div className="w-10 h-10 rounded-2xl bg-gold-100 text-amber-700 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-black text-charcoal-900 block">
              {stats?.averageQuizScore || 85}%
            </span>
            <span className="text-[11px] text-slate-500 font-bold mt-1 block">
              Across {stats?.totalQuizResults || 0} Quiz Attempts
            </span>
          </div>
        </div>

        {/* Admin Quick Action Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/users"
            className="group bg-white border-2 border-slate-200 hover:border-babyBlue-400 rounded-3xl p-6 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-babyBlue-100 text-babyBlue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-charcoal-900 mb-1">User Management</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                View all child, parent, and admin accounts, active levels, and linked profiles.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-babyBlue-600">
              <span>Manage Users</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/courses"
            className="group bg-white border-2 border-slate-200 hover:border-mint-400 rounded-3xl p-6 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-mint-100 text-mint-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-charcoal-900 mb-1">Courses & Lessons</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Create and edit bilingual lessons, authentic Arabic verses with Tashkeel, and challenges.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-mint-600">
              <span>Manage Curriculum</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/quizzes"
            className="group bg-white border-2 border-slate-200 hover:border-gold-400 rounded-3xl p-6 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Star className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-charcoal-900 mb-1">Quizzes & Questions</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Add multiple-choice questions, options, correct answers, and child-safe explanations.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Manage Quizzes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/badges"
            className="group bg-white border-2 border-slate-200 hover:border-purple-400 rounded-3xl p-6 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-charcoal-900 mb-1">Badges & XP Rules</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Configure unlock criteria, XP thresholds, category conditions, and trophy icons.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Manage Badges</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
