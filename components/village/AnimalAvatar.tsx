import React from "react";
import { SubjectId } from "@/lib/types";

interface AnimalAvatarProps {
  subjectId?: SubjectId;
  animal?: "rabbit" | "bear" | "cat";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  mood?: "happy" | "reading" | "cheering" | "proud";
}

export function AnimalAvatar({
  subjectId,
  animal = "rabbit",
  size = "md",
  className = "",
  mood = "happy",
}: AnimalAvatarProps) {
  const chosenAnimal =
    animal ||
    (subjectId === "criminal_law"
      ? "rabbit"
      : subjectId === "police_studies"
      ? "bear"
      : "cat");

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  if (chosenAnimal === "rabbit") {
    // 🐰 Bomi the Bunny (Criminal Law / 형사법)
    return (
      <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Long Ears */}
          <ellipse cx="36" cy="22" rx="10" ry="22" fill="#FCE7ED" stroke="#F3B8CC" strokeWidth="3" transform="rotate(-8 36 22)" />
          <ellipse cx="36" cy="22" rx="5" ry="14" fill="#F8B4C9" transform="rotate(-8 36 22)" />
          <ellipse cx="64" cy="22" rx="10" ry="22" fill="#FCE7ED" stroke="#F3B8CC" strokeWidth="3" transform="rotate(8 64 22)" />
          <ellipse cx="64" cy="22" rx="5" ry="14" fill="#F8B4C9" transform="rotate(8 64 22)" />

          {/* Head */}
          <ellipse cx="50" cy="58" rx="34" ry="30" fill="#FFF8FA" stroke="#F3B8CC" strokeWidth="3" />

          {/* Cheeks blush */}
          <ellipse cx="30" cy="64" rx="6" ry="4" fill="#F9A8C0" opacity="0.6" />
          <ellipse cx="70" cy="64" rx="6" ry="4" fill="#F9A8C0" opacity="0.6" />

          {/* Eyes (Cute Animal Crossing style sparkles) */}
          <ellipse cx="38" cy="54" rx="4.5" ry="5.5" fill="#51454A" />
          <circle cx="36.5" cy="52" r="1.5" fill="#FFFFFF" />
          <ellipse cx="62" cy="54" rx="4.5" ry="5.5" fill="#51454A" />
          <circle cx="60.5" cy="52" r="1.5" fill="#FFFFFF" />

          {/* Glasses for reading (Criminal Law student style) */}
          <circle cx="38" cy="54" r="9" fill="none" stroke="#C76D91" strokeWidth="2.5" />
          <circle cx="62" cy="54" r="9" fill="none" stroke="#C76D91" strokeWidth="2.5" />
          <line x1="47" y1="54" x2="53" y2="54" stroke="#C76D91" strokeWidth="2.5" />

          {/* Nose & Mouth */}
          <polygon points="50,62 47,59 53,59" fill="#E882A3" />
          <path d="M 46 64 Q 50 67 54 64" fill="none" stroke="#7A5665" strokeWidth="2" strokeLinecap="round" />

          {/* Little Ribbon / Bookmark */}
          <circle cx="50" cy="27" r="4" fill="#C76D91" />
        </svg>
      </div>
    );
  }

  if (chosenAnimal === "bear") {
    // 🐻 Gomsoon the Bear (Police Studies / 경찰학)
    return (
      <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Round Ears */}
          <circle cx="28" cy="30" r="13" fill="#D7BEA8" stroke="#B89B82" strokeWidth="3" />
          <circle cx="28" cy="30" r="7" fill="#E8D7C8" />
          <circle cx="72" cy="30" r="13" fill="#D7BEA8" stroke="#B89B82" strokeWidth="3" />
          <circle cx="72" cy="30" r="7" fill="#E8D7C8" />

          {/* Police Officer Hat */}
          <path d="M 28 32 C 28 16, 72 16, 72 32 Z" fill="#4B6584" />
          <ellipse cx="50" cy="33" rx="28" ry="6" fill="#2C3A47" />
          {/* Golden Police Badge on Hat */}
          <polygon points="50,22 53,26 57,26 54,29 55,33 50,30 45,33 46,29 43,26 47,26" fill="#F1C40F" />

          {/* Bear Head */}
          <circle cx="50" cy="58" r="32" fill="#E2CEBA" stroke="#B89B82" strokeWidth="3" />

          {/* Muzzle */}
          <ellipse cx="50" cy="65" rx="14" ry="11" fill="#FFF2DB" />

          {/* Eyes */}
          <circle cx="36" cy="53" r="4" fill="#4A3B32" />
          <circle cx="35" cy="51.5" r="1.2" fill="#FFFFFF" />
          <circle cx="64" cy="53" r="4" fill="#4A3B32" />
          <circle cx="63" cy="51.5" r="1.2" fill="#FFFFFF" />

          {/* Cheeks blush */}
          <circle cx="26" cy="63" r="5" fill="#F6B297" opacity="0.6" />
          <circle cx="74" cy="63" r="5" fill="#F6B297" opacity="0.6" />

          {/* Nose & Smile */}
          <ellipse cx="50" cy="62" rx="4.5" ry="3.5" fill="#4A3B32" />
          <path d="M 46 66 Q 50 70 54 66" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 🐱 Nabi the Cat (Constitution / 헌법)
  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        {/* Pointy Cat Ears */}
        <polygon points="20,44 26,16 46,32" fill="#EADBF5" stroke="#C4A8E0" strokeWidth="3" />
        <polygon points="24,40 28,21 42,32" fill="#F4ECFB" />
        <polygon points="80,44 74,16 54,32" fill="#EADBF5" stroke="#C4A8E0" strokeWidth="3" />
        <polygon points="76,40 72,21 58,32" fill="#F4ECFB" />

        {/* Head */}
        <circle cx="50" cy="56" r="32" fill="#FAF6FF" stroke="#C4A8E0" strokeWidth="3" />

        {/* Cheeks blush */}
        <ellipse cx="28" cy="63" rx="6" ry="4" fill="#E8B8DE" opacity="0.6" />
        <ellipse cx="72" cy="63" rx="6" ry="4" fill="#E8B8DE" opacity="0.6" />

        {/* Whiskers */}
        <line x1="20" y1="60" x2="32" y2="61" stroke="#9E8AB8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="20" y1="65" x2="31" y2="64" stroke="#9E8AB8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="80" y1="60" x2="68" y2="61" stroke="#9E8AB8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="80" y1="65" x2="69" y2="64" stroke="#9E8AB8" strokeWidth="1.8" strokeLinecap="round" />

        {/* Big Smart Cat Eyes */}
        <ellipse cx="38" cy="52" rx="5" ry="6" fill="#4B3968" />
        <circle cx="36.5" cy="50" r="1.8" fill="#FFFFFF" />
        <ellipse cx="62" cy="52" rx="5" ry="6" fill="#4B3968" />
        <circle cx="60.5" cy="50" r="1.8" fill="#FFFFFF" />

        {/* Tiny Nose & Cat Mouth */}
        <polygon points="50,60 47.5,58 52.5,58" fill="#9E8AB8" />
        <path d="M 46 62 Q 50 64 50 62 Q 50 64 54 62" fill="none" stroke="#7E689C" strokeWidth="2" strokeLinecap="round" />

        {/* Golden Crown / Scales of Justice symbol on forehead */}
        <polygon points="46,36 50,30 54,36 52,40 48,40" fill="#FFD166" stroke="#E5B942" strokeWidth="1" />
      </svg>
    </div>
  );
}
