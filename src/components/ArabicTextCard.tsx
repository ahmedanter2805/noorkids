"use client";

import React from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { AudioPronounceButton } from "./AudioPronounceButton";

interface ArabicTextCardProps {
  arabicText: string;
  translation?: string;
  transliteration?: string;
  sourceTitle?: string;
  badgeLabel?: string;
}

export const ArabicTextCard: React.FC<ArabicTextCardProps> = ({
  arabicText,
  translation,
  transliteration,
  sourceTitle,
  badgeLabel = "Arabic Verse / Dua",
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-babyBlue-50 via-white to-amber-50/40 border-2 border-babyBlue-200 rounded-3xl p-6 sm:p-8 shadow-card-soft">
      {/* Decorative background ornament */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-babyBlue-200/30 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-200/20 rounded-tr-full pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-babyBlue-500 text-white shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-300" />
            {badgeLabel}
          </span>
          {sourceTitle && (
            <span className="text-xs font-bold text-slate-500">
              {sourceTitle}
            </span>
          )}
        </div>

        <AudioPronounceButton text={arabicText} label="Listen (استمع)" />
      </div>

      {/* Main Authentic Arabic Text with Tashkeel */}
      <div
        dir="rtl"
        lang="ar"
        className="my-4 text-center text-charcoal-900 font-arabic text-2xl sm:text-3xl lg:text-4xl leading-loose sm:leading-[2.2] select-text py-2"
        style={{ fontFamily: "'Cairo', 'Amiri', 'Traditional Arabic', serif" }}
      >
        {arabicText}
      </div>

      {/* Transliteration */}
      {transliteration && (
        <div className="text-center text-sm font-semibold text-slate-600 italic mb-3">
          {transliteration}
        </div>
      )}

      {/* Translation */}
      {translation && (
        <div className="mt-4 pt-4 border-t border-babyBlue-100 text-center text-sm sm:text-base font-medium text-slate-700">
          <span className="text-xs font-bold uppercase tracking-wider text-babyBlue-600 block mb-1">
            English Meaning
          </span>
          &ldquo;{translation}&rdquo;
        </div>
      )}
    </div>
  );
};
