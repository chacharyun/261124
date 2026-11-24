"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppLayout({
  activeTab,
  onSelectTab,
  children,
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFF8F5] text-forest-text flex flex-col font-sans">
      <Navbar onNavigate={onSelectTab} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />
        <main className="flex-1 p-3 sm:p-6 pb-24 md:pb-10 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <MobileNav activeTab={activeTab} onSelectTab={onSelectTab} />
    </div>
  );
}
