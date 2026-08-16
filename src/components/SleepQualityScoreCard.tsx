import React from 'react';
import { SleepData, SleepQualitySubScores } from '../types';
import { mockSleepQualitySubScores } from '../data/mockSleepData';
import {
  Award,
  Sparkles,
  TrendingDown,
  Activity,
  Heart,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Brain,
  ShieldCheck,
  Moon,
} from 'lucide-react';

interface Props {
  sleep: SleepData;
  subScores?: SleepQualitySubScores;
}

export const SleepQualityScoreCard: React.FC<Props> = ({
  sleep,
  subScores = mockSleepQualitySubScores,
}) => {
  // Score badge helper
  const getScoreRating = (score: number) => {
    if (score >= 90) return { label: '卓越修復 · EXCELLENT', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' };
    if (score >= 80) return { label: '優質良好 · OPTIMAL', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' };
    if (score >= 70) return { label: '普通達標 · FAIR', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' };
    return { label: '修復不足 · POOR', color: 'text-rose-400 bg-rose-500/20 border-rose-500/30' };
  };

  const rating = getScoreRating(sleep.score);

  const subScoreItems = [
    {
      id: 'duration',
      title: '睡眠總時長',
      score: subScores.durationScore,
      value: `${sleep.totalHours} 小時`,
      benchmark: '目標 7.5 ~ 8.5h',
      status: '達標',
      icon: Clock,
      color: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-400',
      description: '總時長充足，有效滿足體內 5 次完整 90 分鐘生理週期。',
    },
    {
      id: 'deep',
      title: '深層慢波修復 (N3)',
      score: subScores.deepSleepScore,
      value: `${Math.floor(sleep.deepMinutes / 60)}h ${sleep.deepMinutes % 60}m (23%)`,
      benchmark: '理想 15% ~ 25%',
      status: '卓越',
      icon: Zap,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      description: '肌肉組織與肌腱微損傷物理修復高峰，生長激素分泌充足。',
    },
    {
      id: 'rem',
      title: '快速動眼期 (REM)',
      score: subScores.remSleepScore,
      value: `${Math.floor(sleep.remMinutes / 60)}h ${sleep.remMinutes % 60}m (18%)`,
      benchmark: '理想 20% ~ 25%',
      status: '良好',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-400',
      description: '短期神經記憶固化與情緒壓力釋放，早晨專注力飽滿。',
    },
    {
      id: 'efficiency',
      title: '睡眠連續性與效率',
      score: subScores.efficiencyScore,
      value: `${sleep.efficiency}%`,
      benchmark: '理想 > 85%',
      status: '高效率',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      description: '夜間清醒時間極短（僅 28 分鐘），無頻繁輾轉中斷。',
    },
    {
      id: 'hr_dip',
      title: '夜間心率下潛率',
      score: subScores.hrDipScore,
      value: `${subScores.hrDipPercent}%`,
      benchmark: '理想 -10% ~ -20%',
      status: '完全放鬆',
      icon: TrendingDown,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-400',
      description: '夜間心率降至 48-52 BPM，副交感神經完全接管，心臟徹底減壓。',
    },
    {
      id: 'hrv',
      title: '夜間 HRV 恢復平衡',
      score: subScores.hrvBalanceScore,
      value: `${sleep.hrvNightAvg} ms`,
      benchmark: '基準 68 ms (+6%)',
      status: '正向增益',
      icon: Heart,
      color: 'from-amber-500 to-emerald-500',
      textColor: 'text-amber-400',
      description: '自律神經迷走神經張力充足，自體抗壓與免疫防護力提升。',
    },
  ];

  return (
    <div
      id="sleep-quality-score-card"
      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-5"
    >
      {/* 1. Header with Circular Gauge & High-level Verdict */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          {/* Radial Score Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#6366f1"
                strokeWidth="8"
                strokeDasharray={`${(sleep.score / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">
                {sleep.score}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">綜合睡眠品質評分</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${rating.color}`}>
                {rating.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              整合 6 大生理維度（時長、深睡慢波、REM大腦修復、心率下潛、HRV張力、連續性），體能修復達到 90% 以上。
            </p>
          </div>
        </div>

        {/* Sleep Debt Summary Box */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">累積睡眠債 (Sleep Debt)</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
              <span>+18 分鐘 (時長盈餘)</span>
            </div>
            <span className="text-[10px] text-slate-500">晝夜節律高度同步</span>
          </div>
        </div>
      </div>

      {/* 2. 6-Dimensional Sub-Score Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {subScoreItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <Icon className={`w-4 h-4 ${item.textColor}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-200">{item.title}</span>
                  </div>

                  <div className="flex items-baseline gap-1 font-mono">
                    <span className={`text-base font-extrabold ${item.textColor}`}>
                      {item.score}
                    </span>
                    <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-2.5 border border-slate-800">
                  <div
                    style={{ width: `${item.score}%` }}
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                  />
                </div>

                {/* Values & Benchmark */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-100 font-bold">{item.value}</span>
                  <span className="text-[11px] text-slate-400">{item.benchmark}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
