import React, { useState, useEffect, useCallback } from 'react';
import { BiometricsHeader } from './components/BiometricsHeader';
import { HeartRateLiveCard } from './components/HeartRateLiveCard';
import { BodyBatteryCard } from './components/BodyBatteryCard';
import { ActivityRingsCard } from './components/ActivityRingsCard';
import { VitalsGridCard } from './components/VitalsGridCard';
import { SleepRecoveryCard } from './components/SleepRecoveryCard';
import { AiHealthInsightCard } from './components/AiHealthInsightCard';
import { WorkoutTrackerView } from './components/WorkoutTrackerView';
import { SleepRecoveryView } from './components/SleepRecoveryView';
import { AICoachDashboardView } from './components/coach/AICoachDashboardView';
import { GamificationCenterView } from './components/gamification/GamificationCenterView';
import { BreathingGuideModal } from './components/BreathingGuideModal';
import { DeviceSimulatorModal } from './components/DeviceSimulatorModal';
import {
  initialBiometrics,
  initialDeviceInfo,
  defaultZones,
  generate24hTrends,
  getPresetModeBiometrics,
} from './data/mockBiometrics';
import { workoutRiverside10K } from './data/mockWorkouts';
import { 
  ActivityMode, 
  BiometricsData, 
  DeviceInfo, 
  HeartRateZoneInfo, 
  AIHealthReport,
  MorningBriefingData,
  AdaptiveWorkoutPlan,
  WorkoutPlanDay,
  TrainingGoalType,
  FitnessLevel
} from './types';
import { Activity, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'biometrics' | 'workout_gps' | 'sleep_recovery' | 'ai_coach' | 'gamification'>('gamification');
  const [biometrics, setBiometrics] = useState<BiometricsData>(initialBiometrics);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(initialDeviceInfo);
  const [zones, setZones] = useState<HeartRateZoneInfo[]>(defaultZones);
  const [trendData, setTrendData] = useState(generate24hTrends());
  const [activeMode, setActiveMode] = useState<ActivityMode>('resting');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Modals
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  // AI Health Report state
  const [aiReport, setAiReport] = useState<AIHealthReport | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // AI Coach state
  const [morningBriefing, setMorningBriefing] = useState<MorningBriefingData | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState<boolean>(false);
  const [adaptivePlan, setAdaptivePlan] = useState<AdaptiveWorkoutPlan | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState<boolean>(false);

  // Fetch AI Insight from backend
  const fetchAiInsight = useCallback(async (currentBio: BiometricsData, mode: ActivityMode) => {
    setIsAiLoading(true);
    try {
      const modeLabelMap: Record<ActivityMode, string> = {
        resting: '靜止休息狀態 (辦公與常規作息)',
        walking: '輕快散步 (低強度有氧活動)',
        running: '有氧慢跑 (Zone 2~3 耐力訓練)',
        hiit: '高強度間歇衝刺 (Zone 4~5 無氧負荷)',
        sleeping: '夜間睡眠修復狀態',
      };

      const res = await fetch('/api/health/ai-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biometrics: currentBio,
          currentStatus: modeLabelMap[mode],
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setAiReport(data);
    } catch (err) {
      console.warn('AI API error, fallback loaded:', err);
      // Client fallback report
      setAiReport({
        success: true,
        source: 'local-engine',
        summary: `今日身體電量充足 (${currentBio.bodyBattery}%)，心率變異度 (HRV: ${currentBio.hrv}ms) 與睡眠品質 (${currentBio.sleep.score}分) 均維持在最佳修復區間。`,
        recommendations: [
          '推薦進行 35 分鐘 Zone 2 輕鬆有氧跑或騎行，打牢心肺耐力基礎。',
          '今日深睡時長達標，體能已準備好接受中高強度肌力訓練。',
          '保持規律補充水分，今日目標至少 2,000ml。',
        ],
        readinessScore: 88,
        trainingFocus: 'Zone 2 基礎耐力訓練 / 核心力量增強',
        recoveryStatus: '恢復極佳 (Peak Readiness)',
      });
    } finally {
      setIsAiLoading(false);
    }
  }, []);

  // Fetch AI Morning Briefing
  const fetchMorningBriefing = useCallback(async (currentBio: BiometricsData) => {
    setIsBriefingLoading(true);
    try {
      const res = await fetch('/api/coach/morning-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ biometrics: currentBio }),
      });
      if (!res.ok) throw new Error('Briefing request failed');
      const data = await res.json();
      if (data && data.briefing) {
        setMorningBriefing(data.briefing);
      } else if (data && data.headline) {
        setMorningBriefing(data);
      }
    } catch (err) {
      console.warn('Morning briefing error, using default:', err);
    } finally {
      setIsBriefingLoading(false);
    }
  }, []);

  // Fetch AI Adaptive Plan
  const fetchAdaptivePlan = useCallback(async (
    currentBio: BiometricsData, 
    goal: TrainingGoalType = 'marathon_pb', 
    fitnessLevel: FitnessLevel = 'intermediate',
    weeklyTargetKm: number = 38
  ) => {
    setIsPlanLoading(true);
    try {
      const res = await fetch('/api/coach/adaptive-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biometrics: currentBio,
          goal,
          fitnessLevel,
          weeklyMileageTarget: weeklyTargetKm,
        }),
      });
      if (!res.ok) throw new Error('Plan request failed');
      const data = await res.json();
      if (data && data.plan) {
        setAdaptivePlan(data.plan);
      } else if (data && data.days) {
        setAdaptivePlan(data);
      }
    } catch (err) {
      console.warn('Plan fetch error, using default:', err);
    } finally {
      setIsPlanLoading(false);
    }
  }, []);

  // Live Chat handler with coach
  const handleSendMessageToCoach = async (text: string, persona: string): Promise<string> => {
    try {
      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          persona,
          biometrics,
        }),
      });
      if (!res.ok) throw new Error('Chat API failed');
      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.warn('Chat error:', err);
      throw err;
    }
  };

  // Start workout action triggered from AI Coach
  const handleStartWorkout = (workout: WorkoutPlanDay) => {
    setActiveTab('workout_gps');
    setNotification(`⚡ 已載入教練課表「${workout.title}」！準備開始訓練`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial load
  useEffect(() => {
    fetchAiInsight(biometrics, activeMode);
    fetchMorningBriefing(biometrics);
    fetchAdaptivePlan(biometrics);
  }, []);

  // Real-time biometrics stream simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setBiometrics((prev) => {
        // Natural small heartbeat fluctuation
        const jitter = (Math.random() - 0.5) * 2;
        const newHr = Math.max(45, Math.min(195, Math.round(prev.heartRate + jitter)));

        // Increment steps slightly if in active modes
        let stepDelta = 0;
        let calDelta = 0;
        if (activeMode === 'walking') {
          stepDelta = Math.floor(Math.random() * 3) + 1;
          calDelta = 0.08;
        } else if (activeMode === 'running') {
          stepDelta = Math.floor(Math.random() * 5) + 3;
          calDelta = 0.35;
        } else if (activeMode === 'hiit') {
          stepDelta = Math.floor(Math.random() * 8) + 4;
          calDelta = 0.6;
        }

        const newSteps = prev.steps + stepDelta;
        const newCalories = Math.round(prev.activeCalories + calDelta);
        const newDist = parseFloat((prev.distanceKm + (stepDelta * 0.00075)).toFixed(2));

        return {
          ...prev,
          heartRate: newHr,
          steps: newSteps,
          activeCalories: newCalories,
          distanceKm: newDist,
          lastUpdated: new Date().toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isLiveStreaming, activeMode]);

  // Handle mode switch (e.g. from resting to running)
  const handleModeChange = (mode: ActivityMode) => {
    setActiveMode(mode);
    const overrides = getPresetModeBiometrics(mode);

    setBiometrics((prev) => {
      const updated = {
        ...prev,
        ...overrides,
      } as BiometricsData;
      return updated;
    });

    // Show temporary toast
    const modeNames: Record<ActivityMode, string> = {
      resting: '🪑 已切換為「靜止休息」模式',
      walking: '🚶‍♂️ 已切換為「輕快散步」模式',
      running: '🏃‍♂️ 已切換為「有氧慢跑」模式 (心率提升)',
      hiit: '⚡ 已切換為「極限衝刺」模式 (心率高強度)',
      sleeping: '🌙 已切換為「睡眠放鬆」模式',
    };
    setNotification(modeNames[mode]);
    setTimeout(() => setNotification(null), 3000);
  };

  // Breathing session complete callback
  const handleBreathingComplete = (reduction: number) => {
    setBiometrics((prev) => ({
      ...prev,
      heartRate: Math.max(56, prev.heartRate - reduction),
      stressLevel: Math.max(12, prev.stressLevel - 15),
      bodyBattery: Math.min(100, prev.bodyBattery + 6),
      hrv: prev.hrv + 5,
    }));
    setIsBreathingOpen(false);
    setNotification('🧘 呼吸減壓完成！心率已降低，身體電量回充 +6%');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Fixed Header */}
      <BiometricsHeader
        deviceInfo={deviceInfo}
        activeMode={activeMode}
        onModeChange={handleModeChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenBreathing={() => setIsBreathingOpen(true)}
        onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
        onRefreshAi={() => {
          fetchAiInsight(biometrics, activeMode);
          fetchMorningBriefing(biometrics);
        }}
        isAiLoading={isAiLoading || isBriefingLoading}
        isLiveStreaming={isLiveStreaming}
        onToggleLiveStream={() => setIsLiveStreaming(!isLiveStreaming)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'ai_coach' ? (
          <AICoachDashboardView
            biometrics={biometrics}
            morningBriefing={morningBriefing}
            adaptivePlan={adaptivePlan}
            isBriefingLoading={isBriefingLoading}
            isPlanLoading={isPlanLoading}
            onRefreshBriefing={() => fetchMorningBriefing(biometrics)}
            onPlanGoalChange={(goal, level, weeklyTarget) => fetchAdaptivePlan(biometrics, goal, level, weeklyTarget)}
            onSendMessageToCoach={handleSendMessageToCoach}
            onStartWorkout={handleStartWorkout}
          />
        ) : activeTab === 'workout_gps' ? (
          <WorkoutTrackerView currentBiometrics={biometrics} />
        ) : activeTab === 'sleep_recovery' ? (
          <SleepRecoveryView
            currentBiometrics={biometrics}
            onOpenBreathing={() => setIsBreathingOpen(true)}
            onOpenAICoach={() => setActiveTab('ai_coach')}
          />
        ) : activeTab === 'gamification' ? (
          <GamificationCenterView
            biometrics={biometrics}
            activeWorkout={workoutRiverside10K}
          />
        ) : (
          <>
            {/* Row 1: Gemini AI Diagnostic Summary & Recommendations */}
            <section aria-label="Gemini AI Health Insight">
              <AiHealthInsightCard
                report={aiReport}
                isLoading={isAiLoading}
                onRefresh={() => fetchAiInsight(biometrics, activeMode)}
                onOpenAICoach={() => setActiveTab('ai_coach')}
              />
            </section>

            {/* Row 2: Heart Rate Live (ECG) + Body Battery & Stress */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HeartRateLiveCard
                heartRate={biometrics.heartRate}
                restingHeartRate={biometrics.restingHeartRate}
                maxHeartRate={biometrics.maxHeartRate}
                hrv={biometrics.hrv}
                zones={zones}
                isLive={isLiveStreaming}
              />

              <BodyBatteryCard
                bodyBattery={biometrics.bodyBattery}
                batteryCharged={biometrics.batteryCharged}
                batteryDrained={biometrics.batteryDrained}
                stressLevel={biometrics.stressLevel}
                trendData={trendData}
                onOpenBreathing={() => setIsBreathingOpen(true)}
              />
            </section>

            {/* Row 3: Activity Rings & Steps + Sleep Architecture */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityRingsCard
                steps={biometrics.steps}
                stepGoal={biometrics.stepGoal}
                distanceKm={biometrics.distanceKm}
                elevationFloors={biometrics.elevationFloors}
                activeCalories={biometrics.activeCalories}
                calorieGoal={biometrics.calorieGoal}
                exerciseMinutes={biometrics.exerciseMinutes}
                exerciseGoalMinutes={biometrics.exerciseGoalMinutes}
                standHours={biometrics.standHours}
                standGoalHours={biometrics.standGoalHours}
              />

              <SleepRecoveryCard
                sleep={biometrics.sleep}
                onOpenFullView={() => setActiveTab('sleep_recovery')}
              />
            </section>

            {/* Row 4: Full Clinical-grade Vitals Grid */}
            <section>
              <VitalsGridCard
                spo2={biometrics.spo2}
                respiratoryRate={biometrics.respiratoryRate}
                skinTempDeviation={biometrics.skinTempDeviation}
                hrv={biometrics.hrv}
                bloodPressure={biometrics.bloodPressureEst}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>智慧穿戴與運動追蹤平台 · 即時生理數據監測與 Gemini AI 運動生理分析引擎</p>
      </footer>

      {/* Interactive Modals */}
      <BreathingGuideModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
        onSessionComplete={handleBreathingComplete}
      />

      <DeviceSimulatorModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        deviceInfo={deviceInfo}
        onUpdateDevice={(info) => setDeviceInfo(info)}
      />
    </div>
  );
}
