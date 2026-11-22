"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sound } from "@/lib/sound";

interface AudioPronounceButtonProps {
  text: string;
  lang?: string;
  label?: string;
}

export const AudioPronounceButton: React.FC<AudioPronounceButtonProps> = ({
  text,
  lang = "ar-SA",
  label = "Listen",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    sound.playCorrect();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85; // Slightly slower for children to hear clearly

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={handlePlay}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
        isPlaying
          ? "bg-gold-500 text-charcoal-900 ring-2 ring-gold-300 scale-105"
          : "bg-babyBlue-100 hover:bg-babyBlue-200 text-babyBlue-800"
      }`}
      title="Listen to pronunciation"
    >
      {isPlaying ? (
        <VolumeX className="w-3.5 h-3.5 text-charcoal-900 animate-pulse" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-babyBlue-700" />
      )}
      <span>{isPlaying ? "Playing..." : label}</span>
    </button>
  );
};
