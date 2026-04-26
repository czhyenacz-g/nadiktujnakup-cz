import type { ReactNode } from "react";

type StatusTone = "info" | "success" | "warning" | "error";

interface StatusMessageProps {
  children: ReactNode;
  tone?: StatusTone;
}

const toneClasses: Record<StatusTone, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-rose-200 bg-rose-50 text-rose-900",
};

// Compact feedback block for validation, browser support, and cart status.
export function StatusMessage({ children, tone = "info" }: StatusMessageProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm leading-6 ${toneClasses[tone]}`}>
      {children}
    </div>
  );
}
