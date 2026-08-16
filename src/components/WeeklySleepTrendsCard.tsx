import React, { useState } from 'react';
import { DailySleepRecord } from '../types';
import { mockWeeklySleepHistory } from '../data/mockSleepData';
import {
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  Moon,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend,
} from 'recharts';

interface Props {
  weeklyData?: DailySleepRecord[];
}

export const WeeklySleepTrendsCard: React.FC<Props> = ({
  weeklyData = mockWeeklySleepHistory,
}) => {
  const [selectedDay, setSelectedDay] = useState<DailySleepRecord>(weeklyData[weeklyData.length - 1]);

  // Compute 7-day averages
  const avgScore = Math.round(
    weeklyData.reduce((acc, d) => acc + d.score, 0) / weeklyData.length
  );
  const avgHours = (
    weeklyData.reduce((acc, d) => acc + d.totalHours, 0) / weeklyData.length
  ).toFixed(1);
  const avgDeepMinutes = Math.round(
    weeklyData.reduce((acc, d) => acc + d.deepMinutes, 0) / weeklyData.length
  );
  const avgHrv = Math.round(
    weeklyData.reduce((acc, d) => acc + d.hrvAvg, 0) / weeklyData.length
  );

  // Transform data for stacked chart
  const chartData = weeklyData.map((d) => ({
    name: d.dayName,
    date: d.date,
    deepHours: parseFloat((d.deepMinutes / 60).toFixed(2)),
    lightHours: parseFloat((d.lightMinutes / 60).toFixed(2)),
    remHours: parseFloat((d.remMinutes / 60).toFixed(2)),
    awakeHours: parseFloat((d.awakeMinutes / 60).toFixed(2)),
    totalHours: d.totalHours,
    score: d.score,
    raw: d,
  }));

  return (
    <div
      id="weekly-sleep-trends-card"
      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-5"
    >
      {/* 1. Header with 7-Day Averages */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              近 7 日睡眠分期與規律性趨勢 (7-Day Sleep Architecture)
            </h3>
            <p className="text-xs text-slate-400">
              分期時長堆疊 · 睡眠評分曲線 · 晝夜入睡節律一致性
            </p>
          </div>
        </div>

        {/* 7-Day Average Stats Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block">7天平均評分</span>
            <span className="text-indigo-400 font-bold text-sm">{avgScore} 分</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block">平均時長</span>
            <span className="text-cyan-400 font-bold text-sm">{avgHours}h</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block">平均深睡</span>
            <span className="text-blue-400 font-bold text-sm">{avgDeepMinutes}m</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block">夜間平均HRV</span>
            <span className="text-emerald-400 font-bold text-sm">{avgHrv}ms</span>
          </div>
        </div>
      </div>

      {/* 2. Stacked Bar Chart with Score Overlay */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-slate-200">
            每日睡眠分期堆疊 (小時) & 品質分數折線
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" />
              深睡
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-indigo-400" />
              淺睡
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-purple-400" />
              REM
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-400" />
              清醒
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length) {
                  const clicked = state.activePayload[0].payload.raw as DailySleepRecord;
                  setSelectedDay(clicked);
                }
              }}
            >
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                fontSize={10}
                tickFormatter={(val) => `${val}h`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[50, 100]}
                stroke="#818cf8"
                fontSize={10}
                tickFormatter={(val) => `${val}分`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const raw = data.raw as DailySleepRecord;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs font-mono">
                        <div className="text-slate-200 font-bold mb-1.5 flex items-center justify-between">
                          <span>{raw.dayName} ({raw.date})</span>
                          <span className="text-indigo-400 font-bold">{raw.score} 分</span>
                        </div>
                        <div className="space-y-1 text-slate-300">
                          <div>總睡眠時長: <strong className="text-slate-100">{raw.totalHours} 小時</strong></div>
                          <div className="text-blue-400">深睡: {Math.floor(raw.deepMinutes / 60)}h {raw.deepMinutes % 60}m</div>
                          <div className="text-indigo-300">淺睡: {Math.floor(raw.lightMinutes / 60)}h {raw.lightMinutes % 60}m</div>
                          <div className="text-purple-400">REM: {Math.floor(raw.remMinutes / 60)}h {raw.remMinutes % 60}m</div>
                          <div className="text-rose-400">清醒: {raw.awakeMinutes}m</div>
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                            作息: {raw.bedTime} 入睡 → {raw.wakeTime} 起床
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="left" dataKey="deepHours" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="lightHours" stackId="a" fill="#818cf8" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="remHours" stackId="a" fill="#c084fc" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="awakeHours" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="score"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 4, fill: '#38bdf8' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Selected Day Breakdown Card */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">選取日期詳情：</span>
            <span className="text-sm font-bold text-slate-100">{selectedDay.dayName} ({selectedDay.date})</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 font-mono">
              {selectedDay.score} 分
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            入睡時間 {selectedDay.bedTime} → 起床 {selectedDay.wakeTime} · 睡眠效率 {selectedDay.efficiency}% · 心率下潛 {selectedDay.hrDipPct}%
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">作息時差穩定性</span>
            <span className="text-emerald-400 font-bold">±12 分鐘 (極度穩定)</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">夜間平均 HRV</span>
            <span className="text-cyan-400 font-bold">{selectedDay.hrvAvg} ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
