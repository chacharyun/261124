"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS } from "@/lib/constants";
import { SubjectId, HandwrittenNote, NotePage, Stroke, StrokePoint } from "@/lib/types";
import { soundManager } from "@/lib/sounds";
import {
  PenTool,
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Download,
  Grid,
  AlignJustify,
  Square,
  Image as ImageIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Save,
} from "lucide-react";

export function HandwrittenCanvasNotes() {
  const { notes, saveNote, deleteNote, settings, updateSettings } = useForestStore();

  // Active note and page
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || "");
  const [activePageNum, setActivePageNum] = useState<number>(1);

  // Drawing tool state
  const [tool, setTool] = useState<"pen" | "highlighter" | "eraser">("pen");
  const [strokeColor, setStrokeColor] = useState<string>("#33222B");
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [template, setTemplate] = useState<"blank" | "lined" | "grid" | "problem">("grid");

  // History for Undo / Redo
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<StrokePoint[]>([]);

  // Active Note
  const currentNote = notes.find((n) => n.id === activeNoteId) || notes[0];
  const currentPage = currentNote?.pages.find((p) => p.pageNumber === activePageNum) || currentNote?.pages[0];

  // Palette colors
  const palette = [
    { name: "먹물 블랙", hex: "#33222B" },
    { name: "코랄 핑크", hex: "#C76D91" },
    { name: "포레스트 그린", hex: "#4E7D46" },
    { name: "사파이어 블루", hex: "#2B5876" },
    { name: "로열 라벤더", hex: "#7B62A4" },
    { name: "형광 옐로우", hex: "#FACC15" },
    { name: "루비 레드", hex: "#E11D48" },
  ];

  // Redraw canvas with background template & vector strokes
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Draw Template Pattern
    const curTemplate = currentPage?.template || template;

    if (curTemplate === "grid") {
      ctx.strokeStyle = "#F0E4DE";
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (curTemplate === "lined") {
      ctx.strokeStyle = "#EAD7D0";
      ctx.lineWidth = 1;
      const lineSpacing = 32;
      for (let y = 48; y <= height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(width - 30, y);
        ctx.stroke();
      }
      // Red margin line
      ctx.strokeStyle = "#F8B4C9";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(70, 0);
      ctx.lineTo(70, height);
      ctx.stroke();
    }

    // Draw strokes
    const strokesToDraw = currentPage?.strokes || [];
    for (const stroke of strokesToDraw) {
      if (stroke.points.length < 2) continue;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = stroke.width * 2;
      } else if (stroke.tool === "highlighter") {
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width * 2.8;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [currentPage, template]);

  // Initial and reactive render
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas, activePageNum, activeNoteId]);

  // Setup Canvas resolution on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth || 800;
    const h = 720;
    canvas.width = w;
    canvas.height = h;
    renderCanvas();
  }, [renderCanvas]);

  // Pointer Events handling with Apple Pencil support
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Pen-only mode enforcement
    if (settings.penOnlyMode && e.pointerType !== "pen") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure || 0.5;

    isDrawingRef.current = true;
    currentStrokeRef.current = [{ x, y, pressure }];
    canvas.setPointerCapture(e.pointerId);

    // Save previous state to undo stack
    if (currentPage) {
      setUndoStack((prev) => [...prev, currentPage.strokes]);
      setRedoStack([]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    if (settings.penOnlyMode && e.pointerType !== "pen") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure || 0.5;

    currentStrokeRef.current.push({ x, y, pressure });

    // Live stroke drawing
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = strokeWidth * 2;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth * 2.8;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
    }

    const pts = currentStrokeRef.current;
    if (pts.length >= 2) {
      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current.length > 0 && currentNote && currentPage) {
      const newStroke: Stroke = {
        points: [...currentStrokeRef.current],
        color: strokeColor,
        width: strokeWidth,
        tool,
      };

      const updatedStrokes = [...currentPage.strokes, newStroke];
      const updatedPages = currentNote.pages.map((p) =>
        p.id === currentPage.id ? { ...p, strokes: updatedStrokes } : p
      );

      saveNote({
        ...currentNote,
        pages: updatedPages,
      });

      currentStrokeRef.current = [];
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (undoStack.length === 0 || !currentNote || !currentPage) return;
    const previousStrokes = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, currentPage.strokes]);
    setUndoStack((prev) => prev.slice(0, -1));

    const updatedPages = currentNote.pages.map((p) =>
      p.id === currentPage.id ? { ...p, strokes: previousStrokes } : p
    );
    saveNote({ ...currentNote, pages: updatedPages });
    soundManager.playClick();
  };

  const handleRedo = () => {
    if (redoStack.length === 0 || !currentNote || !currentPage) return;
    const nextStrokes = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, currentPage.strokes]);
    setRedoStack((prev) => prev.slice(0, -1));

    const updatedPages = currentNote.pages.map((p) =>
      p.id === currentPage.id ? { ...p, strokes: nextStrokes } : p
    );
    saveNote({ ...currentNote, pages: updatedPages });
    soundManager.playClick();
  };

  // Clear Page
  const handleClearPage = () => {
    if (!currentNote || !currentPage) return;
    setUndoStack((prev) => [...prev, currentPage.strokes]);
    const updatedPages = currentNote.pages.map((p) =>
      p.id === currentPage.id ? { ...p, strokes: [] } : p
    );
    saveNote({ ...currentNote, pages: updatedPages });
    soundManager.playPop();
  };

  // Add Page
  const handleAddPage = () => {
    if (!currentNote) return;
    const newPageNum = currentNote.pages.length + 1;
    const newPage: NotePage = {
      id: `p-${Date.now()}`,
      pageNumber: newPageNum,
      template,
      strokes: [],
    };
    saveNote({
      ...currentNote,
      pages: [...currentNote.pages, newPage],
    });
    setActivePageNum(newPageNum);
    soundManager.playPop();
  };

  // Export as PNG
  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${currentNote?.title || "합격의숲_손필기"}_p${activePageNum}.png`;
    link.href = dataUrl;
    link.click();
    soundManager.playLevelUp();
  };

  // Create new note
  const handleCreateNewNote = (subId: SubjectId) => {
    const newNote: HandwrittenNote = {
      id: `note-${Date.now()}`,
      title: `${SUBJECTS[subId].nameKr} 백지 복습 노트`,
      subjectId: subId,
      topic: "핵심 개념 백지화",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      pages: [
        {
          id: `p-${Date.now()}`,
          pageNumber: 1,
          template: "grid",
          strokes: [],
        },
      ],
    };
    saveNote(newNote);
    setActiveNoteId(newNote.id);
    setActivePageNum(1);
    soundManager.playPop();
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-forest-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-forest-text">손필기 노트</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              iPad Air 11" & Apple Pencil 최적화
            </span>
          </div>
          <p className="text-xs text-forest-text-muted mt-0.5">
            포인터 이벤트 기반 백지 복습 및 오답 필기 (팜 리젝션 & 벡터 스트로크 영구 보관)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Pen-Only Palm Rejection Toggle */}
          <button
            onClick={() =>
              updateSettings({ penOnlyMode: !settings.penOnlyMode })
            }
            className={`px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 btn-bubbly ${
              settings.penOnlyMode
                ? "bg-purple-100 border-purple-300 text-purple-900 shadow-sm"
                : "bg-forest-warm/50 border-forest-border text-forest-text-muted hover:bg-forest-warm"
            }`}
            title="손바닥 터치 오작동 방지 (Apple Pencil만 필기 허용)"
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>펜 전용 모드: {settings.penOnlyMode ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={handleExportPng}
            className="px-3.5 py-1.5 rounded-2xl bg-forest-pink/30 hover:bg-forest-pink text-forest-pink-dark font-bold text-xs transition-all flex items-center gap-1.5 btn-bubbly"
          >
            <Download className="w-4 h-4" />
            <span>PNG 저장</span>
          </button>
        </div>
      </div>

      {/* Main Workbench Layout: Left Note Selector + Center Canvas Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Notes List / Sidebar */}
        <div className="bg-white rounded-3xl p-4 border border-forest-border shadow-soft space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between pb-2 border-b border-forest-border">
            <span className="text-xs font-bold text-forest-text">내 필기 노트 목록</span>
            <div className="flex gap-1">
              {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((sid) => (
                <button
                  key={sid}
                  onClick={() => handleCreateNewNote(sid)}
                  className="p-1 rounded-lg bg-forest-warm hover:bg-forest-pink/30 text-[10px] font-bold"
                  title={`${SUBJECTS[sid].nameKr} 새 노트`}
                >
                  +{SUBJECTS[sid].nameKr.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {notes.map((n) => {
              const isSelected = n.id === activeNoteId;
              const sub = SUBJECTS[n.subjectId];
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setActiveNoteId(n.id);
                    setActivePageNum(1);
                    soundManager.playClick();
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left transition-all btn-bubbly ${
                    isSelected
                      ? "bg-forest-pink/20 border-forest-pink text-forest-pink-dark font-bold"
                      : "bg-forest-warm/30 border-forest-border hover:bg-forest-warm text-forest-text"
                  }`}
                >
                  <div className="text-[10px] font-bold text-forest-text-muted">{sub.nameKr}</div>
                  <div className="text-xs font-semibold truncate">{n.title}</div>
                  <div className="text-[9px] text-forest-text-muted mt-0.5">
                    {n.pages.length}페이지 · {n.updatedAt?.slice(5, 10)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Canvas Area & Toolbox */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-forest-border shadow-soft lg:col-span-3 space-y-4">
          {/* Floating Apple Pencil Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-forest-warm/60 p-2.5 rounded-2xl border border-forest-border">
            {/* Tools: Pen, Highlighter, Eraser */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-forest-border">
              <button
                onClick={() => {
                  setTool("pen");
                  soundManager.playClick();
                }}
                className={`p-2 rounded-lg transition-all ${
                  tool === "pen"
                    ? "bg-forest-pink text-white font-bold shadow-sm"
                    : "text-forest-text hover:bg-forest-warm"
                }`}
                title="펜"
              >
                <PenTool className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setTool("highlighter");
                  soundManager.playClick();
                }}
                className={`p-2 rounded-lg transition-all ${
                  tool === "highlighter"
                    ? "bg-forest-pink text-white font-bold shadow-sm"
                    : "text-forest-text hover:bg-forest-warm"
                }`}
                title="형광펜"
              >
                <Highlighter className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setTool("eraser");
                  soundManager.playClick();
                }}
                className={`p-2 rounded-lg transition-all ${
                  tool === "eraser"
                    ? "bg-forest-pink text-white font-bold shadow-sm"
                    : "text-forest-text hover:bg-forest-warm"
                }`}
                title="지우개"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              {palette.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setStrokeColor(c.hex);
                    soundManager.playClick();
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    strokeColor === c.hex ? "scale-125 border-forest-pink-dark shadow-sm" : "border-white"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            {/* Stroke Width Slider */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-forest-text-muted">두께</span>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-20 accent-forest-pink"
              />
              <span className="w-4 text-center font-bold text-[10px]">{strokeWidth}</span>
            </div>

            {/* Template selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-forest-border">
              <button
                onClick={() => {
                  setTemplate("grid");
                  soundManager.playClick();
                }}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  template === "grid" ? "bg-forest-pink/20 text-forest-pink-dark font-bold" : "text-forest-text-muted"
                }`}
                title="모눈 노트"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">모눈</span>
              </button>
              <button
                onClick={() => {
                  setTemplate("lined");
                  soundManager.playClick();
                }}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  template === "lined" ? "bg-forest-pink/20 text-forest-pink-dark font-bold" : "text-forest-text-muted"
                }`}
                title="줄 노트"
              >
                <AlignJustify className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">줄</span>
              </button>
              <button
                onClick={() => {
                  setTemplate("blank");
                  soundManager.playClick();
                }}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  template === "blank" ? "bg-forest-pink/20 text-forest-pink-dark font-bold" : "text-forest-text-muted"
                }`}
                title="무제 노트"
              >
                <Square className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">백지</span>
              </button>
            </div>

            {/* Undo / Redo & Clear */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                className="p-1.5 rounded-lg text-forest-text-muted hover:bg-white"
                title="실행 취소"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                className="p-1.5 rounded-lg text-forest-text-muted hover:bg-white"
                title="다시 실행"
              >
                <Redo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearPage}
                className="p-1.5 rounded-lg text-forest-text-muted hover:bg-rose-50 hover:text-rose-600"
                title="전체 지우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Viewport (touch-action: none prevents iPad safari scroll during writing) */}
          <div className="relative rounded-2xl overflow-hidden border border-forest-border bg-white shadow-inner flex justify-center canvas-container">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full cursor-crosshair block"
              style={{ touchAction: "none" }}
            />
          </div>

          {/* Page Pagination Bottom Bar */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePageNum((prev) => Math.max(1, prev - 1))}
                disabled={activePageNum <= 1}
                className="p-1.5 rounded-lg bg-forest-warm hover:bg-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-forest-text">
                {activePageNum} / {currentNote?.pages.length || 1} 페이지
              </span>
              <button
                onClick={() =>
                  setActivePageNum((prev) =>
                    Math.min(currentNote?.pages.length || 1, prev + 1)
                  )
                }
                disabled={activePageNum >= (currentNote?.pages.length || 1)}
                className="p-1.5 rounded-lg bg-forest-warm hover:bg-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddPage}
              className="px-3 py-1.5 rounded-xl bg-forest-warm hover:bg-forest-pink/30 text-forest-text font-bold text-xs flex items-center gap-1 btn-bubbly"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 페이지 추가</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
