import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

interface UpdateBannerProps {
  show: boolean;
  message?: string;
  onRefresh: () => void;
  onDismiss: () => void;
}

export const UpdateNotificationBanner: React.FC<UpdateBannerProps> = ({
  show,
  message = 'มีการอัปเดตข้อมูลหรือผลการตรวจใหม่จากระบบ',
  onRefresh,
  onDismiss
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounceIn max-w-md w-full px-4">
      <div className="bg-slate-900/95 text-white border-2 border-blue-500/80 shadow-2xl rounded-2xl p-3.5 flex items-center justify-between gap-3 backdrop-blur-md ring-4 ring-blue-500/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/30 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>พบการเปลี่ยนแปลงข้อมูล</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-[11px] text-slate-300 truncate">
              {message}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onRefresh}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเฟรชทันที</span>
          </button>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="ปิดการแจ้งเตือน"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

