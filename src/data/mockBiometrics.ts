import { BiometricsData, DeviceInfo, HeartRateZoneInfo, HourlyMetricPoint, ActivityMode } from '../types';

export const initialDeviceInfo: DeviceInfo = {
  name: "Garmin Forerunner 965",
  model: "Apex Black / Titanium Edition",
  batteryLevel: 84,
  isCharging: false,
  isConnected: true,
  signalQuality: "excellent",
  lastSyncTime: "剛剛 (即時同步)",
  firmwareVersion: "v18.23",
};

export const defaultZones: HeartRateZoneInfo[] = [
  {
    zone: 1,
    name: "暖身放鬆",
    nameEn: "Warm Up",
    minBpm: 95,
    maxBpm: 114,
    color: "#60a5fa", // Blue
    bgColor: "rgba(96, 165, 250, 0.15)",
    borderColor: "rgba(96, 165, 250, 0.4)",
    description: "促進血液循環、運動前後收操放鬆",
    timeSpentSec: 2400, // 40 mins
  },
  {
    zone: 2,
    name: "燃脂有氧",
    nameEn: "Fat Burn",
    minBpm: 115,
    maxBpm: 133,
    color: "#34d399", // Emerald Green
    bgColor: "rgba(52, 211, 153, 0.15)",
    borderColor: "rgba(52, 211, 153, 0.4)",
    description: "提升基礎代謝與粒線體密度、高效燃脂",
    timeSpentSec: 3600, // 60 mins
  },
  {
    zone: 3,
    name: "耐力有氧",
    nameEn: "Aerobic",
    minBpm: 134,
    maxBpm: 152,
    color: "#fbbf24", // Amber Yellow
    bgColor: "rgba(251, 191, 36, 0.15)",
    borderColor: "rgba(251, 191, 36, 0.4)",
    description: "增強心肺耐力與有氧配速維持能力",
    timeSpentSec: 1800, // 30 mins
  },
  {
    zone: 4,
    name: "無氧乳酸",
    nameEn: "Anaerobic Threshold",
    minBpm: 153,
    maxBpm: 171,
    color: "#fb923c", // Orange
    bgColor: "rgba(251, 146, 60, 0.15)",
    borderColor: "rgba(251, 146, 60, 0.4)",
    description: "提高乳酸耐受度與抗疲勞爆發力",
    timeSpentSec: 720, // 12 mins
  },
  {
    zone: 5,
    name: "極限衝刺",
    nameEn: "Maximum Peak",
    minBpm: 172,
    maxBpm: 190,
    color: "#f87171", // Rose Red
    bgColor: "rgba(248, 113, 113, 0.15)",
    borderColor: "rgba(248, 113, 113, 0.4)",
    description: "短時間神經肌肉衝刺、極限功率釋放",
    timeSpentSec: 180, // 3 mins
  },
];

export const generate24hTrends = (): HourlyMetricPoint[] => {
  const points: HourlyMetricPoint[] = [];
  const hours = [
    "00:00", "02:00", "04:00", "06:00", "08:00", "10:00",
    "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "現在"
  ];

  // Realistic diurnal curves
  const hrCurve = [54, 52, 51, 56, 78, 88, 75, 82, 92, 138, 76, 64, 72];
  const batteryCurve = [70, 82, 92, 98, 92, 85, 78, 68, 62, 48, 42, 38, 78];
  const stressCurve = [12, 10, 8, 18, 35, 48, 32, 45, 52, 74, 28, 22, 26];
  const stepsCurve = [0, 0, 0, 120, 1450, 2800, 4200, 5600, 6800, 8100, 8350, 8420, 8420];

  for (let i = 0; i < hours.length; i++) {
    points.push({
      time: hours[i],
      heartRate: hrCurve[i],
      bodyBattery: batteryCurve[i],
      stress: stressCurve[i],
      steps: stepsCurve[i],
    });
  }
  return points;
};

export const initialBiometrics: BiometricsData = {
  heartRate: 72,
  restingHeartRate: 56,
  maxHeartRate: 188,
  hrv: 68,
  spo2: 98,
  stressLevel: 26,
  bodyBattery: 78,
  batteryCharged: 48,
  batteryDrained: 28,
  skinTempDeviation: 0.1,
  respiratoryRate: 14,
  bloodPressureEst: { systolic: 118, diastolic: 76 },

  steps: 8420,
  stepGoal: 10000,
  distanceKm: 6.32,
  elevationFloors: 16,
  activeCalories: 580,
  calorieGoal: 650,
  exerciseMinutes: 44,
  exerciseGoalMinutes: 30,
  standHours: 10,
  standGoalHours: 12,

  sleep: {
    score: 87,
    totalHours: 7.7,
    bedTime: "23:15",
    wakeTime: "06:57",
    deepMinutes: 108, // 1h 48m
    lightMinutes: 242, // 4h 02m
    remMinutes: 84,   // 1h 24m
    awakeMinutes: 28, // 28m
    efficiency: 94,
    restingHrDuringSleep: 52,
    hrvNightAvg: 72,
    recoveryHoursRemaining: 4,
  },

  lastUpdated: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
};

export const getPresetModeBiometrics = (mode: ActivityMode): Partial<BiometricsData> => {
  switch (mode) {
    case 'resting':
      return {
        heartRate: 64,
        stressLevel: 18,
        spo2: 99,
        respiratoryRate: 12,
        hrv: 76,
      };
    case 'walking':
      return {
        heartRate: 98,
        stressLevel: 38,
        spo2: 98,
        respiratoryRate: 16,
        hrv: 58,
      };
    case 'running':
      return {
        heartRate: 146,
        stressLevel: 68,
        spo2: 97,
        respiratoryRate: 28,
        hrv: 42,
      };
    case 'hiit':
      return {
        heartRate: 174,
        stressLevel: 88,
        spo2: 96,
        respiratoryRate: 34,
        hrv: 30,
      };
    case 'sleeping':
      return {
        heartRate: 52,
        stressLevel: 8,
        spo2: 98,
        respiratoryRate: 11,
        hrv: 82,
      };
  }
};
