"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/lib/auth-context";
import { useProfile } from "@/lib/queries";
import { getLevel, getTier } from "@/lib/progression";
import { Zap, X, Award, ShieldAlert } from "lucide-react";

export function LevelUpCelebration() {
  const { user } = useUser();
  const { data: profile } = useProfile(user?.id);
  const [show, setShow] = useState(false);
  const [levelInfo, setLevelInfo] = useState({ oldLevel: 1, newLevel: 1 });

  const prevLevelRef = useRef<number | null>(null);

  useEffect(() => {
    if (!profile) return;
    const currentXP = profile.xp || 0;
    const currentLevel = getLevel(currentXP);

    if (prevLevelRef.current === null) {
      // First load, establish base level
      prevLevelRef.current = currentLevel;
      return;
    }

    if (currentLevel > prevLevelRef.current) {
      // Trigger celebration!
      setLevelInfo({
        oldLevel: prevLevelRef.current,
        newLevel: currentLevel,
      });
      setShow(true);
      prevLevelRef.current = currentLevel;

      // Auto-dismiss after 6 seconds
      const timer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(timer);
    } else if (currentLevel < prevLevelRef.current) {
      // Safe fallback if XP is reset or adjusted downwards
      prevLevelRef.current = currentLevel;
    }
  }, [profile]);

  if (!show) return null;

  const tier = getTier(levelInfo.newLevel);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl border border-outline-variant/30 bg-surface p-6 text-center shadow-2xl dark:border-white/[0.08] dark:bg-surface-container animate-scale-up">
        {/* Confetti falling animations mock */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-4 left-6 text-xl animate-bounce" style={{ animationDelay: "0s" }}>🎉</div>
          <div className="absolute top-12 right-8 text-xl animate-bounce" style={{ animationDelay: "0.4s" }}>✨</div>
          <div className="absolute top-24 left-12 text-lg animate-bounce" style={{ animationDelay: "0.2s" }}>🌟</div>
          <div className="absolute top-36 right-16 text-lg animate-bounce" style={{ animationDelay: "0.6s" }}>🏆</div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 rounded-xl p-1 text-outline hover:bg-surface-container-high hover:text-on-surface transition-colors"
          aria-label="Close panel"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="flex justify-center mt-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl animate-pulse shadow-md"
            style={{ backgroundColor: `${tier.color}15` }}
          >
            <Award size={36} style={{ color: tier.color }} />
          </div>
        </div>

        {/* Level Up Announcement */}
        <h2 className="font-display text-[24px] font-black text-on-surface mt-5 leading-tight">
          Level Up!
        </h2>
        <p className="text-[12px] font-bold text-outline uppercase tracking-wider mt-1">
          स्तर बढ़ गया है
        </p>

        {/* Level comparison */}
        <div className="my-6 flex items-center justify-center gap-4">
          <div className="rounded-xl border border-outline-variant/35 bg-surface-container-low px-4 py-2 dark:border-white/[0.04] dark:bg-white/[0.02]">
            <span className="block text-[11px] font-semibold text-outline">Level</span>
            <span className="text-[20px] font-bold text-outline/75">{levelInfo.oldLevel}</span>
          </div>
          <div className="text-primary font-bold text-xl animate-bounce">➔</div>
          <div
            className="rounded-xl px-5 py-2.5 shadow-sm border"
            style={{ borderColor: tier.color, backgroundColor: `${tier.color}08` }}
          >
            <span className="block text-[11px] font-bold uppercase tracking-wide" style={{ color: tier.color }}>
              Level
            </span>
            <span className="text-[24px] font-black" style={{ color: tier.color }}>
              {levelInfo.newLevel}
            </span>
          </div>
        </div>

        {/* Unlocked Tier Badge */}
        <div className="rounded-2xl bg-surface-container p-4 border border-outline-variant/15 dark:border-white/[0.04]">
          <p className="text-[11px] font-semibold text-outline mb-1.5">Unlocked Badge Rank</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">{tier.badgeEmoji}</span>
            <span className="font-display text-[16px] font-bold text-on-surface">
              {tier.name}
            </span>
            <span className="text-[11px] font-semibold text-outline">
              ({tier.hindiName})
            </span>
          </div>
        </div>

        {/* Motivational Line */}
        <p className="mt-6 text-[13.5px] font-medium text-outline">
          Your vocabulary acumen is reaching new heights. Keep studying!
        </p>

        {/* Claim button */}
        <button
          onClick={() => setShow(false)}
          className="mt-6 w-full h-11.5 rounded-xl font-bold text-on-primary text-[13.5px] shadow-md transition-all hover:opacity-95 active:scale-98"
          style={{ backgroundColor: tier.color }}
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
