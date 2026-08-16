import React from 'react';
import { SplitLap, WorkoutSession } from '../types';
import { Timer, Zap, Flame, Trophy, TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react';

interface Props {
  workout: WorkoutSession;
}

export const WorkoutSplitsCard: React.FC<Props> = ({ workout }) => {
  const splits = workout.splits;

  // Find fastest split
  let fastestSplitIndex = 0;
  let minTime = Infinity;
  splits.forEach((s, idx) => {
    if (s.timeSeconds < minTime) {
      minTime = s.timeSeconds;
      fastestSplitIndex = idx;
    }
  });

  return (
    <div
      id="workout-splits-card"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Timer className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">分段配速與每公里計時</h3>
              <p className="text-xs text-slate-400">Kilometer Splits & Lap Consistency Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>最佳分段: 第 {fastestSplitIndex + 1} km ({splits[fastestSplitIndex]?.paceFormatted})</span>
          </div>
        </div>

        {/* Splits Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">公里</th>
                <th className="py-2.5 px-3">分段配速</th>
                <th className="py-2.5 px-3">平均心率</th>
                <th className="py-2.5 px-3">爬升 (m)</th>
                <th className="py-2.5 px-3">平均步頻/踏頻</th>
                <th className="py-2.5 px-3 text-right">用時</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {splits.map((lap, idx) => {
                const isFastest = idx === fastestSplitIndex;
                const minSec = Math.floor(lap.timeSeconds / 60);
                const remSec = lap.timeSeconds % 60;
                const formattedTime = `${minSec}:${remSec < 10 ? '0' : ''}${remSec}`;

                return (
                  <tr
                    key={lap.km}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isFastest ? 'bg-cyan-500/5 font-semibold text-white' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 flex items-center gap-1.5">
                      <span className="font-bold text-slate-100">{lap.km} km</span>
                      {isFastest && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                          ⚡ 最快
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{lap.paceFormatted}</td>
                    <td className="py-2.5 px-3 text-rose-400">
                      <span className="inline-flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {lap.avgHeartRate} bpm
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-amber-400">+{lap.elevationGainMeters}m</td>
                    <td className="py-2.5 px-3 text-indigo-300">{lap.avgCadence} {workout.sportType === 'cycling' ? 'rpm' : 'spm'}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{formattedTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training Effect Summary Box */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          {/* Aerobic TE */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">有氧訓練效果 (Aerobic TE)</div>
              <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">
                {workout.trainingEffect.aerobic.toFixed(1)}{' '}
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                高度效益
              </span>
            </div>
          </div>

          {/* Anaerobic TE */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">無氧訓練效果 (Anaerobic TE)</div>
              <div className="text-xl font-bold text-indigo-400 font-mono mt-0.5">
                {workout.trainingEffect.anaerobic.toFixed(1)}{' '}
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                維持提升
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          💡 <strong className="text-slate-200">教練分析：</strong>{workout.trainingEffect.description}
        </p>
      </div>
    </div>
  );
};
