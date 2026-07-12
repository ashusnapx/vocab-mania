import Link from "next/link";

type PillButtonProps = {
  label: string;
  href: string;
  variant?: "filled" | "tonal" | "outlined" | "text";
  size?: "sm" | "md" | "lg";
};

const variants = {
  filled: "bg-md-primary text-md-on-primary shadow-sm hover:bg-md-primary/90 hover:shadow-md",
  tonal: "bg-md-secondary-container text-md-on-secondary-container hover:bg-md-secondary-container/80",
  outlined: "border border-md-outline bg-transparent text-md-primary hover:bg-md-primary/8",
  text: "bg-transparent text-md-primary hover:bg-md-primary/8",
};

const sizes = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-10 px-6 text-[14px]",
  lg: "h-12 px-8 text-[16px]",
};

export function PillButton({
  label,
  href,
  variant = "filled",
  size = "md",
}: PillButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2 active:scale-95 ${variants[variant]} ${sizes[size]}`}
    >
      {label}
    </Link>
  );
}
