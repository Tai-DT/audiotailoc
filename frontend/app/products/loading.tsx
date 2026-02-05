import { Music4 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center gap-8">
      <div className="relative w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center">
        <Music4 className="w-10 h-10 text-primary" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold tracking-wide text-zinc-500">Đang tải sản phẩm…</p>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}
