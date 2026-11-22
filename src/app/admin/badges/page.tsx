"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Heart,
  Moon,
  Award,
  X,
  Users,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface AdminBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXP: number;
  categoryCondition: string | null;
  _count: { children: number };
}

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<AdminBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddBadgeModal, setShowAddBadgeModal] = useState(false);

  // Form states
  const [badgeName, setBadgeName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Award");
  const [requiredXP, setRequiredXP] = useState(50);
  const [categoryCondition, setCategoryCondition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBadges = async () => {
    try {
      const res = await fetch("/api/admin/badges");
      const json = await res.json();
      setBadges(json.badges || []);
    } catch (e) {
      console.error("Fetch badges error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeName || !description) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: badgeName,
          description,
          icon,
          requiredXP,
          categoryCondition: categoryCondition || null,
        }),
      });

      if (res.ok) {
        setShowAddBadgeModal(false);
        setBadgeName("");
        setDescription("");
        await fetchBadges();
      }
    } catch (e) {
      console.error("Create badge error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return BookOpen;
      case "Sparkles":
        return Sparkles;
      case "Heart":
        return Heart;
      case "Moon":
        return Moon;
      default:
        return Award;
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
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 block">
              Gamification Engine
            </span>
            <h1 className="text-2xl font-black text-charcoal-900">
              Badges & Milestone Rewards
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Configure unlockable badges, XP thresholds, and category conditions.
            </p>
          </div>

          <button
            onClick={() => setShowAddBadgeModal(true)}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Badge</span>
          </button>
        </div>

        {/* Badges Grid */}
        {isLoading ? (
          <p className="text-center py-20 text-slate-400 font-bold">Loading badges...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((b) => {
              const IconComp = getBadgeIcon(b.icon);

              return (
                <div
                  key={b.id}
                  className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-card-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
                        <IconComp className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold-100 text-amber-900">
                        {b.requiredXP} XP Req
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-charcoal-900 mb-1">{b.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {b.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>
                      Condition: {b.categoryCondition ? b.categoryCondition : "General XP"}
                    </span>
                    <span className="flex items-center gap-1 text-babyBlue-600">
                      <Users className="w-3.5 h-3.5" />
                      {b._count.children} Children Unlocked
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Badge Modal */}
      {showAddBadgeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-charcoal-900">
                Create Badge
              </h3>
              <button
                onClick={() => setShowAddBadgeModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBadge} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Badge Name
                </label>
                <input
                  type="text"
                  required
                  value={badgeName}
                  onChange={(e) => setBadgeName(e.target.value)}
                  placeholder="Master Reciter"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Earned by completing advanced Quran recitation lessons."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Required XP Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={requiredXP}
                  onChange={(e) => setRequiredXP(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Category Condition
                </label>
                <select
                  value={categoryCondition}
                  onChange={(e) => setCategoryCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                >
                  <option value="">Any Category (General XP)</option>
                  <option value="QURAN">Quran (القرآن)</option>
                  <option value="SALAH">Salah (الصلاة)</option>
                  <option value="RAMADAN">Ramadan (رمضان)</option>
                  <option value="ISLAMIC_STORIES">Islamic Stories (القصص)</option>
                  <option value="MUSLIM_CHARACTER">Muslim Character (الأخلاق)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBadgeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-xs shadow-sm"
                >
                  {isSubmitting ? "Saving..." : "Create Badge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
