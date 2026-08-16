import React, { useRef, useState } from 'react';
import { 
  Download, 
  Share2, 
  Sparkles, 
  Flame, 
  Heart, 
  MapPin, 
  Clock, 
  Zap, 
  Award, 
  Calendar, 
  Check, 
  Sliders, 
  Copy,
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { 
  WorkoutSession, 
  BiometricsData, 
  GamificationBadge, 
  PosterThemeStyle, 
  PosterCustomization 
} from '../../types';

interface Props {
  workout: WorkoutSession;
  biometrics: BiometricsData;
  badge?: GamificationBadge | null;
  onClose?: () => void;
}

export const WorkoutSharePosterModal: React.FC<Props> = ({
  workout,
  biometrics,
  badge,
  onClose,
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const [customization, setCustomization] = useState<PosterCustomization>({
    theme: 'cyberpunk',
    headline: '⚡ 破風巡航 · 專項 PB 達成！',
    subQuote: '心流專注在呼吸與每一步的著地反饋，超越昨天的自己。',
    includeGpsMap: true,
    includeHeartRateChart: true,
    includeBiometricsHUD: true,
    includeBadgeHighlight: !!badge,
    selectedBadgeId: badge?.id,
    customSticker: 'pb_crushed',
    aspectRatio: 'story_9_16',
    athleteName: 'Alex Runner',
    customLocationTag: '台北大佳河濱公園 · 10K 巡航賽道',
  });

  const themeConfig: Record<PosterThemeStyle, {
    name: string;
    bgGradient: string;
    cardBg: string;
    textColor: string;
    accentColor: string;
    accentGlow: string;
    borderColor: string;
    tagStyle: string;
    badgeBg: string;
    mapStroke: string;
  }> = {
    cyberpunk: {
      name: '賽博霓虹 (Cyberpunk)',
      bgGradient: 'from-slate-950 via-indigo-950 to-purple-950',
      cardBg: 'bg-slate-900/80 border-cyan-500/40',
      textColor: 'text-slate-100',
      accentColor: 'text-cyan-400',
      accentGlow: 'shadow-cyan-500/30 border-cyan-500',
      borderColor: 'border-cyan-500/40',
      tagStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
      badgeBg: 'bg-purple-900/40 border-purple-500/50 text-purple-300',
      mapStroke: '#06b6d4',
    },
    mag_cover: {
      name: '運動雜誌封面 (Magazine)',
      bgGradient: 'from-zinc-950 via-neutral-900 to-black',
      cardBg: 'bg-neutral-900/80 border-amber-500/40',
      textColor: 'text-neutral-100',
      accentColor: 'text-amber-400',
      accentGlow: 'shadow-amber-500/30 border-amber-500',
      borderColor: 'border-amber-500/40',
      tagStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
      badgeBg: 'bg-amber-950/50 border-amber-500/50 text-amber-300',
      mapStroke: '#f59e0b',
    },
    fiery_beast: {
      name: '熔岩赤焰 (Fiery Beast)',
      bgGradient: 'from-black via-rose-950 to-orange-950',
      cardBg: 'bg-stone-900/80 border-orange-500/40',
      textColor: 'text-orange-100',
      accentColor: 'text-orange-400',
      accentGlow: 'shadow-orange-500/30 border-orange-500',
      borderColor: 'border-orange-500/40',
      tagStyle: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
      badgeBg: 'bg-rose-950/50 border-rose-500/50 text-rose-300',
      mapStroke: '#f97316',
    },
    aurora_glow: {
      name: '極光流光 (Aurora Glow)',
      bgGradient: 'from-slate-950 via-teal-950 to-emerald-950',
      cardBg: 'bg-slate-900/80 border-emerald-500/40',
      textColor: 'text-slate-100',
      accentColor: 'text-emerald-400',
      accentGlow: 'shadow-emerald-500/30 border-emerald-500',
      borderColor: 'border-emerald-500/40',
      tagStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
      badgeBg: 'bg-teal-950/50 border-teal-500/50 text-teal-300',
      mapStroke: '#10b981',
    },
    minimal_pure: {
      name: '極簡極致 (Minimalist)',
      bgGradient: 'from-slate-900 via-slate-950 to-black',
      cardBg: 'bg-slate-900/60 border-slate-700',
      textColor: 'text-slate-200',
      accentColor: 'text-slate-100',
      accentGlow: 'shadow-white/10 border-slate-500',
      borderColor: 'border-slate-700',
      tagStyle: 'bg-slate-800 text-slate-300 border-slate-600',
      badgeBg: 'bg-slate-800 border-slate-700 text-slate-300',
      mapStroke: '#e2e8f0',
    },
    retro_pixel: {
      name: '復古街機 (Retro Arcade)',
      bgGradient: 'from-purple-950 via-fuchsia-950 to-slate-950',
      cardBg: 'bg-slate-950/90 border-fuchsia-500/50',
      textColor: 'text-fuchsia-100',
      accentColor: 'text-fuchsia-400',
      accentGlow: 'shadow-fuchsia-500/40 border-fuchsia-400',
      borderColor: 'border-fuchsia-500/40',
      tagStyle: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50 font-mono',
      badgeBg: 'bg-purple-950 border-fuchsia-500 text-yellow-300 font-mono',
      mapStroke: '#d946ef',
    },
  };

  const currentTheme = themeConfig[customization.theme];

  // SVG Mini GPS Track generator
  const renderMiniGpsTrack = () => {
    if (!workout.gpsTrack || workout.gpsTrack.length === 0) {
      return (
        <div className="w-full h-32 flex items-center justify-center text-xs text-slate-500">
          無 GPS 軌跡資料
        </div>
      );
    }

    const lats = workout.gpsTrack.map(p => p.latitude);
    const lngs = workout.gpsTrack.map(p => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = maxLat - minLat || 0.01;
    const lngSpan = maxLng - minLng || 0.01;

    const width = 280;
    const height = 120;
    const padding = 15;

    const pointsStr = workout.gpsTrack.map(p => {
      const x = padding + ((p.longitude - minLng) / lngSpan) * (width - padding * 2);
      const y = height - (padding + ((p.latitude - minLat) / latSpan) * (height - padding * 2));
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="120" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <polyline
          fill="none"
          stroke={currentTheme.mapStroke}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          points={pointsStr}
        />
        {workout.gpsTrack.length > 0 && (
          <circle
            cx={padding + ((workout.gpsTrack[0].longitude - minLng) / lngSpan) * (width - padding * 2)}
            cy={height - (padding + ((workout.gpsTrack[0].latitude - minLat) / latSpan) * (height - padding * 2))}
            r="4.5"
            fill="#10b981"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        )}
        {workout.gpsTrack.length > 1 && (
          <circle
            cx={padding + ((workout.gpsTrack[workout.gpsTrack.length - 1].longitude - minLng) / lngSpan) * (width - padding * 2)}
            cy={height - (padding + ((workout.gpsTrack[workout.gpsTrack.length - 1].latitude - minLat) / latSpan) * (height - padding * 2))}
            r="4.5"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        )}
      </svg>
    );
  };

  // Sticker badge render
  const renderSticker = () => {
    switch (customization.customSticker) {
      case 'pb_crushed':
        return (
          <div className="absolute -top-3 -right-3 rotate-12 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black rounded-lg shadow-xl shadow-amber-500/40 border-2 border-white uppercase tracking-wider">
            🔥 PB CRUSHED
          </div>
        );
      case 'king_of_zone2':
        return (
          <div className="absolute -top-3 -right-3 -rotate-6 px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-black rounded-lg shadow-xl shadow-cyan-500/40 border-2 border-white uppercase tracking-wider">
            👑 ZONE 2 MASTER
          </div>
        );
      case 'burn_the_fat':
        return (
          <div className="absolute -top-3 -right-3 rotate-6 px-3 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-black rounded-lg shadow-xl shadow-rose-500/40 border-2 border-white uppercase tracking-wider">
            ⚡ 脂肪燃燒殆盡
          </div>
        );
      case 'unstoppable':
        return (
          <div className="absolute -top-3 -right-3 -rotate-12 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-black rounded-lg shadow-xl shadow-purple-500/40 border-2 border-white uppercase tracking-wider">
            🚀 UNSTOPPABLE
          </div>
        );
      case 'night_runner':
        return (
          <div className="absolute -top-3 -right-3 rotate-6 px-3 py-1 bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 text-xs font-black rounded-lg shadow-xl shadow-indigo-500/40 border-2 border-white uppercase tracking-wider">
            🌃 夜行光速之魂
          </div>
        );
      default:
        return null;
    }
  };

  const handleDownloadImage = () => {
    setIsDownloading(true);
    // Canvas client side export simulation
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw gradient background
      const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Draw Titles & Metrics
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('PULSESTREAM AI ATHLETE', 80, 120);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(customization.headline, 80, 220);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '32px sans-serif';
      ctx.fillText(`運動員: ${customization.athleteName} · ${customization.customLocationTag}`, 80, 280);

      // Big Distance
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 160px sans-serif';
      ctx.fillText(`${workout.distanceKm.toFixed(2)}`, 80, 500);
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText('KM 累積距離', 580, 480);

      // Main stats boxes
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(80, 560, 440, 180);
      ctx.fillRect(560, 560, 440, 180);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '28px sans-serif';
      ctx.fillText('平均配速', 120, 610);
      ctx.fillText('運動時長', 600, 610);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText(workout.avgPaceFormatted, 120, 690);
      const mins = Math.floor(workout.durationSeconds / 60);
      const secs = workout.durationSeconds % 60;
      ctx.fillText(`${mins}m ${secs}s`, 600, 690);

      // Heart rate & Cal
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(80, 770, 440, 180);
      ctx.fillRect(560, 770, 440, 180);

      ctx.fillStyle = '#f43f5e';
      ctx.font = '28px sans-serif';
      ctx.fillText('平均心率', 120, 820);
      ctx.fillStyle = '#fb923c';
      ctx.fillText('主動熱量消耗', 600, 820);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText(`${workout.avgHeartRate} BPM`, 120, 900);
      ctx.fillText(`${workout.caloriesBurned} kcal`, 600, 900);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '28px sans-serif';
      ctx.fillText('Generated by PulseStream Wearable AI · Garmin / Apple Health Pro', 80, 1820);

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `PulseStream_Workout_${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    }
    setIsDownloading(false);
  };

  const handleCopyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-100">
                  運動打卡海報一鍵生成器
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  社交即時分享
                </span>
              </div>
              <p className="text-xs text-slate-400">
                整合 GPS 軌跡、心率區間、卡路里消耗與成就勳章，打造吸睛運動動態
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Left Controls, Right Live Poster Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Customization Sidebar (5 cols) */}
          <div className="lg:col-span-5 p-5 space-y-5 border-r border-slate-800 bg-slate-950/60 overflow-y-auto">
            {/* 1. Theme Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>海報視覺風格主題</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(themeConfig) as PosterThemeStyle[]).map((themeKey) => (
                  <button
                    key={themeKey}
                    onClick={() => setCustomization(prev => ({ ...prev, theme: themeKey }))}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      customization.theme === themeKey
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">{themeConfig[themeKey].name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">海報畫幅尺寸</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'story_9_16', label: '限時動態 9:16' },
                  { id: 'square_1_1', label: '方形貼文 1:1' },
                  { id: 'landscape_16_9', label: '橫幅長圖 16:9' },
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setCustomization(prev => ({ ...prev, aspectRatio: ratio.id as any }))}
                    className={`p-2 rounded-lg text-center text-xs font-bold border transition-all cursor-pointer ${
                      customization.aspectRatio === ratio.id
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Headline & Sub-quote */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300">主標題宣言</label>
                <input
                  type="text"
                  value={customization.headline}
                  onChange={(e) => setCustomization(prev => ({ ...prev, headline: e.target.value }))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">心流感悟金句</label>
                <input
                  type="text"
                  value={customization.subQuote}
                  onChange={(e) => setCustomization(prev => ({ ...prev, subQuote: e.target.value }))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* 4. Custom Sticker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">專屬成就印章 / 貼紙</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'pb_crushed', label: '🔥 PB CRUSHED' },
                  { id: 'king_of_zone2', label: '👑 ZONE 2' },
                  { id: 'burn_the_fat', label: '⚡ 脂肪燃燒' },
                  { id: 'unstoppable', label: '🚀 勢不可擋' },
                  { id: 'night_runner', label: '🌃 夜行光速' },
                  { id: 'none', label: '無貼紙' },
                ].map(stk => (
                  <button
                    key={stk.id}
                    onClick={() => setCustomization(prev => ({ ...prev, customSticker: stk.id as any }))}
                    className={`p-1.5 rounded-lg text-center text-[11px] font-bold border transition-all cursor-pointer ${
                      customization.customSticker === stk.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {stk.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300">海報數據模組開關</label>
              <div className="space-y-1.5 text-xs text-slate-300">
                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <span>包含 GPS 迷你立體軌跡</span>
                  <input
                    type="checkbox"
                    checked={customization.includeGpsMap}
                    onChange={(e) => setCustomization(prev => ({ ...prev, includeGpsMap: e.target.checked }))}
                    className="accent-cyan-500"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <span>即時心率與身體電量 HUD</span>
                  <input
                    type="checkbox"
                    checked={customization.includeBiometricsHUD}
                    onChange={(e) => setCustomization(prev => ({ ...prev, includeBiometricsHUD: e.target.checked }))}
                    className="accent-cyan-500"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <span>展示成就勳章烙印</span>
                  <input
                    type="checkbox"
                    checked={customization.includeBadgeHighlight}
                    onChange={(e) => setCustomization(prev => ({ ...prev, includeBadgeHighlight: e.target.checked }))}
                    className="accent-cyan-500"
                  />
                </label>
              </div>
            </div>

            {/* 6. Athlete & Location */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div>
                <label className="text-[11px] font-bold text-slate-400">運動員署名</label>
                <input
                  type="text"
                  value={customization.athleteName}
                  onChange={(e) => setCustomization(prev => ({ ...prev, athleteName: e.target.value }))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">地點地標</label>
                <input
                  type="text"
                  value={customization.customLocationTag}
                  onChange={(e) => setCustomization(prev => ({ ...prev, customLocationTag: e.target.value }))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Right Live Poster Preview (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-slate-950 flex flex-col items-center justify-center overflow-y-auto">
            {/* The Poster Card */}
            <div
              ref={posterRef}
              className={`relative transition-all duration-300 bg-gradient-to-br ${currentTheme.bgGradient} border-2 ${currentTheme.borderColor} rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 overflow-hidden flex flex-col justify-between ${
                customization.aspectRatio === 'story_9_16'
                  ? 'w-[320px] sm:w-[350px] min-h-[580px]'
                  : customization.aspectRatio === 'square_1_1'
                  ? 'w-[320px] sm:w-[380px] min-h-[380px]'
                  : 'w-[340px] sm:w-[460px] min-h-[290px]'
              }`}
            >
              {/* Sticker placement */}
              {renderSticker()}

              {/* Background ambient pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Top Row: App Brand & Date */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-black text-xs shadow-md">
                    ⚡
                  </div>
                  <span className="text-xs font-black tracking-wider text-slate-200 uppercase">
                    PULSESTREAM AI
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {new Date().toLocaleDateString('zh-TW')}
                </div>
              </div>

              {/* Headline & Quote */}
              <div className="relative z-10 my-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate">{customization.customLocationTag}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight leading-snug">
                  {customization.headline}
                </h2>
                <p className="text-xs text-slate-300/80 italic mt-1 leading-relaxed">
                  "{customization.subQuote}"
                </p>
              </div>

              {/* GPS Track Visual (if enabled) */}
              {customization.includeGpsMap && (
                <div className="relative z-10 my-2 p-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
                  {renderMiniGpsTrack()}
                </div>
              )}

              {/* Core Hero Metric: Big Distance */}
              <div className="relative z-10 my-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    TOTAL DISTANCE
                  </div>
                  <div className={`text-4xl sm:text-5xl font-black tracking-tight ${currentTheme.accentColor}`}>
                    {workout.distanceKm.toFixed(2)}
                    <span className="text-sm font-bold text-slate-400 ml-1.5">KM</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    AVG PACE
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                    {workout.avgPaceFormatted}
                    <span className="text-[10px] text-slate-400 ml-1">/km</span>
                  </div>
                </div>
              </div>

              {/* Secondary Metrics Grid */}
              <div className="relative z-10 grid grid-cols-3 gap-2 my-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-cyan-400" />
                    <span>時長</span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-100 mt-0.5">
                    {Math.floor(workout.durationSeconds / 60)}m {workout.durationSeconds % 60}s
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                    <Heart className="w-2.5 h-2.5 text-rose-400" />
                    <span>平均心率</span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-rose-300 mt-0.5">
                    {workout.avgHeartRate} <span className="text-[9px]">BPM</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                    <Flame className="w-2.5 h-2.5 text-orange-400" />
                    <span>燃燒熱量</span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-orange-300 mt-0.5">
                    {workout.caloriesBurned} <span className="text-[9px]">kcal</span>
                  </div>
                </div>
              </div>

              {/* Badge Highlight (if enabled) */}
              {customization.includeBadgeHighlight && badge && (
                <div className={`relative z-10 my-1 p-2.5 rounded-xl ${currentTheme.badgeBg} border flex items-center gap-2.5 shadow-md`}>
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-black truncate">{badge.title}</div>
                    <div className="text-[10px] opacity-80 truncate">{badge.description}</div>
                  </div>
                </div>
              )}

              {/* Footer: Athlete Tag & Watermark */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ATHLETE: <strong className="text-slate-200">{customization.athleteName}</strong></span>
                </div>
                <span className="tracking-wider uppercase opacity-60">
                  GARMIN / APPLE HEALTH PRO
                </span>
              </div>
            </div>

            {/* Poster Actions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full max-w-md">
              <button
                id="btn-download-poster"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? '海報繪製中...' : '下載高清打卡圖片'}</span>
              </button>

              <button
                id="btn-copy-poster-link"
                onClick={handleCopyLink}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{isCopied ? '連結已複製！' : '複製分享連結'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
