"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Users,
  Sparkles,
  Trophy,
  Flame,
  Star,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface ChildAnalyticsData {
  child: {
    id: string;
    name: string;
    email: string;
    age: number;
    avatar: string;
    xpPoints: number;
    level: number;
    currentStreak: number;
    badges: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      unlockedAt: string;
    }>;
  };
  coursesBreakdown: Array<{
    id: string;
    title: string;
    category: string;
    colorTheme: string;
    totalLessons: number;
    completedCount: number;
    percent: number;
  }>;
  quizHistory: Array<{
    id: string;
    quizTitle: string;
    lessonTitle: string;
    category: string;
    score: number;
    totalQuestions: number;
    earnedXP: number;
    passed: boolean;
    submittedAt: string;
  }>;
  weakAreas: Array<{
    id: string;
    lessonTitle: string;
    score: number;
  }>;
}

export default function ChildDetailedAnalyticsPage() {
  const params = useParams();
  const [data, setData] = useState<ChildAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/parent/children/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Sparkles className="w-8 h-8 text-mint-500 animate-spin" />
      </div>
    );
  }

  if (!data || !data.child) {
    return (
      <div className="flex-1 max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-charcoal-900 mb-2">Child profile not found</h2>
        <Link href="/parent/dashboard" className="text-mint-600 font-bold underline">
          Back to Parent Dashboard
        </Link>
      </div>
    );
  }

  const child = data.child;

  return (
    <div className="flex-1 bg-gradient-to-b from-mint-50/50 via-white to-slate-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        {/* Back Link */}
        <Link
          href="/parent/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-mint-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Family Overview</span>
        </Link>

        {/* Header Profile Card */}
        <div className="bg-white border-2 border-mint-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-babyBlue-100 border-2 border-babyBlue-300 flex items-center justify-center font-black text-2xl text-babyBlue-700 shadow-sm">
                {child.name.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-mint-700 block">
                  Detailed Learning Insights
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900">
                  {child.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Age {child.age} • {child.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-gold-50 border border-gold-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-[10px] font-black uppercase text-amber-800 block">Level</span>
                <span className="text-base font-black text-charcoal-900">Level {child.level}</span>
              </div>
              <div className="bg-babyBlue-50 border border-babyBlue-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-[10px] font-black uppercase text-babyBlue-800 block">Total XP</span>
                <span className="text-base font-black text-charcoal-900">{child.xpPoints} XP</span>
              </div>
              <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-[10px] font-black uppercase text-orange-800 block">Streak</span>
                <span className="text-base font-black text-charcoal-900">{child.currentStreak} Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Areas Needing Attention Banner (if any) */}
        {data.weakAreas && data.weakAreas.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl text-charcoal-900 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-charcoal-900 flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <h3 className="text-base font-black text-amber-950">
                Topics Needing Support & Practice ({data.weakAreas.length})
              </h3>
              <p className="text-xs text-amber-900/80 font-medium mt-0.5">
                {child.name} scored below 70% on these quizzes. We recommend reviewing these lessons together:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.weakAreas.map((w) => (
                  <span
                    key={w.id}
                    className="px-3 py-1 rounded-xl bg-white border border-amber-300 text-xs font-bold text-charcoal-900 shadow-2xs"
                  >
                    {w.lessonTitle} ({w.score}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5-Path Completion Breakdown */}
        <div className="bg-white border-2 border-mint-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
          <h2 className="text-lg font-black text-charcoal-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-mint-600" />
            <span>Path Completion Breakdown (5 Learning Paths)</span>
          </h2>

          <div className="space-y-4">
            {data.coursesBreakdown.map((course) => (
              <div key={course.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {course.category}
                    </span>
                    <h3 className="text-sm font-black text-charcoal-900">
                      {course.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    {course.completedCount} / {course.totalLessons} Lessons ({course.percent}%)
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-mint-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${course.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Quiz Results History Table */}
        <div className="bg-white border-2 border-mint-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
          <h2 className="text-lg font-black text-charcoal-900 mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-500" />
            <span>Full Quiz Results History ({data.quizHistory.length})</span>
          </h2>

          {data.quizHistory.length === 0 ? (
            <p className="text-sm text-slate-400 font-bold text-center py-8">
              No quizzes completed yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[11px] font-black">
                    <th className="pb-3 pl-2">Lesson / Quiz</th>
                    <th className="pb-3">Path</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Earned XP</th>
                    <th className="pb-3 pr-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {data.quizHistory.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pl-2 text-charcoal-900">{q.lessonTitle}</td>
                      <td className="py-3.5 text-slate-500">{q.category}</td>
                      <td className="py-3.5 text-charcoal-900 font-black">{q.score}%</td>
                      <td className="py-3.5">
                        {q.passed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-mint-100 text-mint-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800">
                            <XCircle className="w-3.5 h-3.5" />
                            Retry Recommended
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-babyBlue-600">+{q.earnedXP} XP</td>
                      <td className="py-3.5 pr-2 text-slate-400 text-xs">
                        {new Date(q.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Unlocked Badges Showcase */}
        {child.badges && child.badges.length > 0 && (
          <div className="bg-white border-2 border-mint-200 rounded-3xl p-6 sm:p-8 shadow-card-soft">
            <h2 className="text-lg font-black text-charcoal-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-500" />
              <span>Unlocked Badges & Honors ({child.badges.length})</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {child.badges.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-gold-50 border border-gold-200 text-center flex flex-col items-center shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-400 text-charcoal-900 flex items-center justify-center font-bold mb-2 shadow-xs">
                    <Award className="w-6 h-6 text-amber-950" />
                  </div>
                  <h3 className="text-xs font-black text-charcoal-900 mb-1">{b.name}</h3>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
