"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  Star,
  Award,
  RotateCcw,
  PartyPopper,
  Zap,
} from "lucide-react";
import { fireCelebrationConfetti } from "@/components/ConfettiEffect";
import { sound } from "@/lib/sound";
import { useAuth } from "@/context/AuthContext";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  orderIndex: number;
  correctAnswer: string;
  explanation: string;
}

interface QuizData {
  id: string;
  title: string;
  passingScore: number;
  bonusXP: number;
  lessonId: string;
  lesson: {
    id: string;
    title: string;
    courseId: string;
    course: {
      id: string;
      title: string;
      category: string;
      colorTheme: string;
    };
  };
  questions: QuizQuestion[];
}

interface QuizSubmissionResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  earnedXP: number;
  gamification: {
    newXP: number;
    newLevel: number;
    leveledUp: boolean;
    unlockedBadges: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
    }>;
  };
  reviewDetails: Array<{
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export default function QuizEnginePage() {
  const params = useParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showInstantHint, setShowInstantHint] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/quizzes/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data.quiz || null);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [params.id]);

  const handleSelectOption = (questionId: string, option: string) => {
    if (result) return; // Already finished
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
    setShowInstantHint((prev) => ({ ...prev, [questionId]: true }));

    const question = quiz?.questions.find((q) => q.id === questionId);
    if (question) {
      if (option === question.correctAnswer) {
        sound.playCorrect();
      } else {
        sound.playWrong();
      }
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || isSubmitting) return;

    // Check if all questions are answered
    const unanswered = quiz.questions.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      alert("Please answer all questions before submitting your quiz!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selectedAnswers }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        if (data.passed) {
          sound.playFanfare();
          fireCelebrationConfetti();
        } else {
          sound.playWrong();
        }
        await refreshUser();
      }
    } catch (e) {
      console.error("Quiz submission error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowInstantHint({});
    setResult(null);
    setCurrentQuestionIndex(0);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Sparkles className="w-8 h-8 text-babyBlue-500 animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex-1 max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-charcoal-900 mb-2">Quiz not found</h2>
        <Link href="/child/courses" className="text-babyBlue-600 font-bold underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="flex-1 bg-gradient-to-b from-babyBlue-50/70 via-white to-slate-50 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        {/* Back Link */}
        <Link
          href={`/child/lessons/${quiz.lesson.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-babyBlue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lesson: {quiz.lesson.title}</span>
        </Link>

        {/* Quiz Header */}
        <div className="bg-white border-2 border-babyBlue-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold-100 text-amber-800">
              Interactive Quiz
            </span>
            <span className="text-xs font-bold text-slate-500">
              Passing: {quiz.passingScore}% • Reward: +{quiz.bonusXP} Bonus XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900">
            {quiz.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Read carefully, pick the best answer, and earn radiant stars!
          </p>
        </div>

        {/* If Quiz is Submitted, Show Results Summary */}
        {result ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div
              className={`p-8 rounded-3xl text-center shadow-card-soft border-2 ${
                result.passed
                  ? "bg-gradient-to-br from-mint-500 to-emerald-600 text-white border-mint-400 shadow-bubbly-mint"
                  : "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400"
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-4xl mb-4">
                {result.passed ? "🏆" : "💪"}
              </div>

              <h2 className="text-3xl font-black mb-2">
                {result.passed ? "Masha'Allah! You Passed!" : "Good Try, Young Star!"}
              </h2>

              <p className="text-sm font-medium opacity-90 max-w-md mx-auto mb-6">
                {result.passed
                  ? `You answered ${result.correctCount} of ${result.totalQuestions} questions correctly! You earned +${result.earnedXP} XP!`
                  : `You scored ${result.score}%. Don't worry, in Islam we learn with patience (Sabr). Review your answers and try again!`}
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md text-sm font-black">
                  Score: {result.score}%
                </span>
                <span className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md text-sm font-black flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-gold-300" />
                  +{result.earnedXP} XP Earned
                </span>
                {result.gamification?.leveledUp && (
                  <span className="px-4 py-2 rounded-2xl bg-gold-400 text-charcoal-900 text-sm font-black flex items-center gap-1.5 animate-bounce">
                    <Star className="w-4 h-4 fill-charcoal-900" />
                    Leveled Up to Level {result.gamification.newLevel}!
                  </span>
                )}
              </div>

              {/* Unlocked Badges */}
              {result.gamification?.unlockedBadges?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <span className="text-xs font-black uppercase tracking-wider block mb-2">
                    🌟 New Badges Unlocked!
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {result.gamification.unlockedBadges.map((b) => (
                      <span
                        key={b.id}
                        className="bg-white text-charcoal-900 px-3 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5"
                      >
                        <Award className="w-4 h-4 text-amber-600" />
                        {b.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Question by Question Detailed Review */}
            <div className="bg-white border-2 border-babyBlue-200 rounded-3xl p-6 sm:p-8 shadow-card-soft">
              <h3 className="text-lg font-black text-charcoal-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-babyBlue-500" />
                <span>Question Review & Explanations</span>
              </h3>

              <div className="space-y-6">
                {result.reviewDetails.map((item, idx) => (
                  <div
                    key={item.questionId}
                    className={`p-5 rounded-2xl border-2 ${
                      item.isCorrect
                        ? "bg-mint-50/60 border-mint-300"
                        : "bg-red-50/60 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-xs font-black text-slate-500">
                        Question {idx + 1}
                      </span>
                      {item.isCorrect ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-mint-200 text-mint-900 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct (+10 XP)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-200 text-red-900 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Needs Practice
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-black text-charcoal-900 mb-3">
                      {item.questionText}
                    </h4>

                    <div className="text-xs space-y-1 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500">Your Answer:</span>
                        <span
                          className={`font-black ${
                            item.isCorrect ? "text-mint-700" : "text-red-600 line-through"
                          }`}
                        >
                          {item.selectedAnswer || "None"}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500">Correct Answer:</span>
                          <span className="font-black text-mint-700">
                            {item.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-white/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <strong className="text-babyBlue-700 block mb-0.5">Explanation:</strong>
                      {item.explanation}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 rounded-2xl bg-babyBlue-100 hover:bg-babyBlue-200 text-babyBlue-800 font-black text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>

                <Link
                  href={`/child/courses/${quiz.lesson.courseId}`}
                  className="px-6 py-3 rounded-2xl bg-babyBlue-500 hover:bg-babyBlue-600 text-white font-black text-xs sm:text-sm shadow-bubbly transition-all"
                >
                  Return to Path Road Map
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Active Quiz Engine */
          <div className="bg-white border-2 border-babyBlue-200 rounded-3xl p-6 sm:p-8 shadow-card-soft">
            {/* Progress indicators */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-babyBlue-700">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <div className="flex items-center gap-1.5">
                {quiz.questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-xl font-black text-xs transition-all flex items-center justify-center ${
                      idx === currentQuestionIndex
                        ? "bg-babyBlue-500 text-white shadow-sm"
                        : selectedAnswers[q.id]
                        ? "bg-mint-100 text-mint-800 border border-mint-300"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 mb-6 leading-snug">
              {currentQ.questionText}
            </h2>

            {/* Multiple Choice Options with Instant Visual Feedback */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === opt;
                const hasAnswered = !!selectedAnswers[currentQ.id];
                const isCorrect = opt === currentQ.correctAnswer;

                let optionStyle =
                  "bg-slate-50 hover:bg-babyBlue-50/70 border-slate-200 text-charcoal-900";

                if (hasAnswered) {
                  if (isSelected && isCorrect) {
                    // Mint Green for correct
                    optionStyle = "bg-mint-100 border-mint-500 text-mint-900 shadow-bubbly-mint";
                  } else if (isSelected && !isCorrect) {
                    // Gentle red for wrong
                    optionStyle = "bg-red-50 border-red-400 text-red-900";
                  } else if (isCorrect) {
                    // Highlight correct answer gently
                    optionStyle = "bg-mint-50 border-mint-300 text-mint-800";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, opt)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {hasAnswered && isSelected && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-mint-600 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant feedback explanation hint */}
            {selectedAnswers[currentQ.id] && (
              <div className="mb-6 p-4 rounded-2xl bg-babyBlue-50 border border-babyBlue-200 text-xs sm:text-sm text-slate-700 animate-in fade-in duration-200">
                <strong className="text-babyBlue-800 block mb-1">
                  {selectedAnswers[currentQ.id] === currentQ.correctAnswer
                    ? "✨ Brilliant! Correct Answer!"
                    : "💡 Gentle Learning Hint:"}
                </strong>
                {currentQ.explanation}
              </div>
            )}

            {/* Bottom Nav / Submit */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none"
              >
                Previous Question
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting || !selectedAnswers[currentQ.id]}
                  className="px-6 py-3 rounded-2xl bg-gold-400 hover:bg-gold-500 text-charcoal-900 font-black text-xs sm:text-sm shadow-bubbly-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-900" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Quiz & Collect Stars"}</span>
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(quiz.questions.length - 1, prev + 1)
                    )
                  }
                  className="px-6 py-3 rounded-2xl bg-babyBlue-500 hover:bg-babyBlue-600 text-white font-black text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
