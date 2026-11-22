"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Trash2,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface AdminLesson {
  id: string;
  title: string;
  arabicHighlight: string;
  challengePrompt: string;
  xpReward: number;
  orderIndex: number;
  quizzes: Array<{
    id: string;
    title: string;
    _count: { questions: number };
  }>;
}

interface AdminCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  colorTheme: string;
  lessons: AdminLesson[];
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);

  // Form state for creating a new bilingual lesson
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [arabicHighlight, setArabicHighlight] = useState("");
  const [step1Title, setStep1Title] = useState("");
  const [step1English, setStep1English] = useState("");
  const [step1Arabic, setStep1Arabic] = useState("");
  const [challengePrompt, setChallengePrompt] = useState("");
  const [xpReward, setXpReward] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const json = await res.json();
      setCourses(json.courses || []);
      if (json.courses?.length > 0 && !selectedCourseId) {
        setSelectedCourseId(json.courses[0].id);
      }
    } catch (e) {
      console.error("Fetch courses error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !lessonTitle) return;

    setIsSubmitting(true);
    try {
      const contentSteps = [
        {
          step: 1,
          title: step1Title || "Introduction",
          englishText: step1English,
          arabicText: step1Arabic,
        },
      ];

      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_LESSON",
          courseId: selectedCourseId,
          title: lessonTitle,
          arabicHighlight,
          contentSteps,
          challengePrompt,
          xpReward,
        }),
      });

      if (res.ok) {
        setShowAddLessonModal(false);
        setLessonTitle("");
        setArabicHighlight("");
        setStep1English("");
        setStep1Arabic("");
        setChallengePrompt("");
        await fetchCourses();
      }
    } catch (e) {
      console.error("Create lesson error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete lesson "${title}"?`)) return;
    try {
      const res = await fetch("/api/admin/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "LESSON" }),
      });
      if (res.ok) {
        await fetchCourses();
      }
    } catch (e) {
      console.error("Delete lesson error:", e);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-100 via-white to-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-charcoal-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Dashboard</span>
        </Link>

        {/* Header Banner */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-mint-600 block">
              Curriculum Management
            </span>
            <h1 className="text-2xl font-black text-charcoal-900">
              Courses & Bilingual Lessons
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Manage learning paths, authentic Arabic highlights with Tashkeel, and challenges.
            </p>
          </div>

          <button
            onClick={() => setShowAddLessonModal(true)}
            className="px-5 py-3 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-black text-xs sm:text-sm shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Lesson</span>
          </button>
        </div>

        {/* Courses & Lessons Listing */}
        {isLoading ? (
          <p className="text-center py-20 text-slate-400 font-bold">Loading courses...</p>
        ) : (
          <div className="space-y-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card-soft"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-babyBlue-100 text-babyBlue-800">
                      {course.category}
                    </span>
                    <h2 className="text-xl font-black text-charcoal-900 mt-1">
                      {course.title}
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {course.lessons.length} Lessons
                  </span>
                </div>

                {course.lessons.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No lessons in this path yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="p-5 rounded-2xl border-2 border-slate-100 hover:border-babyBlue-200 bg-slate-50/50 flex flex-col justify-between transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase text-slate-400">
                              Lesson {idx + 1}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-gold-100 text-amber-900">
                              +{lesson.xpReward} XP
                            </span>
                          </div>

                          <h3 className="text-base font-black text-charcoal-900 mb-2">
                            {lesson.title}
                          </h3>

                          {lesson.arabicHighlight && (
                            <div
                              dir="rtl"
                              className="font-arabic text-xs text-babyBlue-800 line-clamp-1 mb-2 font-bold"
                            >
                              {lesson.arabicHighlight}
                            </div>
                          )}

                          {lesson.challengePrompt && (
                            <p className="text-[11px] text-slate-500 italic line-clamp-2 mb-3">
                              Challenge: {lesson.challengePrompt}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                          <Link
                            href={`/child/lessons/${lesson.id}`}
                            className="text-xs font-bold text-babyBlue-600 hover:underline"
                          >
                            Preview Child View
                          </Link>

                          <button
                            onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Lesson"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create New Lesson */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-charcoal-900">
                Create New Lesson
              </h3>
              <button
                onClick={() => setShowAddLessonModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Target Course / Path
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Lesson Title (Bilingual)
                </label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Surah An-Nas: Seeking Protection (سورة الناس)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Arabic Highlight with Tashkeel (Surah Verse, Dua, or Hadith)
                </label>
                <textarea
                  dir="rtl"
                  rows={2}
                  value={arabicHighlight}
                  onChange={(e) => setArabicHighlight(e.target.value)}
                  placeholder="قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Step 1 Card Title
                </label>
                <input
                  type="text"
                  value={step1Title}
                  onChange={(e) => setStep1Title(e.target.value)}
                  placeholder="The Meaning of Protection"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Step 1 English Explanation
                </label>
                <textarea
                  rows={3}
                  value={step1English}
                  onChange={(e) => setStep1English(e.target.value)}
                  placeholder="In this Surah, we ask Allah to protect us from whisperings and bad thoughts..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Practical Challenge Prompt
                </label>
                <input
                  type="text"
                  value={challengePrompt}
                  onChange={(e) => setChallengePrompt(e.target.value)}
                  placeholder="Recite this Surah with your brother or sister before going to bed!"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  XP Reward ({xpReward} XP)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={xpReward}
                  onChange={(e) => setXpReward(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-mint-600 hover:bg-mint-700 disabled:opacity-50 text-white font-black text-xs shadow-sm"
                >
                  {isSubmitting ? "Creating..." : "Save Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
