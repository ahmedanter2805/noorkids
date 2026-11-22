"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Trophy,
  Flame,
  Star,
  ArrowRight,
  CheckCircle2,
  Lock,
  Moon,
  Scroll,
  Heart,
  Bot,
  Zap,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ArabicTextCard } from "@/components/ArabicTextCard";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface DashboardData {
  child: {
    id: string;
    name: string;
    age: number;
    avatar: string;
    xpPoints: number;
    level: number;
    currentStreak: number;
    levelProgress: {
      currentLevelXP: number;
      nextLevelXP: number;
      percent: number;
      xpNeeded: number;
    };
    badges: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      unlockedAt: string;
    }>;
  };
  stats: {
    totalLessonsOverall: number;
    totalCompletedOverall: number;
    overallProgressPercent: number;
  };
  courses: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    icon: string;
    colorTheme: string;
    totalLessons: number;
    completedLessons: number;
    percent: number;
  }>;
}

export default function ChildDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/child/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "QURAN":
        return BookOpen;
      case "SALAH":
        return Sparkles;
      case "RAMADAN":
        return Moon;
      case "ISLAMIC_STORIES":
        return Scroll;
      case "MUSLIM_CHARACTER":
        return Heart;
      default:
        return BookOpen;
    }
  };

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case "sky":
        return "from-sky-400 to-babyBlue-600 border-sky-200 text-sky-700 bg-sky-50";
      case "mint":
        return "from-emerald-400 to-mint-600 border-mint-200 text-mint-700 bg-mint-50";
      case "amber":
        return "from-amber-400 to-gold-600 border-amber-200 text-amber-700 bg-amber-50";
      case "rose":
        return "from-rose-400 to-pink-600 border-rose-200 text-rose-700 bg-rose-50";
      case "indigo":
        return "from-indigo-400 to-purple-600 border-indigo-200 text-indigo-700 bg-indigo-50";
      default:
        return "from-babyBlue-400 to-babyBlue-600 border-babyBlue-200 text-babyBlue-700 bg-babyBlue-50";
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-10 h-10 text-babyBlue-500 animate-spin" />
          <p className="text-sm font-bold text-slate-500">Loading your magical island...</p>
        </div>
      </div>
    );
  }

  const child = data?.child;

  return (
    <div className="flex-1 bg-gradient-to-b from-babyBlue-50/70 via-white to-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Quick Demo Switcher bar */}
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-babyBlue-500 via-sky-500 to-babyBlue-600 rounded-3xl p-6 sm:p-10 text-white shadow-bubbly mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                <span className="font-arabic text-sm">السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Welcome back, {child?.name || user?.fullName || "Young Explorer"}! 🌟
              </h1>
              <p className="text-babyBlue-100 text-sm sm:text-base font-medium mt-1">
                Every good deed lights up your path. Ready to learn and earn stars today?
              </p>
            </div>

            {/* Quick Stats Badges inside banner */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Streak */}
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                  <Flame className="w-5 h-5 fill-white text-white" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-babyBlue-100 block">Streak</span>
                  <span className="text-lg font-black text-white">{child?.currentStreak || 1} Days</span>
                </div>
              </div>

              {/* Level */}
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold-400 text-charcoal-900 flex items-center justify-center shadow-sm">
                  <Star className="w-5 h-5 fill-charcoal-900 text-charcoal-900" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-babyBlue-100 block">Level</span>
                  <span className="text-lg font-black text-white">Level {child?.level || 1}</span>
                </div>
              </div>

              {/* Total XP */}
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-mint-500 text-white flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5 fill-white text-white" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-babyBlue-100 block">Total XP</span>
                  <span className="text-lg font-black text-white">{child?.xpPoints || 0} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span>Progress to Level {(child?.level || 1) + 1}</span>
              <span>
                {child?.levelProgress?.currentLevelXP || 0} / 100 XP (
                {child?.levelProgress?.percent || 0}%)
              </span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3.5 p-0.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-gold-300 to-gold-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${child?.levelProgress?.percent || 10}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Motivation Card */}
        <div className="mb-10">
          <ArabicTextCard
            badgeLabel="Dua of the Day (دعاء اليوم)"
            arabicText="رَبِّ زِدْنِي عِلْمًا"
            transliteration="Rabbi zidnee 'ilmaa"
            translation="O my Lord! Increase me in knowledge."
            sourceTitle="Surah Ta-Ha [20:114]"
          />
        </div>

        {/* The 5 Core Learning Paths Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-charcoal-900 tracking-tight">
                Your 5 Learning Paths
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose a world, step into the adventure, and collect stars!
              </p>
            </div>
            <Link
              href="/child/courses"
              className="text-xs sm:text-sm font-bold text-babyBlue-600 hover:text-babyBlue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.courses?.map((course) => {
              const IconComp = getCategoryIcon(course.category);
              const themeStyle = getThemeGradient(course.colorTheme);

              return (
                <Link
                  key={course.id}
                  href={`/child/courses/${course.id}`}
                  className="group bg-white border-2 border-babyBlue-200 hover:border-babyBlue-400 rounded-3xl p-6 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${themeStyle.split(" ")[0]} ${themeStyle.split(" ")[1]} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <IconComp className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-babyBlue-50 text-babyBlue-800 border border-babyBlue-200">
                        {course.completedLessons}/{course.totalLessons} Done
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-charcoal-900 group-hover:text-babyBlue-600 transition-colors mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {course.description}
                    </p>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Path Mastery</span>
                        <span>{course.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-mint-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${course.percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-babyBlue-600">
                      <span>Enter Path</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* NoorBot Quick Card */}
            <Link
              href="/child/chat"
              className="group bg-gradient-to-br from-babyBlue-500 to-sky-600 rounded-3xl p-6 text-white shadow-bubbly hover:scale-[1.02] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                    <Bot className="w-8 h-8 text-gold-300" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-400 text-charcoal-900">
                    AI Buddy
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mb-2">Ask NoorBot</h3>
                <p className="text-xs text-babyBlue-100 leading-relaxed">
                  Have a question about Wudu, fasting, Prophet stories, or Duas? Ask your AI Islamic tutor anytime!
                </p>
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-black">
                <span>Start Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Unlocked Badges Showcase */}
        {child?.badges && child.badges.length > 0 && (
          <div className="bg-white border-2 border-babyBlue-200 rounded-3xl p-6 sm:p-8 shadow-card-soft">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-gold-500" />
                <h3 className="text-lg font-black text-charcoal-900">
                  Unlocked Trophies ({child.badges.length})
                </h3>
              </div>
              <Link
                href="/child/badges"
                className="text-xs font-bold text-babyBlue-600 hover:text-babyBlue-700 underline"
              >
                Visit Trophy Room
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {child.badges.map((b) => (
                <div
                  key={b.id}
                  className="bg-gold-50/60 border border-gold-200 rounded-2xl p-4 text-center flex flex-col items-center shadow-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-400 text-charcoal-900 flex items-center justify-center font-bold mb-2 shadow-sm">
                    <Award className="w-6 h-6 text-amber-900" />
                  </div>
                  <h4 className="text-xs font-black text-charcoal-900 mb-1">{b.name}</h4>
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
