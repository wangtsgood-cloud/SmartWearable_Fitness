import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Calendar, 
  MessageSquare, 
  Flame, 
  Activity, 
  Heart, 
  Zap, 
  TrendingUp, 
  Award,
  Clock,
  Layers
} from 'lucide-react';
import { 
  MorningBriefingData, 
  AdaptiveWorkoutPlan, 
  WorkoutPlanDay, 
  TrainingGoalType, 
  FitnessLevel, 
  BiometricsData 
} from '../../types';
import { MorningBriefingCard } from './MorningBriefingCard';
import { AdaptiveTrainingPlanCard } from './AdaptiveTrainingPlanCard';
import { LiveAICoachChatCard } from './LiveAICoachChatCard';

interface Props {
  biometrics: BiometricsData;
  morningBriefing: MorningBriefingData | null;
  adaptivePlan: AdaptiveWorkoutPlan | null;
  isBriefingLoading: boolean;
  isPlanLoading: boolean;
  onRefreshBriefing: () => void;
  onPlanGoalChange: (goal: TrainingGoalType, level: FitnessLevel, weeklyTarget: number) => void;
  onSendMessageToCoach: (text: string, persona: string) => Promise<string>;
  onStartWorkout: (workout: WorkoutPlanDay) => void;
}

export const AICoachDashboardView: React.FC<Props> = ({
  biometrics,
  morningBriefing,
  adaptivePlan,
  isBriefingLoading,
  isPlanLoading,
  onRefreshBriefing,
  onPlanGoalChange,
  onSendMessageToCoach,
  onStartWorkout,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'briefing' | 'plan' | 'chat'>('all');

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Sub-navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
                Gemini AI 智慧運動教練中心
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              每日晨間早報 · 自適應訓練課表 · 即時運動生理專家諮詢
            </p>
          </div>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            id="subtab-all"
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>教練總覽</span>
          </button>

          <button
            id="subtab-briefing"
            onClick={() => setActiveSubTab('briefing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'briefing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>每日晨間早報</span>
          </button>

          <button
            id="subtab-plan"
            onClick={() => setActiveSubTab('plan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'plan'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>自適應課表</span>
          </button>

          <button
            id="subtab-chat"
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>即時諮詢</span>
          </button>
        </div>
      </div>

      {/* View Content Switching */}
      {activeSubTab === 'all' && (
        <div className="space-y-6">
          {/* Section 1: Morning Briefing */}
          <MorningBriefingCard
            briefing={morningBriefing}
            biometrics={biometrics}
            isLoading={isBriefingLoading}
            onRefresh={onRefreshBriefing}
            onNavigateToWorkout={() => setActiveSubTab('plan')}
          />

          {/* Section 2 & 3: Bento Grid: Adaptive Plan + Live Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <AdaptiveTrainingPlanCard
                plan={adaptivePlan}
                biometrics={biometrics}
                isLoading={isPlanLoading}
                onGoalChange={onPlanGoalChange}
                onStartWorkout={onStartWorkout}
              />
            </div>
            <div className="lg:col-span-5">
              <LiveAICoachChatCard
                biometrics={biometrics}
                onSendMessage={onSendMessageToCoach}
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'briefing' && (
        <MorningBriefingCard
          briefing={morningBriefing}
          biometrics={biometrics}
          isLoading={isBriefingLoading}
          onRefresh={onRefreshBriefing}
          onNavigateToWorkout={() => setActiveSubTab('plan')}
        />
      )}

      {activeSubTab === 'plan' && (
        <AdaptiveTrainingPlanCard
          plan={adaptivePlan}
          biometrics={biometrics}
          isLoading={isPlanLoading}
          onGoalChange={onPlanGoalChange}
          onStartWorkout={onStartWorkout}
        />
      )}

      {activeSubTab === 'chat' && (
        <LiveAICoachChatCard
          biometrics={biometrics}
          onSendMessage={onSendMessageToCoach}
        />
      )}
    </div>
  );
};
