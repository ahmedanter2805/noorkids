"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Award,
  Zap,
  CheckSquare,
  Square,
  PartyPopper,
} from "lucide-react";
import { ArabicTextCard } from "@/components/ArabicTextCard";
import { fireCelebrationConfetti } from "@/components/ConfettiEffect";
import { sound } from "@/lib/sound";
import { useAuth } from "@/context/AuthContext";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface LessonStep {
  step: number;
  title: string;
  englishText: string;
  arabicText?: string;
}

interface LessonData {
  id: string;
  title: string;
  arabicHighlight: string;
  challengePrompt: string;
  xpReward: number;
  contentSteps: LessonStep[];
  isCompleted: boolean;
  course: {
    id: string;
    title: string;
    category: string;
    colorTheme: string;
  };
  quizzes: Array<{
    id: string;
    title: string;
    passingScore: number;
    bonusXP: number;
    quizResults?: Array<{ score: number }>;
  }>;
}

export default function LessonViewPage() {
  const params = useParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [challengeDone, setChallengeDone] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedState, setCompletedState] = useState(false);
  const [earnedXPState, setEarnedXPState] = useState<number | null>(null);
  const [unlockedBadgesState, setUnlockedBadgesState] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/lessons/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.lesson) {
          setLesson(data.lesson);
          setCompletedState(data.lesson.isCompleted);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [params.id]);

  const handleMarkComplete = async () => {
    if (!lesson || isCompleting) return;
    setIsCompleting(true);

    try {
      const res = await fetch(`/api/lessons/${lesson.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        sound.playFanfare();
        fireCelebrationConfetti();
        setCompletedState(true);
        setEarnedXPState(data.earnedXP || lesson.xpReward);
        if (data.gamification?.unlockedBadges) {
          setUnlockedBadgesState(data.gamification.unlockedBadges);
        }
        await refreshUser();
      }
    } catch (e) {
      console.error("Complete lesson error:", e);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Sparkles className="w-8 h-8 text-babyBlue-500 animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex-1 max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-charcoal-900 mb-2">Lesson not found</h2>
        <Link href="/child/courses" className="text-babyBlue-600 font-bold underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  const steps = lesson.contentSteps || [];
  const currentStep = steps[currentStepIndex] || steps[0];
  const quiz = lesson.quizzes[0];

  return (
    <div className="flex-1 bg-gradient-to-b from-babyBlue-50/70 via-white to-slate-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        {/* Back Link */}
        <Link
          href={`/child/courses/${lesson.course.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-babyBlue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {lesson.course.title}</span>
        </Link>

        {/* Lesson Header */}
        <div className="bg-white border-2 border-babyBlue-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-babyBlue-100 text-babyBlue-800">
              {lesson.course.category}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-amber-800 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                +{lesson.xpReward} XP Reward
              </span>
              {completedState && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-mint-100 text-mint-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint-600" />
                  Completed
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 mt-2">
            {lesson.title}
          </h1>
        </div>

        {/* Authentic Arabic Highlight Card */}
        {lesson.arabicHighlight && (
          <div className="mb-8">
            <ArabicTextCard
              badgeLabel="Sacred Text / Recitation"
              arabicText={lesson.arabicHighlight}
              sourceTitle={lesson.title}
            />
          </div>
        )}

        {/* Step-by-Step Interactive Cards */}
        {steps.length > 0 && (
          <div className="bg-white border-2 border-babyBlue-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
            {/* Step navigation dots */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-babyBlue-700">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <div className="flex items-center gap-1.5">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playCorrect();
                      setCurrentStepIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? "w-8 bg-babyBlue-500"
                        : "w-2.5 bg-babyBlue-200 hover:bg-babyBlue-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Step Content */}
            <div className="py-2">
              <h2 className="text-xl font-black text-charcoal-900 mb-3">
                {currentStep.title}
              </h2>

              {currentStep.arabicText && (
                <div
                  dir="rtl"
                  lang="ar"
                  className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-center font-arabic text-xl sm:text-2xl font-bold text-charcoal-900 leading-loose my-4"
                >
                  {currentStep.arabicText}
                </div>
              )}

              <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
                {currentStep.englishText}
              </p>
            </div>

            {/* Step Prev/Next buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => {
                  sound.playCorrect();
                  setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none"
              >
                Previous Step
              </button>

              <button
                disabled={currentStepIndex === steps.length - 1}
                onClick={() => {
                  sound.playCorrect();
                  setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-babyBlue-500 hover:bg-babyBlue-600 disabled:opacity-30 text-white shadow-sm flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Interactive Challenge Prompt Card */}
        {lesson.challengePrompt && (
          <div className="bg-gradient-to-r from-amber-50 to-gold-50 border-2 border-gold-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-full bg-gold-400 text-charcoal-900 flex items-center justify-center font-bold text-sm shadow-sm">
                ⭐
              </span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 block">
                  Action Challenge
                </span>
                <h3 className="text-lg font-black text-charcoal-900">
                  Put It Into Practice!
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-800 font-semibold mb-4 leading-relaxed">
              {lesson.challengePrompt}
            </p>

            <button
              onClick={() => {
                sound.playCorrect();
                setChallengeDone(!challengeDone);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-sm ${
                challengeDone
                  ? "bg-mint-500 text-white shadow-bubbly-mint"
                  : "bg-white text-slate-700 border border-gold-300 hover:bg-gold-100"
              }`}
            >
              {challengeDone ? (
                <>
                  <CheckSquare className="w-4 h-4 text-white" />
                  <span>Challenge Accepted & Done! 🎉</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-amber-700" />
                  <span>I did this good deed today!</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Celebration / Lesson Completion Banner */}
        {earnedXPState && (
          <div className="mb-8 p-6 bg-gradient-to-r from-mint-500 to-emerald-600 rounded-3xl text-white shadow-bubbly-mint flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
                🌟
              </div>
              <div>
                <h3 className="text-xl font-black">Masha&apos;Allah! Lesson Completed!</h3>
                <p className="text-xs text-mint-100 font-medium">
                  You earned <strong className="text-white">+{earnedXPState} XP</strong> towards your next level!
                </p>
              </div>
            </div>

            {quiz && (
              <Link
                href={`/child/quizzes/${quiz.id}`}
                className="px-6 py-3 rounded-2xl bg-white text-mint-700 font-black text-xs sm:text-sm shadow-md hover:bg-mint-50 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Take the Quiz Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {/* Unlocked Badges alert */}
        {unlockedBadgesState.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-gold-400 to-amber-500 rounded-3xl text-charcoal-900 shadow-bubbly-gold">
            <div className="flex items-center gap-3 mb-2">
              <PartyPopper className="w-6 h-6 text-amber-950 animate-bounce" />
              <h3 className="text-lg font-black">New Badge Unlocked!</h3>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {unlockedBadgesState.map((b) => (
                <div
                  key={b.id}
                  className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            onClick={handleMarkComplete}
            disabled={isCompleting}
            className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-bubbly ${
              completedState
                ? "bg-mint-500 text-white hover:bg-mint-600"
                : "bg-babyBlue-500 text-white hover:bg-babyBlue-600 hover:scale-105"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {isCompleting
                ? "Recording progress..."
                : completedState
                ? "Lesson Completed (Repeat for +5 XP)"
                : "Mark Lesson Complete (+30 XP)"}
            </span>
          </button>

          {quiz && (
            <Link
              href={`/child/quizzes/${quiz.id}`}
              className="px-8 py-4 rounded-2xl bg-gold-400 hover:bg-gold-500 text-charcoal-900 font-black text-sm shadow-bubbly-gold hover:scale-105 transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5 text-amber-900" />
              <span>Take Quiz (+{quiz.bonusXP} Bonus XP)</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
