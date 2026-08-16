import React from 'react';
import { Activity, Battery, BatteryCharging, Bluetooth, RefreshCw, Sparkles, Wind, Watch, ShieldAlert, Trophy } from 'lucide-react';
import { ActivityMode, DeviceInfo } from '../types';

interface Props {
  deviceInfo: DeviceInfo;
  activeMode: ActivityMode;
  onModeChange: (mode: ActivityMode) => void;
  activeTab: 'biometrics' | 'workout_gps' | 'sleep_recovery' | 'ai_coach' | 'gamification';
  onTabChange: (tab: 'biometrics' | 'workout_gps' | 'sleep_recovery' | 'ai_coach' | 'gamification') => void;
  onOpenBreathing: () => void;
  onOpenDeviceModal: () => void;
  onRefreshAi: () => void;
  isAiLoading: boolean;
  isLiveStreaming: boolean;
  onToggleLiveStream: () => void;
}

export const BiometricsHeader: React.FC<Props> = ({
  deviceInfo,
  activeMode,
  onModeChange,
  activeTab,
  onTabChange,
  onOpenBreathing,
  onOpenDeviceModal,
  onRefreshAi,
  isAiLoading,
  isLiveStreaming,
  onToggleLiveStream,
}) => {
  const modeOptions: { id: ActivityMode; label: string; icon: string; hrRange: string }[] = [
    { id: 'resting', label: '靜止休息', icon: '🪑', hrRange: '60~70 BPM' },
    { id: 'walking', label: '輕快散步', icon: '🚶‍♂️', hrRange: '90~105 BPM' },
    { id: 'running', label: '有氧慢跑', icon: '🏃‍♂️', hrRange: '135~155 BPM' },
    { id: 'hiit', label: '極限衝刺', icon: '⚡', hrRange: '165~185 BPM' },
    { id: 'sleeping', label: '睡眠放鬆', icon: '🌙', hrRange: '50~58 BPM' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-lg">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Live Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                  智慧穿戴體徵與運動分析
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isLiveStreaming ? 'animate-pulse' : ''}`} />
                  {isLiveStreaming ? '即時串流中' : '已暫停'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                心電波形 · GPS 軌跡熱力 · 身體電量 · 睡眠修復 · Gemini AI 教練
              </p>
            </div>
          </div>

          {/* View Navigation Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => onTabChange('biometrics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'biometrics'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>即時體徵</span>
            </button>
            <button
              onClick={() => onTabChange('workout_gps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'workout_gps'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🧭</span>
              <span>運動與 GPS 軌跡</span>
            </button>
            <button
              onClick={() => onTabChange('sleep_recovery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'sleep_recovery'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌙</span>
              <span>睡眠分期與修復</span>
            </button>
            <button
              id="tab-btn-ai-coach"
              onClick={() => onTabChange('ai_coach')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'ai_coach'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI 智慧教練</span>
            </button>
            <button
              id="tab-btn-gamification"
              onClick={() => onTabChange('gamification')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'gamification'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>成就打卡海報</span>
            </button>
          </div>
        </div>

        {/* Device & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Device Pill */}
          <button
            id="btn-device-status"
            onClick={onOpenDeviceModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 transition-colors cursor-pointer"
            title="點擊切換或設定穿戴裝置"
          >
            <Bluetooth className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">{deviceInfo.name}</span>
            <div className="flex items-center gap-1 text-slate-400 pl-1 border-l border-slate-700">
              {deviceInfo.isCharging ? (
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Battery className="w-3.5 h-3.5 text-slate-300" />
              )}
              <span>{deviceInfo.batteryLevel}%</span>
            </div>
          </button>

          {/* Guided Breathing Button */}
          <button
            id="btn-open-breathing"
            onClick={onOpenBreathing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-950/80 hover:bg-teal-900 border border-teal-700/60 text-xs text-teal-200 transition-colors font-medium cursor-pointer"
          >
            <Wind className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
            <span>深呼吸減壓</span>
          </button>

          {/* AI Refresh Button */}
          <button
            id="btn-refresh-ai"
            onClick={onRefreshAi}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-cyan-200 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'AI 診斷中...' : 'Gemini 體能報告'}</span>
          </button>

          {/* Live toggle */}
          <button
            id="btn-toggle-stream"
            onClick={onToggleLiveStream}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
            title={isLiveStreaming ? '暫停即時模擬' : '恢復即時模擬'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>
        </div>
      </div>

      {/* Quick Mode Switcher Bar */}
      <div className="bg-slate-950/70 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 scrollbar-none">
          <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0 font-medium mr-2">
            <span>情境模擬：</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {modeOptions.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  id={`mode-btn-${mode.id}`}
                  onClick={() => onModeChange(mode.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                  <span className="text-[10px] opacity-70 ml-0.5 hidden sm:inline">({mode.hrRange})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
