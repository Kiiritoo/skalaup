import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="text-sm font-medium text-zinc-600 mt-1">{title}</p>
      {description && (
        <p className="text-xs text-zinc-400 mt-1">{description}</p>
      )}
    </div>
  );
}
