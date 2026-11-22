"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  Trophy,
  Flame,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Award,
  Calendar,
  X,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface ChildSummary {
  id: string;
  name: string;
  email: string;
  age: number;
  avatar: string;
  xpPoints: number;
  level: number;
  currentStreak: number;
  badgesCount: number;
  completedLessonsCount: number;
  progressPercent: number;
  avgQuizScore: number;
  recentQuizzes: Array<{
    id: string;
    lessonTitle: string;
    score: number;
    earnedXP: number;
    submittedAt: string;
  }>;
}

interface ParentOverviewData {
  parent: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  stats: {
    totalChildren: number;
    totalFamilyXP: number;
    totalLessonsCompleted: number;
    totalBadgesEarned: number;
  };
  children: ChildSummary[];
}

export default function ParentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ParentOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  // Form states for new child
  const [newChildName, setNewChildName] = useState("");
  const [newChildEmail, setNewChildEmail] = useState("");
  const [newChildPassword, setNewChildPassword] = useState("bismillah123");
  const [newChildAge, setNewChildAge] = useState(7);
  const [isSubmittingChild, setIsSubmittingChild] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/parent/overview");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Parent overview error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setIsSubmittingChild(true);

    try {
      const res = await fetch("/api/parent/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newChildName,
          email: newChildEmail,
          password: newChildPassword,
          age: newChildAge,
        }),
      });
      const resData = await res.json();

      if (!res.ok) {
        setModalError(resData.error || "Failed to add child");
        setIsSubmittingChild(false);
        return;
      }

      setShowAddChildModal(false);
      setNewChildName("");
      setNewChildEmail("");
      await fetchOverview();
    } catch {
      setModalError("Error adding child.");
    } finally {
      setIsSubmittingChild(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Sparkles className="w-8 h-8 text-mint-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-mint-50/50 via-white to-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        {/* Parent Header Banner */}
        <div className="bg-gradient-to-r from-mint-600 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-10 text-white shadow-bubbly-mint mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white mb-3 inline-block">
                Parent & Guardian Portal
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                Family Learning Overview
              </h1>
              <p className="text-mint-100 text-sm sm:text-base font-medium mt-1">
                Monitor your children&apos;s daily Islamic habits, quiz accomplishments, and areas needing support.
              </p>
            </div>

            <button
              onClick={() => setShowAddChildModal(true)}
              className="px-5 py-3 rounded-2xl bg-white text-mint-800 font-black text-sm shadow-md hover:bg-mint-50 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Child Profile</span>
            </button>
          </div>

          {/* Family High-level Stats */}
          <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <span className="text-xs uppercase font-bold text-mint-100 block">Children</span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {data?.stats?.totalChildren || 0}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <span className="text-xs uppercase font-bold text-mint-100 block">Total Family XP</span>
              <span className="text-2xl sm:text-3xl font-black text-gold-300">
                {data?.stats?.totalFamilyXP || 0} XP
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <span className="text-xs uppercase font-bold text-mint-100 block">Lessons Completed</span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {data?.stats?.totalLessonsCompleted || 0}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <span className="text-xs uppercase font-bold text-mint-100 block">Badges Earned</span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {data?.stats?.totalBadgesEarned || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Linked Children Cards Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-charcoal-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-mint-600" />
              <span>Children Profiles ({data?.children?.length || 0})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {data?.children?.map((child) => (
              <div
                key={child.id}
                className="bg-white border-2 border-mint-200 rounded-3xl p-6 sm:p-8 shadow-card-soft flex flex-col justify-between"
              >
                <div>
                  {/* Child Header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-babyBlue-100 border-2 border-babyBlue-300 flex items-center justify-center font-black text-xl text-babyBlue-700 shadow-sm">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-charcoal-900">
                          {child.name}
                        </h3>
                        <span className="text-xs font-bold text-slate-500">
                          Age: {child.age} yrs • {child.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-gold-100 text-amber-800 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                        Level {child.level}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-800 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
                        {child.currentStreak}d
                      </span>
                    </div>
                  </div>

                  {/* Micro Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        XP Points
                      </span>
                      <span className="text-base font-black text-babyBlue-600">
                        {child.xpPoints}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Badges
                      </span>
                      <span className="text-base font-black text-gold-600">
                        {child.badgesCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Avg Quiz Score
                      </span>
                      <span className="text-base font-black text-mint-600">
                        {child.avgQuizScore}%
                      </span>
                    </div>
                  </div>

                  {/* Course Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                      <span>Overall Lessons Progress</span>
                      <span>{child.progressPercent}% Completed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-mint-500 h-full rounded-full transition-all"
                        style={{ width: `${child.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Recent Quiz Timeline */}
                  {child.recentQuizzes && child.recentQuizzes.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                        Recent Quiz Results
                      </h4>
                      <div className="space-y-2">
                        {child.recentQuizzes.map((q) => (
                          <div
                            key={q.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-700"
                          >
                            <span className="truncate max-w-[200px]">{q.lessonTitle}</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                                  q.score >= 70
                                    ? "bg-mint-100 text-mint-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {q.score}%
                              </span>
                              <span className="text-slate-400">+{q.earnedXP} XP</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/parent/children/${child.id}`}
                    className="w-full py-3 rounded-2xl bg-mint-500 hover:bg-mint-600 text-white font-black text-xs sm:text-sm text-center block shadow-sm hover:scale-[1.01] transition-all"
                  >
                    View Detailed Analytics & Quiz History
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-mint-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-charcoal-900">
                Add Child Profile
              </h3>
              <button
                onClick={() => setShowAddChildModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddChild} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Child Name
                </label>
                <input
                  type="text"
                  required
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="Yusuf Kareem"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Child Email (Login username)
                </label>
                <input
                  type="email"
                  required
                  value={newChildEmail}
                  onChange={(e) => setNewChildEmail(e.target.value)}
                  placeholder="yusuf@noorkids.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newChildPassword}
                  onChange={(e) => setNewChildPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Age ({newChildAge} yrs)
                </label>
                <input
                  type="range"
                  min="4"
                  max="14"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(parseInt(e.target.value))}
                  className="w-full accent-mint-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingChild}
                  className="px-5 py-2.5 rounded-xl bg-mint-600 hover:bg-mint-700 disabled:opacity-50 text-white font-black text-xs shadow-sm"
                >
                  {isSubmittingChild ? "Creating..." : "Create Child Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
