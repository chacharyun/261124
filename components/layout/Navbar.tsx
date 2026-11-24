"use client";

import React from "react";
import { useForestStore } from "@/lib/store";
import { calculateDDay } from "@/lib/spaced-repetition";
import { Volume2, VolumeX, Sparkles, Coins } from "lucide-react";

export function Navbar({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { settings, village, reviewItems, updateSettings } = useForestStore();
  const dday = calculateDDay(settings.examDate);

  // Count due reviews today
  const todayStr = new Date().toISOString().slice(0, 10);
  const dueReviewsCount = reviewItems.filter((r) => r.nextReviewDate <= todayStr).length;

  const xpProgress = village.totalXp % 100;

  return (
    <header className="sticky top-0 z-30 bg-[#FFF8F5]/90 backdrop-blur-md border-b border-forest-border px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Village Title & D-Day */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate && onNavigate("village")}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-2xl bg-forest-pink flex items-center justify-center text-lg shadow-soft group-hover:scale-105 transition-transform">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-forest-text tracking-tight">
                  {settings.villageName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-forest-pink/30 text-forest-pink-dark border border-forest-pink/50 animate-pulse">
                  {dday.text}
                </span>
              </div>
              <p className="text-[11px] text-forest-text-muted hidden sm:block">
                2027.03.20 경찰 필기시험 합격을 향한 평화로운 여정
              </p>
            </div>
          </div>
        </div>

        {/* Status badges & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Due Review Indicator */}
          {dueReviewsCount > 0 && (
            <button
              onClick={() => onNavigate && onNavigate("review")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold btn-bubbly transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              오늘 복습 <strong className="text-amber-900">{dueReviewsCount}</strong>건
            </button>
          )}

          {/* Level & XP */}
          <div className="flex items-center gap-2 bg-white/80 border border-forest-border px-3 py-1 rounded-2xl shadow-soft">
            <div className="flex items-center gap-1 text-xs font-bold text-forest-pink-dark">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Lv.{village.level}</span>
            </div>
            <div className="w-14 sm:w-20 bg-forest-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-forest-pink h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-forest-text-muted hidden md:inline">
              {xpProgress}/100 XP
            </span>
          </div>

          {/* Coins / Bells */}
          <div className="flex items-center gap-1 bg-amber-50/90 border border-amber-200 px-2.5 py-1 rounded-2xl text-xs font-bold text-amber-800 shadow-soft">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{village.coins}</span>
            <span className="text-[10px] text-amber-600 font-normal">벨</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-2 rounded-2xl bg-white/80 border border-forest-border text-forest-text hover:bg-forest-pink/20 transition-colors btn-bubbly"
            title={settings.soundEnabled ? "소리 끄기" : "소리 켜기"}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-forest-pink-dark" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
