"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  color?: "primary" | "secondary" | "tertiary";
}

export function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  color = "primary",
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  const colorMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
  }[color];

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-[13px] text-outline font-medium">{label}</span>}
          {showPercentage && <span className="text-[13px] font-medium text-on-surface">{pct}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
        <div
          className={`h-full rounded-full ${colorMap} transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[12px] text-outline">{current} / {total}</span>
      </div>
    </div>
  );
}
