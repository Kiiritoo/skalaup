import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  userName?: string;
  unreadMessages?: number;
}

export function DashboardHeader({
  title,
  description,
  userName,
  unreadMessages = 0,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        {description && (
          <p className="text-zinc-500 mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {unreadMessages > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 border border-violet-100">
            <Bell className="h-4 w-4 text-violet-600" />
            <span className="text-sm text-violet-700">
              {unreadMessages} pesan baru
            </span>
          </div>
        )}
        {userName && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-zinc-900">{userName}</p>
              <Badge variant="secondary" className="text-[10px]">
                Admin
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
