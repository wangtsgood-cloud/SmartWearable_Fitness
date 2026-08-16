import React from 'react';
import { Flame, Timer, PersonStanding, Footprints, Mountain, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  steps: number;
  stepGoal: number;
  distanceKm: number;
  elevationFloors: number;
  activeCalories: number;
  calorieGoal: number;
  exerciseMinutes: number;
  exerciseGoalMinutes: number;
  standHours: number;
  standGoalHours: number;
}

export const ActivityRingsCard: React.FC<Props> = ({
  steps,
  stepGoal,
  distanceKm,
  elevationFloors,
  activeCalories,
  calorieGoal,
  exerciseMinutes,
  exerciseGoalMinutes,
  standHours,
  standGoalHours,
}) => {
  // Percentages capped for visual circle calculation
  const movePct = Math.min(2, activeCalories / calorieGoal);
  const exercisePct = Math.min(2, exerciseMinutes / exerciseGoalMinutes);
  const standPct = Math.min(2, standHours / standGoalHours);
  const stepPct = Math.min(100, Math.round((steps / stepGoal) * 100));

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#a3e635', '#06b6d4', '#eab308'],
    });
  };

  // SVG Ring Calculation Helpers
  const size = 160;
  const center = size / 2;
  const strokeWidth = 10;
  const gap = 3;

  const r1 = 68; // Outer: Move (Rose)
  const r2 = r1 - strokeWidth - gap; // Middle: Exercise (Lime)
  const r3 = r2 - strokeWidth - gap; // Inner: Stand (Cyan)

  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;
  const c3 = 2 * Math.PI * r3;

  const offset1 = c1 - Math.min(1, movePct) * c1;
  const offset2 = c2 - Math.min(1, exercisePct) * c2;
  const offset3 = c3 - Math.min(1, standPct) * c3;

  return (
    <div id="card-activity-rings" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500/20 to-lime-500/20 text-rose-400 border border-rose-500/30">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                今日活動三大圓環
              </h2>
              <p className="text-xs text-slate-400">Activity Rings & Movement Tracker</p>
            </div>
          </div>

          <button
            onClick={triggerConfetti}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
            title="慶祝達標"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>達成獎勵</span>
          </button>
        </div>

        {/* Concentric Rings & Metric Breakdown */}
        <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
          {/* SVG Concentric Rings */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background Tracks */}
              <circle cx={center} cy={center} r={r1} stroke="rgba(244, 63, 94, 0.15)" strokeWidth={strokeWidth} fill="none" />
              <circle cx={center} cy={center} r={r2} stroke="rgba(163, 230, 53, 0.15)" strokeWidth={strokeWidth} fill="none" />
              <circle cx={center} cy={center} r={r3} stroke="rgba(6, 182, 212, 0.15)" strokeWidth={strokeWidth} fill="none" />

              {/* Progress Rings */}
              <circle
                cx={center}
                cy={center}
                r={r1}
                stroke="#f43f5e"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={c1}
                strokeDashoffset={offset1}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx={center}
                cy={center}
                r={r2}
                stroke="#a3e635"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={c2}
                strokeDashoffset={offset2}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx={center}
                cy={center}
                r={r3}
                stroke="#06b6d4"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={c3}
                strokeDashoffset={offset3}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Icon / Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-slate-100 font-mono">
                {stepPct}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium">步數達標</span>
            </div>
          </div>

          {/* Three Ring Details */}
          <div className="flex-1 w-full space-y-2.5">
            {/* Move (Red) */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">動態熱量 (Move)</div>
                  <div className="text-[10px] text-slate-400">目標 {calorieGoal} kcal</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-rose-400 font-mono">
                  {activeCalories} <span className="text-[10px] text-slate-400">kcal</span>
                </div>
                <div className="text-[10px] text-rose-300 font-medium">
                  {Math.round((activeCalories / calorieGoal) * 100)}%
                </div>
              </div>
            </div>

            {/* Exercise (Lime) */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-lime-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-lime-500/20 text-lime-400">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">運動時長 (Exercise)</div>
                  <div className="text-[10px] text-slate-400">目標 {exerciseGoalMinutes} 分鐘</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-lime-400 font-mono flex items-center justify-end gap-1">
                  {exerciseMinutes} <span className="text-[10px] text-slate-400">分鐘</span>
                  {exerciseMinutes >= exerciseGoalMinutes && <span className="text-xs">🎉</span>}
                </div>
                <div className="text-[10px] text-lime-300 font-medium">
                  {Math.round((exerciseMinutes / exerciseGoalMinutes) * 100)}% (已達標)
                </div>
              </div>
            </div>

            {/* Stand (Cyan) */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <PersonStanding className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">站立小時 (Stand)</div>
                  <div className="text-[10px] text-slate-400">目標 {standGoalHours} 小時</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-cyan-400 font-mono">
                  {standHours} <span className="text-[10px] text-slate-400">小時</span>
                </div>
                <div className="text-[10px] text-cyan-300 font-medium">
                  {Math.round((standHours / standGoalHours) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps, Distance & Elevation Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
              <Footprints className="w-3.5 h-3.5 text-blue-400" />
              <span>今日步數</span>
            </div>
            <div className="text-base font-extrabold text-slate-100 font-mono mt-0.5">
              {steps.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">/ 10,000 步</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
              <span>🚶 累計距離</span>
            </div>
            <div className="text-base font-extrabold text-teal-400 font-mono mt-0.5">
              {distanceKm}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">公里 (km)</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
              <Mountain className="w-3.5 h-3.5 text-indigo-400" />
              <span>爬坡高度</span>
            </div>
            <div className="text-base font-extrabold text-indigo-400 font-mono mt-0.5">
              {elevationFloors}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">樓層 (Floors)</div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
        <span>🔥 基礎代謝 (BMR): 1,620 kcal</span>
        <span className="font-semibold text-slate-300">總消耗: {activeCalories + 1620} kcal</span>
      </div>
    </div>
  );
};
