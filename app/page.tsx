"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VillageDashboard } from "@/components/dashboard/VillageDashboard";
import { GardenOfPlans } from "@/components/planner/GardenOfPlans";
import { TodayStudySession } from "@/components/study/TodayStudySession";
import { SpacedReviewLibrary } from "@/components/review/SpacedReviewLibrary";
import { MistakeVault } from "@/components/mistakes/MistakeVault";
import { HandwrittenCanvasNotes } from "@/components/notes/HandwrittenCanvasNotes";
import { WendyAiCoach } from "@/components/coach/WendyAiCoach";
import { GrowthAnalytics } from "@/components/analytics/GrowthAnalytics";
import { VillageDecorationView } from "@/components/village/VillageDecorationView";
import { SettingsView } from "@/components/settings/SettingsView";
import { useForestStore } from "@/lib/store";
import { Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const { isLoaded, storageError } = useForestStore();
  const [activeTab, setActiveTab] = useState<string>("village");
  const [isQuickMistakeModalOpen, setIsQuickMistakeModalOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex flex-col items-center justify-center text-forest-text space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-forest-pink text-white flex items-center justify-center text-3xl shadow-cute animate-float">
          🌸
        </div>
        <div className="text-center space-y-1">
          <h2 className="font-black text-lg text-forest-text">합격의 숲으로 들어가는 중...</h2>
          <p className="text-xs text-forest-text-muted">
            순경 시험 합격을 향한 마을 친구들이 마중 나오고 있어요 🌱
          </p>
        </div>
        <Loader2 className="w-5 h-5 text-forest-pink-dark animate-spin" />
      </div>
    );
  }

  return (
    <AppLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {storageError && <div role="alert" className="bg-rose-50 text-rose-800 p-3 rounded-xl mb-3">{storageError}</div>}
      {activeTab === "village" && (
        <VillageDashboard
          onNavigate={setActiveTab}
          onOpenQuickMistakeModal={() => {
            setActiveTab("mistakes");
            setIsQuickMistakeModalOpen(true);
          }}
        />
      )}

      {activeTab === "planner" && (
        <GardenOfPlans onNavigateToStudy={() => setActiveTab("study")} />
      )}

      {activeTab === "study" && (
        <TodayStudySession
          onNavigateToNotes={() => setActiveTab("notes")}
          onNavigateToReview={() => setActiveTab("review")}
        />
      )}

      {activeTab === "review" && (
        <SpacedReviewLibrary onNavigateToMistakes={() => setActiveTab("mistakes")} />
      )}

      {activeTab === "mistakes" && (
        <MistakeVault
          isModalOpen={isQuickMistakeModalOpen}
          onCloseModal={() => setIsQuickMistakeModalOpen(false)}
        />
      )}

      {activeTab === "notes" && <HandwrittenCanvasNotes />}

      {activeTab === "wendy" && <WendyAiCoach />}

      {activeTab === "analytics" && <GrowthAnalytics />}

      {activeTab === "decor" && <VillageDecorationView />}

      {activeTab === "settings" && <SettingsView />}
    </AppLayout>
  );
}
