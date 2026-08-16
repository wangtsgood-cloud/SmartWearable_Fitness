import React, { useState } from 'react';
import { X, Upload, FileCode, CheckCircle2, AlertCircle, Compass, Play, MapPin } from 'lucide-react';
import { parseGPXString } from '../utils/gpxParser';
import { WorkoutSession } from '../types';
import { sampleWorkoutList } from '../data/mockWorkouts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkout: (workout: WorkoutSession) => void;
}

export const GPXImportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectWorkout,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.gpx') && !file.name.toLowerCase().endsWith('.xml')) {
      setErrorMsg('請上傳 .gpx 格式之運動軌跡檔案');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const text = await file.text();
      const newWorkout = parseGPXString(text, file.name.replace(/\.[^/.]+$/, ''));
      onSelectWorkout(newWorkout);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'GPX 解析失敗，請確認檔案格式是否正確。');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">GPS 運動軌跡匯入與預設路線</h3>
            <p className="text-xs text-slate-400">支援 GPX 檔案匯入或選擇熱門運動路線</p>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer mb-5 ${
            dragOver
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
          }`}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.gpx,.xml';
            input.onchange = (e: any) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            };
            input.click();
          }}
        >
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <div className="text-xs font-semibold text-slate-200">
            {loading ? '正在解析 GPS 座標與熱力資料...' : '點擊選擇或將 .GPX 檔案拖曳至此'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            支援 Garmin Connect, Strava, Apple Watch, COROS 等匯出檔
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sample Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>精選推薦 GPS 路線：</span>
            <span className="text-[11px] text-slate-500">含心率熱力與高程剖面</span>
          </label>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {sampleWorkoutList.map((sw) => (
              <button
                key={sw.id}
                onClick={() => {
                  onSelectWorkout(sw);
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                      {sw.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{sw.distanceKm} km</span>
                      <span>·</span>
                      <span>配速 {sw.avgPaceFormatted}</span>
                      <span>·</span>
                      <span>爬升 +{sw.elevationGainMeters}m</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-cyan-400 font-semibold flex items-center gap-1">
                  載入 <Play className="w-3 h-3 fill-current" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
