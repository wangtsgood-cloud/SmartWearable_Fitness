import React, { useState, useEffect } from 'react';
import { RecoveryAssessment, RecoveryFactor } from '../types';
import { initialRecoveryAssessment } from '../data/mockSleepData';
import {
  Clock,
  Zap,
  Activity,
  Heart,
  TrendingUp,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Coffee,
  BedDouble,
  Wind,
  Flame,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

interface Props {
  initialData?: RecoveryAssessment;
}

export const RecoveryCountdownCard: React.FC<Props> = ({
  initialData = initialRecoveryAssessment,
}) => {
  // State for dynamic interactive recovery hours & seconds countdown
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.round(initialData.recoveryHoursRemaining * 3600)
  );
  const [appliedFactors, setAppliedFactors] = useState<RecoveryFactor[]>(initialData.factors);
  const [activeSimAction, setActiveSimAction] = useState<string | null>(null);

  // Dynamic seconds countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds to HH:MM:SS
  const formatCountdown = (totalSecs: number) => {
    if (totalSecs <= 0) return '00:00:00 (已完全恢復)';
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Recovery percent calculated from total 24h baseline
  const remainingHours = remainingSeconds / 3600;
  const currentRecoveryPct = Math.min(
    100,
    Math.max(10, Math.round(((24 - remainingHours) / 24) * 100))
  );

  // Recovery Stage definition
  const getStageInfo = (pct: number) => {
    if (pct >= 85) {
      return {
        stage: 4,
        label: '🟩 巔峰爆發 (Optimal / Race Ready)',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20 border-emerald-500/30',
        advice: '身體電量充足，神經肌肉完全放鬆，具備進行高強度間歇 (HIIT) 或極限配速訓練之生理條件。',
        safeZone: 'Zone 4 ~ Zone 5',
      };
    }
    if (pct >= 60) {
      return {
        stage: 3,
        label: '🟦 良好體能 (Zone 2 Endurance)',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20 border-cyan-500/30',
        advice: '心血管負荷已降至安全線，適宜進行 Zone 2 有氧基礎耐力跑、長距離定速巡航或核心肌群阻力塑型。',
        safeZone: 'Zone 2 ~ Zone 3 (最大心率 < 152 BPM)',
      };
    }
    if (pct >= 35) {
      return {
        stage: 2,
        label: '🟨 基礎修復 (Active Recovery)',
        color: 'text-amber-400',
        bg: 'bg-amber-500/20 border-amber-500/30',
        advice: '肌肉組織尚在超量恢復期，建議進行慢速散步、滾筒放鬆或動態伸展，避免增加額外乳酸堆積。',
        safeZone: 'Zone 1 (最大心率 < 115 BPM)',
      };
    }
    return {
      stage: 1,
      label: '🟥 重度疲勞 (Rest & Replenish)',
      color: 'text-rose-400',
      bg: 'bg-rose-500/20 border-rose-500/30',
      advice: '身體電量偏低，心臟自律神經處於交感主導，請優先補充水分與電解質，並保持充足睡眠。',
      safeZone: '完全休息 (Rest)',
    };
  };

  const stage = getStageInfo(currentRecoveryPct);

  // Simulator helper
  const handleApplyFactor = (
    title: string,
    deltaHours: number,
    impactType: 'positive' | 'negative',
    description: string
  ) => {
    setActiveSimAction(title);
    setRemainingSeconds((prev) => Math.max(0, prev + Math.round(deltaHours * 3600)));
    setAppliedFactors((prev) => [
      {
        id: `factor-${Date.now()}`,
        title,
        impactType,
        impactDescription: description,
        changeHours: deltaHours,
      },
      ...prev,
    ]);
  };

  const handleReset = () => {
    setRemainingSeconds(Math.round(initialData.recoveryHoursRemaining * 3600));
    setAppliedFactors(initialData.factors);
    setActiveSimAction(null);
  };

  return (
    <div
      id="recovery-countdown-card"
      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-5"
    >
      {/* 1. Header with Live Countdown & Readiness Gauge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                運動後恢復時長動態倒數 (EPOC Recovery Timer)
              </h3>
              <p className="text-xs text-slate-400">
                即時秒數倒數 · 4 階恢復體能準備度 · 訓練綠燈指引
              </p>
            </div>
          </div>
        </div>

        {/* Live Big Countdown Badge */}
        <div className="flex items-center gap-4 bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl">
          <div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              距離 100% 巔峰準備：
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight mt-0.5">
              {formatCountdown(remainingSeconds)}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              預計完全恢復時程：{remainingHours <= 0 ? '已達標' : initialData.targetRecoveryTime}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Recovery Progress Bar & 4-Stage Hierarchy */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">體能恢復進度：</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{currentRecoveryPct}%</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${stage.bg} ${stage.color}`}>
            {stage.label}
          </span>
        </div>

        {/* Segmented 4-Phase Progress Track */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex p-0.5 border border-slate-800 relative">
            <div
              style={{ width: `${currentRecoveryPct}%` }}
              className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/20"
            />
          </div>

          {/* 4 Stage Benchmarks */}
          <div className="grid grid-cols-4 text-center text-[10px] text-slate-500 font-mono">
            <div className={`${currentRecoveryPct >= 25 ? 'text-slate-300 font-semibold' : ''}`}>
              0% 重度疲勞
            </div>
            <div className={`${currentRecoveryPct >= 50 ? 'text-slate-300 font-semibold' : ''}`}>
              35% 輕度伸展
            </div>
            <div className={`${currentRecoveryPct >= 75 ? 'text-slate-300 font-semibold' : ''}`}>
              60% 有氧耐力
            </div>
            <div className={`${currentRecoveryPct >= 85 ? 'text-emerald-400 font-bold' : ''}`}>
              85%+ 巔峰滿電
            </div>
          </div>
        </div>

        {/* Training Advice Box */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center justify-between font-semibold mb-1">
            <span className="text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              今日最佳訓練指引 (Workout Greenlight)
            </span>
            <span className="text-cyan-300 font-mono text-[11px]">
              建議上限：{stage.safeZone}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">{stage.advice}</p>
        </div>
      </div>

      {/* 3. Interactive Recovery Simulator Actions */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/30 via-slate-950 to-indigo-950/30 border border-indigo-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>互動式恢復因子模擬器 (Interactive Recovery Factors)</span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重設生理數值</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Action 1: Nap */}
          <button
            onClick={() =>
              handleApplyFactor(
                '午間小憩 45 分鐘',
                -1.5,
                'positive',
                '大腦腺苷酸快速代謝，副交感神經充電 +15%'
              )
            }
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                + 午間小憩 45m
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">-1.5 小時</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">加速消除大腦中樞疲勞</div>
          </button>

          {/* Action 2: Breathing / Meditation */}
          <button
            onClick={() =>
              handleApplyFactor(
                '15 分鐘腹式深呼吸',
                -0.8,
                'positive',
                '活化迷走神經，HRV 上升 +12ms，肌肉放鬆'
              )
            }
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                + 15m 呼吸減壓
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">-0.8 小時</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">提升 HRV 與自律神經放鬆</div>
          </button>

          {/* Action 3: Coffee Intake */}
          <button
            onClick={() =>
              handleApplyFactor(
                '飲用雙倍濃縮咖啡',
                +1.2,
                'negative',
                '交感神經暫時興奮，夜間心率下潛幅度預計減緩'
              )
            }
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                - 攝取 200mg 咖啡因
              </span>
              <span className="text-[10px] text-amber-400 font-mono">+1.2 小時</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">延緩副交感神經全面修復</div>
          </button>

          {/* Action 4: Additional Workout */}
          <button
            onClick={() =>
              handleApplyFactor(
                '追加 8km 中度晨跑',
                +3.5,
                'negative',
                '額外累積 EPOC 75 與下肢肌纖維微創傷'
              )
            }
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-rose-300">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                - 追加 8km 訓練
              </span>
              <span className="text-[10px] text-rose-400 font-mono">+3.5 小時</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">增加運動後過量氧耗 (EPOC)</div>
          </button>
        </div>
      </div>

      {/* 4. Physiological Factors List */}
      <div>
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span>當前生效的修復影響因子 (Active Biological Drivers)：</span>
          <span className="text-[11px] text-slate-500 font-mono">共 {appliedFactors.length} 項</span>
        </div>

        <div className="space-y-2">
          {appliedFactors.map((factor) => (
            <div
              key={factor.id}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                factor.impactType === 'positive'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {factor.impactType === 'positive' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-100">{factor.title}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{factor.impactDescription}</p>
                </div>
              </div>

              <div
                className={`font-mono font-bold text-sm shrink-0 ml-3 ${
                  factor.impactType === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {factor.changeHours > 0 ? `+${factor.changeHours}` : factor.changeHours} 小時
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
