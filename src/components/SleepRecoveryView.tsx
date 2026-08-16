import React, { useState } from 'react';
import { BiometricsData } from '../types';
import { SleepGanttChart } from './SleepGanttChart';
import { SleepQualityScoreCard } from './SleepQualityScoreCard';
import { RecoveryCountdownCard } from './RecoveryCountdownCard';
import { WeeklySleepTrendsCard } from './WeeklySleepTrendsCard';
import {
  Moon,
  Sparkles,
  BedDouble,
  Clock,
  Zap,
  Activity,
  Heart,
  ShieldCheck,
  Calendar,
  Share2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Coffee,
  Wind,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  currentBiometrics: BiometricsData;
  onOpenBreathing?: () => void;
  onOpenAICoach?: () => void;
}

export const SleepRecoveryView: React.FC<Props> = ({
  currentBiometrics,
  onOpenBreathing,
  onOpenAICoach,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-08-15 (昨夜最新紀錄)');
  const [showShareToast, setShowShareToast] = useState(false);

  const sleep = currentBiometrics.sleep;

  const handleShareReport = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
    });
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div id="sleep-recovery-view" className="space-y-6">
      {/* 1. Top Control Bar: Date Selector & Quick Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Moon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                全天候睡眠分期與修復評估系統
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                已同步最新夜間體徵
              </span>
            </div>
            <p className="text-xs text-slate-400">
              臨床多導睡眠甘特圖 · 6 維度品質評分 · 實時 EPOC 體能恢復倒數
            </p>
          </div>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {onOpenAICoach && (
            <button
              id="btn-open-coach-from-sleep"
              onClick={onOpenAICoach}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>獲取 AI 晨間早報與訓練建議</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{selectedDate}</span>
          </div>

          <button
            onClick={handleShareReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>匯出報告</span>
          </button>
        </div>
      </div>

      {showShareToast && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>睡眠與修復生理評估報告已複製至剪貼簿，可分享至教練或醫療追蹤檔案！</span>
          </div>
        </div>
      )}

      {/* 2. Main Sleep Hypnogram Gantt Chart */}
      <section aria-label="Sleep Hypnogram Gantt Chart">
        <SleepGanttChart />
      </section>

      {/* 3. Two Columns: Sleep Quality Subscores & Live Recovery Countdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quality Score & Subscores */}
        <SleepQualityScoreCard sleep={sleep} />

        {/* Right: Live Recovery Countdown & Readiness */}
        <RecoveryCountdownCard />
      </section>

      {/* 4. 7-Day Sleep Trends & Consistency */}
      <section aria-label="Weekly Sleep Trends">
        <WeeklySleepTrendsCard />
      </section>

      {/* 5. Circadian & Sleep Hygiene Insights */}
      <section className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-slate-100">
            生理晝夜節律與修復優化指引 (Circadian Synchronization)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
              <Sun className="w-4 h-4" />
              <span>早晨晨光重置節律</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              起床後 30 分鐘內接觸 10,000 Lux 戶外自然光 15 分鐘，可有效抑制褪黑激素並校準 14 小時後的入睡定時器。
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <Wind className="w-4 h-4" />
              <span>睡前迷走神經放鬆</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              睡前 1 小時進行 4-7-8 腹式深呼吸或溫水淋浴，幫助體核心溫度下降 0.5°C，可縮短入睡潛伏期至 10 分鐘內。
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
              <Coffee className="w-4 h-4" />
              <span>咖啡因代謝半衰期</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              咖啡因半衰期約 6 小時。建議每日 14:00 後停止攝取咖啡因，確保夜間腺苷受體順利結合以維持充足深睡。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
