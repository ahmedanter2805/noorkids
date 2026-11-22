"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Trophy,
  Bot,
  Flame,
  Star,
  ShieldCheck,
  Heart,
  Moon,
  Scroll,
  ArrowRight,
  CheckCircle2,
  Compass,
  Play,
  Award,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  const paths = [
    {
      title: "Holy Quran",
      arabicTitle: "القرآن الكريم",
      description: "Recite short Surahs, understand their wisdom, and illuminate your heart.",
      icon: BookOpen,
      color: "from-sky-400 to-babyBlue-600",
      bgLight: "bg-sky-50",
      border: "border-sky-200",
      textCol: "text-sky-700",
      example: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
    {
      title: "Prayer Journey",
      arabicTitle: "رحلة الصلاة",
      description: "Master sparkling Wudu and discover the peace of the 5 daily prayers.",
      icon: Sparkles,
      color: "from-emerald-400 to-mint-600",
      bgLight: "bg-mint-50",
      border: "border-mint-200",
      textCol: "text-mint-700",
      example: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    },
    {
      title: "Ramadan & Fasting",
      arabicTitle: "رمضان المبارك",
      description: "Celebrate the month of light, fasting, Duas, and acts of Sadaqah.",
      icon: Moon,
      color: "from-amber-400 to-gold-600",
      bgLight: "bg-amber-50",
      border: "border-amber-200",
      textCol: "text-amber-700",
      example: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ",
    },
    {
      title: "Stories of the Prophets",
      arabicTitle: "قصص الأنبياء",
      description: "Thrilling adventures of Prophet Nuh, Yusuf, and moral lessons of faith.",
      icon: Scroll,
      color: "from-rose-400 to-pink-600",
      bgLight: "bg-rose-50",
      border: "border-rose-200",
      textCol: "text-rose-700",
      example: "وَاصْنَعِ الْفُلْكَ بِأَعْيُنِنَا وَوَحْيِنَا",
    },
    {
      title: "Muslim Character",
      arabicTitle: "الأخلاق الإسلامية",
      description: "Build a golden character with honesty, respect for parents, and kindness.",
      icon: Heart,
      color: "from-indigo-400 to-purple-600",
      bgLight: "bg-indigo-50",
      border: "border-indigo-200",
      textCol: "text-indigo-700",
      example: "عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ",
    },
  ];

  const cycleSteps = [
    {
      step: 1,
      title: "Learn",
      arabic: "تَعَلَّمْ",
      desc: "Bilingual micro-lessons with authentic Arabic text & Tashkeel.",
      color: "bg-sky-500",
    },
    {
      step: 2,
      title: "Interact",
      arabic: "تَفَاعَلْ",
      desc: "Step-by-step interactive cards, audio pronunciation, & challenge prompts.",
      color: "bg-amber-500",
    },
    {
      step: 3,
      title: "Practice",
      arabic: "تَدَرَّبْ",
      desc: "Fun multiple-choice quizzes with instant gentle feedback & hints.",
      color: "bg-mint-500",
    },
    {
      step: 4,
      title: "Earn",
      arabic: "اكْسِبْ",
      desc: "Collect real-time XP, level up your character, and light up streaks.",
      color: "bg-gold-500",
    },
    {
      step: 5,
      title: "Progress",
      arabic: "تَقَدَّمْ",
      desc: "Unlock glowing badges in your Trophy Room and make parents proud!",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Demo Bar */}
      <div className="bg-babyBlue-100/70 border-b border-babyBlue-200 py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <DemoSwitcher />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-babyBlue-50/70 via-white to-slate-50">
        {/* Decorative background shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-babyBlue-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-gold-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Arabic Greeting pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-babyBlue-100/90 border border-babyBlue-300 text-babyBlue-800 text-xs font-black uppercase tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-gold-500 animate-spin" />
              <span className="font-arabic text-sm">السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-charcoal-900 tracking-tight leading-tight sm:leading-none mb-6">
              Islamic Learning That Kids{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-babyBlue-600 via-sky-500 to-mint-500">
                Actually Love!
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed mb-8">
              NoorKids transforms authentic Islamic education into a vibrant adventure.
              Master the Quran, Salah, Ramadan, and beautiful character through interactive lessons, quizzes, XP rewards, and child-safe AI.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {user ? (
                <Link
                  href={
                    user.role === "CHILD"
                      ? "/child/dashboard"
                      : user.role === "PARENT"
                      ? "/parent/dashboard"
                      : "/admin/dashboard"
                  }
                  className="px-8 py-4 rounded-2xl bg-babyBlue-500 hover:bg-babyBlue-600 text-white font-black text-base shadow-bubbly hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => {
                      const switcher = document.querySelector("#quick-demo-section");
                      switcher?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-8 py-4 rounded-2xl bg-gold-400 hover:bg-gold-500 text-charcoal-900 font-black text-base shadow-bubbly-gold hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-amber-900" />
                    <span>Try 1-Click Demo</span>
                  </button>
                  <Link
                    href="/register"
                    className="px-8 py-4 rounded-2xl bg-white border-2 border-babyBlue-300 hover:bg-babyBlue-50 text-babyBlue-700 font-black text-base shadow-sm hover:scale-105 transition-all"
                  >
                    Register Child or Parent
                  </Link>
                </>
              )}
            </div>

            {/* Micro stats banner */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-babyBlue-600">5 Paths</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Core Curriculum</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-gold-500">100% Kid-Safe</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Controlled AI Tutor</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-mint-500">Gamified XP</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Levels & Badges</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-indigo-500">Parent Portal</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Real-time Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Step Learning Cycle (Learn -> Interact -> Practice -> Earn -> Progress) */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-babyBlue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300 mb-3 inline-block">
              Pedagogical Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
              The NoorKids Learning Cycle
            </h2>
            <p className="text-slate-600 font-medium mt-2">
              Designed around child cognitive engagement: every lesson follows a rewarding 5-stage loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {cycleSteps.map((step) => (
              <div
                key={step.step}
                className="relative bg-babyBlue-50/50 border-2 border-babyBlue-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-card-soft hover:-translate-y-1 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${step.color} text-white font-black text-lg flex items-center justify-center shadow-md mb-4`}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-black text-charcoal-900 mb-1">{step.title}</h3>
                <span className="text-sm font-bold font-arabic text-babyBlue-600 mb-3">
                  {step.arabic}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Core Learning Paths Showcase */}
      <section id="paths" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-babyBlue-100 text-babyBlue-800 border border-babyBlue-300 mb-3 inline-block">
              Curriculum Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
              Explore the 5 Learning Paths
            </h2>
            <p className="text-slate-600 font-medium mt-2">
              Carefully curated paths with authentic Arabic verses, Tashkeel, moral takeaways, and interactive quizzes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paths.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white border-2 ${p.border} rounded-3xl p-7 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${p.color} text-white flex items-center justify-center shadow-md`}
                      >
                        <IconComp className="w-7 h-7" />
                      </div>
                      <span className={`text-sm font-black font-arabic ${p.textCol}`}>
                        {p.arabicTitle}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-charcoal-900 mb-2">{p.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{p.description}</p>
                  </div>

                  <div className={`mt-4 p-3 rounded-2xl ${p.bgLight} border ${p.border}`}>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      Sample Verse / Dua
                    </span>
                    <div
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-sm font-bold text-charcoal-900 leading-loose text-center"
                    >
                      {p.example}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* NoorBot Card */}
            <div className="bg-gradient-to-br from-babyBlue-500 to-babyBlue-600 border-2 border-babyBlue-400 rounded-3xl p-7 text-white shadow-bubbly flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                    <Bot className="w-7 h-7" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-gold-400 text-charcoal-900">
                    AI Tutor
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mb-2">NoorBot AI Assistant</h3>
                <p className="text-sm text-babyBlue-100 leading-relaxed">
                  Kid-safe conversational tutor trained to answer questions on Wudu, Salah, Ramadan, and noble character in simple, loving language.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20">
                <Link
                  href="/child/chat"
                  className="w-full py-3 rounded-xl bg-white text-babyBlue-600 font-black text-center text-sm block hover:bg-babyBlue-50 transition-all shadow-sm"
                >
                  Chat with NoorBot Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Demo Login Section on Landing Page */}
      <section id="quick-demo-section" className="py-16 sm:py-20 bg-white border-t border-babyBlue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 border border-gold-300 text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Instant Evaluator Access</span>
          </div>

          <h2 className="text-3xl font-black text-charcoal-900 tracking-tight mb-3">
            One-Click Quick Demo Login
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto mb-8">
            Experience the full app from any role without entering passwords. Switch instantly between child, parent, and admin views.
          </p>

          <DemoSwitcher />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-900 text-white py-12 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-babyBlue-500 flex items-center justify-center text-white font-black">
                <Sparkles className="w-5 h-5 text-gold-300" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight block">
                  Noor<span className="text-babyBlue-400">Kids</span>
                </span>
                <span className="text-xs text-slate-400">Gamified Islamic Learning for Children</span>
              </div>
            </div>

            <div className="text-center md:text-right text-xs text-slate-400">
              <p>© 2025 NoorKids. Built with care for the Muslim youth.</p>
              <p className="mt-1">
                Learn → Interact → Practice → Earn → Progress
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
