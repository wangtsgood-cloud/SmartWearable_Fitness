import React from 'react';
import { Zap, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity, Smile, Frown, Meh } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { HourlyMetricPoint } from '../types';

interface Props {
  bodyBattery: number;
  batteryCharged: number;
  batteryDrained: number;
  stressLevel: number;
  trendData: HourlyMetricPoint[];
  onOpenBreathing: () => void;
}

export const BodyBatteryCard: React.FC<Props> = ({
  bodyBattery,
  batteryCharged,
  batteryDrained,
  stressLevel,
  trendData,
  onOpenBreathing,
}) => {
  // Stress level category & color
  const getStressInfo = (level: number) => {
    if (level <= 25) {
      return {
        label: '放鬆休憩 (Rest)',
        color: '#34d399',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
        desc: '副交感神經主導，身體正處於高效修復充電狀態。',
        icon: Smile,
      };
    } else if (level <= 50) {
      return {
        label: '低度壓力 (Low)',
        color: '#60a5fa',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-400',
        desc: '輕微專注工作或輕鬆走動，能量平穩消耗中。',
        icon: Meh,
      };
    } else if (level <= 75) {
      return {
        label: '中度壓力 (Medium)',
        color: '#fbbf24',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-400',
        desc: '高強度專注或中等運動負荷，建議稍作休息補充水分。',
        icon: Meh,
      };
    } else {
      return {
        label: '高度壓力 (High)',
        color: '#f87171',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        textColor: 'text-rose-400',
        desc: '交感神經極度亢奮或劇烈疲勞，強烈建議進行深呼吸減壓。',
        icon: Frown,
      };
    }
  };

  const stressInfo = getStressInfo(stressLevel);
  const StressIcon = stressInfo.icon;

  // Custom tooltip for 24h trend
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs backdrop-blur-md">
          <p className="font-bold text-slate-200 mb-1">{label}</p>
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>身體電量: {payload[0]?.value}%</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>壓力指數: {payload[1]?.value}</span>
          </div>
          {payload[2] && (
            <div className="flex items-center gap-2 text-rose-400 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>即時心率: {payload[2]?.value} BPM</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="card-body-battery" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                身體能量與壓力指數
              </h2>
              <p className="text-xs text-slate-400">Body Battery & HRV Stress Model</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-4xl font-extrabold text-cyan-400 tracking-tight font-mono">
                {bodyBattery}
              </span>
              <span className="text-xs font-semibold text-cyan-300">/ 100</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">當前能量存量</span>
          </div>
        </div>

        {/* Dynamic Battery & Drain stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Battery Progress Bar */}
          <div className="col-span-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span className="text-slate-300">身體電量儲備</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center text-emerald-400 font-mono">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{batteryCharged} 充電
                </span>
                <span className="flex items-center text-rose-400 font-mono">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />-{batteryDrained} 消耗
                </span>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-700 shadow-sm shadow-cyan-500/50"
                style={{ width: `${bodyBattery}%` }}
              />
            </div>
          </div>

          {/* Stress Level Box */}
          <div className={`p-3 rounded-xl border ${stressInfo.bgColor} ${stressInfo.borderColor} flex flex-col justify-between`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">當前壓力指數</span>
              <StressIcon className={`w-4 h-4 ${stressInfo.textColor}`} />
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className={`text-2xl font-bold font-mono ${stressInfo.textColor}`}>
                {stressLevel}
              </span>
              <span className="text-[11px] text-slate-400">/ 100</span>
            </div>
            <div className="text-[11px] font-medium text-slate-300 truncate">
              {stressInfo.label}
            </div>
          </div>

          {/* Quick Relief Callout */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-300">修復與減壓指引</span>
            <p className="text-[11px] text-slate-400 leading-tight my-1 line-clamp-2">
              {stressInfo.desc}
            </p>
            <button
              onClick={onOpenBreathing}
              className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>啟動箱式呼吸減壓</span> →
            </button>
          </div>
        </div>

        {/* 24-Hour Trend Chart */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>24小時能量與壓力趨勢</span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-normal">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> 身體電量
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 壓力曲線
              </span>
            </div>
          </div>

          <div className="h-40 w-full bg-slate-950/80 rounded-xl border border-slate-800/80 pt-3 pb-1 px-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.4)" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  ticks={[0, 50, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="bodyBattery"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBattery)"
                />
                <Area
                  type="monotone"
                  dataKey="stress"
                  stroke="#fbbf24"
                  strokeWidth={1.8}
                  fillOpacity={1}
                  fill="url(#colorStress)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>⚡ 建議今日進行：主動恢復或中低強度運動</span>
        <span className="text-cyan-400 font-mono text-[11px]">84% 電量峰值</span>
      </div>
    </div>
  );
};
