import {
  SleepSegment,
  SleepCycle,
  SleepTimelinePoint,
  SleepQualitySubScores,
  RecoveryAssessment,
  DailySleepRecord,
} from '../types';

// Sleep Segments for Gantt Chart (23:15 -> 06:57 = 462 mins)
export const mockSleepSegments: SleepSegment[] = [
  // Onset & Cycle 1
  {
    id: 'seg-1',
    stage: 'awake',
    startTime: '23:15',
    endTime: '23:23',
    startMinutes: 0,
    durationMinutes: 8,
    avgHeartRate: 66,
    avgHRV: 52,
    spo2: 99,
    movementLevel: 'moderate',
  },
  {
    id: 'seg-2',
    stage: 'light',
    startTime: '23:23',
    endTime: '23:45',
    startMinutes: 8,
    durationMinutes: 22,
    avgHeartRate: 58,
    avgHRV: 64,
    spo2: 98,
    movementLevel: 'low',
  },
  {
    id: 'seg-3',
    stage: 'deep',
    startTime: '23:45',
    endTime: '00:35',
    startMinutes: 30,
    durationMinutes: 50,
    avgHeartRate: 49,
    avgHRV: 84,
    spo2: 98,
    movementLevel: 'none',
  },
  {
    id: 'seg-4',
    stage: 'light',
    startTime: '00:35',
    endTime: '00:48',
    startMinutes: 80,
    durationMinutes: 13,
    avgHeartRate: 54,
    avgHRV: 70,
    spo2: 98,
    movementLevel: 'low',
  },
  {
    id: 'seg-5',
    stage: 'rem',
    startTime: '00:48',
    endTime: '01:05',
    startMinutes: 93,
    durationMinutes: 17,
    avgHeartRate: 57,
    avgHRV: 62,
    spo2: 97,
    movementLevel: 'none',
  },

  // Cycle 2
  {
    id: 'seg-6',
    stage: 'light',
    startTime: '01:05',
    endTime: '01:25',
    startMinutes: 110,
    durationMinutes: 20,
    avgHeartRate: 53,
    avgHRV: 72,
    spo2: 98,
    movementLevel: 'none',
  },
  {
    id: 'seg-7',
    stage: 'deep',
    startTime: '01:25',
    endTime: '02:05',
    startMinutes: 130,
    durationMinutes: 40,
    avgHeartRate: 48,
    avgHRV: 88,
    spo2: 98,
    movementLevel: 'none',
  },
  {
    id: 'seg-8',
    stage: 'light',
    startTime: '02:05',
    endTime: '02:22',
    startMinutes: 170,
    durationMinutes: 17,
    avgHeartRate: 52,
    avgHRV: 74,
    spo2: 98,
    movementLevel: 'low',
  },
  {
    id: 'seg-9',
    stage: 'rem',
    startTime: '02:22',
    endTime: '02:45',
    startMinutes: 187,
    durationMinutes: 23,
    avgHeartRate: 56,
    avgHRV: 66,
    spo2: 97,
    movementLevel: 'none',
  },

  // Cycle 3 (Mid-night with brief toss)
  {
    id: 'seg-10',
    stage: 'awake',
    startTime: '02:45',
    endTime: '02:53',
    startMinutes: 210,
    durationMinutes: 8,
    avgHeartRate: 64,
    avgHRV: 55,
    spo2: 98,
    movementLevel: 'high',
  },
  {
    id: 'seg-11',
    stage: 'light',
    startTime: '02:53',
    endTime: '03:25',
    startMinutes: 218,
    durationMinutes: 32,
    avgHeartRate: 52,
    avgHRV: 76,
    spo2: 98,
    movementLevel: 'low',
  },
  {
    id: 'seg-12',
    stage: 'deep',
    startTime: '03:25',
    endTime: '03:43',
    startMinutes: 250,
    durationMinutes: 18,
    avgHeartRate: 49,
    avgHRV: 82,
    spo2: 98,
    movementLevel: 'none',
  },
  {
    id: 'seg-13',
    stage: 'rem',
    startTime: '03:43',
    endTime: '04:10',
    startMinutes: 268,
    durationMinutes: 27,
    avgHeartRate: 55,
    avgHRV: 68,
    spo2: 97,
    movementLevel: 'none',
  },

  // Cycle 4
  {
    id: 'seg-14',
    stage: 'light',
    startTime: '04:10',
    endTime: '04:55',
    startMinutes: 295,
    durationMinutes: 45,
    avgHeartRate: 51,
    avgHRV: 78,
    spo2: 98,
    movementLevel: 'none',
  },
  {
    id: 'seg-15',
    stage: 'awake',
    startTime: '04:55',
    endTime: '05:01',
    startMinutes: 340,
    durationMinutes: 6,
    avgHeartRate: 62,
    avgHRV: 58,
    spo2: 98,
    movementLevel: 'moderate',
  },
  {
    id: 'seg-16',
    stage: 'rem',
    startTime: '05:01',
    endTime: '05:25',
    startMinutes: 346,
    durationMinutes: 24,
    avgHeartRate: 54,
    avgHRV: 70,
    spo2: 97,
    movementLevel: 'none',
  },

  // Cycle 5 & Wake Up
  {
    id: 'seg-17',
    stage: 'light',
    startTime: '05:25',
    endTime: '06:15',
    startMinutes: 370,
    durationMinutes: 50,
    avgHeartRate: 53,
    avgHRV: 75,
    spo2: 98,
    movementLevel: 'low',
  },
  {
    id: 'seg-18',
    stage: 'rem',
    startTime: '06:15',
    endTime: '06:38',
    startMinutes: 420,
    durationMinutes: 23,
    avgHeartRate: 56,
    avgHRV: 68,
    spo2: 98,
    movementLevel: 'none',
  },
  {
    id: 'seg-19',
    stage: 'light',
    startTime: '06:38',
    endTime: '06:51',
    startMinutes: 443,
    durationMinutes: 13,
    avgHeartRate: 55,
    avgHRV: 71,
    spo2: 98,
    movementLevel: 'low',
  },
  {
    id: 'seg-20',
    stage: 'awake',
    startTime: '06:51',
    endTime: '06:57',
    startMinutes: 456,
    durationMinutes: 6,
    avgHeartRate: 68,
    avgHRV: 56,
    spo2: 99,
    movementLevel: 'high',
  },
];

// Sleep Cycles Annotated
export const mockSleepCycles: SleepCycle[] = [
  {
    cycleNumber: 1,
    name: '第 1 週期 · 慢波啟動',
    startTime: '23:15',
    endTime: '01:05',
    durationMinutes: 110,
    deepMinutes: 50,
    remMinutes: 17,
    quality: 'optimal',
  },
  {
    cycleNumber: 2,
    name: '第 2 週期 · 物理生長修復',
    startTime: '01:05',
    endTime: '02:45',
    durationMinutes: 100,
    deepMinutes: 40,
    remMinutes: 23,
    quality: 'optimal',
  },
  {
    cycleNumber: 3,
    name: '第 3 週期 · 記憶情緒鞏固',
    startTime: '02:45',
    endTime: '04:10',
    durationMinutes: 85,
    deepMinutes: 18,
    remMinutes: 27,
    quality: 'good',
  },
  {
    cycleNumber: 4,
    name: '第 4 週期 · REM 主導期',
    startTime: '04:10',
    endTime: '05:25',
    durationMinutes: 75,
    deepMinutes: 0,
    remMinutes: 24,
    quality: 'good',
  },
  {
    cycleNumber: 5,
    name: '第 5 週期 · 喚醒整合過渡',
    startTime: '05:25',
    endTime: '06:57',
    durationMinutes: 92,
    deepMinutes: 0,
    remMinutes: 23,
    quality: 'good',
  },
];

// Continuous 5-minute sampling points for overlay charts
export const generateSleepTimelinePoints = (): SleepTimelinePoint[] => {
  const points: SleepTimelinePoint[] = [];
  const totalMinutes = 462;
  const step = 5;

  for (let m = 0; m <= totalMinutes; m += step) {
    const hours = Math.floor((23 * 60 + 15 + m) / 60) % 24;
    const mins = (23 * 60 + 15 + m) % 60;
    const timeStr = `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`;

    // Determine stage based on segments
    let curSegment = mockSleepSegments.find(
      (s) => m >= s.startMinutes && m < s.startMinutes + s.durationMinutes
    ) || mockSleepSegments[mockSleepSegments.length - 1];

    let stageValue = 2; // Light
    if (curSegment.stage === 'deep') stageValue = 3;
    else if (curSegment.stage === 'rem') stageValue = 1;
    else if (curSegment.stage === 'awake') stageValue = 0;

    // Heart rate curve with physiological dip
    // Normal resting day HR ~ 62 bpm. Night lowest dips to ~48 bpm around 02:00
    const progress = m / totalMinutes;
    const dipFactor = Math.sin(progress * Math.PI); // max at middle
    const baseHr = 60 - dipFactor * 12;
    const stageHrDelta =
      curSegment.stage === 'deep' ? -4 : curSegment.stage === 'rem' ? 2 : curSegment.stage === 'awake' ? 8 : 0;
    const heartRate = Math.round(baseHr + stageHrDelta + (Math.sin(m * 0.1) * 1.5));

    // HRV curve (peaks during deep sleep and mid-night)
    const baseHrv = 55 + dipFactor * 22;
    const stageHrvDelta =
      curSegment.stage === 'deep' ? 12 : curSegment.stage === 'rem' ? -2 : curSegment.stage === 'awake' ? -15 : 4;
    const hrv = Math.round(baseHrv + stageHrvDelta + (Math.cos(m * 0.08) * 2));

    // SpO2 (between 96% and 99%)
    const spo2 = curSegment.stage === 'awake' ? 99 : Math.round(97.5 + Math.sin(m * 0.05) * 0.8);

    // Skin temp deviation: dips by -0.3°C during deep sleep
    const skinTemp = parseFloat((-0.1 - dipFactor * 0.35 + (Math.random() - 0.5) * 0.05).toFixed(2));

    // Respiratory rate: 11-14 brpm
    const resp = curSegment.stage === 'deep' ? 11.5 : curSegment.stage === 'rem' ? 14.2 : 12.8;

    points.push({
      time: timeStr,
      minutesFromBed: m,
      stage: curSegment.stage,
      stageValue,
      heartRate,
      hrv,
      spo2,
      skinTempDeviation: skinTemp,
      respiratoryRate: parseFloat(resp.toFixed(1)),
      movement: curSegment.movementLevel === 'high' ? 4 : curSegment.movementLevel === 'moderate' ? 2 : curSegment.movementLevel === 'low' ? 1 : 0,
    });
  }

  return points;
};

export const mockSleepQualitySubScores: SleepQualitySubScores = {
  durationScore: 94, // 7h 42m (Target 8h)
  deepSleepScore: 95, // 108 min (23.4% of total sleep - optimal range 15-25%)
  remSleepScore: 88, // 84 min (18.2% of total sleep - target 20-25%)
  efficiencyScore: 94, // 94% sleep efficiency, low interruptions
  hrDipScore: 96, // Heart rate dipped by -14.8% (optimal > 10-15%)
  hrvBalanceScore: 90, // Night avg 72ms (Baseline 68ms -> +6% recovery boost)
  sleepDebtMinutes: -18, // 18 mins surplus
  hrDipPercent: -14.8,
};

export const initialRecoveryAssessment: RecoveryAssessment = {
  readinessScore: 88,
  recoveryPercent: 82, // 82% recovered
  totalRecoveryHours: 24, // Needed 24h total recovery after yesterday's 10k run
  recoveryHoursRemaining: 3.5, // 3.5 hours until 100% full peak capacity
  status: 'optimal',
  statusLabel: '體能狀態優良 · 隨時可進行有效訓練',
  targetRecoveryTime: '今日 14:30',
  recommendedActivity: '適宜進行 Zone 2 有氧耐力訓練或肌力塑型，傍晚後達 100% 巔峰',
  maxSafeHrZone: 3,
  recommendedTrainingLoad: '中高負荷 (Optimal Training Zone)',
  factors: [
    {
      id: 'f-1',
      title: '高佔比深層慢波修復 (+50m)',
      impactType: 'positive',
      impactDescription: '肌肉生長激素分泌充足，肌肉微損傷已修復 85%',
      changeHours: -2.5,
    },
    {
      id: 'f-2',
      title: '夜間心率下潛率達標 (-14.8%)',
      impactType: 'positive',
      impactDescription: '副交感神經完全接管，心血管負荷徹底緩解',
      changeHours: -1.8,
    },
    {
      id: 'f-3',
      title: '昨日 10KM 訓練負荷 (EPOC 95)',
      impactType: 'negative',
      impactDescription: '下肢肌群仍處於超量恢復期中期，需待下午完全充能',
      changeHours: +4.0,
    },
  ],
};

// 7-day Weekly Sleep History
export const mockWeeklySleepHistory: DailySleepRecord[] = [
  {
    date: '2026-08-09',
    dayName: '週日',
    score: 84,
    totalHours: 7.2,
    deepMinutes: 95,
    lightMinutes: 235,
    remMinutes: 72,
    awakeMinutes: 30,
    efficiency: 91,
    hrDipPct: -12.4,
    hrvAvg: 67,
    bedTime: '23:40',
    wakeTime: '06:52',
  },
  {
    date: '2026-08-10',
    dayName: '週一',
    score: 79,
    totalHours: 6.8,
    deepMinutes: 75,
    lightMinutes: 240,
    remMinutes: 65,
    awakeMinutes: 28,
    efficiency: 89,
    hrDipPct: -9.8,
    hrvAvg: 62,
    bedTime: '00:15',
    wakeTime: '07:03',
  },
  {
    date: '2026-08-11',
    dayName: '週二',
    score: 88,
    totalHours: 7.9,
    deepMinutes: 112,
    lightMinutes: 248,
    remMinutes: 88,
    awakeMinutes: 26,
    efficiency: 94,
    hrDipPct: -15.2,
    hrvAvg: 74,
    bedTime: '23:05',
    wakeTime: '06:59',
  },
  {
    date: '2026-08-12',
    dayName: '週三',
    score: 82,
    totalHours: 7.1,
    deepMinutes: 88,
    lightMinutes: 232,
    remMinutes: 76,
    awakeMinutes: 30,
    efficiency: 90,
    hrDipPct: -11.6,
    hrvAvg: 66,
    bedTime: '23:50',
    wakeTime: '06:56',
  },
  {
    date: '2026-08-13',
    dayName: '週四',
    score: 91,
    totalHours: 8.2,
    deepMinutes: 125,
    lightMinutes: 250,
    remMinutes: 92,
    awakeMinutes: 25,
    efficiency: 95,
    hrDipPct: -16.8,
    hrvAvg: 78,
    bedTime: '22:50',
    wakeTime: '07:02',
  },
  {
    date: '2026-08-14',
    dayName: '週五',
    score: 76,
    totalHours: 6.5,
    deepMinutes: 70,
    lightMinutes: 220,
    remMinutes: 62,
    awakeMinutes: 38,
    efficiency: 86,
    hrDipPct: -8.5,
    hrvAvg: 58,
    bedTime: '00:45',
    wakeTime: '07:15',
  },
  {
    date: '2026-08-15',
    dayName: '週六 (昨夜)',
    score: 87,
    totalHours: 7.7,
    deepMinutes: 108,
    lightMinutes: 242,
    remMinutes: 84,
    awakeMinutes: 28,
    efficiency: 94,
    hrDipPct: -14.8,
    hrvAvg: 72,
    bedTime: '23:15',
    wakeTime: '06:57',
  },
];
