import React from "react";
import { SubjectId } from "@/lib/types";

interface BuildingProps {
  buildingId: SubjectId | "cherry_tree" | "flower_bed" | "bench" | "street_lamp" | "fountain" | "bookshelf";
  level?: number;
  className?: string;
}

export function BuildingIllustration({ buildingId, level = 1, className = "" }: BuildingProps) {
  if (buildingId === "criminal_law") {
    // 📚 형사법 도서관 (Pastel pink roof, arched books, cozy chimney)
    return (
      <div className={`relative inline-block ${className}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          {/* Base Ground */}
          <ellipse cx="60" cy="105" rx="50" ry="12" fill="#E8D9CD" opacity="0.6" />

          {/* Chimney */}
          <rect x="80" y="25" width="14" height="25" rx="3" fill="#D88A9F" stroke="#B9677C" strokeWidth="2" />
          {/* Smoke puffs */}
          <circle cx="87" cy="18" r="4" fill="#FFFFFF" opacity="0.8" />
          <circle cx="91" cy="11" r="5" fill="#FFFFFF" opacity="0.6" />

          {/* Main Walls */}
          <rect x="25" y="48" width="70" height="55" rx="6" fill="#FFF2F5" stroke="#F3B8CC" strokeWidth="3" />

          {/* Arched Roof */}
          <path d="M 15 50 Q 60 15 105 50 Z" fill="#F3B8CC" stroke="#C76D91" strokeWidth="3" />
          {/* Roof tiles pattern */}
          <path d="M 28 42 Q 60 22 92 42" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />

          {/* Library Signboard */}
          <rect x="42" y="38" width="36" height="12" rx="4" fill="#FFF" stroke="#C76D91" strokeWidth="1.5" />
          <text x="60" y="46" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#C76D91">
            형사법 도서관
          </text>

          {/* Windows with book silhouettes */}
          <rect x="33" y="60" width="16" height="18" rx="4" fill="#FFF" stroke="#E8B0C4" strokeWidth="2" />
          <line x1="33" y1="69" x2="49" y2="69" stroke="#E8B0C4" strokeWidth="1.5" />
          <line x1="41" y1="60" x2="41" y2="78" stroke="#E8B0C4" strokeWidth="1.5" />

          <rect x="71" y="60" width="16" height="18" rx="4" fill="#FFF" stroke="#E8B0C4" strokeWidth="2" />
          <line x1="71" y1="69" x2="87" y2="69" stroke="#E8B0C4" strokeWidth="1.5" />
          <line x1="79" y1="60" x2="79" y2="78" stroke="#E8B0C4" strokeWidth="1.5" />

          {/* Wooden Door */}
          <rect x="51" y="68" width="18" height="35" rx="4" fill="#D7BEA8" stroke="#A68368" strokeWidth="2" />
          <circle cx="55" cy="85" r="2" fill="#FFEAA7" />

          {/* Level Star Badge */}
          <g transform="translate(85, 78)">
            <circle cx="12" cy="12" r="10" fill="#FFD166" stroke="#FFFFFF" strokeWidth="2" />
            <text x="12" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#784B12">
              ★{level}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (buildingId === "police_studies") {
    // 🐻 경찰학 경찰서 (Soft green & blue tones, rotating police light beacon, shield badge)
    return (
      <div className={`relative inline-block ${className}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          {/* Base Ground */}
          <ellipse cx="60" cy="105" rx="50" ry="12" fill="#D9E6D5" opacity="0.6" />

          {/* Roof Light Beacon */}
          <rect x="55" y="20" width="10" height="7" rx="2" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
          <circle cx="60" cy="16" r="5" fill="#E74C3C" opacity="0.8" />
          <line x1="50" y1="12" x2="44" y2="9" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" />
          <line x1="70" y1="12" x2="76" y2="9" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" />

          {/* Modern Police Station Building Roof */}
          <polygon points="60,25 20,48 100,48" fill="#B9D5B0" stroke="#7BA372" strokeWidth="3" />
          <path d="M 32 44 L 60 29 L 88 44" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />

          {/* Main Walls */}
          <rect x="26" y="48" width="68" height="55" rx="6" fill="#F4FAF2" stroke="#B9D5B0" strokeWidth="3" />

          {/* Police Station Sign */}
          <rect x="40" y="44" width="40" height="13" rx="4" fill="#3B5998" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="60" y="53" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#FFFFFF">
            경찰학 치안센터
          </text>

          {/* Badge Logo */}
          <polygon points="60,60 66,66 60,73 54,66" fill="#F1C40F" stroke="#D4AC0D" strokeWidth="1" />

          {/* Glass Doors */}
          <rect x="48" y="70" width="24" height="33" rx="4" fill="#D4E6F1" stroke="#5499C7" strokeWidth="2" />
          <line x1="60" y1="70" x2="60" y2="103" stroke="#5499C7" strokeWidth="1.5" />

          {/* Windows */}
          <rect x="31" y="62" width="14" height="15" rx="3" fill="#EAF2F8" stroke="#85929E" strokeWidth="1.5" />
          <rect x="75" y="62" width="14" height="15" rx="3" fill="#EAF2F8" stroke="#85929E" strokeWidth="1.5" />

          {/* Level Star Badge */}
          <g transform="translate(85, 78)">
            <circle cx="12" cy="12" r="10" fill="#FFD166" stroke="#FFFFFF" strokeWidth="2" />
            <text x="12" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#784B12">
              ★{level}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (buildingId === "constitution") {
    // 🐱 헌법 법원 (Lavender roof, neoclassical pillars, scales of justice)
    return (
      <div className={`relative inline-block ${className}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          {/* Base Ground */}
          <ellipse cx="60" cy="105" rx="50" ry="12" fill="#DFD7E8" opacity="0.6" />

          {/* Triangular Pediment */}
          <polygon points="60,20 16,45 104,45" fill="#D8C9ED" stroke="#9A83BA" strokeWidth="3" />
          {/* Pediment Scales of Justice Icon */}
          <circle cx="60" cy="33" r="2.5" fill="#9A83BA" />
          <line x1="53" y1="35" x2="67" y2="35" stroke="#9A83BA" strokeWidth="1.5" />
          <polygon points="50,38 56,38 53,42" fill="#FFD166" />
          <polygon points="64,38 70,38 67,42" fill="#FFD166" />

          {/* Main Walls */}
          <rect x="22" y="45" width="76" height="58" rx="4" fill="#FAF7FC" stroke="#D8C9ED" strokeWidth="3" />

          {/* Neoclassical Pillars */}
          <rect x="27" y="46" width="9" height="52" rx="2" fill="#EFE8F7" stroke="#BAA5D8" strokeWidth="1.5" />
          <rect x="43" y="46" width="9" height="52" rx="2" fill="#EFE8F7" stroke="#BAA5D8" strokeWidth="1.5" />
          <rect x="68" y="46" width="9" height="52" rx="2" fill="#EFE8F7" stroke="#BAA5D8" strokeWidth="1.5" />
          <rect x="84" y="46" width="9" height="52" rx="2" fill="#EFE8F7" stroke="#BAA5D8" strokeWidth="1.5" />

          {/* Grand Arch Door */}
          <path d="M 54 98 L 54 68 Q 60 60 66 68 L 66 98 Z" fill="#7B62A4" stroke="#543C78" strokeWidth="2" />
          <circle cx="57" cy="80" r="1.5" fill="#FFD166" />

          {/* Level Star Badge */}
          <g transform="translate(85, 78)">
            <circle cx="12" cy="12" r="10" fill="#FFD166" stroke="#FFFFFF" strokeWidth="2" />
            <text x="12" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#784B12">
              ★{level}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Decorations
  if (buildingId === "cherry_tree") {
    return (
      <div className={`relative inline-block ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="46" y="55" width="8" height="35" rx="3" fill="#9C6644" />
          <ellipse cx="50" cy="40" rx="32" ry="26" fill="#F8B4C9" opacity="0.9" />
          <ellipse cx="38" cy="32" rx="20" ry="18" fill="#F38BA8" opacity="0.8" />
          <ellipse cx="62" cy="34" rx="22" ry="18" fill="#FCE7ED" opacity="0.9" />
          <circle cx="48" cy="24" r="16" fill="#FFCCD5" />
          {/* Falling Petals */}
          <ellipse cx="28" cy="65" rx="3" ry="1.5" fill="#F38BA8" transform="rotate(25 28 65)" />
          <ellipse cx="72" cy="70" rx="3.5" ry="2" fill="#F8B4C9" transform="rotate(-30 72 70)" />
        </svg>
      </div>
    );
  }

  if (buildingId === "flower_bed") {
    return (
      <div className={`relative inline-block ${className}`}>
        <svg viewBox="0 0 100 80" className="w-full h-full">
          <ellipse cx="50" cy="55" rx="42" ry="14" fill="#8B5E3C" opacity="0.3" />
          <rect x="15" y="42" width="70" height="20" rx="8" fill="#D7BEA8" stroke="#A47E5B" strokeWidth="2" />
          {/* Tulips */}
          <path d="M 28 42 Q 28 28 34 24 Q 40 28 40 42 Z" fill="#FF6B6B" />
          <path d="M 45 42 Q 45 25 50 21 Q 55 25 55 42 Z" fill="#FFE66D" />
          <path d="M 62 42 Q 62 28 67 24 Q 72 28 72 42 Z" fill="#FF85A1" />
        </svg>
      </div>
    );
  }

  if (buildingId === "bench") {
    return (
      <div className={`relative inline-block ${className}`}>
        <svg viewBox="0 0 100 80" className="w-full h-full">
          <ellipse cx="50" cy="62" rx="38" ry="10" fill="#000" opacity="0.1" />
          <rect x="20" y="32" width="60" height="8" rx="2" fill="#B08968" stroke="#7F5539" strokeWidth="1.5" />
          <rect x="20" y="44" width="60" height="8" rx="2" fill="#B08968" stroke="#7F5539" strokeWidth="1.5" />
          {/* Bench Legs */}
          <line x1="28" y1="44" x2="24" y2="64" stroke="#4A3728" strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="44" x2="76" y2="64" stroke="#4A3728" strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="32" x2="26" y2="44" stroke="#4A3728" strokeWidth="3" />
          <line x1="74" y1="32" x2="74" y2="44" stroke="#4A3728" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  if (buildingId === "street_lamp") {
    return (
      <div className={`relative inline-block ${className}`}>
        <svg viewBox="0 0 80 100" className="w-full h-full">
          <ellipse cx="40" cy="90" rx="18" ry="5" fill="#000" opacity="0.15" />
          <line x1="40" y1="28" x2="40" y2="90" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
          <polygon points="28,26 52,26 46,14 34,14" fill="#FBBF24" opacity="0.9" />
          <polygon points="26,14 54,14 40,6" fill="#1F2937" stroke="#111827" strokeWidth="1" />
          {/* Gentle glow aura */}
          <circle cx="40" cy="20" r="16" fill="#FEF08A" opacity="0.35" />
        </svg>
      </div>
    );
  }

  // Fountain
  return (
    <div className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="75" rx="42" ry="16" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="2.5" />
        <ellipse cx="50" cy="74" rx="35" ry="11" fill="#7DD3FC" />
        {/* Tier */}
        <ellipse cx="50" cy="52" rx="24" ry="9" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
        <line x1="50" y1="52" x2="50" y2="74" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
        {/* Water Spout */}
        <path d="M 50 48 Q 44 26 38 42" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 50 48 Q 56 26 62 42" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
