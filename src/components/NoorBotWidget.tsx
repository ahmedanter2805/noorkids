"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, MessageCircle, Volume2 } from "lucide-react";
import { sound } from "@/lib/sound";

export const NoorBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    {
      role: "bot",
      text: "Assalamu Alaikum, friend! 🌟 I am NoorBot, your friendly Islamic learning buddy! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "How do I make Wudu? 💧",
    "Dua before sleeping 🌙",
    "What is Sadaqah? 💖",
    "The 5 daily prayers 🕌",
  ];

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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
          text: "Assalamu Alaikum! NoorBot is taking a little nap. Try again in a second! 🌟",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => {
            sound.playCorrect();
            setIsOpen(true);
          }}
          className="relative group bg-gradient-to-tr from-babyBlue-500 to-babyBlue-400 hover:from-babyBlue-600 hover:to-babyBlue-500 text-white p-4 rounded-3xl shadow-bubbly hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          title="Chat with NoorBot"
        >
          <div className="relative">
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full border-2 border-white animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full border-2 border-white" />
          </div>
          <span className="text-sm font-black hidden sm:inline pr-1">Ask NoorBot</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="bg-white border-2 border-babyBlue-200 rounded-3xl shadow-2xl w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-babyBlue-500 to-babyBlue-400 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm tracking-wide">NoorBot AI</h3>
                  <span className="px-1.5 py-0.2 bg-gold-400 text-charcoal-900 text-[9px] font-black rounded-full uppercase">
                    Kid-Safe
                  </span>
                </div>
                <p className="text-[11px] text-babyBlue-100 font-medium">Your friendly Islamic tutor</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="bg-babyBlue-50/70 border-b border-babyBlue-100 p-2 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-babyBlue-800 border border-babyBlue-200 hover:bg-babyBlue-100 transition-all shadow-xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-white to-babyBlue-50/20">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    m.role === "user"
                      ? "bg-babyBlue-500 text-white rounded-br-xs font-medium"
                      : "bg-white text-charcoal-900 border border-babyBlue-100 rounded-bl-xs font-normal"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-babyBlue-100 rounded-2xl rounded-bl-xs p-3 text-xs text-babyBlue-600 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-gold-500" />
                  <span>NoorBot is thinking with a smile...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-babyBlue-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about Islam..."
              className="flex-1 bg-babyBlue-50/70 border border-babyBlue-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-babyBlue-500 hover:bg-babyBlue-600 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
