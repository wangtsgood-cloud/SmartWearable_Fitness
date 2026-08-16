import { WorkoutSession, GPSPoint, SplitLap, SportType } from '../types';

// Helper to generate a realistic looping GPS track
export const generateLoopGPS = (
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  numPoints: number,
  baseElevation: number,
  elevationVar: number,
  basePace: number,
  baseHr: number,
  sport: SportType
): GPSPoint[] => {
  const points: GPSPoint[] = [];
  let cumDistance = 0;
  const startTime = new Date(Date.now() - 3600000);

  for (let i = 0; i <= numPoints; i++) {
    const progress = i / numPoints;
    const angle = progress * Math.PI * 2;
    
    // Slight jitter to make track feel organic and like a real trail / road
    const wobble1 = Math.sin(angle * 3) * 0.25;
    const wobble2 = Math.cos(angle * 5) * 0.15;
    const r = radiusKm * (1 + wobble1 + wobble2);

    // Convert km offset to degrees (approx: 1 deg lat ~ 111km, 1 deg lng ~ 102km in Taiwan)
    const dLat = (r * Math.cos(angle)) / 111;
    const dLng = (r * Math.sin(angle)) / 102;

    const lat = centerLat + dLat;
    const lng = centerLng + dLng;

    // Elevation model: climbing on first half, descending on second
    const elev = baseElevation + Math.sin(progress * Math.PI) * elevationVar + Math.sin(progress * 8) * 4;

    // Pace & HR correlation: climbing uphill -> slower pace & higher HR
    const climbEffort = (Math.sin(progress * Math.PI) * 0.5);
    const pace = basePace + climbEffort * 0.8 + (Math.random() - 0.5) * 0.2;
    const hr = Math.round(baseHr + climbEffort * 22 + (Math.random() - 0.5) * 4);
    const speed = parseFloat((60 / pace).toFixed(1));

    if (i > 0) {
      cumDistance += (radiusKm * 2 * Math.PI) / numPoints;
    }

    const ptTime = new Date(startTime.getTime() + (cumDistance * pace * 60000));

    points.push({
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      elevation: Math.round(elev),
      timestamp: ptTime.toISOString(),
      heartRate: Math.max(80, Math.min(195, hr)),
      speedKmh: speed,
      paceMinPerKm: parseFloat(pace.toFixed(2)),
      cadence: sport === 'running' ? Math.round(176 + (Math.random() - 0.5) * 6) : Math.round(85 + (Math.random() - 0.5) * 8),
      powerWatts: sport === 'cycling' ? Math.round(180 + climbEffort * 110) : undefined,
      distanceFromStartKm: parseFloat(cumDistance.toFixed(2)),
    });
  }

  return points;
};

// Preset Workout 1: 大佳河濱公園 10K 有氧節奏跑
const runTrack10K = generateLoopGPS(
  25.0715, 121.5360, 1.45, 120, 12, 18, 4.85, 154, 'running'
);

const splits10K: SplitLap[] = [
  { km: 1, timeSeconds: 302, paceFormatted: "5'02\"", avgHeartRate: 142, elevationGainMeters: 3, avgCadence: 174 },
  { km: 2, timeSeconds: 294, paceFormatted: "4'54\"", avgHeartRate: 148, elevationGainMeters: 4, avgCadence: 176 },
  { km: 3, timeSeconds: 288, paceFormatted: "4'48\"", avgHeartRate: 152, elevationGainMeters: 2, avgCadence: 178 },
  { km: 4, timeSeconds: 285, paceFormatted: "4'45\"", avgHeartRate: 155, elevationGainMeters: 5, avgCadence: 179 },
  { km: 5, timeSeconds: 290, paceFormatted: "4'50\"", avgHeartRate: 156, elevationGainMeters: 2, avgCadence: 177 },
  { km: 6, timeSeconds: 284, paceFormatted: "4'44\"", avgHeartRate: 158, elevationGainMeters: 3, avgCadence: 180 },
  { km: 7, timeSeconds: 282, paceFormatted: "4'42\"", avgHeartRate: 160, elevationGainMeters: 4, avgCadence: 180 },
  { km: 8, timeSeconds: 278, paceFormatted: "4'38\"", avgHeartRate: 163, elevationGainMeters: 2, avgCadence: 182 },
  { km: 9, timeSeconds: 275, paceFormatted: "4'35\"", avgHeartRate: 166, elevationGainMeters: 1, avgCadence: 184 },
  { km: 10, timeSeconds: 265, paceFormatted: "4'25\"", avgHeartRate: 174, elevationGainMeters: 2, avgCadence: 188 },
];

export const workoutRiverside10K: WorkoutSession = {
  id: "workout-run-10k-01",
  title: "大佳河濱 10K 漸進節奏跑 (Tempo Progression)",
  sportType: "running",
  startTime: "2026-08-15 06:15",
  durationSeconds: 2843, // 47m 23s
  distanceKm: 10.05,
  caloriesBurned: 685,
  avgHeartRate: 156,
  maxHeartRate: 178,
  avgPaceFormatted: "4'42\"",
  avgSpeedKmh: 12.7,
  maxSpeedKmh: 14.8,
  elevationGainMeters: 28,
  elevationLossMeters: 26,
  avgCadence: 178,
  trainingEffect: {
    aerobic: 4.2,
    anaerobic: 2.1,
    description: "高度提升乳酸閾值與有氧巡航輸出，具備極佳心肺刺激效果。",
  },
  heartRateZoneDurations: {
    zone1: 180,
    zone2: 720,
    zone3: 1240,
    zone4: 640,
    zone5: 63,
  },
  splits: splits10K,
  gpsTrack: runTrack10K,
  weather: {
    temperatureC: 24,
    humidityPct: 68,
    condition: "晴朗微風",
  },
};

// Preset Workout 2: 陽明山風櫃嘴公路車爬坡挑戰 (Cycling)
const bikeTrack = generateLoopGPS(
  25.1320, 121.5780, 3.8, 140, 85, 480, 2.4, 162, 'cycling'
);

const splitsCycling: SplitLap[] = [
  { km: 5, timeSeconds: 720, paceFormatted: "2'24\"", avgHeartRate: 148, elevationGainMeters: 65, avgCadence: 88 },
  { km: 10, timeSeconds: 980, paceFormatted: "3'16\"", avgHeartRate: 165, elevationGainMeters: 185, avgCadence: 78 },
  { km: 15, timeSeconds: 1120, paceFormatted: "3'44\"", avgHeartRate: 172, elevationGainMeters: 220, avgCadence: 74 },
  { km: 20, timeSeconds: 620, paceFormatted: "2'04\"", avgHeartRate: 135, elevationGainMeters: 40, avgCadence: 92 },
  { km: 24, timeSeconds: 480, paceFormatted: "2'00\"", avgHeartRate: 128, elevationGainMeters: 15, avgCadence: 95 },
];

export const workoutCyclingHill: WorkoutSession = {
  id: "workout-cycle-fenggui-02",
  title: "陽明山風櫃嘴爬坡巡航 (Hill Climb Ride)",
  sportType: "cycling",
  startTime: "2026-08-14 07:00",
  durationSeconds: 3920, // 1h 05m
  distanceKm: 24.2,
  caloriesBurned: 940,
  avgHeartRate: 158,
  maxHeartRate: 182,
  avgPaceFormatted: "2'41\"",
  avgSpeedKmh: 22.2,
  maxSpeedKmh: 48.5,
  elevationGainMeters: 525,
  elevationLossMeters: 510,
  avgCadence: 82,
  avgPowerWatts: 215,
  trainingEffect: {
    aerobic: 4.8,
    anaerobic: 3.4,
    description: "極高強度爬坡負荷，有效增強肌耐力與無氧乳酸耐受能力。",
  },
  heartRateZoneDurations: {
    zone1: 240,
    zone2: 680,
    zone3: 1100,
    zone4: 1540,
    zone5: 360,
  },
  splits: splitsCycling,
  gpsTrack: bikeTrack,
  weather: {
    temperatureC: 22,
    humidityPct: 75,
    condition: "山區多雲清爽",
  },
};

// Preset Workout 3: 象山九五峰越野登山健行 (Trail Hiking)
const hikeTrack = generateLoopGPS(
  25.0280, 121.5790, 0.85, 90, 45, 320, 12.5, 138, 'hiking'
);

const splitsHiking: SplitLap[] = [
  { km: 1, timeSeconds: 840, paceFormatted: "14'00\"", avgHeartRate: 132, elevationGainMeters: 110, avgCadence: 110 },
  { km: 2, timeSeconds: 960, paceFormatted: "16'00\"", avgHeartRate: 148, elevationGainMeters: 145, avgCadence: 104 },
  { km: 3, timeSeconds: 780, paceFormatted: "13'00\"", avgHeartRate: 135, elevationGainMeters: 65, avgCadence: 115 },
  { km: 4, timeSeconds: 650, paceFormatted: "10'50\"", avgHeartRate: 120, elevationGainMeters: 15, avgCadence: 122 },
  { km: 5.2, timeSeconds: 720, paceFormatted: "12'00\"", avgHeartRate: 118, elevationGainMeters: 20, avgCadence: 118 },
];

export const workoutTrailHiking: WorkoutSession = {
  id: "workout-hike-xiangshan-03",
  title: "象山九五峰階梯越野越嶺 (Trail Hike)",
  sportType: "hiking",
  startTime: "2026-08-13 16:30",
  durationSeconds: 3950,
  distanceKm: 5.2,
  caloriesBurned: 495,
  avgHeartRate: 134,
  maxHeartRate: 164,
  avgPaceFormatted: "12'39\"",
  avgSpeedKmh: 4.7,
  maxSpeedKmh: 6.8,
  elevationGainMeters: 355,
  elevationLossMeters: 340,
  avgCadence: 114,
  trainingEffect: {
    aerobic: 3.2,
    anaerobic: 1.2,
    description: "良好的下肢肌力激活與基礎有氧心肺訓練，燃脂效率優異。",
  },
  heartRateZoneDurations: {
    zone1: 620,
    zone2: 1840,
    zone3: 1120,
    zone4: 340,
    zone5: 30,
  },
  splits: splitsHiking,
  gpsTrack: hikeTrack,
  weather: {
    temperatureC: 28,
    humidityPct: 80,
    condition: "午後微風",
  },
};

export const sampleWorkoutList: WorkoutSession[] = [
  workoutRiverside10K,
  workoutCyclingHill,
  workoutTrailHiking,
];
