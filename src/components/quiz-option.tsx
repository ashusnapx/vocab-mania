"use client";

import { Check, X } from "lucide-react";

interface QuizOptionProps {
  text: string;
  isCorrect: boolean;
  selected: boolean;
  revealed: boolean;
  onClick: () => void;
}

export function QuizOption({ text, isCorrect, selected, revealed, onClick }: QuizOptionProps) {
  const getStyle = () => {
    if (!revealed) {
      if (selected) return "border-primary bg-primary/10 text-primary";
      return "border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 text-on-surface";
    }
    if (isCorrect) return "border-green-500 bg-green-50 text-green-700";
    if (selected && !isCorrect) return "border-red-500 bg-red-50 text-red-600";
    return "border-outline-variant/20 bg-surface-hover/50 text-outline opacity-50";
  };

  const getIcon = () => {
    if (!revealed || !selected) return null;
    if (isCorrect) return <Check size={16} className="text-green-600" />;
    return <X size={16} className="text-red-500" />;
  };

  return (
    <button
      onClick={!revealed ? onClick : undefined}
      disabled={revealed}
      className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left text-[15px] font-medium transition-all ${getStyle()}`}
    >
      <span className="flex-1">{text}</span>
      {getIcon()}
    </button>
  );
}
