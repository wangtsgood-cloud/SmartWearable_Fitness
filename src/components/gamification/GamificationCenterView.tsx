import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Sparkles, 
  Share2, 
  Lock, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Filter, 
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Gift
} from 'lucide-react';
import { GamificationBadge, UserLevelInfo, BadgeCategory, WorkoutSession, BiometricsData } from '../../types';
import { INITIAL_BADGES, INITIAL_USER_LEVEL } from '../../data/mockGamification';
import { WorkoutSharePosterModal } from './WorkoutSharePosterModal';
import confetti from 'canvas-confetti';

interface Props {
  biometrics: BiometricsData;
  activeWorkout: WorkoutSession;
}

export const GamificationCenterView: React.FC<Props> = ({
  biometrics,
  activeWorkout,
}) => {
  const [userLevel, setUserLevel] = useState<UserLevelInfo>(INITIAL_USER_LEVEL);
  const [badges, setBadges] = useState<GamificationBadge[]>(INITIAL_BADGES);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [selectedBadgeForPoster, setSelectedBadgeForPoster] = useState<GamificationBadge | null>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState<boolean>(false);
  const [justClaimedId, setJustClaimedId] = useState<string | null>(null);

  const categories: { id: BadgeCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: '全部成就', icon: '🌟' },
    { id: 'endurance', label: '耐力巡航', icon: '🏃‍♂️' },
    { id: 'speed', label: '極速破風', icon: '🚀' },
    { id: 'streak', label: '連勝自律', icon: '🔥' },
    { id: 'recovery', label: '深度修復', icon: '🌙' },
    { id: 'vitality', label: '活力代謝', icon: '⚡' },
    { id: 'milestone', label: '傳奇里程碑', icon: '🏆' },
  ];

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(b => b.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const progressPercent = Math.round((userLevel.currentExp / userLevel.nextLevelExp) * 100);

  const handleClaimBadge = (badge: GamificationBadge) => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect');
    }

    setJustClaimedId(badge.id);
    setTimeout(() => setJustClaimedId(null), 3000);

    // Open poster modal
    setSelectedBadgeForPoster(badge);
    setIsPosterModalOpen(true);
  };

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20';
      case 'epic':
        return 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-purple-300 border-purple-500/50 shadow-purple-500/20';
      case 'rare':
        return 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '傳奇 (Legendary)';
      case 'epic': return '史詩 (Epic)';
      case 'rare': return '稀有 (Rare)';
      default: return '普通 (Common)';
    }
  };

  return (
    <div id="gamification-center-view" className="space-y-6">
      {/* 1. Top Level & XP Progression Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Level info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/30 uppercase tracking-wider">
                ATHLETE LEVEL {userLevel.currentLevel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>連續打卡 {userLevel.streakDays} 天</span>
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                {userLevel.levelTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                已解鎖 {unlockedCount} / {badges.length} 枚榮譽成就勳章 · 累計訓練里程 {userLevel.totalDistanceKm} KM
              </p>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full max-w-lg space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-cyan-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>經驗值 EXP: {userLevel.currentExp} / {userLevel.nextLevelExp}</span>
                </span>
                <span className="text-slate-400">升級至 Lv.{userLevel.currentLevel + 1} 尚需 {userLevel.nextLevelExp - userLevel.currentExp} EXP</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-500 shadow-md shadow-cyan-500/50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Button for Poster */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0">
            <button
              id="btn-open-poster-generator"
              onClick={() => {
                const latestBadge = badges.find(b => b.unlocked);
                setSelectedBadgeForPoster(latestBadge || null);
                setIsPosterModalOpen(true);
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>一鍵生成運動打卡海報</span>
            </button>

            <div className="text-center text-[11px] text-slate-400 font-medium">
              支援 Instagram Story / 微信 / Strava 尺寸
            </div>
          </div>
        </div>

        {/* Mini 4-stat Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">總運動次數</div>
            <div className="text-lg sm:text-xl font-black text-slate-100 mt-0.5">{userLevel.totalWorkouts} <span className="text-xs font-normal text-slate-400">次</span></div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">累計總距離</div>
            <div className="text-lg sm:text-xl font-black text-cyan-300 mt-0.5">{userLevel.totalDistanceKm} <span className="text-xs font-normal text-slate-400">KM</span></div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">總消耗熱量</div>
            <div className="text-lg sm:text-xl font-black text-orange-300 mt-0.5">{userLevel.totalCalories.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span></div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">成就解鎖率</div>
            <div className="text-lg sm:text-xl font-black text-emerald-300 mt-0.5">{Math.round((unlockedCount / badges.length) * 100)}%</div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          return (
            <div
              key={badge.id}
              className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-slate-900/90 border-slate-800 shadow-xl hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-75'
              }`}
            >
              {/* Top row: Icon, Title, Rarity */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border ${
                      badge.unlocked
                        ? 'bg-slate-800 border-slate-700 shadow-cyan-500/10'
                        : 'bg-slate-900 border-slate-800 text-slate-600 grayscale'
                    }`}>
                      {badge.icon}
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getRarityBadgeStyle(badge.rarity)}`}>
                        {getRarityLabel(badge.rarity)}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-slate-100 mt-1">
                        {badge.title}
                      </h4>
                    </div>
                  </div>

                  {badge.unlocked ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {badge.description}
                </p>

                {badge.perk && (
                  <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-300 flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">特權：{badge.perk}</span>
                  </div>
                )}
              </div>

              {/* Bottom: Progress or Claim / Share Action */}
              <div className="pt-3 border-t border-slate-800/80">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>+{badge.expPoints} EXP</span>
                    </div>

                    <button
                      onClick={() => handleClaimBadge(badge)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>產生此勳章海報</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400">解鎖進度: {badge.requirement}</span>
                      <span className="text-amber-400">{badge.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Poster Generator Modal */}
      {isPosterModalOpen && (
        <WorkoutSharePosterModal
          workout={activeWorkout}
          biometrics={biometrics}
          badge={selectedBadgeForPoster}
          onClose={() => setIsPosterModalOpen(false)}
        />
      )}
    </div>
  );
};
