"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  DailyStudyPlan,
  FixedSchedule,
  HandwrittenNote,
  ReviewItem,
  ReviewAttempt,
  StudySession,
  UserSettings,
  VillageState,
  AiCoachMessage,
  XpTransaction,
  SubjectId,
  UnderstandingLevel,
  SubjectPlan,
} from "./types";
import {
  initialUserSettings,
  initialSchedules,
  getInitialTodayPlan,
  initialReviewItems,
  initialNotes,
  initialVillageState,
  initialAiMessages,
  initialSessions,
} from "./sample-data";
import { calculateNextReview, getTodayDateString } from "./spaced-repetition";
import { soundManager } from "./sounds";
import { XP_REWARDS } from "./constants";

const STORAGE_KEY = "pass_forest_data_v1";

interface ForestStoreContextType {
  isLoaded: boolean;
  settings: UserSettings;
  schedules: FixedSchedule[];
  todayPlan: DailyStudyPlan;
  sessions: StudySession[];
  reviewItems: ReviewItem[];
  reviewAttempts: ReviewAttempt[];
  notes: HandwrittenNote[];
  village: VillageState;
  aiMessages: AiCoachMessage[];
  xpTransactions: XpTransaction[];

  // Actions
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  addSchedule: (sch: Omit<FixedSchedule, "id">) => void;
  updateSchedule: (sch: FixedSchedule) => void;
  deleteSchedule: (id: string) => void;

  updateTodayPlan: (partial: Partial<DailyStudyPlan>) => void;
  updateSubjectPlan: (subjectId: SubjectId, partial: Partial<SubjectPlan>) => void;
  toggleSubjectComplete: (subjectId: SubjectId) => void;

  addStudySession: (session: StudySession) => void;
  addReviewItem: (item: Omit<ReviewItem, "id" | "registeredDate" | "nextReviewDate" | "reviewStage" | "reviewCount" | "overcome">) => ReviewItem;
  deleteReviewItem: (id: string) => void;
  recordReviewAttempt: (itemId: string, understanding: UnderstandingLevel, isCorrect?: boolean, spentSeconds?: number) => void;

  saveNote: (note: HandwrittenNote) => void;
  deleteNote: (id: string) => void;

  awardXp: (
    type: keyof typeof XP_REWARDS,
    idempotencyKey: string,
    subjectId?: SubjectId
  ) => boolean;

  unlockDecoration: (id: string) => boolean;
  moveDecoration: (id: string, x: number, y: number) => void;

  addAiMessage: (msg: Omit<AiCoachMessage, "id" | "date" | "createdAt">) => void;

  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
  resetAllData: () => void;
}

const ForestStoreContext = createContext<ForestStoreContextType | null>(null);

export function ForestStoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(initialUserSettings);
  const [schedules, setSchedules] = useState<FixedSchedule[]>(initialSchedules);
  const [todayPlan, setTodayPlan] = useState<DailyStudyPlan>(getInitialTodayPlan());
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(initialReviewItems);
  const [reviewAttempts, setReviewAttempts] = useState<ReviewAttempt[]>([]);
  const [notes, setNotes] = useState<HandwrittenNote[]>(initialNotes);
  const [village, setVillage] = useState<VillageState>(initialVillageState);
  const [aiMessages, setAiMessages] = useState<AiCoachMessage[]>(initialAiMessages);
  const [xpTransactions, setXpTransactions] = useState<XpTransaction[]>([]);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.schedules) setSchedules(parsed.schedules);
        if (parsed.todayPlan) {
          // If saved plan is for a different day, initialize a fresh todayPlan while preserving structure
          const today = getTodayDateString();
          if (parsed.todayPlan.date === today) {
            setTodayPlan(parsed.todayPlan);
          } else {
            setTodayPlan(getInitialTodayPlan());
          }
        }
        if (parsed.sessions) setSessions(parsed.sessions);
        if (parsed.reviewItems) setReviewItems(parsed.reviewItems);
        if (parsed.reviewAttempts) setReviewAttempts(parsed.reviewAttempts);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.village) setVillage(parsed.village);
        if (parsed.aiMessages) setAiMessages(parsed.aiMessages);
        if (parsed.xpTransactions) setXpTransactions(parsed.xpTransactions);
      }
    } catch (e) {
      console.error("Failed to load local storage data:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        settings,
        schedules,
        todayPlan,
        sessions,
        reviewItems,
        reviewAttempts,
        notes,
        village,
        aiMessages,
        xpTransactions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to persist data:", e);
    }
  }, [
    isLoaded,
    settings,
    schedules,
    todayPlan,
    sessions,
    reviewItems,
    reviewAttempts,
    notes,
    village,
    aiMessages,
    xpTransactions,
  ]);

  // Sync sound setting
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    soundManager.playClick();
  }, []);

  const addSchedule = useCallback((sch: Omit<FixedSchedule, "id">) => {
    const newSch: FixedSchedule = { ...sch, id: `sch-${Date.now()}` };
    setSchedules((prev) => [...prev, newSch]);
    soundManager.playPop();
  }, []);

  const updateSchedule = useCallback((sch: FixedSchedule) => {
    setSchedules((prev) => prev.map((s) => (s.id === sch.id ? sch : s)));
    soundManager.playClick();
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    soundManager.playClick();
  }, []);

  const updateTodayPlan = useCallback((partial: Partial<DailyStudyPlan>) => {
    setTodayPlan((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateSubjectPlan = useCallback((subjectId: SubjectId, partial: Partial<SubjectPlan>) => {
    setTodayPlan((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subjectId]: {
          ...prev.subjects[subjectId],
          ...partial,
        },
      },
    }));
  }, []);

  // Award XP with idempotency check to avoid repeat exploitation
  const awardXp = useCallback(
    (type: keyof typeof XP_REWARDS, idempotencyKey: string, subjectId?: SubjectId): boolean => {
      let isAlreadyAwarded = false;
      setXpTransactions((prev) => {
        if (prev.some((tx) => tx.idempotencyKey === idempotencyKey)) {
          isAlreadyAwarded = true;
          return prev;
        }
        const rule = XP_REWARDS[type];
        const newTx: XpTransaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          idempotencyKey,
          activityType: type,
          xpAwarded: rule.xp,
          subjectId,
          timestamp: new Date().toISOString(),
        };
        return [newTx, ...prev];
      });

      if (isAlreadyAwarded) return false;

      const rule = XP_REWARDS[type];
      setVillage((prev) => {
        const newTotalXp = prev.totalXp + rule.xp;
        const newCoins = prev.coins + Math.floor(rule.xp * 1.5);
        const newLevel = Math.floor(newTotalXp / 100) + 1;

        // Upgrade building XP if subjectId is provided
        const updatedBuildings = { ...prev.buildings };
        if (subjectId && updatedBuildings[subjectId]) {
          const b = updatedBuildings[subjectId];
          const nextBuildingXp = b.xp + rule.xp;
          const nextBuildingLevel = Math.min(5, Math.floor(nextBuildingXp / 100) + 1);
          updatedBuildings[subjectId] = {
            ...b,
            xp: nextBuildingXp,
            level: nextBuildingLevel,
          };
        }

        const leveledUp = newLevel > prev.level;
        if (leveledUp) {
          soundManager.playLevelUp();
        } else {
          soundManager.playChime();
        }

        return {
          ...prev,
          totalXp: newTotalXp,
          coins: newCoins,
          level: newLevel,
          buildings: updatedBuildings,
        };
      });

      return true;
    },
    []
  );

  const toggleSubjectComplete = useCallback(
    (subjectId: SubjectId) => {
      setTodayPlan((prev) => {
        const current = prev.subjects[subjectId].completed;
        const next = !current;
        const updated = {
          ...prev,
          subjects: {
            ...prev.subjects,
            [subjectId]: {
              ...prev.subjects[subjectId],
              completed: next,
            },
          },
        };

        if (next) {
          const today = getTodayDateString();
          awardXp("subject_complete", `subject_complete_${subjectId}_${today}`, subjectId);

          // Check if all 3 subjects are completed today!
          const allDone = Object.values(updated.subjects).every((s) => s.completed);
          if (allDone) {
            awardXp("all_three_complete", `all_three_complete_${today}`);
          }
        }

        return updated;
      });
    },
    [awardXp]
  );

  const addStudySession = useCallback(
    (session: StudySession) => {
      setSessions((prev) => [session, ...prev]);
      soundManager.playChime();

      // If user attempted 10+ questions, reward XP
      if (session.attemptedQuestions >= 10) {
        awardXp("questions_10", `questions_10_${session.id}`, session.subjectId);
      }
    },
    [awardXp]
  );

  const addReviewItem = useCallback(
    (item: Omit<ReviewItem, "id" | "registeredDate" | "nextReviewDate" | "reviewStage" | "reviewCount" | "overcome">): ReviewItem => {
      const today = getTodayDateString();
      const nextReview = calculateNextReview(today, item.understanding, 1);
      const newItem: ReviewItem = {
        ...item,
        id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        registeredDate: today,
        nextReviewDate: nextReview.nextReviewDate,
        reviewStage: nextReview.nextStage,
        reviewCount: 0,
        overcome: false,
      };

      setReviewItems((prev) => [newItem, ...prev]);
      soundManager.playPop();
      return newItem;
    },
    []
  );

  const deleteReviewItem = useCallback((id: string) => {
    setReviewItems((prev) => prev.filter((r) => r.id !== id));
    soundManager.playClick();
  }, []);

  const recordReviewAttempt = useCallback(
    (itemId: string, understanding: UnderstandingLevel, isCorrect?: boolean, spentSeconds: number = 30) => {
      const today = getTodayDateString();
      let targetSubjectId: SubjectId | undefined;
      let wasOvercome = false;

      setReviewItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;
          targetSubjectId = item.subjectId;
          const next = calculateNextReview(today, understanding, item.reviewStage, isCorrect);
          wasOvercome = next.overcome && !item.overcome;
          return {
            ...item,
            understanding,
            reviewStage: next.nextStage,
            nextReviewDate: next.nextReviewDate,
            reviewCount: item.reviewCount + 1,
            overcome: next.overcome,
          };
        })
      );

      const attempt: ReviewAttempt = {
        id: `att-${Date.now()}`,
        reviewItemId: itemId,
        attemptDate: today,
        understanding,
        isCorrect,
        spentSeconds,
      };
      setReviewAttempts((prev) => [attempt, ...prev]);

      // Award XP for completing a review problem
      awardXp("review_problem", `review_att_${attempt.id}`, targetSubjectId);

      // Extra bonus if candidate overcame repeated mistake
      if (wasOvercome) {
        awardXp("repeat_mistake_overcome", `overcome_${itemId}_${today}`, targetSubjectId);
      }
    },
    [awardXp]
  );

  const saveNote = useCallback((note: HandwrittenNote) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === note.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...note, updatedAt: new Date().toISOString() };
        return copy;
      }
      return [note, ...prev];
    });
    soundManager.playPop();
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    soundManager.playClick();
  }, []);

  const unlockDecoration = useCallback((id: string): boolean => {
    let success = false;
    setVillage((prev) => {
      const target = prev.decorations.find((d) => d.id === id);
      if (!target || target.unlocked) return prev;
      if (prev.coins < target.costXp) return prev; // Not enough coins/xp

      success = true;
      soundManager.playLevelUp();
      return {
        ...prev,
        coins: prev.coins - target.costXp,
        decorations: prev.decorations.map((d) => (d.id === id ? { ...d, unlocked: true } : d)),
        recentUnlocks: [`${target.name} 잠금 해제!`, ...prev.recentUnlocks.slice(0, 4)],
      };
    });
    return success;
  }, []);

  const moveDecoration = useCallback((id: string, x: number, y: number) => {
    setVillage((prev) => ({
      ...prev,
      decorations: prev.decorations.map((d) => (d.id === id ? { ...d, x, y } : d)),
    }));
    soundManager.playPop();
  }, []);

  const addAiMessage = useCallback((msg: Omit<AiCoachMessage, "id" | "date" | "createdAt">) => {
    const today = getTodayDateString();
    const newMsg: AiCoachMessage = {
      ...msg,
      id: `ai-${Date.now()}`,
      date: today,
      createdAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    setAiMessages((prev) => [newMsg, ...prev]);
    soundManager.playChime();
  }, []);

  const exportBackup = useCallback((): string => {
    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      settings,
      schedules,
      todayPlan,
      sessions,
      reviewItems,
      reviewAttempts,
      notes,
      village,
      aiMessages,
      xpTransactions,
    };
    return JSON.stringify(backupData, null, 2);
  }, [
    settings,
    schedules,
    todayPlan,
    sessions,
    reviewItems,
    reviewAttempts,
    notes,
    village,
    aiMessages,
    xpTransactions,
  ]);

  const importBackup = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.schedules) setSchedules(parsed.schedules);
      if (parsed.todayPlan) setTodayPlan(parsed.todayPlan);
      if (parsed.sessions) setSessions(parsed.sessions);
      if (parsed.reviewItems) setReviewItems(parsed.reviewItems);
      if (parsed.reviewAttempts) setReviewAttempts(parsed.reviewAttempts);
      if (parsed.notes) setNotes(parsed.notes);
      if (parsed.village) setVillage(parsed.village);
      if (parsed.aiMessages) setAiMessages(parsed.aiMessages);
      if (parsed.xpTransactions) setXpTransactions(parsed.xpTransactions);
      soundManager.playLevelUp();
      return true;
    } catch (e) {
      console.error("Import error:", e);
      return false;
    }
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(initialUserSettings);
    setSchedules(initialSchedules);
    setTodayPlan(getInitialTodayPlan());
    setSessions(initialSessions);
    setReviewItems(initialReviewItems);
    setReviewAttempts([]);
    setNotes(initialNotes);
    setVillage(initialVillageState);
    setAiMessages(initialAiMessages);
    setXpTransactions([]);
    soundManager.playPop();
  }, []);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      settings,
      schedules,
      todayPlan,
      sessions,
      reviewItems,
      reviewAttempts,
      notes,
      village,
      aiMessages,
      xpTransactions,
      updateSettings,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      updateTodayPlan,
      updateSubjectPlan,
      toggleSubjectComplete,
      addStudySession,
      addReviewItem,
      deleteReviewItem,
      recordReviewAttempt,
      saveNote,
      deleteNote,
      awardXp,
      unlockDecoration,
      moveDecoration,
      addAiMessage,
      exportBackup,
      importBackup,
      resetAllData,
    }),
    [
      isLoaded,
      settings,
      schedules,
      todayPlan,
      sessions,
      reviewItems,
      reviewAttempts,
      notes,
      village,
      aiMessages,
      xpTransactions,
      updateSettings,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      updateTodayPlan,
      updateSubjectPlan,
      toggleSubjectComplete,
      addStudySession,
      addReviewItem,
      deleteReviewItem,
      recordReviewAttempt,
      saveNote,
      deleteNote,
      awardXp,
      unlockDecoration,
      moveDecoration,
      addAiMessage,
      exportBackup,
      importBackup,
      resetAllData,
    ]
  );

  return <ForestStoreContext.Provider value={contextValue}>{children}</ForestStoreContext.Provider>;
}

export function useForestStore() {
  const ctx = useContext(ForestStoreContext);
  if (!ctx) {
    throw new Error("useForestStore must be used within a ForestStoreProvider");
  }
  return ctx;
}
