import React from 'react';
import { Droplet, Wind, Thermometer, Gauge, Activity, CheckCircle2 } from 'lucide-react';

interface Props {
  spo2: number;
  respiratoryRate: number;
  skinTempDeviation: number;
  hrv: number;
  bloodPressure: { systolic: number; diastolic: number };
}

export const VitalsGridCard: React.FC<Props> = ({
  spo2,
  respiratoryRate,
  skinTempDeviation,
  hrv,
  bloodPressure,
}) => {
  return (
    <div id="card-vitals-grid" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Activity className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">全方位生理體徵指標</h2>
            <p className="text-xs text-slate-400">Clinical-Grade Biometric Sensors</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          體徵全部正常
        </span>
      </div>

      {/* Grid of Vitals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. SpO2 */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">血氧飽和度</span>
            <Droplet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-cyan-400 font-mono flex items-baseline gap-1">
              {spo2}<span className="text-xs font-semibold text-slate-400">%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              正常 (95%~100%)
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full"
              style={{ width: `${spo2}%` }}
            />
          </div>
        </div>

        {/* 2. Respiratory Rate */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">呼吸頻率</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-teal-400 font-mono flex items-baseline gap-1">
              {respiratoryRate}<span className="text-xs font-semibold text-slate-400">brpm</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              平穩靜止 (12~18)
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-400 h-full rounded-full"
              style={{ width: `${Math.min(100, (respiratoryRate / 30) * 100)}%` }}
            />
          </div>
        </div>

        {/* 3. Skin Temperature Deviation */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">皮膚溫度趨勢</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-amber-400 font-mono flex items-baseline gap-1">
              {skinTempDeviation >= 0 ? `+${skinTempDeviation}` : skinTempDeviation}
              <span className="text-xs font-semibold text-slate-400">°C</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              相對基準溫 (±0.5°C)
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden flex items-center justify-center">
            <div className="w-2 h-full bg-amber-400 rounded-full" />
          </div>
        </div>

        {/* 4. Estimated Blood Pressure */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">光學推算血壓</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-indigo-300 font-mono flex items-baseline gap-1">
              {bloodPressure.systolic}/{bloodPressure.diastolic}
              <span className="text-xs font-semibold text-slate-400">mmHg</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              收縮 / 舒張壓理想
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
