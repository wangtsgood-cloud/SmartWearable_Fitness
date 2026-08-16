import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, BedDouble, Zap, ShieldCheck, Clock, ChevronRight, Activity, Heart } from 'lucide-react';
import { SleepData } from '../types';

interface Props {
  sleep: SleepData;
  onOpenFullView?: () => void;
}

export const SleepRecoveryCard: React.FC<Props> = ({ sleep, onOpenFullView }) => {
  const totalMinutes = sleep.deepMinutes + sleep.lightMinutes + sleep.remMinutes + sleep.awakeMinutes || 1;

  const deepPct = Math.round((sleep.deepMinutes / totalMinutes) * 100);
  const lightPct = Math.round((sleep.lightMinutes / totalMinutes) * 100);
  const remPct = Math.round((sleep.remMinutes / totalMinutes) * 100);
  const awakePct = Math.round((sleep.awakeMinutes / totalMinutes) * 100);

  // Live countdown timer state
  const [countdownSecs, setCountdownSecs] = useState(
    Math.round(sleep.recoveryHoursRemaining * 3600)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div id="card-sleep-recovery" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                全天候睡眠分期與修復評估
              </h2>
              <p className="text-xs text-slate-400">Sleep Staging & Dynamic EPOC Recovery</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-3xl font-extrabold text-indigo-400 tracking-tight font-mono">
                {sleep.score}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">✨ 優質修復狀態</span>
          </div>
        </div>

        {/* Total Sleep Duration & Timeline times */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <BedDouble className="w-4 h-4 text-indigo-400" />
              <span>總睡眠時長：<strong className="text-slate-100 font-mono text-sm">{sleep.totalHours} 小時</strong></span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {sleep.bedTime} 入睡 → {sleep.wakeTime} 起床
            </div>
          </div>

          {/* Stacked Sleep Stages Bar */}
          <div className="w-full h-3.5 rounded-full bg-slate-900 flex overflow-hidden p-0.5 border border-slate-800 mb-2.5">
            <div
              style={{ width: `${deepPct}%` }}
              className="h-full bg-blue-500 transition-all"
              title={`深層睡眠: ${formatMins(sleep.deepMinutes)} (${deepPct}%)`}
            />
            <div
              style={{ width: `${lightPct}%` }}
              className="h-full bg-indigo-400 transition-all"
              title={`淺層睡眠: ${formatMins(sleep.lightMinutes)} (${lightPct}%)`}
            />
            <div
              style={{ width: `${remPct}%` }}
              className="h-full bg-purple-400 transition-all"
              title={`快速動眼 REM: ${formatMins(sleep.remMinutes)} (${remPct}%)`}
            />
            <div
              style={{ width: `${awakePct}%` }}
              className="h-full bg-rose-400 transition-all"
              title={`清醒時間: ${formatMins(sleep.awakeMinutes)} (${awakePct}%)`}
            />
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-slate-300 font-semibold">深睡</span>
              </div>
              <div className="text-xs font-bold text-blue-400 font-mono mt-0.5">
                {formatMins(sleep.deepMinutes)}
              </div>
              <div className="text-[9px] text-slate-400 font-medium">{deepPct}%</div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-[10px] text-slate-300 font-semibold">淺睡</span>
              </div>
              <div className="text-xs font-bold text-indigo-400 font-mono mt-0.5">
                {formatMins(sleep.lightMinutes)}
              </div>
              <div className="text-[9px] text-slate-400 font-medium">{lightPct}%</div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-[10px] text-slate-300 font-semibold">REM</span>
              </div>
              <div className="text-xs font-bold text-purple-400 font-mono mt-0.5">
                {formatMins(sleep.remMinutes)}
              </div>
              <div className="text-[9px] text-slate-400 font-medium">{remPct}%</div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-[10px] text-slate-300 font-semibold">清醒</span>
              </div>
              <div className="text-xs font-bold text-rose-400 font-mono mt-0.5">
                {formatMins(sleep.awakeMinutes)}
              </div>
              <div className="text-[9px] text-slate-400 font-medium">{awakePct}%</div>
            </div>
          </div>
        </div>

        {/* Recovery Metrics & Live Countdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>睡眠效率</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {sleep.efficiency}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              夜間心率下潛 -14.8% (放鬆)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>恢復時長倒數</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-1">
              {formatCountdown(countdownSecs)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              距離 100% 巔峰體能
            </div>
          </div>
        </div>
      </div>

      {/* Footer link to full view */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">🌙 夜間平均 HRV: {sleep.hrvNightAvg} ms</span>
        {onOpenFullView && (
          <button
            onClick={onOpenFullView}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer group"
          >
            <span>展開睡眠甘特圖與修復評估</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

