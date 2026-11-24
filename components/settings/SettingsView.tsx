"use client";

import React, { useState, useRef } from "react";
import { useForestStore } from "@/lib/store";
import { soundManager } from "@/lib/sounds";
import {
  Settings,
  Calendar,
  Clock,
  User,
  Volume2,
  VolumeX,
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export function SettingsView() {
  const {
    settings,
    updateSettings,
    exportBackup,
    importBackup,
    resetAllData,
  } = useForestStore();

  const [examDateInput, setExamDateInput] = useState(settings.examDate);
  const [userNameInput, setUserNameInput] = useState(settings.userName);
  const [villageNameInput, setVillageNameInput] = useState(settings.villageName);
  const [dailyMinutesInput, setDailyMinutesInput] = useState(settings.dailyTargetMinutes);
  const [busyMinutesInput, setBusyMinutesInput] = useState(settings.busyDayMinMinutes);

  // Supabase fields
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || "");
  const [supabaseKey, setSupabaseKey] = useState(settings.supabaseAnonKey || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      examDate: examDateInput,
      userName: userNameInput,
      villageName: villageNameInput,
      dailyTargetMinutes: Number(dailyMinutesInput),
      busyDayMinMinutes: Number(busyMinutesInput),
      supabaseUrl: supabaseUrl.trim() || undefined,
      supabaseAnonKey: supabaseKey.trim() || undefined,
    });
    setSaveSuccess(true);
    soundManager.playLevelUp();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExport = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `합격의숲_백업_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    soundManager.playLevelUp();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        alert("성공적으로 백업 데이터를 불러왔습니다! 🌸");
      } else {
        alert("백업 파일 형식이 올바르지 않습니다.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm("정말 초기 기본 상태(풍부한 경찰시험 샘플 데이터)로 리셋하시겠습니까?")) {
      resetAllData();
      alert("기본 데이터로 초기화되었습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-forest-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-forest-text">환경 설정</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-pink/30 text-forest-pink-dark">
              계정 및 데이터 관리
            </span>
          </div>
          <p className="text-xs text-forest-text-muted mt-0.5">
            시험일, 일일 공부 시간, 소리 설정, 데이터 백업 및 Supabase 연동
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveGeneral} className="space-y-6">
        {/* 1. Exam & Target Time Settings */}
        <div className="bg-white rounded-3xl p-6 border border-forest-border shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-forest-text flex items-center gap-2">
            <Calendar className="w-4 h-4 text-forest-pink-dark" />
            <span>시험일 및 공부 시간 설정</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-forest-text-muted mb-1">
                순경 필기시험 목표일 *
              </label>
              <input
                type="date"
                required
                value={examDateInput}
                onChange={(e) => setExamDateInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border font-bold focus:outline-none"
              />
              <span className="text-[10px] text-forest-text-muted mt-1 block">
                기본 설정: 2027년 3월 20일
              </span>
            </div>

            <div>
              <label className="block font-bold text-forest-text-muted mb-1">
                기본 하루 목표 공부 시간 (분) *
              </label>
              <input
                type="number"
                required
                min={30}
                max={600}
                value={dailyMinutesInput}
                onChange={(e) => setDailyMinutesInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border font-bold focus:outline-none"
              />
              <span className="text-[10px] text-forest-text-muted mt-1 block">
                기본 권장: 180분 (3시간)
              </span>
            </div>

            <div>
              <label className="block font-bold text-forest-text-muted mb-1">
                바쁜 날 최소 공부 시간 (분) *
              </label>
              <input
                type="number"
                required
                min={15}
                max={180}
                value={busyMinutesInput}
                onChange={(e) => setBusyMinutesInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border font-bold focus:outline-none"
              />
              <span className="text-[10px] text-forest-text-muted mt-1 block">
                기본 권장: 60분 (1시간)
              </span>
            </div>
          </div>
        </div>

        {/* 2. User & Village Customization */}
        <div className="bg-white rounded-3xl p-6 border border-forest-border shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-forest-text flex items-center gap-2">
            <User className="w-4 h-4 text-forest-pink-dark" />
            <span>수험생 프로필 및 마을 테마</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-forest-text-muted mb-1">수험생 닉네임</label>
              <input
                type="text"
                required
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-forest-text-muted mb-1">나의 마을 이름</label>
              <input
                type="text"
                required
                value={villageNameInput}
                onChange={(e) => setVillageNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Supabase Cloud Sync (Optional) */}
        <div className="bg-white rounded-3xl p-6 border border-forest-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-forest-text flex items-center gap-2">
              <Database className="w-4 h-4 text-forest-pink-dark" />
              <span>Supabase 클라우드 동기화 (선택 사항)</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest-green/30 text-forest-green-dark font-bold">
              로컬 자동 저장 지원
            </span>
          </div>
          <p className="text-xs text-forest-text-muted leading-relaxed">
            컴퓨터, 아이패드, 휴대폰에서 동일한 데이터를 동기화하려면 Supabase 프로젝트의 URL과
            Anon Key를 입력하세요. 입력하지 않더라도 기기 브라우저 저장소에 100% 안전하게 저장됩니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-forest-text-muted mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-forest-text-muted mb-1">
                Supabase Anon Key
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save General Settings Button */}
        <div className="flex items-center justify-between">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>설정이 안전하게 저장되었습니다!</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-forest-pink-dark text-white font-black text-xs hover:opacity-90 shadow-cute transition-all btn-bubbly"
          >
            설정 변경 사항 저장
          </button>
        </div>
      </form>

      {/* 4. Data Backup & Restore */}
      <div className="bg-white rounded-3xl p-6 border border-forest-border shadow-soft space-y-4">
        <h2 className="text-sm font-bold text-forest-text flex items-center gap-2">
          <Download className="w-4 h-4 text-forest-pink-dark" />
          <span>데이터 백업 및 복원 (100% 데이터 소유권)</span>
        </h2>
        <p className="text-xs text-forest-text-muted">
          언제든지 내 모든 학습 기록, 오답노트, 손필기 벡터 데이터, 마을 상태를 JSON 파일로
          내보내거나 불러올 수 있습니다.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 rounded-2xl bg-forest-warm border border-forest-border hover:bg-white text-forest-text font-bold text-xs flex items-center gap-2 btn-bubbly shadow-xs"
          >
            <Download className="w-4 h-4 text-forest-pink-dark" />
            <span>JSON 백업 파일 다운로드</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-2xl bg-forest-warm border border-forest-border hover:bg-white text-forest-text font-bold text-xs flex items-center gap-2 btn-bubbly shadow-xs"
          >
            <Upload className="w-4 h-4 text-forest-green-dark" />
            <span>백업 파일 복원하기</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-2 btn-bubbly ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>샘플 데이터로 초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
}
