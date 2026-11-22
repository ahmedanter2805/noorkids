"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Moon, Scroll, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  colorTheme: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

export default function ChildCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
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
        return "from-sky-400 to-babyBlue-600";
      case "mint":
        return "from-emerald-400 to-mint-600";
      case "amber":
        return "from-amber-400 to-gold-600";
      case "rose":
        return "from-rose-400 to-pink-600";
      case "indigo":
        return "from-indigo-400 to-purple-600";
      default:
        return "from-babyBlue-400 to-babyBlue-600";
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-babyBlue-50/70 via-white to-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-babyBlue-100 text-babyBlue-800 border border-babyBlue-300 mb-3 inline-block">
            Choose Your Quest
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
            The 5 Learning Paths
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Pick any path to begin learning, complete challenges, and earn XP badges!
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-400 font-bold">
            Loading learning paths...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const IconComp = getCategoryIcon(course.category);
              const gradient = getThemeGradient(course.colorTheme);

              return (
                <Link
                  key={course.id}
                  href={`/child/courses/${course.id}`}
                  className="bg-white border-2 border-babyBlue-200 hover:border-babyBlue-400 rounded-3xl p-6 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <IconComp className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-babyBlue-50 text-babyBlue-800 border border-babyBlue-200">
                        {course.completedLessons}/{course.totalLessons} Done
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-charcoal-900 group-hover:text-babyBlue-600 transition-colors mb-2">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {course.description}
                    </p>
                  </div>

                  <div>
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Path Completion</span>
                        <span>{course.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-mint-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-babyBlue-600">
                      <span>Explore Lessons</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
