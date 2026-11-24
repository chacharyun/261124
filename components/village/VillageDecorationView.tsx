"use client";

import React, { useState, useRef } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS } from "@/lib/constants";
import { SubjectId, VillageDecorationItem } from "@/lib/types";
import { AnimalAvatar } from "./AnimalAvatar";
import { BuildingIllustration } from "./BuildingIllustration";
import { soundManager } from "@/lib/sounds";
import {
  Sparkles,
  Coins,
  Heart,
  Store,
  MapPin,
  CheckCircle2,
  Move,
  X,
  Compass,
  ArrowRight,
} from "lucide-react";

export function VillageDecorationView() {
  const { village, settings, unlockDecoration, moveDecoration } = useForestStore();

  const [selectedBuilding, setSelectedBuilding] = useState<SubjectId | null>("criminal_law");
  const [selectedDecoration, setSelectedDecoration] = useState<VillageDecorationItem | null>(null);
  const [isMoveMode, setIsMoveMode] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  const buildings = village.buildings;
  const characters = village.characters;

  // Grid dimensions for Village Plaza: 6 columns (0 to 5) x 3 rows (0 to 2)
  const GRID_COLS = 6;
  const GRID_ROWS = 3;

  // Find decoration at specific coordinates
  const getDecorationAt = (x: number, y: number) => {
    return village.decorations.find((d) => d.unlocked && d.x === x && d.y === y);
  };

  const handleSelectDecoration = (item: VillageDecorationItem) => {
    setSelectedDecoration(item);
    setIsMoveMode(false);
    soundManager.playPop();

    // Scroll smoothly to the map so the user clearly sees where it's located
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    if (item.unlocked) {
      setStatusMessage(`📍 [${item.name}] 위치를 지도에서 확인했습니다! (${item.x + 1}열, ${item.y + 1}행)`);
    } else {
      setStatusMessage(`🔒 [${item.name}]은(는) 아직 잠겨 있습니다. 상점에서 해금 후 배치할 수 있어요!`);
    }
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleTileClick = (x: number, y: number) => {
    const existing = getDecorationAt(x, y);

    // If in Move Mode and user taps an empty tile
    if (isMoveMode && selectedDecoration) {
      if (existing && existing.id !== selectedDecoration.id) {
        alert("해당 타일에는 이미 다른 장식이 배치되어 있습니다. 빈 타일을 선택해 주세요!");
        return;
      }

      moveDecoration(selectedDecoration.id, x, y);
      setIsMoveMode(false);
      soundManager.playChime();
      setStatusMessage(`🌸 [${selectedDecoration.name}] 위치를 (${x + 1}열, ${y + 1}행)으로 이동했습니다!`);
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    // Normal click on a placed item
    if (existing) {
      handleSelectDecoration(existing);
    } else {
      // Clicked on empty tile
      setSelectedDecoration(null);
      setIsMoveMode(false);
      soundManager.playClick();
    }
  };

  const handleUnlockItem = (item: VillageDecorationItem) => {
    if (village.coins < item.costXp) {
      alert("벨(코인)이 부족해요! 오늘의 공부나 복습을 완료해 벨을 모아보세요.");
      return;
    }
    const success = unlockDecoration(item.id);
    if (success) {
      soundManager.playLevelUp();
      setStatusMessage(`🎉 [${item.name}] 잠금 해제 완료! 지도에 배치되었습니다.`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-forest-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-forest-text">마을 꾸미기 & 성장</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-pink/30 text-forest-pink-dark">
              동물의 숲 감성
            </span>
          </div>
          <p className="text-xs text-forest-text-muted mt-0.5">
            지도의 장식 타일을 클릭하여 위치를 확인하고, 자유롭게 원하는 곳으로 이동시켜 보세요.
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
          <div className="font-bold text-sm mb-0.5">지치지 않는 합격의 숲 평화 원칙 🌱</div>
          <p className="leading-relaxed text-emerald-800">
            공부를 며칠 쉬어가더라도 캐릭터가 시들거나 건물이 퇴화하지 않으며, 출석 스트레스를 주지 않습니다.
            바쁜 날 60분 최소 목표만 달성해도 주민들이 감사 인사를 전해요!
          </p>
        </div>
      </div>

      {/* Floating Status / Action Feedback Toast */}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-forest-pink text-white text-xs font-bold shadow-cute animate-in fade-in slide-in-from-top-2 duration-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. INTERACTIVE VILLAGE MAP CONTAINER */}
      <div
        ref={mapRef}
        className="bg-[#FAF7F2] rounded-3xl p-5 sm:p-7 border-2 border-dashed border-forest-border shadow-soft space-y-6 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest-border/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-forest-pink-dark" />
              <h2 className="text-base sm:text-lg font-black text-forest-text">
                {settings.villageName} 인터랙티브 지도
              </h2>
            </div>
            <p className="text-xs text-forest-text-muted mt-0.5">
              {isMoveMode
                ? "🚀 이동 모드 활성화 중: 장식을 옮기고 싶은 지도의 빈 잔디 타일을 터치하세요!"
                : "타일의 장식을 클릭하면 세부 정보와 위치가 표시되며, 원하는 위치로 이동할 수 있습니다."}
            </p>
          </div>

          {selectedDecoration && selectedDecoration.unlocked && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMoveMode(!isMoveMode);
                  soundManager.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all btn-bubbly ${
                  isMoveMode
                    ? "bg-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300"
                    : "bg-forest-pink text-white shadow-sm hover:bg-forest-pink-dark"
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                <span>{isMoveMode ? "이동 취소" : "위치 이동하기"}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedDecoration(null);
                  setIsMoveMode(false);
                }}
                className="p-1.5 rounded-xl text-forest-text-muted hover:bg-white border border-forest-border text-xs"
                title="선택 해제"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* TOP: 3 Major Subject Buildings Row */}
        <div>
          <div className="text-[11px] font-bold text-forest-text-muted mb-2 flex items-center gap-1">
            <span>🏛️ 마을의 3대 과목 중심 건물</span>
            <span className="text-[10px] text-forest-pink-dark font-normal">
              (클릭 시 캐릭터 대화 및 증축 현황 확인)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((subId) => {
              const b = buildings[subId];
              const c = characters[subId];
              const isSelected = selectedBuilding === subId;

              return (
                <div
                  key={subId}
                  onClick={() => {
                    setSelectedBuilding(subId);
                    soundManager.playPop();
                  }}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center text-center btn-bubbly ${
                    isSelected
                      ? "bg-white border-forest-pink shadow-cute ring-2 ring-forest-pink/30"
                      : "bg-white/80 border-forest-border hover:bg-white hover:border-forest-pink/60 shadow-xs"
                  }`}
                >
                  <BuildingIllustration
                    buildingId={subId}
                    level={b.level}
                    className="w-24 h-24 mb-1"
                  />
                  <div className="relative my-1">
                    <AnimalAvatar subjectId={subId} size="md" mood={c.mood} />
                    <span className="absolute -top-2 -right-4 bg-white px-1.5 py-0.2 rounded-full border border-forest-border text-[9px] font-bold text-forest-pink-dark">
                      ★{b.level}
                    </span>
                  </div>
                  <div className="font-black text-xs text-forest-text">{b.name}</div>
                  <div className="text-[10px] text-forest-text-muted">{c.name}</div>

                  <div className="mt-2 bg-forest-warm/60 p-2 rounded-xl text-[10px] text-forest-text italic leading-tight w-full">
                    "{c.dialogue}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM: INTERACTIVE VILLAGE PLAZA TILE GRID (6 cols x 3 rows) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-forest-text-muted flex items-center gap-1.5">
              <span>🌿 마을 공원 조경 타일 지도 (6 × 3)</span>
              {isMoveMode && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold animate-pulse">
                  이동할 빈 타일을 터치하세요!
                </span>
              )}
            </div>
            {selectedDecoration && (
              <span className="text-xs font-bold text-forest-pink-dark flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  선택된 장식: {selectedDecoration.name} ({selectedDecoration.x + 1}열,{" "}
                  {selectedDecoration.y + 1}행)
                </span>
              </span>
            )}
          </div>

          {/* Grid Layout */}
          <div className="bg-[#E4EFE0] p-3 rounded-2xl border-2 border-[#BCD1B6] grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {Array.from({ length: GRID_ROWS }).map((_, rowIndex) =>
              Array.from({ length: GRID_COLS }).map((_, colIndex) => {
                const item = getDecorationAt(colIndex, rowIndex);
                const isSelected = selectedDecoration?.id === item?.id;
                const canMoveHere = isMoveMode && !item;

                return (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    onClick={() => handleTileClick(colIndex, rowIndex)}
                    className={`relative h-24 rounded-2xl p-1.5 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-2 border-forest-pink shadow-cute ring-4 ring-forest-pink/40 scale-105 z-20 animate-pulse"
                        : item
                        ? "bg-[#F3FAF0] border border-[#BCD1B6] hover:bg-white hover:border-forest-pink/60 hover:shadow-sm"
                        : canMoveHere
                        ? "bg-amber-50 border-2 border-dashed border-amber-400 hover:bg-amber-100/80 animate-pulse"
                        : "bg-[#D8E8D2]/60 border border-dashed border-[#BCD1B6]/70 hover:bg-[#EAF4E8]"
                    }`}
                  >
                    {/* Coordinate indicator in corner */}
                    <span className="absolute top-1 left-1.5 text-[8px] font-bold text-forest-text-muted/60">
                      {colIndex + 1},{rowIndex + 1}
                    </span>

                    {item ? (
                      <>
                        {/* Selected Beacon Pin */}
                        {isSelected && (
                          <div className="absolute -top-2.5 z-30 flex items-center gap-0.5 bg-forest-pink text-white px-1.5 py-0.5 rounded-full text-[9px] font-black shadow-md animate-bounce">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>위치 확인!</span>
                          </div>
                        )}

                        <div className="w-12 h-12 flex items-center justify-center mb-0.5">
                          <BuildingIllustration
                            buildingId={item.type as any}
                            className="w-11 h-11"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-forest-text leading-tight truncate max-w-full text-center">
                          {item.name}
                        </span>
                      </>
                    ) : canMoveHere ? (
                      <div className="text-center text-amber-800 space-y-0.5">
                        <Move className="w-4 h-4 mx-auto animate-bounce" />
                        <span className="text-[9px] font-bold block">여기로 이동</span>
                      </div>
                    ) : (
                      <div className="text-center opacity-40">
                        <span className="text-[12px]">🌱</span>
                        <span className="text-[8px] block text-forest-text-muted">빈 타일</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. PLACED DECORATIONS LIST (CLICKABLE WITH CLEAR POSITION HIGHLIGHT) */}
      <div className="bg-white rounded-3xl p-6 border border-forest-border shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-forest-pink-dark" />
            <h3 className="text-base font-bold text-forest-text">마을에 배치된 조경 장식들</h3>
          </div>
          <span className="text-xs text-forest-pink-dark font-bold">
            💡 카드를 클릭하면 지도에서 위치가 반짝이며 표시됩니다!
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {village.decorations.map((dec) => {
            const isSelected = selectedDecoration?.id === dec.id;

            return (
              <div
                key={dec.id}
                onClick={() => handleSelectDecoration(dec)}
                className={`cursor-pointer rounded-2xl p-3 text-center border-2 transition-all btn-bubbly flex flex-col justify-between ${
                  isSelected
                    ? "bg-forest-pink/20 border-forest-pink shadow-cute ring-2 ring-forest-pink/40 scale-102"
                    : dec.unlocked
                    ? "bg-white border-forest-border hover:border-forest-pink/60 shadow-soft"
                    : "bg-forest-warm/30 border-dashed border-forest-border/80 opacity-70"
                }`}
              >
                <div>
                  <div className="w-14 h-14 mx-auto flex items-center justify-center">
                    <BuildingIllustration buildingId={dec.type as any} className="w-12 h-12" />
                  </div>
                  <div className="text-xs font-bold text-forest-text mt-1 truncate">{dec.name}</div>
                </div>

                <div className="mt-2 pt-1 border-t border-forest-border/50">
                  {dec.unlocked ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-forest-pink-dark bg-white px-1.5 py-0.5 rounded-full border border-forest-border">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>
                          {dec.x + 1}열 {dec.y + 1}행
                        </span>
                      </span>
                      <div className="text-[9px] text-forest-text-muted">
                        {isSelected ? "📍 지도에서 확인 중" : "클릭하여 위치 확인"}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-amber-700 font-semibold flex items-center justify-center gap-1">
                      <Coins className="w-3 h-3 text-amber-500" />
                      <span>{dec.costXp} 벨 필요</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DECORATION SHOP & UNLOCKS */}
      <div className="bg-white rounded-3xl p-6 border border-forest-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-forest-pink-dark" />
            <h3 className="text-base font-bold text-forest-text">마을 상점 (보상 해금)</h3>
          </div>
          <span className="text-xs text-forest-text-muted">
            학습으로 획득한 벨로 새로운 조경 장식을 구매하고 마을을 가꿔보세요.
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
                <button
                  onClick={() => handleSelectDecoration(item)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>배치 확인</span>
                </button>
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
