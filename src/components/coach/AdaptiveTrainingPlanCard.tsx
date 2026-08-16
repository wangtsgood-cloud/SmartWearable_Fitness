import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Flame, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Dumbbell, 
  Heart, 
  Play, 
  RefreshCw,
  ChevronRight,
  Sliders,
  Award
} from 'lucide-react';
import { 
  AdaptiveWorkoutPlan, 
  WorkoutPlanDay, 
  TrainingGoalType, 
  FitnessLevel, 
  BiometricsData,
  SportType 
} from '../../types';

interface Props {
  plan: AdaptiveWorkoutPlan | null;
  biometrics: BiometricsData;
  isLoading: boolean;
  onGoalChange: (goal: TrainingGoalType, level: FitnessLevel, weeklyTarget: number) => void;
  onStartWorkout: (workout: WorkoutPlanDay) => void;
}

export const AdaptiveTrainingPlanCard: React.FC<Props> = ({
  plan,
  biometrics,
  isLoading,
  onGoalChange,
  onStartWorkout,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<TrainingGoalType>(plan?.goal || 'marathon_pb');
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>(plan?.fitnessLevel || 'intermediate');
  const [weeklyMileage, setWeeklyMileage] = useState<number>(plan?.weeklyMileageTargetKm || 38);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  const goalOptions: { id: TrainingGoalType; label: string; icon: string; desc: string }[] = [
    { id: 'marathon_pb', label: '半馬/全馬破 PB', icon: '🏃‍♂️', desc: '乳酸閾值間歇 + LSD 長距離耐力打底' },
    { id: 'cycling_ftp', label: '公路車 FTP 突破', icon: '🚴', desc: 'Sweet Spot 甜蜜點輸出與踏頻控制' },
    { id: 'fat_loss', label: '減脂燃脂與體態', icon: '🔥', desc: 'Zone 2 最大脂肪氧化 + 全身肌力雕塑' },
    { id: 'vo2max_hiit', label: 'VO2Max 爆發力', icon: '⚡', desc: '4x4 挪威間歇與心肺引擎極限擴容' },
    { id: 'longevity_recovery', label: '主動修復與長壽', icon: '🧘', desc: '關節活動度、筋膜放鬆與自律神經調控' },
  ];

  const levelOptions: { id: FitnessLevel; label: string }[] = [
    { id: 'beginner', label: '初階 (Beginner)' },
    { id: 'intermediate', label: '中階 (Intermediate)' },
    { id: 'advanced', label: '進階 (Advanced)' },
    { id: 'elite', label: '菁英 (Elite)' },
  ];

  const handleApplyConfig = () => {
    onGoalChange(selectedGoal, selectedLevel, weeklyMileage);
    setShowConfigModal(false);
  };

  const defaultPlan: AdaptiveWorkoutPlan = plan || {
    id: "default-plan",
    goal: selectedGoal,
    goalLabel: "半馬/全馬破 PB 專項",
    fitnessLevel: selectedLevel,
    weeklyMileageTargetKm: weeklyMileage,
    focusSummary: "以 Zone 2 基礎有氧耐力為核心，搭配 1 次乳酸閾值間歇與 1 次週末長距離定速巡航，維持心血管高適應。",
    planPeriod: "第 3 週 · 專項進步期 (Cycle 2)",
    adaptiveAdjustmentNote: `⚡ 偵測到今日身體電量 ${biometrics.bodyBattery}%、HRV ${biometrics.hrv}ms，已自動為今日課表最佳化 +5% 巡航配速！`,
    aiCoachVerdict: "當前生理指標處於超補償高峰期，請嚴格遵守心率區間以達到最高訓練效益。",
    days: [
      {
        id: "d1",
        dayOfWeek: "週一",
        date: "今日",
        isToday: true,
        sportType: "running",
        title: "Zone 2 穩態基礎耐力跑",
        subtitle: "有氧打底與燃脂效率最佳化",
        intensity: "Zone 2",
        durationMinutes: 45,
        targetHrBpm: "135 - 148 BPM",
        targetPaceOrPower: "5'25\" - 5'40\" /km",
        estimatedCalories: 450,
        trainingLoadScore: 68,
        workoutStructure: [
          "10 分鐘輕鬆慢跑熱身 (Zone 1, 115-130 BPM)",
          "30 分鐘維持 Zone 2 穩態巡航配速 (專注深長腹式呼吸)",
          "5 分鐘慢走與下肢動態伸展冷卻"
        ],
        adaptationReason: `即時身體電量 ${biometrics.bodyBattery}% 充足，維持標準 45m 有氧堆疊。`,
        status: "pending"
      },
      {
        id: "d2",
        dayOfWeek: "週二",
        date: "明日",
        isToday: false,
        sportType: "running",
        title: "乳酸閾值間歇跑 (Threshold 4x5m)",
        subtitle: "提升乳酸清除率與高配速抗疲勞耐受力",
        intensity: "Zone 4",
        durationMinutes: 50,
        targetHrBpm: "162 - 174 BPM",
        targetPaceOrPower: "4'30\" - 4'45\" /km",
        estimatedCalories: 580,
        trainingLoadScore: 115,
        workoutStructure: [
          "12 分鐘漸進熱身跑 (Zone 1-2)",
          "4 組 x 5 分鐘 Zone 4 閾值跑 (組間慢跑 2 分鐘完全放鬆)",
          "10 分鐘輕鬆緩和慢跑"
        ],
        adaptationReason: "安排於充分修復之後，確保高輸出品質。",
        status: "pending"
      },
      {
        id: "d3",
        dayOfWeek: "週三",
        date: "08/19",
        isToday: false,
        sportType: "mobility",
        title: "主動修復與筋膜放鬆",
        subtitle: "自律神經調控與髖膝關節活動度",
        intensity: "Zone 1",
        durationMinutes: 30,
        targetHrBpm: "< 115 BPM",
        estimatedCalories: 120,
        trainingLoadScore: 20,
        workoutStructure: [
          "滾筒放鬆股四頭肌、闊筋膜張肌與小腿後側 10m",
          "動態鴿式與髖屈肌深度延展 10m",
          "10m 4-7-8 調息呼吸減壓"
        ],
        adaptationReason: "間歇日後的關鍵主動修復，預防延遲性肌肉酸痛與受傷。",
        status: "pending"
      },
      {
        id: "d4",
        dayOfWeek: "週四",
        date: "08/20",
        isToday: false,
        sportType: "cycling",
        title: "交叉訓練 · 低衝擊飛輪巡航",
        subtitle: "維持心肺刺激同時減輕膝踝關節衝擊",
        intensity: "Zone 2",
        durationMinutes: 50,
        targetHrBpm: "130 - 145 BPM",
        targetPaceOrPower: "160 - 180 Watts",
        estimatedCalories: 480,
        trainingLoadScore: 65,
        workoutStructure: [
          "8 分鐘輕齒比踏頻熱身 (85-90 rpm)",
          "35 分鐘穩態輸出 (Zone 2)",
          "7 分鐘低阻力放鬆冷卻"
        ],
        adaptationReason: "避免連續跑步造成的關節壓力，增進毛細血管密度。",
        status: "pending"
      },
      {
        id: "d5",
        dayOfWeek: "週五",
        date: "08/21",
        isToday: false,
        sportType: "strength",
        title: "下肢肌力與核心穩定強化",
        subtitle: "單腿平衡、臀中肌與抗旋轉核心",
        intensity: "Zone 2",
        durationMinutes: 40,
        targetHrBpm: "120 - 140 BPM",
        estimatedCalories: 300,
        trainingLoadScore: 55,
        workoutStructure: [
          "保加利亞分腿蹲 3組 x 10下 (強化單腿支撐力)",
          "單腳羅馬尼亞硬舉 3組 x 8下 (鍛鍊大腿後側膕旁肌)",
          "側平板支撐與鳥狗式 3組 (加固骨盆抗旋轉核心)"
        ],
        adaptationReason: "提升跑步經濟性，減少長距離後程步態塌陷。",
        status: "pending"
      },
      {
        id: "d6",
        dayOfWeek: "週六",
        date: "08/22",
        isToday: false,
        sportType: "running",
        title: "週末長距離慢跑 (LSD 14km)",
        subtitle: "有氧引擎擴容與脂肪代謝極限鍛鍊",
        intensity: "Zone 2",
        durationMinutes: 80,
        targetHrBpm: "136 - 150 BPM",
        targetPaceOrPower: "5'30\" - 5'50\" /km",
        estimatedCalories: 860,
        trainingLoadScore: 145,
        workoutStructure: [
          "前 15 分鐘輕鬆暖身 (配速 5'50\")",
          "55 分鐘定速巡航 (配速 5'35\", 累積 12-14km)",
          "10 分鐘冷卻與全身靜態伸展"
        ],
        adaptationReason: "每週主要訓練量累積日，訓練心理韌性與耐力儲備。",
        status: "pending"
      },
      {
        id: "d7",
        dayOfWeek: "週日",
        date: "08/23",
        isToday: false,
        sportType: "rest",
        title: "完全休息日 (Full Rest)",
        subtitle: "神經系統與肌原纖維全面重塑",
        intensity: "Rest",
        durationMinutes: 0,
        targetHrBpm: "--",
        estimatedCalories: 0,
        trainingLoadScore: 0,
        workoutStructure: [
          "享受充足睡眠 (目標 >8 小時)",
          "充足蛋白質與水分補充 (每公斤體重 1.6g 蛋白質)",
          "輕鬆散步或冥想"
        ],
        adaptationReason: "週期結尾超量恢復，為下週負荷儲備充沛動能。",
        status: "pending"
      }
    ]
  };

  const currentPlan: AdaptiveWorkoutPlan = (plan && Array.isArray(plan.days) && plan.days.length > 0) ? {
    ...defaultPlan,
    ...plan,
    days: plan.days.map((d, i) => ({
      ...defaultPlan.days[i % defaultPlan.days.length],
      ...d,
      workoutStructure: (d.workoutStructure && Array.isArray(d.workoutStructure) && d.workoutStructure.length > 0)
        ? d.workoutStructure
        : defaultPlan.days[i % defaultPlan.days.length].workoutStructure
    }))
  } : defaultPlan;

  const safeDayIndex = Math.min(Math.max(0, selectedDayIndex), currentPlan.days.length - 1);
  const activeDay: WorkoutPlanDay = currentPlan.days[safeDayIndex] || currentPlan.days[0];

  const getIntensityBadge = (intensity: string) => {
    switch (intensity) {
      case 'Zone 1':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">Zone 1 暖身恢復</span>;
      case 'Zone 2':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">Zone 2 有氧耐力</span>;
      case 'Zone 3':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Zone 3 節奏配速</span>;
      case 'Zone 4':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Zone 4 乳酸閾值</span>;
      case 'Zone 5':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Zone 5 無氧極限</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">完全休息</span>;
    }
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'running': return '🏃‍♂️';
      case 'cycling': return '🚴';
      case 'strength': return '🏋️‍♂️';
      case 'mobility': return '🧘';
      case 'hiit': return '⚡';
      default: return '🌙';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-slate-900 border-b border-slate-800/80 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  🎯 7日自適應個人化課表
                </span>
                <span className="text-xs text-slate-400">{currentPlan.planPeriod}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini 自適應演算法
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-1">
                {currentPlan.goalLabel} ({currentPlan.fitnessLevel})
              </h2>
            </div>
          </div>

          {/* Goal Setting & Regen Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              id="btn-open-plan-config"
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>目標設定</span>
            </button>

            <button
              id="btn-regen-plan"
              onClick={() => onGoalChange(selectedGoal, selectedLevel, weeklyMileage)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? '課表微調中...' : '自適應重編'}</span>
            </button>
          </div>
        </div>

        {/* Real-time AI Biometric Adaptation Banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0 animate-pulse" />
          <div className="text-xs text-slate-200 leading-relaxed">
            <span className="font-bold text-cyan-300">即時體徵自適應調校：</span>
            {currentPlan.adaptiveAdjustmentNote}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* 7-Day Interactive Day Strip */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">本週 7 日訓練日程 (點擊切換查看課表詳情)</span>
            <span className="text-xs text-slate-400 font-medium">目標週里程: <strong className="text-cyan-300">{currentPlan.weeklyMileageTargetKm} km</strong></span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {currentPlan.days.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={day.id}
                  id={`plan-day-btn-${idx}`}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500 shadow-md shadow-cyan-500/20'
                      : day.isToday
                      ? 'bg-slate-950/90 border-amber-500/50 hover:border-amber-500'
                      : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800'
                  }`}
                >
                  {day.isToday && (
                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 uppercase shadow-sm">
                      TODAY
                    </span>
                  )}

                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold text-slate-300">{day.dayOfWeek}</span>
                    <span className="text-[10px] text-slate-400">{day.date}</span>
                  </div>

                  <div className="my-1.5">
                    <div className="text-lg">{getSportIcon(day.sportType)}</div>
                    <div className="text-xs font-bold text-slate-100 truncate mt-0.5">{day.title}</div>
                    <div className="text-[10px] text-slate-400">{day.durationMinutes > 0 ? `${day.durationMinutes} 分鐘` : '休息修復'}</div>
                  </div>

                  <div className="mt-1">
                    {getIntensityBadge(day.intensity)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Expanded Detail Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xl">{getSportIcon(activeDay.sportType)}</span>
                <span className="text-sm font-bold text-cyan-400">{activeDay.dayOfWeek} ({activeDay.date})</span>
                {getIntensityBadge(activeDay.intensity)}
                {activeDay.isToday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ⚡ 今日課表
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-slate-100">{activeDay.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{activeDay.subtitle}</p>
            </div>

            {/* Start Workout Button */}
            {activeDay.sportType !== 'rest' && (
              <button
                id="btn-start-workout-session"
                onClick={() => onStartWorkout(activeDay)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>立即載入並執行此課表</span>
              </button>
            )}
          </div>

          {/* Metric Targets Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>預估時長</span>
              </div>
              <div className="text-base font-extrabold text-slate-100 mt-0.5">
                {activeDay.durationMinutes > 0 ? `${activeDay.durationMinutes} 分鐘` : '休息'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>目標心率區間</span>
              </div>
              <div className="text-base font-extrabold text-rose-300 mt-0.5">
                {activeDay.targetHrBpm}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-amber-400" />
                <span>目標配速/輸出</span>
              </div>
              <div className="text-base font-extrabold text-amber-300 mt-0.5">
                {activeDay.targetPaceOrPower || '--'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>預估消耗 / 負荷</span>
              </div>
              <div className="text-base font-extrabold text-orange-300 mt-0.5">
                {activeDay.estimatedCalories} kcal / {activeDay.trainingLoadScore}
              </div>
            </div>
          </div>

          {/* Workout Structure Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">訓練分段結構 (Workout Execution Steps)</h4>
            <div className="space-y-2">
              {activeDay.workoutStructure.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-200 leading-relaxed font-medium">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptation Rationale Footer */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span><strong>教練適應性理由：</strong>{activeDay.adaptationReason}</span>
          </div>
        </div>
      </div>

      {/* Goal & Preference Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold">自適應課表目標與偏好設定</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Goal Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">選擇主要運動目標</label>
              <div className="space-y-1.5">
                {goalOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedGoal(opt.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedGoal === opt.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{opt.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] text-slate-400">{opt.desc}</div>
                      </div>
                    </div>
                    {selectedGoal === opt.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fitness Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">體能等級</label>
              <div className="grid grid-cols-2 gap-2">
                {levelOptions.map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      selectedLevel === lvl.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Mileage Target */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">目標週累積里程</span>
                <span className="font-bold text-cyan-400">{weeklyMileage} km</span>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                step={5}
                value={weeklyMileage}
                onChange={e => setWeeklyMileage(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleApplyConfig}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                確認並重新生成課表
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
