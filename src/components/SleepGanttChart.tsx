import React, { useState } from 'react';
import {
  SleepSegment,
  SleepCycle,
  SleepTimelinePoint,
  SleepStageType,
} from '../types';
import {
  mockSleepSegments,
  mockSleepCycles,
  generateSleepTimelinePoints,
} from '../data/mockSleepData';
import {
  Moon,
  BedDouble,
  Activity,
  Heart,
  TrendingDown,
  Sparkles,
  Info,
  Clock,
  Zap,
  Wind,
  Layers,
  Thermometer,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface Props {
  segments?: SleepSegment[];
  cycles?: SleepCycle[];
}

const STAGE_CONFIG: Record<
  SleepStageType,
  {
    name: string;
    enName: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    yVal: number;
    description: string;
  }
> = {
  awake: {
    name: '清醒/翻身',
    enName: 'Awake / Toss',
    color: '#f87171',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
    yVal: 0,
    description: '夜間短暫覺醒與體動，正常生理微翻身週期。',
  },
  rem: {
    name: '快速動眼 (REM)',
    enName: 'Rapid Eye Movement',
    color: '#c084fc',
    bgClass: 'bg-purple-400',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-400/30',
    yVal: 1,
    description: '大腦情緒整合、短期記憶鞏固與神經突觸修復。',
  },
  light: {
    name: '淺層睡眠 (Light)',
    enName: 'N1 & N2 Light Stage',
    color: '#818cf8',
    bgClass: 'bg-indigo-400',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-400/30',
    yVal: 2,
    description: '過渡放鬆期，心率呼吸逐漸平穩，肌肉張力放鬆。',
  },
  deep: {
    name: '深層睡眠 (Deep)',
    enName: 'N3 Slow-Wave Sleep',
    color: '#3b82f6',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    yVal: 3,
    description: '生長激素分泌高峰，骨骼肌腱修復與自律神經深層重置。',
  },
};

type ViewOverlayMode = 'hypnogram' | 'hr_hrv_dip' | 'spo2_temp';

export const SleepGanttChart: React.FC<Props> = ({
  segments = mockSleepSegments,
  cycles = mockSleepCycles,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<SleepSegment | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<SleepTimelinePoint | null>(null);
  const [overlayMode, setOverlayMode] = useState<ViewOverlayMode>('hypnogram');
  const [activeSession, setActiveSession] = useState<'night' | 'nap'>('night');

  const timelinePoints = generateSleepTimelinePoints();
  const totalMinutes = segments.reduce((acc, s) => acc + s.durationMinutes, 0) || 462;

  // Calculate stage totals
  const deepMinutes = segments.filter((s) => s.stage === 'deep').reduce((a, b) => a + b.durationMinutes, 0);
  const lightMinutes = segments.filter((s) => s.stage === 'light').reduce((a, b) => a + b.durationMinutes, 0);
  const remMinutes = segments.filter((s) => s.stage === 'rem').reduce((a, b) => a + b.durationMinutes, 0);
  const awakeMinutes = segments.filter((s) => s.stage === 'awake').reduce((a, b) => a + b.durationMinutes, 0);

  const formatMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div
      id="sleep-gantt-chart-card"
      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-5"
    >
      {/* 1. Header & Layer Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Moon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              全天候睡眠分期甘特圖 (Hypnogram Timeline)
            </h3>
            <p className="text-xs text-slate-400">
              臨床多導睡眠分期圖 (PSG) · 5 大睡眠生理週期 · 體徵同步曲線
            </p>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <button
              onClick={() => setOverlayMode('hypnogram')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                overlayMode === 'hypnogram'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              階梯分期甘特圖
            </button>
            <button
              onClick={() => setOverlayMode('hr_hrv_dip')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                overlayMode === 'hr_hrv_dip'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              心率下潛與 HRV
            </button>
            <button
              onClick={() => setOverlayMode('spo2_temp')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                overlayMode === 'spo2_temp'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              血氧與體溫
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Stage Metrics Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Deep Sleep */}
        <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-300 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              深層睡眠 (N3)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">
              {Math.round((deepMinutes / totalMinutes) * 100)}%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-blue-400 font-mono">
              {formatMins(deepMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">生長激素與肌力修復</div>
          </div>
        </div>

        {/* Light Sleep */}
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              淺層睡眠 (Light)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
              {Math.round((lightMinutes / totalMinutes) * 100)}%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-indigo-300 font-mono">
              {formatMins(lightMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">大腦過渡與生理重置</div>
          </div>
        </div>

        {/* REM Sleep */}
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              快速動眼 (REM)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
              {Math.round((remMinutes / totalMinutes) * 100)}%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-purple-400 font-mono">
              {formatMins(remMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">記憶整合與心智煥新</div>
          </div>
        </div>

        {/* Awake */}
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              清醒 / 翻身
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
              {Math.round((awakeMinutes / totalMinutes) * 100)}%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-rose-400 font-mono">
              {formatMins(awakeMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">夜間微覺醒 3 次</div>
          </div>
        </div>
      </div>

      {/* 3. Sleep Cycle Bracket Annotations */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            5 大生理睡眠週期 (90-110 min 週期規律)
          </span>
          <span className="text-[11px] text-slate-500">23:15 入睡 → 06:57 喚醒 (總計 7.7h)</span>
        </div>

        {/* Cycle horizontal brackets */}
        <div className="grid grid-cols-5 gap-1 text-center font-mono">
          {cycles.map((cyc) => (
            <div
              key={cyc.cycleNumber}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-left hover:border-indigo-500/50 transition-colors"
            >
              <div className="text-[10px] font-bold text-indigo-300 truncate">
                C{cyc.cycleNumber} · {cyc.durationMinutes}m
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                {cyc.startTime}-{cyc.endTime}
              </div>
              <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">
                深 {cyc.deepMinutes}m / R {cyc.remMinutes}m
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Gantt Timeline Bar & Segment Highlighting */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>分期時序甘特條（點擊或懸停區間查看細節）：</span>
          <span className="font-mono text-slate-400">
            {selectedSegment
              ? `${selectedSegment.startTime} ~ ${selectedSegment.endTime} (${selectedSegment.durationMinutes}m · ${STAGE_CONFIG[selectedSegment.stage].name})`
              : '點選各分期段落'}
          </span>
        </div>

        {/* The Continuous Segmented Gantt Bar */}
        <div className="relative w-full h-8 rounded-xl bg-slate-950 border border-slate-800 flex overflow-hidden p-0.5 shadow-inner">
          {segments.map((seg) => {
            const widthPct = (seg.durationMinutes / totalMinutes) * 100;
            const isSelected = selectedSegment?.id === seg.id;
            const config = STAGE_CONFIG[seg.stage];

            return (
              <div
                key={seg.id}
                onClick={() => setSelectedSegment(seg)}
                style={{ width: `${widthPct}%` }}
                className={`h-full ${config.bgClass} cursor-pointer transition-all hover:opacity-100 relative group ${
                  isSelected ? 'ring-2 ring-white z-10 opacity-100 scale-y-105' : 'opacity-85'
                }`}
                title={`${config.name}: ${seg.startTime}-${seg.endTime} (${seg.durationMinutes}m)`}
              >
                {/* Visual tooltip on hover */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 p-2 rounded-lg bg-slate-950 border border-slate-700 text-left shadow-2xl z-30 pointer-events-none">
                  <div className="text-[11px] font-bold text-slate-100">{config.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {seg.startTime} ~ {seg.endTime} ({seg.durationMinutes}m)
                  </div>
                  <div className="text-[10px] text-rose-400 font-mono mt-0.5">
                    心率 {seg.avgHeartRate} bpm · HRV {seg.avgHRV}ms
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Ruler */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 px-1">
          <span>23:15 (入睡)</span>
          <span>01:00</span>
          <span>03:00 (深度波谷)</span>
          <span>05:00</span>
          <span>06:57 (喚醒)</span>
        </div>
      </div>

      {/* 5. Selected Segment Detailed Panel */}
      {selectedSegment && (
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${STAGE_CONFIG[selectedSegment.stage].bgClass} text-slate-950 font-bold`}>
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <span>{STAGE_CONFIG[selectedSegment.stage].name}</span>
                <span className="text-xs font-normal text-slate-400 font-mono">
                  {selectedSegment.startTime} ~ {selectedSegment.endTime} ({selectedSegment.durationMinutes} 分鐘)
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                {STAGE_CONFIG[selectedSegment.stage].description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-slate-300 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
            <div>
              <span className="text-[10px] text-slate-500 block">段落平均心率</span>
              <span className="text-rose-400 font-bold">{selectedSegment.avgHeartRate} bpm</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">段落 HRV</span>
              <span className="text-emerald-400 font-bold">{selectedSegment.avgHRV} ms</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">體動翻身</span>
              <span className="text-indigo-300 font-bold">
                {selectedSegment.movementLevel === 'none'
                  ? '靜止穩定'
                  : selectedSegment.movementLevel === 'low'
                  ? '輕微'
                  : '微覺醒翻身'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Dynamic Recharts Continuous Visualizations */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        {overlayMode === 'hypnogram' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold text-slate-200">
                多導階梯睡眠分期曲線 (Hypnogram Staircase Curve)
              </span>
              <span className="text-[11px] text-slate-500">
                深層(頂部慢波) → 淺層 → REM → 清醒(底部)
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelinePoints}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="hypnoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="#818cf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    interval={8}
                  />
                  <YAxis
                    domain={[0, 3]}
                    ticks={[0, 1, 2, 3]}
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(val) => {
                      if (val === 3) return '深睡';
                      if (val === 2) return '淺睡';
                      if (val === 1) return 'REM';
                      return '清醒';
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as SleepTimelinePoint;
                        const config = STAGE_CONFIG[data.stage];
                        return (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs font-mono">
                            <div className="text-slate-300 font-bold flex items-center justify-between mb-1">
                              <span>時間: {data.time}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] ${config.bgClass} text-slate-950 font-bold`}>
                                {config.name}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] mt-1 text-slate-300">
                              <div>心率: <span className="text-rose-400 font-bold">{data.heartRate} bpm</span></div>
                              <div>HRV: <span className="text-emerald-400 font-bold">{data.hrv} ms</span></div>
                              <div>血氧: <span className="text-cyan-400 font-bold">{data.spo2}%</span></div>
                              <div>呼吸: <span className="text-indigo-300 font-bold">{data.respiratoryRate} brpm</span></div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="stageValue"
                    stroke="#818cf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#hypnoGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {overlayMode === 'hr_hrv_dip' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold text-slate-200">
                夜間心率下潛曲線 (Nocturnal Heart Rate Dip) & HRV 波動
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  夜間心率 (最低 48 bpm · 下潛 -14.8%)
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  夜間 HRV (均值 72 ms)
                </span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelinePoints}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    interval={8}
                  />
                  <YAxis
                    yAxisId="left"
                    domain={[40, 80]}
                    stroke="#f43f5e"
                    fontSize={10}
                    tickFormatter={(val) => `${val}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[40, 100]}
                    stroke="#10b981"
                    fontSize={10}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as SleepTimelinePoint;
                        return (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs font-mono">
                            <div className="text-slate-200 font-bold mb-1">時間：{data.time}</div>
                            <div className="text-rose-400">即時心率: {data.heartRate} bpm</div>
                            <div className="text-emerald-400">即時 HRV: {data.hrv} ms</div>
                            <div className="text-slate-400 text-[10px] mt-1">
                              分期: {STAGE_CONFIG[data.stage].name}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    yAxisId="left"
                    y={56}
                    stroke="#64748b"
                    strokeDasharray="3 3"
                    label={{ value: '日間靜息 56', fill: '#64748b', fontSize: 9 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="hrv"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {overlayMode === 'spo2_temp' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold text-slate-200">
                夜間連續血氧 SpO2 與皮膚溫度偏離度 (Skin Temperature)
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  血氧濃度 (最低 96% · 無窒息停滯)
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  皮膚溫度 (生理波谷 -0.35°C)
                </span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelinePoints}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    interval={8}
                  />
                  <YAxis
                    yAxisId="left"
                    domain={[94, 100]}
                    stroke="#06b6d4"
                    fontSize={10}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[-0.6, 0.2]}
                    stroke="#f59e0b"
                    fontSize={10}
                    tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}°C`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as SleepTimelinePoint;
                        return (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs font-mono">
                            <div className="text-slate-200 font-bold mb-1">時間：{data.time}</div>
                            <div className="text-cyan-400">血氧 SpO2: {data.spo2}%</div>
                            <div className="text-amber-400">體溫偏離: {data.skinTempDeviation > 0 ? '+' : ''}{data.skinTempDeviation}°C</div>
                            <div className="text-indigo-300">呼吸頻率: {data.respiratoryRate} brpm</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="spo2"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="skinTempDeviation"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
