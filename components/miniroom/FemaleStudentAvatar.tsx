"use client";

import React from "react";

interface FemaleStudentAvatarProps {
  outfit?: string; // "student_hoodie" | "school_vest" | "police_trial"
  hasGlasses?: boolean;
  hasRibbon?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isDragging?: boolean;
}

export function FemaleStudentAvatar({
  outfit = "student_hoodie",
  hasGlasses = false,
  hasRibbon = false,
  size = "md",
  className = "",
  isDragging = false,
}: FemaleStudentAvatarProps) {
  const sizeClasses = {
    sm: "w-12 h-16",
    md: "w-16 h-24",
    lg: "w-20 h-32",
    xl: "w-28 h-40",
  };

  return (
    <div
      className={`relative inline-block select-none ${sizeClasses[size]} ${
        isDragging ? "scale-110 drop-shadow-xl" : "drop-shadow-md"
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 140"
        className="w-full h-full overflow-visible transition-transform duration-150"
      >
        {/* Soft Ground Shadow */}
        <ellipse cx="50" cy="132" rx="24" ry="6" fill="#000000" opacity="0.18" />

        {/* --- LEGS & SHOES --- */}
        {/* Legs */}
        <rect x="40" y="96" width="7" height="24" rx="3" fill="#F8D7C4" />
        <rect x="53" y="96" width="7" height="24" rx="3" fill="#F8D7C4" />
        {/* White Socks */}
        <rect x="39.5" y="110" width="8" height="10" rx="2" fill="#FFFFFF" />
        <rect x="52.5" y="110" width="8" height="10" rx="2" fill="#FFFFFF" />
        {/* Cute Sneakers / Slippers */}
        <ellipse cx="43" cy="123" rx="6.5" ry="4" fill="#F38BA8" />
        <ellipse cx="57" cy="123" rx="6.5" ry="4" fill="#F38BA8" />
        <ellipse cx="43" cy="121" rx="4" ry="2" fill="#FFFFFF" />
        <ellipse cx="57" cy="121" rx="4" ry="2" fill="#FFFFFF" />

        {/* --- OUTFIT BODY & TORSO --- */}
        {outfit === "police_trial" ? (
          // 👮‍♀️ Police Uniform Trial
          <g>
            {/* Dark Navy Pleated Skirt */}
            <path d="M 36 82 L 64 82 L 68 98 L 32 98 Z" fill="#2C3E50" stroke="#1A252F" strokeWidth="1.2" />
            <line x1="44" y1="82" x2="43" y2="98" stroke="#1A252F" strokeWidth="1" />
            <line x1="56" y1="82" x2="57" y2="98" stroke="#1A252F" strokeWidth="1" />

            {/* Police Uniform Jacket */}
            <path d="M 32 54 L 68 54 L 65 83 L 35 83 Z" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
            {/* White Collar & Navy Tie */}
            <polygon points="44,54 50,62 46,54" fill="#FFFFFF" />
            <polygon points="56,54 50,62 54,54" fill="#FFFFFF" />
            <polygon points="48,60 52,60 51,74 49,74" fill="#2C3E50" />
            {/* Golden Police Badge */}
            <polygon points="40,64 42,67 40,70 38,67" fill="#F1C40F" />
            {/* Golden Buttons */}
            <circle cx="50" cy="74" r="1.5" fill="#F1C40F" />
            <circle cx="50" cy="80" r="1.5" fill="#F1C40F" />

            {/* Arms */}
            <path d="M 32 56 Q 26 68 32 78" fill="none" stroke="#34495E" strokeWidth="6" strokeLinecap="round" />
            <circle cx="32" cy="78" r="3.5" fill="#F8D7C4" />
            <path d="M 68 56 Q 74 68 68 78" fill="none" stroke="#34495E" strokeWidth="6" strokeLinecap="round" />
            <circle cx="68" cy="78" r="3.5" fill="#F8D7C4" />
          </g>
        ) : outfit === "school_vest" ? (
          // 👔 Neat Collared Shirt & Pastel Green Knit Vest
          <g>
            {/* Navy Plaid Skirt */}
            <path d="M 36 82 L 64 82 L 67 97 L 33 97 Z" fill="#4B6584" stroke="#2C3E50" strokeWidth="1.2" />
            <line x1="44" y1="82" x2="43" y2="97" stroke="#384C63" strokeWidth="1" />
            <line x1="56" y1="82" x2="57" y2="97" stroke="#384C63" strokeWidth="1" />

            {/* Knit Vest */}
            <path d="M 34 54 L 66 54 L 63 83 L 37 83 Z" fill="#B9D5B0" stroke="#7BA675" strokeWidth="1.5" />
            {/* V-neck collar & shirt */}
            <polygon points="43,54 50,66 57,54" fill="#FFFFFF" />
            <polygon points="48,64 52,64 51,74 49,74" fill="#E74C3C" />

            {/* Arms */}
            <path d="M 34 56 Q 27 67 33 78" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="33" cy="78" r="3.5" fill="#F8D7C4" />
            <path d="M 66 56 Q 73 67 67 78" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="67" cy="78" r="3.5" fill="#F8D7C4" />
          </g>
        ) : (
          // 🧥 Student Pastel Pink Hoodie (Default)
          <g>
            {/* Cozy Grey Jogger Shorts / Skirt */}
            <path d="M 36 82 L 64 82 L 66 96 L 34 96 Z" fill="#7F8C8D" stroke="#5D6D7E" strokeWidth="1.2" />

            {/* Pastel Pink Hoodie */}
            <path d="M 33 53 L 67 53 L 65 84 L 35 84 Z" fill="#F3B8CC" stroke="#C76D91" strokeWidth="1.5" />
            {/* Hoodie pocket */}
            <path d="M 41 72 L 59 72 L 57 81 L 43 81 Z" fill="#EDB0C5" stroke="#C76D91" strokeWidth="1" />
            {/* Hoodie strings */}
            <line x1="47" y1="56" x2="47" y2="67" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="53" y1="56" x2="53" y2="67" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="47" cy="67.5" r="1.2" fill="#C76D91" />
            <circle cx="53" cy="67.5" r="1.2" fill="#C76D91" />

            {/* Cozy Sleeves & Hands holding a law note */}
            <path d="M 33 55 Q 26 66 32 76" fill="none" stroke="#F3B8CC" strokeWidth="6.5" strokeLinecap="round" />
            <circle cx="32" cy="76" r="3.5" fill="#F8D7C4" />
            <path d="M 67 55 Q 74 66 68 76" fill="none" stroke="#F3B8CC" strokeWidth="6.5" strokeLinecap="round" />
            <circle cx="68" cy="76" r="3.5" fill="#F8D7C4" />

            {/* Little law handbook in hands */}
            <rect x="44" y="70" width="12" height="15" rx="1.5" fill="#3B5998" stroke="#1E3799" strokeWidth="1" />
            <text x="50" y="80" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#FFFFFF">
              형법
            </text>
          </g>
        )}

        {/* --- HEAD & FACE --- */}
        {/* Neck */}
        <rect x="46" y="47" width="8" height="8" rx="2" fill="#F8D7C4" />

        {/* Back Hair */}
        <path d="M 28 32 C 26 56, 32 60, 36 62 L 64 62 C 68 60, 74 56, 72 32 Z" fill="#3D2B1F" />
        {/* Ponytail hint on the side */}
        <ellipse cx="28" cy="40" rx="6" ry="12" fill="#3D2B1F" transform="rotate(-15 28 40)" />

        {/* Face Oval */}
        <ellipse cx="50" cy="35" rx="19" ry="17" fill="#FCE8DC" />

        {/* Cheeks Blush (Cyworld style cute pink) */}
        <ellipse cx="38" cy="40" rx="4" ry="2.5" fill="#FF9EAA" opacity="0.65" />
        <ellipse cx="62" cy="40" rx="4" ry="2.5" fill="#FF9EAA" opacity="0.65" />

        {/* Sparkling Big Eyes */}
        <ellipse cx="42" cy="34" rx="2.8" ry="3.8" fill="#2C1D11" />
        <circle cx="41" cy="32.5" r="1.2" fill="#FFFFFF" />
        <ellipse cx="58" cy="34" rx="2.8" ry="3.8" fill="#2C1D11" />
        <circle cx="57" cy="32.5" r="1.2" fill="#FFFFFF" />

        {/* Cute Smile */}
        <path d="M 47 41 Q 50 44 53 41" fill="none" stroke="#9E6B55" strokeWidth="1.5" strokeLinecap="round" />

        {/* Front Hair Bangs (단정한 앞머리 & 옆머리) */}
        <path
          d="M 31 30 C 31 16, 69 16, 69 30 C 66 26, 60 27, 56 31 C 52 26, 46 26, 44 31 C 40 27, 34 26, 31 30 Z"
          fill="#4A3525"
        />
        {/* Side Bangs */}
        <path d="M 31 29 Q 29 44 33 48" fill="none" stroke="#4A3525" strokeWidth="3" strokeLinecap="round" />
        <path d="M 69 29 Q 71 44 67 48" fill="none" stroke="#4A3525" strokeWidth="3" strokeLinecap="round" />

        {/* Hair Shine Highlight */}
        <ellipse cx="50" cy="20" rx="10" ry="2" fill="#75563D" opacity="0.5" />

        {/* --- ACCESSORIES --- */}
        {/* Glasses (if equipped or outfit) */}
        {(hasGlasses || outfit === "study_glasses") && (
          <g>
            <circle cx="42" cy="34" r="5.5" fill="none" stroke="#33222B" strokeWidth="1.5" />
            <circle cx="58" cy="34" r="5.5" fill="none" stroke="#33222B" strokeWidth="1.5" />
            <line x1="47.5" y1="34" x2="52.5" y2="34" stroke="#33222B" strokeWidth="1.5" />
          </g>
        )}

        {/* Cherry Ribbon Pin */}
        {(hasRibbon || outfit === "cherry_ribbon") && (
          <g transform="translate(62, 18)">
            <ellipse cx="0" cy="0" rx="3.5" ry="2" fill="#FF758F" transform="rotate(-20)" />
            <ellipse cx="5" cy="0" rx="3.5" ry="2" fill="#FF758F" transform="rotate(20)" />
            <circle cx="2.5" cy="0" r="2" fill="#FFEAA7" />
          </g>
        )}
      </svg>
    </div>
  );
}
