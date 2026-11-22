"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  ArrowLeft,
  Volume2,
  HelpCircle,
  BookOpen,
  Heart,
  Moon,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { AudioPronounceButton } from "@/components/AudioPronounceButton";
import { DemoSwitcher } from "@/components/DemoSwitcher";

export default function ChildChatPage() {
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    {
      role: "bot",
      text: `Assalamu Alaikum wa Rahmatullah! 🌟
I am NoorBot, your friendly Islamic learning assistant!
Ask me anything about:
• How to make sparkling Wudu 💧
• The 5 daily prayers (Salah) 🕌
• Fasting and Ramadan 🌙
• Prophet stories and brave adventures 🚢
• Duas before eating, sleeping, or studying 🤲
What would you like to explore today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const starterChips = [
    { label: "How do I make Wudu? 💧", prompt: "How do I make Wudu?" },
    { label: "Dua before sleeping 🌙", prompt: "What is the Dua before sleeping?" },
    { label: "What is Sadaqah? 💖", prompt: "What is Sadaqah and how can kids do it?" },
    { label: "Story of Prophet Nuh 🚢", prompt: "Tell me about Prophet Nuh and his ark" },
    { label: "The 5 Daily Prayers 🕌", prompt: "What are the 5 daily prayers and their times?" },
    { label: "Dua for Parents ❤️", prompt: "What is the Dua for parents in the Quran?" },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    sound.playCorrect();
    setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    if (!messageText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: textToSend }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Assalamu Alaikum! NoorBot is resting for a moment. Try asking again! 🌟",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-babyBlue-50/70 via-white to-slate-50 flex flex-col pb-8">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 flex-1 flex flex-col">
        <div className="mb-4">
          <DemoSwitcher compact={true} />
        </div>

        {/* Back Link */}
        <Link
          href="/child/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-babyBlue-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Island</span>
        </Link>

        {/* Main Chat Container */}
        <div className="bg-white border-2 border-babyBlue-200 rounded-3xl shadow-card-soft flex-1 flex flex-col overflow-hidden min-h-[550px]">
          {/* Tutor Header */}
          <div className="bg-gradient-to-r from-babyBlue-500 via-sky-500 to-babyBlue-600 p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-lg">NoorBot AI Tutor</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-400 text-charcoal-900">
                    Kid-Safe
                  </span>
                </div>
                <p className="text-xs text-babyBlue-100 font-medium">
                  Controlled, loving Islamic assistant for curious young minds
                </p>
              </div>
            </div>
          </div>

          {/* Preset Prompts horizontal scroll */}
          <div className="bg-babyBlue-50/70 border-b border-babyBlue-100 p-3 overflow-x-auto flex gap-2 no-scrollbar">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.prompt)}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-babyBlue-800 border border-babyBlue-200 hover:bg-babyBlue-100 hover:border-babyBlue-300 transition-all shadow-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-white via-babyBlue-50/15 to-white">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl p-5 text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-card-soft ${
                    m.role === "user"
                      ? "bg-babyBlue-500 text-white rounded-br-xs font-medium"
                      : "bg-white text-charcoal-900 border-2 border-babyBlue-100 rounded-bl-xs font-normal"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-babyBlue-100 rounded-3xl rounded-bl-xs p-4 text-xs font-bold text-babyBlue-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-gold-500" />
                  <span>NoorBot is formulating a gentle, wise answer...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-white border-t border-babyBlue-100 flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NoorBot anything about Islam, Quran, Duas, or prayer..."
              className="flex-1 bg-slate-50 border border-babyBlue-200 rounded-2xl px-5 py-3.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-babyBlue-500 hover:bg-babyBlue-600 disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-bubbly hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
