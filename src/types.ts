export type ActivityMode = 'resting' | 'walking' | 'running' | 'hiit' | 'sleeping';

export interface HeartRateZoneInfo {
  zone: 1 | 2 | 3 | 4 | 5;
  name: string;
  nameEn: string;
  minBpm: number;
  maxBpm: number;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  timeSpentSec: number;
}

export interface HourlyMetricPoint {
  time: string; // e.g. "00:00", "04:00"
  heartRate: number;
  bodyBattery: number;
  stress: number;
  steps: number;
}

export interface ActivityRingMetric {
  current: number;
  target: number;
  unit: string;
  label: string;
  color: string;
  bgTrackColor: string;
}

export interface SleepData {
  score: number; // 0-100
  totalHours: number;
  bedTime: string;
  wakeTime: string;
  deepMinutes: number;
  lightMinutes: number;
  remMinutes: number;
  awakeMinutes: number;
  efficiency: number; // e.g. 92%
  restingHrDuringSleep: number;
  hrvNightAvg: number;
  recoveryHoursRemaining: number;
}

export interface BiometricsData {
  heartRate: number;
  restingHeartRate: number;
  maxHeartRate: number;
  hrv: number; // Heart Rate Variability (ms)
  spo2: number; // Blood Oxygen %
  stressLevel: number; // 0-100
  bodyBattery: number; // 0-100
  batteryCharged: number;
  batteryDrained: number;
  skinTempDeviation: number; // e.g. +0.2°C
  respiratoryRate: number; // breaths per minute (brpm)
  bloodPressureEst: { systolic: number; diastolic: number };
  
  // Daily Movement
  steps: number;
  stepGoal: number;
  distanceKm: number;
  elevationFloors: number;
  activeCalories: number;
  calorieGoal: number;
  exerciseMinutes: number;
  exerciseGoalMinutes: number;
  standHours: number;
  standGoalHours: number;

  // Sleep
  sleep: SleepData;

  // Timestamp
  lastUpdated: string;
}

export interface DeviceInfo {
  name: string;
  model: string;
  batteryLevel: number;
  isCharging: boolean;
  isConnected: boolean;
  signalQuality: 'excellent' | 'good' | 'fair';
  lastSyncTime: string;
  firmwareVersion: string;
}

export interface AIHealthReport {
  success: boolean;
  source?: string;
  summary: string;
  recommendations: string[];
  readinessScore: number;
  trainingFocus: string;
  recoveryStatus: string;
}

export type SportType = 'running' | 'cycling' | 'hiking' | 'trail_running' | 'swimming' | 'hiit';

export interface GPSPoint {
  latitude: number;
  longitude: number;
  elevation: number; // meters
  timestamp: string;
  heartRate: number;
  speedKmh: number;
  paceMinPerKm: number; // e.g. 5.25 = 5:15 /km
  cadence?: number; // spm / rpm
  powerWatts?: number;
  distanceFromStartKm: number;
}

export interface SplitLap {
  km: number;
  timeSeconds: number;
  paceFormatted: string; // e.g. "4'58\""
  avgHeartRate: number;
  elevationGainMeters: number;
  avgCadence: number;
}

export interface WorkoutSession {
  id: string;
  title: string;
  sportType: SportType;
  startTime: string;
  durationSeconds: number;
  distanceKm: number;
  caloriesBurned: number;
  avgHeartRate: number;
  maxHeartRate: number;
  avgPaceFormatted: string; // e.g. "5'12\""
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  elevationGainMeters: number;
  elevationLossMeters: number;
  avgCadence?: number; // spm for run, rpm for bike
  avgPowerWatts?: number;
  trainingEffect: {
    aerobic: number; // 0.0 - 5.0
    anaerobic: number; // 0.0 - 5.0
    description: string;
  };
  heartRateZoneDurations: {
    zone1: number; // seconds
    zone2: number;
    zone3: number;
    zone4: number;
    zone5: number;
  };
  splits: SplitLap[];
  gpsTrack: GPSPoint[];
  weather?: {
    temperatureC: number;
    humidityPct: number;
    condition: string;
  };
}

export type SleepStageType = 'deep' | 'light' | 'rem' | 'awake';

export interface SleepSegment {
  id: string;
  stage: SleepStageType;
  startTime: string; // e.g. "23:15"
  endTime: string;   // e.g. "23:55"
  startMinutes: number; // minutes from bedTime (0 to totalMinutes)
  durationMinutes: number;
  avgHeartRate: number;
  avgHRV: number;
  spo2: number;
  movementLevel: 'none' | 'low' | 'moderate' | 'high';
}

export interface SleepCycle {
  cycleNumber: number;
  name: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  deepMinutes: number;
  remMinutes: number;
  quality: 'optimal' | 'good' | 'interrupted';
}

export interface SleepTimelinePoint {
  time: string; // "23:30", "00:00"
  minutesFromBed: number;
  stage: SleepStageType;
  stageValue: number; // 0: Awake, 1: REM, 2: Light, 3: Deep (for stairs chart)
  heartRate: number;
  hrv: number;
  spo2: number;
  skinTempDeviation: number;
  respiratoryRate: number;
  movement: number;
}

export interface SleepQualitySubScores {
  durationScore: number;       // 0-100 (時長達成度)
  deepSleepScore: number;      // 0-100 (深睡慢波修復)
  remSleepScore: number;       // 0-100 (快速動眼記憶情緒修復)
  efficiencyScore: number;     // 0-100 (連續性與清醒次數)
  hrDipScore: number;          // 0-100 (夜間心率下潛率)
  hrvBalanceScore: number;     // 0-100 (自律神經與HRV平衡)
  sleepDebtMinutes: number;    // +/- 睡眠債分
  hrDipPercent: number;        // e.g. -14.8%
}

export interface RecoveryFactor {
  id: string;
  title: string;
  impactType: 'positive' | 'negative' | 'neutral';
  impactDescription: string;
  changeHours: number; // e.g. -1.5h or +2.0h
}

export interface RecoveryAssessment {
  readinessScore: number; // 0-100
  recoveryPercent: number; // 0-100%
  totalRecoveryHours: number; // e.g. 24
  recoveryHoursRemaining: number; // e.g. 3.75
  status: 'fully_recovered' | 'optimal' | 'moderate_fatigue' | 'heavy_fatigue';
  statusLabel: string;
  targetRecoveryTime: string; // e.g. "今日 13:45"
  recommendedActivity: string;
  maxSafeHrZone: number; // 1 to 5
  recommendedTrainingLoad: string;
  factors: RecoveryFactor[];
}

export interface DailySleepRecord {
  date: string;
  dayName: string; // "週一", "週二"
  score: number;
  totalHours: number;
  deepMinutes: number;
  lightMinutes: number;
  remMinutes: number;
  awakeMinutes: number;
  efficiency: number;
  hrDipPct: number;
  hrvAvg: number;
  bedTime: string;
  wakeTime: string;
}

// ==========================================
// Gemini AI Coach & Adaptive Training Types
// ==========================================

export interface MorningBriefingData {
  generatedAt: string;
  headline: string;
  bodyBatteryScore: number;
  readinessVerdict: string; // e.g. "巔峰黃金狀態 · 建議安排專項課表"
  readinessLevel: 'peak' | 'optimal' | 'moderate' | 'rest';
  overviewText: string;
  goldenWindow: {
    timeRange: string; // e.g. "16:30 - 18:15"
    reason: string;
    targetSport: string;
  };
  nutritionAdvice: {
    hydrationGoalMl: number;
    preWorkoutSnack: string;
    electrolyteTip: string;
  };
  nervousSystemInsight: {
    hrvStatus: string;
    stressGuidance: string;
    breathingTip: string;
  };
  keyActionItems: string[];
}

export type TrainingGoalType =
  | 'marathon_pb'
  | 'cycling_ftp'
  | 'fat_loss'
  | 'vo2max_hiit'
  | 'longevity_recovery';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface WorkoutPlanDay {
  id: string;
  dayOfWeek: string; // "週一", "週二" ...
  date: string; // "08/17"
  isToday: boolean;
  sportType: SportType | 'rest' | 'mobility' | 'strength';
  title: string;
  subtitle: string;
  intensity: 'Zone 1' | 'Zone 2' | 'Zone 3' | 'Zone 4' | 'Zone 5' | 'Rest';
  durationMinutes: number;
  targetHrBpm: string; // e.g. "135 - 148 BPM"
  targetPaceOrPower?: string; // e.g. "5'10\" /km" or "185W"
  estimatedCalories: number;
  trainingLoadScore: number; // EPOC / Load (e.g. 85)
  workoutStructure: string[]; // e.g. ["10m 慢跑熱身", "5x800m 間歇 (配速 4'10\")", "10m 緩和伸展"]
  adaptationReason: string; // Real-time biometric justification
  status: 'pending' | 'completed' | 'skipped' | 'in_progress';
}

export interface AdaptiveWorkoutPlan {
  id: string;
  goal: TrainingGoalType;
  goalLabel: string;
  fitnessLevel: FitnessLevel;
  weeklyMileageTargetKm: number;
  focusSummary: string;
  planPeriod: string; // e.g. "第 4 週 · 基礎期轉進步期"
  adaptiveAdjustmentNote: string;
  days: WorkoutPlanDay[];
  aiCoachVerdict: string;
}

export interface AICoachPersona {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatarEmoji: string;
  color: string;
  systemRoleDescription: string;
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'coach';
  coachId?: string;
  timestamp: string;
  text: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
  isStreaming?: boolean;
}

// ==========================================
// Gamification, Badges & Social Share Poster
// ==========================================

export type BadgeCategory = 'endurance' | 'streak' | 'recovery' | 'speed' | 'milestone' | 'vitality';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface GamificationBadge {
  id: string;
  title: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string; // Emoji or visual icon
  description: string;
  requirement: string;
  progress: number; // 0 - 100
  unlocked: boolean;
  unlockedAt?: string;
  expPoints: number;
  perk?: string; // e.g. "解鎖賽博霓虹海報主題"
}

export interface UserLevelInfo {
  currentLevel: number;
  levelTitle: string;
  currentExp: number;
  nextLevelExp: number;
  totalWorkouts: number;
  totalDistanceKm: number;
  totalCalories: number;
  streakDays: number;
  unlockedBadgesCount: number;
}

export type PosterThemeStyle = 
  | 'cyberpunk'     // 賽博霓虹黑金/青紫
  | 'minimal_pure'  // 極簡極致美學白/冷灰
  | 'mag_cover'     // 運動雜誌頭條 (Runner's World 風格)
  | 'fiery_beast'   // 熔岩赤焰能量爆發
  | 'aurora_glow'   // 極光紫青夢幻流光
  | 'retro_pixel';  // 復古街機像素風

export interface PosterCustomization {
  theme: PosterThemeStyle;
  headline: string;
  subQuote: string;
  includeGpsMap: boolean;
  includeHeartRateChart: boolean;
  includeBiometricsHUD: boolean;
  includeBadgeHighlight: boolean;
  selectedBadgeId?: string;
  customSticker: 'none' | 'pb_crushed' | 'king_of_zone2' | 'burn_the_fat' | 'unstoppable' | 'night_runner';
  aspectRatio: 'story_9_16' | 'square_1_1' | 'landscape_16_9';
  athleteName: string;
  customLocationTag: string;
}


