"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  Plus,
  ArrowLeft,
  CheckCircle2,
  X,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface AdminQuiz {
  id: string;
  title: string;
  passingScore: number;
  bonusXP: number;
  lesson: {
    title: string;
    course: { title: string; category: string };
  };
  questions: Array<{
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState("");

  // Add question form state
  const [questionText, setQuestionText] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt4, setOpt4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/admin/quizzes");
      const json = await res.json();
      setQuizzes(json.quizzes || []);
      if (json.quizzes?.length > 0 && !selectedQuizId) {
        setSelectedQuizId(json.quizzes[0].id);
      }
    } catch (e) {
      console.error("Fetch quizzes error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizId || !questionText || !correctAnswer) return;

    setIsSubmitting(true);
    try {
      const options = [opt1, opt2, opt3, opt4].filter(Boolean);

      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_QUESTION",
          quizId: selectedQuizId,
          questionText,
          options,
          correctAnswer,
          explanation,
        }),
      });

      if (res.ok) {
        setShowAddQuestionModal(false);
        setQuestionText("");
        setOpt1("");
        setOpt2("");
        setOpt3("");
        setOpt4("");
        setCorrectAnswer("");
        setExplanation("");
        await fetchQuizzes();
      }
    } catch (e) {
      console.error("Add question error:", e);
    } finally {
      setIsSubmitting(false);
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

        {/* Banner */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 block">
              Assessment Engine
            </span>
            <h1 className="text-2xl font-black text-charcoal-900">
              Quizzes & Question Bank
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Manage multiple-choice questions, verify answers, and configure bonus XP.
            </p>
          </div>

          <button
            onClick={() => setShowAddQuestionModal(true)}
            className="px-5 py-3 rounded-2xl bg-gold-400 hover:bg-gold-500 text-charcoal-900 font-black text-xs sm:text-sm shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-900" />
            <span>Add Question</span>
          </button>
        </div>

        {/* Quizzes List */}
        {isLoading ? (
          <p className="text-center py-20 text-slate-400 font-bold">Loading quizzes...</p>
        ) : (
          <div className="space-y-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card-soft"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-100 text-amber-900">
                      {quiz.lesson.course.category}
                    </span>
                    <h2 className="text-xl font-black text-charcoal-900 mt-1">
                      {quiz.title}
                    </h2>
                    <span className="text-xs font-bold text-slate-400">
                      Lesson: {quiz.lesson.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                      Passing: {quiz.passingScore}%
                    </span>
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-gold-50 text-amber-800 border border-gold-200">
                      +{quiz.bonusXP} Bonus XP
                    </span>
                    <Link
                      href={`/child/quizzes/${quiz.id}`}
                      className="px-3 py-1 rounded-xl text-xs font-black bg-babyBlue-500 text-white hover:bg-babyBlue-600"
                    >
                      Try Quiz
                    </Link>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {quiz.questions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-black text-slate-400">
                          Q{qIdx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-mint-100 text-mint-800">
                          Correct: {q.correctAnswer}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-charcoal-900 mb-2">
                        {q.questionText}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {q.options.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                              opt === q.correctAnswer
                                ? "bg-mint-50 border-mint-300 text-mint-800"
                                : "bg-white border-slate-200 text-slate-600"
                            }`}
                          >
                            {opt}
                          </span>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-slate-500 italic">
                          Explanation: {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-charcoal-900">
                Add Quiz Question
              </h3>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Select Quiz
                </label>
                <select
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                >
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title} ({q.lesson.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="What is the first step of Wudu?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Option 1
                </label>
                <input
                  type="text"
                  required
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  placeholder="Saying Bismillah and washing hands"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Option 2
                </label>
                <input
                  type="text"
                  required
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  placeholder="Wiping feet"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Option 3
                </label>
                <input
                  type="text"
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  placeholder="Sleeping"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Correct Answer (Must match one option exactly)
                </label>
                <input
                  type="text"
                  required
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Saying Bismillah and washing hands"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-mint-700"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Kid-Friendly Explanation
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="We always begin with Bismillah (بِسْمِ اللَّهِ) to invite Allah's blessing."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 disabled:opacity-50 text-charcoal-900 font-black text-xs shadow-sm"
                >
                  {isSubmitting ? "Adding..." : "Save Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
