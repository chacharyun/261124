"use client";

import React from "react";
import {
  Home,
  CalendarDays,
  BookOpen,
  Library,
  Camera,
  PenTool,
  Bot,
  BarChart3,
  Trees,
  Settings,
} from "lucide-react";
import { useForestStore } from "@/lib/store";
import { AnimalAvatar } from "../village/AnimalAvatar";

export interface NavItem {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  badge?: number;
  highlight?: boolean;
}

export function Sidebar({
  activeTab,
  onSelectTab,
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}) {
  const { reviewItems, settings, village } = useForestStore();

  const todayStr = new Date().toISOString().slice(0, 10);
  const dueReviews = reviewItems.filter((r) => r.nextReviewDate <= todayStr).length;

  const navItems: NavItem[] = [
    { id: "village", label: "우리 마을", subLabel: "메인 대시보드", icon: Home },
    { id: "planner", label: "계획의 정원", subLabel: "통합 플래너", icon: CalendarDays },
    { id: "study", label: "오늘의 공부", subLabel: "4단계 집중 학습", icon: BookOpen, highlight: true },
    {
      id: "review",
      label: "복습 도서관",
      subLabel: "자동 간격 반복",
      icon: Library,
      badge: dueReviews,
    },
    { id: "mistakes", label: "오답 보관소", subLabel: "사진 오답 등록", icon: Camera },
    { id: "notes", label: "손필기 노트", subLabel: "백지 복습 & 필기", icon: PenTool },
    { id: "wendy", label: "웬디쌤", subLabel: "AI 학습 코치", icon: Bot },
    { id: "analytics", label: "성장 기록", subLabel: "학습 통계 분석", icon: BarChart3 },
    { id: "decor", label: "마을 꾸미기", subLabel: "보상 & 건물 성장", icon: Trees },
    { id: "settings", label: "설정", subLabel: "시험일 · 계정 · 백업", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-md border-r border-forest-border flex flex-col justify-between p-4 hidden md:flex shrink-0 min-h-[calc(100vh-57px)]">
      {/* Menu List */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-forest-text-muted uppercase tracking-wider">
          숲속 수험 여정
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all btn-bubbly ${
                  isActive
                    ? "bg-forest-pink/30 text-forest-pink-dark font-bold shadow-soft border border-forest-pink/40"
                    : "text-forest-text hover:bg-forest-warm/60 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isActive
                        ? "bg-forest-pink text-white"
                        : "bg-forest-cream text-forest-text-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight">{item.label}</div>
                    <div className="text-[10px] text-forest-text-muted">{item.subLabel}</div>
                  </div>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Candidate Profile Card at bottom */}
      <div className="mt-6 pt-4 border-t border-forest-border/80">
        <div className="bg-gradient-to-r from-forest-cream to-forest-pink/20 rounded-2xl p-3 border border-forest-border/60 flex items-center gap-3">
          <AnimalAvatar subjectId="criminal_law" size="sm" mood="reading" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-forest-text truncate">
              {settings.userName} 님
            </div>
            <div className="text-[10px] text-forest-text-muted">
              마을 Lv.{village.level} 순경 준비생
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
