import React, { useEffect, useRef } from 'react';
import { Heart, Activity, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { HeartRateZoneInfo } from '../types';

interface Props {
  heartRate: number;
  restingHeartRate: number;
  maxHeartRate: number;
  hrv: number;
  zones: HeartRateZoneInfo[];
  isLive: boolean;
}

export const HeartRateLiveCard: React.FC<Props> = ({
  heartRate,
  restingHeartRate,
  maxHeartRate,
  hrv,
  zones,
  isLive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataPointsRef = useRef<number[]>([]);
  const phaseRef = useRef<number>(0);

  // Determine current heart rate zone
  const currentZone = zones.find(
    (z) => heartRate >= z.minBpm && heartRate <= z.maxBpm
  ) || (heartRate < zones[0].minBpm ? zones[0] : zones[zones.length - 1]);

  // Real-time ECG / PPG Wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Initialize buffer if empty
    if (dataPointsRef.current.length === 0) {
      dataPointsRef.current = new Array(width).fill(midY);
    }

    const render = () => {
      // Calculate speed based on current BPM
      const speed = Math.max(1.2, heartRate / 45);
      phaseRef.current = (phaseRef.current + speed) % 100;

      // Generate ECG shape based on phase
      let waveY = midY;
      const p = phaseRef.current;

      // P wave (slight bump)
      if (p > 15 && p <= 25) {
        waveY = midY - Math.sin(((p - 15) / 10) * Math.PI) * 6;
      }
      // Q dip
      else if (p > 30 && p <= 34) {
        waveY = midY + 5;
      }
      // R sharp spike
      else if (p > 34 && p <= 40) {
        const rProgress = (p - 34) / 6;
        if (rProgress < 0.5) {
          waveY = midY - (rProgress * 2) * (height * 0.42);
        } else {
          waveY = midY - (1 - (rProgress - 0.5) * 2) * (height * 0.42);
        }
      }
      // S dip
      else if (p > 40 && p <= 45) {
        waveY = midY + 10;
      }
      // T wave
      else if (p > 55 && p <= 75) {
        waveY = midY - Math.sin(((p - 55) / 20) * Math.PI) * 12;
      } else {
        // baseline jitter
        waveY = midY + (Math.random() - 0.5) * 1.5;
      }

      // Shift buffer
      dataPointsRef.current.shift();
      dataPointsRef.current.push(waveY);

      // Clear & Draw
      ctx.clearRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Gradient Wave Line
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(244, 63, 94, 0.1)');
      gradient.addColorStop(0.7, 'rgba(244, 63, 94, 0.8)');
      gradient.addColorStop(1, '#f43f5e');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();

      for (let i = 0; i < dataPointsRef.current.length; i++) {
        if (i === 0) {
          ctx.moveTo(i, dataPointsRef.current[i]);
        } else {
          ctx.lineTo(i, dataPointsRef.current[i]);
        }
      }
      ctx.stroke();

      // Lead glowing dot at the end
      const lastY = dataPointsRef.current[dataPointsRef.current.length - 1];
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(width - 2, lastY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [heartRate]);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  const totalZoneTime = zones.reduce((acc, z) => acc + z.timeSpentSec, 0) || 1;

  // Heartbeat pulse animation duration (in seconds per beat)
  const pulseDuration = (60 / Math.max(40, heartRate)).toFixed(2);

  return (
    <div id="card-heart-rate" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Heart
                className="w-5 h-5 text-rose-500"
                style={{
                  animation: `ping ${pulseDuration}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                }}
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                即時心率監測
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: currentZone.bgColor,
                    color: currentZone.color,
                    borderColor: currentZone.borderColor,
                    borderWidth: 1,
                  }}
                >
                  Zone {currentZone.zone} · {currentZone.name}
                </span>
              </h2>
              <p className="text-xs text-slate-400">光學 PPG 感測 · 每秒連續取樣</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-4xl font-extrabold text-slate-50 tracking-tight font-mono">
                {heartRate}
              </span>
              <span className="text-xs font-semibold text-rose-400 uppercase">BPM</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {heartRate > 160 ? '⚠️ 高強度區間' : heartRate < 60 ? '😴 靜息放鬆' : '✨ 正常活動'}
            </p>
          </div>
        </div>

        {/* Real-time ECG Wave Canvas */}
        <div className="relative w-full h-24 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden my-3">
          <canvas
            ref={canvasRef}
            width={480}
            height={96}
            className="w-full h-full block"
          />
          <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>ECG LEAD II · 25mm/s</span>
          </div>
          <div className="absolute bottom-2 right-3 text-[10px] text-slate-500 font-mono">
            HRV {hrv} ms
          </div>
        </div>

        {/* Heart Rate Zones Distribution */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>今日心率五大區間分佈</span>
            <span className="text-slate-400 text-[11px]">累計運動時長</span>
          </div>

          {/* Stacked zone bar */}
          <div className="w-full h-3 rounded-full bg-slate-950 flex overflow-hidden p-0.5 border border-slate-800">
            {zones.map((z) => {
              const widthPct = (z.timeSpentSec / totalZoneTime) * 100;
              return (
                <div
                  key={z.zone}
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: z.color,
                  }}
                  className="h-full transition-all hover:opacity-80"
                  title={`Zone ${z.zone} (${z.name}): ${formatTime(z.timeSpentSec)} (${widthPct.toFixed(0)}%)`}
                />
              );
            })}
          </div>

          {/* Zones grid breakdown */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {zones.map((z) => {
              const isCurrent = currentZone.zone === z.zone;
              return (
                <div
                  key={z.zone}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? 'border-rose-500/60 bg-rose-500/10 shadow-sm'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: z.color }}
                    />
                    <span className="text-[10px] font-bold text-slate-200">Z{z.zone}</span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-300 mt-0.5">
                    {z.minBpm}-{z.maxBpm}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {formatTime(z.timeSpentSec)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-800/80 text-center">
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">靜止心率 (RHR)</div>
          <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
            {restingHeartRate} <span className="text-[10px] text-slate-500">BPM</span>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">最高心率 (Max)</div>
          <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
            {maxHeartRate} <span className="text-[10px] text-slate-500">BPM</span>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">心率變異度 (HRV)</div>
          <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
            {hrv} <span className="text-[10px] text-slate-500">ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
