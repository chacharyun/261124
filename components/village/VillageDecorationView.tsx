"use client";

import React, { useState } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS, XP_REWARDS } from "@/lib/constants";
import { SubjectId, VillageDecorationItem } from "@/lib/types";
import { AnimalAvatar } from "./AnimalAvatar";
import { BuildingIllustration } from "./BuildingIllustration";
import { soundManager } from "@/lib/sounds";
import {
  Trees,
  Sparkles,
  Coins,
  ShieldCheck,
  Award,
  ChevronRight,
  Heart,
  Store,
  MapPin,
  Lock,
  Unlock,
  CheckCircle2,
} from "lucide-react";

export function VillageDecorationView() {
  const { village, settings, unlockDecoration, moveDecoration } = useForestStore();

  const [selectedBuilding, setSelectedBuilding] = useState<SubjectId | null>("criminal_law");
  const [selectedDecoration, setSelectedDecoration] = useState<VillageDecorationItem | null>(null);

  const buildings = village.buildings;
  const characters = village.characters;

  const handleUnlockItem = (item: VillageDecorationItem) => {
    if (village.coins < item.costXp) {
      alert("벨(코인)이 부족해요! 오늘의 공부나 복습을 완료해 벨을 모아보세요.");
      return;
    }
    const success = unlockDecoration(item.id);
    if (success) {
      soundManager.playLevelUp();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-forest-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-forest-text">마을 꾸미기 & 성장</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-pink/30 text-forest-pink-dark">
              동물의 숲 감성
            </span>
          </div>
          <p className="text-xs text-forest-text-muted mt-0.5">
            공부와 복습을 진행할수록 건물이 증축되고, 나만의 따뜻한 경찰 마을을 꾸밀 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-forest-warm/60 px-4 py-2 rounded-2xl border border-forest-border self-start sm:self-auto">
          <div className="flex items-center gap-1.5 font-black text-sm text-forest-text">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>마을 Lv.{village.level}</span>
          </div>
          <div className="w-px h-4 bg-forest-border" />
          <div className="flex items-center gap-1.5 font-black text-sm text-amber-700">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>{village.coins} 벨</span>
          </div>
        </div>
      </div>

      {/* Gentle Growth Philosophy Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-3xl p-4 border border-emerald-200/80 shadow-soft flex items-start gap-3">
        <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
          <Heart className="w-5 h-5 fill-emerald-500" />
        </div>
        <div className="text-xs text-emerald-950">
          <div className="font-bold text-sm mb-0.5">
            지치지 않는 합격의 숲 평화 원칙 🌱
          </div>
          <p className="leading-relaxed text-emerald-800">
            공부를 며칠 쉬어가더라도 캐릭터가 시들거나 건물이 퇴화하지 않으며, 출석 스트레스를 주지
            않습니다. 바쁜 날 60분 최소 목표만 달성해도 주민들이 감사 인사를 전해요!
          </p>
        </div>
      </div>

      {/* 1. INTERACTIVE VILLAGE MAP */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border-2 border-dashed border-forest-border shadow-soft relative overflow-hidden">
        {/* Soft decorative background paths and grass dots */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#C76D91_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-forest-text-muted border border-forest-border">
              {settings.villageName} 전경
            </span>
            <h2 className="text-lg font-black text-forest-text">
              과목별 3대 건물 & 캐릭터 거주지
            </h2>
          </div>

          {/* 3 Major Buildings Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((subId) => {
              const b = buildings[subId];
              const c = characters[subId];
              const sub = SUBJECTS[subId];
              const isSelected = selectedBuilding === subId;

              return (
                <div
                  key={subId}
                  onClick={() => {
                    setSelectedBuilding(subId);
                    soundManager.playPop();
                  }}
                  className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex flex-col items-center text-center btn-bubbly ${
                    isSelected
                      ? "bg-white border-forest-pink shadow-cute scale-102 ring-2 ring-forest-pink/30"
                      : "bg-white/80 border-forest-border hover:bg-white hover:border-forest-pink/60 shadow-soft"
                  }`}
                >
                  {/* Building Graphic */}
                  <BuildingIllustration
                    buildingId={subId}
                    level={b.level}
                    className="w-32 h-32 mb-2"
                  />

                  {/* Animal Character & Dialogue Bubble */}
                  <div className="relative my-2">
                    <AnimalAvatar subjectId={subId} size="lg" mood={c.mood} />
                    <div className="absolute -top-3 -right-6 bg-white px-2 py-0.5 rounded-full border border-forest-border shadow-xs text-[10px] font-bold text-forest-pink-dark">
                      Lv.{b.level}
                    </div>
                  </div>

                  <div className="font-black text-sm text-forest-text mt-1">{b.name}</div>
                  <div className="text-[11px] text-forest-text-muted">
                    {c.name} · {c.outfit}
                  </div>

                  {/* Speech bubble */}
                  <div className="mt-3 bg-forest-warm/60 p-2.5 rounded-2xl border border-forest-border/80 text-[11px] text-forest-text italic leading-snug">
                    "{c.dialogue}"
                  </div>

                  {/* Building Progress */}
                  <div className="w-full mt-3 pt-2 border-t border-forest-border/50 text-left text-[10px]">
                    <div className="flex justify-between text-forest-text-muted mb-1">
                      <span>건물 증축 진도</span>
                      <span className="font-bold">{b.xp % 100}/100 XP</span>
                    </div>
                    <div className="w-full bg-forest-border rounded-full h-1.5">
                      <div
                        className="bg-forest-pink h-full rounded-full transition-all"
                        style={{ width: `${b.xp % 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Placed Village Decorations Section */}
          <div className="pt-4 border-t border-forest-border/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-forest-text-muted">
                마을에 배치된 조경 장식들
              </span>
              <span className="text-xs text-forest-pink-dark font-bold">
                클릭하여 장식 위치 확인
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {village.decorations.map((dec) => (
                <div
                  key={dec.id}
                  className={`rounded-2xl p-3 text-center border transition-all ${
                    dec.unlocked
                      ? "bg-white border-forest-border shadow-soft"
                      : "bg-forest-warm/30 border-dashed border-forest-border/80 opacity-60"
                  }`}
                >
                  <div className="w-16 h-16 mx-auto flex items-center justify-center">
                    <BuildingIllustration buildingId={dec.type as any} className="w-14 h-14" />
                  </div>
                  <div className="text-xs font-bold text-forest-text mt-1">{dec.name}</div>
                  <div className="text-[10px] text-forest-text-muted">
                    {dec.unlocked ? "배치 완료" : `${dec.costXp} 벨 필요`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DECORATION SHOP & UNLOCKS */}
      <div className="bg-white rounded-3xl p-6 border border-forest-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-forest-pink-dark" />
            <h3 className="text-base font-bold text-forest-text">마을 상점 (보상 해금)</h3>
          </div>
          <span className="text-xs text-forest-text-muted">
            학습으로 획득한 벨로 마을을 아기자기하게 꾸며보세요.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {village.decorations.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-4 border transition-all flex items-center justify-between ${
                item.unlocked
                  ? "bg-emerald-50/40 border-emerald-200"
                  : "bg-white border-forest-border hover:border-forest-pink"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-forest-warm/40 flex items-center justify-center">
                  <BuildingIllustration buildingId={item.type as any} className="w-10 h-10" />
                </div>
                <div>
                  <div className="font-bold text-xs text-forest-text">{item.name}</div>
                  <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-500" />
                    <span>{item.costXp} 벨</span>
                  </div>
                </div>
              </div>

              {item.unlocked ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>보유 중</span>
                </span>
              ) : (
                <button
                  onClick={() => handleUnlockItem(item)}
                  className="px-3 py-1.5 rounded-xl bg-forest-pink text-forest-text hover:bg-forest-pink-dark hover:text-white font-bold text-xs transition-all shadow-sm btn-bubbly"
                >
                  구매하기
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
