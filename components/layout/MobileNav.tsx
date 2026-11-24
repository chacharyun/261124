"use client";

import React, { useState } from "react";
import {
  Home,
  CalendarDays,
  BookOpen,
  Library,
  MoreHorizontal,
  Camera,
  PenTool,
  Bot,
  BarChart3,
  Trees,
  Settings,
  X,
} from "lucide-react";
import { useForestStore } from "@/lib/store";

export function MobileNav({
  activeTab,
  onSelectTab,
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { reviewItems } = useForestStore();

  const todayStr = new Date().toISOString().slice(0, 10);
  const dueReviews = reviewItems.filter((r) => r.nextReviewDate <= todayStr).length;

  const primaryTabs = [
    { id: "village", label: "우리마을", icon: Home },
    { id: "planner", label: "계획", icon: CalendarDays },
    { id: "study", label: "공부", icon: BookOpen },
    { id: "review", label: "복습", icon: Library, badge: dueReviews },
    { id: "more", label: "더보기", icon: MoreHorizontal },
  ];

  const secondaryTabs = [
    { id: "mistakes", label: "오답 보관소", desc: "사진 기반 타이핑 최소화", icon: Camera },
    { id: "notes", label: "손필기 노트", desc: "Apple Pencil 백지 복습", icon: PenTool },
    { id: "wendy", label: "웬디쌤", desc: "AI 맞춤 학습 코칭", icon: Bot },
    { id: "analytics", label: "성장 기록", desc: "정답률 & 공부 시간 분석", icon: BarChart3 },
    { id: "decor", label: "마을 꾸미기", desc: "보상 & 건물 성장", icon: Trees },
    { id: "settings", label: "설정", desc: "시험일 · 백업 · 계정", icon: Settings },
  ];

  return (
    <>
      {/* Bottom Sticky Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-forest-border px-2 py-1.5 flex justify-around items-center">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === "more" ? showMoreMenu : activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "more") {
                  setShowMoreMenu(!showMoreMenu);
                } else {
                  setShowMoreMenu(false);
                  onSelectTab(tab.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive ? "text-forest-pink-dark font-bold scale-105" : "text-forest-text-muted"
              }`}
            >
              <div
                className={`p-1 rounded-xl ${
                  isActive ? "bg-forest-pink/30 text-forest-pink-dark" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* "더보기" Drawer / Modal */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-[#FFF8F5] rounded-t-3xl border-t border-forest-border p-5 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-forest-border">
              <span className="font-bold text-base text-forest-text">전체 메뉴</span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-full hover:bg-forest-warm text-forest-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4 pb-6">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl text-left border transition-all ${
                      isActive
                        ? "bg-forest-pink/30 border-forest-pink text-forest-pink-dark font-bold"
                        : "bg-white border-forest-border text-forest-text hover:bg-forest-warm"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-forest-cream text-forest-pink-dark shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{tab.label}</div>
                      <div className="text-[10px] text-forest-text-muted mt-0.5">{tab.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
