type TagLabelProps = {
  children: React.ReactNode;
};

export function TagLabel({ children }: TagLabelProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-violet-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-violet-primary dark:bg-[#a78bfa]/10 dark:text-[#a78bfa]">
      {children}
    </span>
  );
}
