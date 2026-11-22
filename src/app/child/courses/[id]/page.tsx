"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Play,
  HelpCircle,
  Star,
  Award,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface CourseDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  colorTheme: string;
  lessons: Array<{
    id: string;
    title: string;
    xpReward: number;
    orderIndex: number;
    quizzes: Array<{
      id: string;
      title: string;
      bonusXP: number;
      quizResults?: Array<{ score: number }>;
    }>;
    progress?: Array<{ isCompleted: boolean }>;
  }>;
}

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/courses/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data.course || null);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Sparkles className="w-8 h-8 text-babyBlue-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-charcoal-900 mb-2">Course not found</h2>
        <Link href="/child/courses" className="text-babyBlue-600 font-bold underline">
          Back to all courses
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-babyBlue-50/70 via-white to-slate-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        {/* Back button */}
        <Link
          href="/child/courses"
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-babyBlue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All 5 Paths</span>
        </Link>

        {/* Course Header Banner */}
        <div className="bg-white border-2 border-babyBlue-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-babyBlue-100 text-babyBlue-800">
              {course.category}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {course.lessons.length} Lessons Available
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 mb-2">
            {course.title}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">{course.description}</p>
        </div>

        {/* Lessons Island Road Map */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-charcoal-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold-500" />
            <span>Lessons Road Map</span>
          </h2>

          {course.lessons.map((lesson, idx) => {
            const isCompleted = lesson.progress && lesson.progress.length > 0 && lesson.progress[0].isCompleted;
            const quiz = lesson.quizzes[0];
            const quizResult = quiz?.quizResults && quiz.quizResults.length > 0 ? quiz.quizResults[0] : null;

            return (
              <div
                key={lesson.id}
                className={`bg-white border-2 ${
                  isCompleted ? "border-mint-300" : "border-babyBlue-200"
                } rounded-3xl p-5 sm:p-6 shadow-card-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                      isCompleted
                        ? "bg-mint-500 text-white"
                        : "bg-babyBlue-100 text-babyBlue-800 border border-babyBlue-300"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Lesson {idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-amber-800">
                        +{lesson.xpReward} XP
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-charcoal-900">
                      {lesson.title}
                    </h3>

                    {quiz && (
                      <span className="text-xs text-slate-500 font-medium">
                        Quiz: {quiz.title} {quizResult ? `(Score: ${quizResult.score}%)` : ""}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href={`/child/lessons/${lesson.id}`}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      isCompleted
                        ? "bg-babyBlue-50 hover:bg-babyBlue-100 text-babyBlue-800 border border-babyBlue-200"
                        : "bg-babyBlue-500 hover:bg-babyBlue-600 text-white shadow-bubbly"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isCompleted ? "Review Lesson" : "Start Lesson"}</span>
                  </Link>

                  {quiz && (
                    <Link
                      href={`/child/quizzes/${quiz.id}`}
                      className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-gold-50 hover:bg-gold-100 text-amber-800 border border-gold-300 transition-all flex items-center gap-1 shadow-sm"
                      title="Take Quiz"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Quiz</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
