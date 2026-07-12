type TagLabelProps = {
  children: React.ReactNode;
};

export function TagLabel({ children }: TagLabelProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary-container px-3.5 py-1 text-[12px] font-medium tracking-[0.01em] text-on-secondary-container">
      {children}
    </span>
  );
}
