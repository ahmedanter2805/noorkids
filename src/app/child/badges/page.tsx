"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  BookOpen,
  Heart,
  Moon,
  Award,
  Star,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXP: number;
  categoryCondition: string | null;
  isUnlocked: boolean;
  unlockedAt: string | null;
  progressPercent: number;
}

export default function TrophyRoomPage() {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [childXP, setChildXP] = useState(0);
  const [childLevel, setChildLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/child/badges")
      .then((res) => res.json())
      .then((data) => {
        setBadges(data.badges || []);
        setChildXP(data.childXP || 0);
        setChildLevel(data.childLevel || 1);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return BookOpen;
      case "Sparkles":
        return Sparkles;
      case "GraduationCap":
        return GraduationCap;
      case "Heart":
        return Heart;
      case "Moon":
        return Moon;
      default:
        return Award;
    }
  };

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="flex-1 bg-gradient-to-b from-babyBlue-50/70 via-white to-slate-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        {/* Back Link */}
        <Link
          href="/child/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-babyBlue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Island</span>
        </Link>

        {/* Trophy Room Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gold-400 via-amber-400 to-amber-500 rounded-3xl p-6 sm:p-10 text-charcoal-900 shadow-bubbly-gold mb-10">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-white/30 backdrop-blur-md flex items-center justify-center text-charcoal-900 shadow-md">
                <Trophy className="w-8 h-8 text-amber-950" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 block">
                  Hall of Achievements
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
                  Trophy Room
                </h1>
                <p className="text-xs sm:text-sm font-bold text-amber-950/80 mt-0.5">
                  You have unlocked {unlockedCount} of {badges.length} badges!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/40 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-black text-amber-900 block">Current XP</span>
                <span className="text-base font-black text-charcoal-900">{childXP} XP</span>
              </div>
              <div className="bg-white/40 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-black text-amber-900 block">Level</span>
                <span className="text-base font-black text-charcoal-900">Level {childLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 font-bold">
            Loading your trophies...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => {
              const IconComp = getBadgeIcon(badge.icon);

              return (
                <div
                  key={badge.id}
                  className={`relative overflow-hidden rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                    badge.isUnlocked
                      ? "bg-gradient-to-br from-gold-50 via-white to-amber-50/40 border-gold-300 shadow-bubbly-gold hover:scale-105"
                      : "bg-slate-50/80 border-slate-200 text-slate-400 opacity-80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
                          badge.isUnlocked
                            ? "bg-gradient-to-tr from-gold-400 to-amber-400 text-charcoal-900 ring-4 ring-gold-200 animate-pulse-glow"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <IconComp className="w-8 h-8" />
                      </div>

                      {badge.isUnlocked ? (
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-mint-100 text-mint-800 border border-mint-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-mint-600" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-600 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          Locked
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-lg font-black mb-1 ${
                        badge.isUnlocked ? "text-charcoal-900" : "text-slate-600"
                      }`}
                    >
                      {badge.name}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed mb-4 ${
                        badge.isUnlocked ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {badge.description}
                    </p>
                  </div>

                  {/* Progress towards unlock */}
                  <div>
                    {!badge.isUnlocked && (
                      <div className="pt-3 border-t border-slate-200">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                          <span>Requirement: {badge.requiredXP} XP</span>
                          <span>{badge.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gold-400 h-full rounded-full"
                            style={{ width: `${badge.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {badge.isUnlocked && badge.unlockedAt && (
                      <div className="pt-3 border-t border-gold-200/60 text-[11px] font-bold text-amber-800">
                        Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
