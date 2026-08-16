import React, { useState, useEffect, useRef } from 'react';
import {
  WorkoutSession,
  SportType,
  GPSPoint,
  SplitLap,
  BiometricsData,
} from '../types';
import { GPSRouteMap } from './GPSRouteMap';
import { ElevationProfileChart } from './ElevationProfileChart';
import { WorkoutSplitsCard } from './WorkoutSplitsCard';
import { GPXImportModal } from './GPXImportModal';
import {
  sampleWorkoutList,
  workoutRiverside10K,
  generateLoopGPS,
} from '../data/mockWorkouts';
import {
  Play,
  Pause,
  Square,
  Flame,
  Gauge,
  Heart,
  Mountain,
  Navigation,
  Timer,
  Zap,
  Upload,
  Plus,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Activity,
  Layers,
  ChevronRight,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutSharePosterModal } from './gamification/WorkoutSharePosterModal';
import { INITIAL_BADGES } from '../data/mockGamification';

interface Props {
  currentBiometrics: BiometricsData;
}

const SPORT_OPTIONS: { id: SportType; label: string; icon: string; defaultPace: string }[] = [
  { id: 'running', label: '戶外路跑', icon: '🏃‍♂️', defaultPace: "4'45\"" },
  { id: 'cycling', label: '戶外騎行', icon: '🚴‍♂️', defaultPace: "2'30\"" },
  { id: 'hiking', label: '登山越野', icon: '🥾', defaultPace: "12'30\"" },
  { id: 'swimming', label: '游泳追蹤', icon: '🏊‍♂️', defaultPace: "1'45\"/100m" },
  { id: 'hiit', label: '體能間歇', icon: '⚡', defaultPace: '--' },
];

export const WorkoutTrackerView: React.FC<Props> = ({ currentBiometrics }) => {
  const [selectedSport, setSelectedSport] = useState<SportType>('running');
  const [workoutList, setWorkoutList] = useState<WorkoutSession[]>(sampleWorkoutList);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession>(workoutRiverside10K);
  const [isGpxModalOpen, setIsGpxModalOpen] = useState(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  // Live Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveDistanceKm, setLiveDistanceKm] = useState(0);
  const [liveCalories, setLiveCalories] = useState(0);
  const [liveGpsTrack, setLiveGpsTrack] = useState<GPSPoint[]>([]);
  const [liveSplits, setLiveSplits] = useState<SplitLap[]>([]);

  // Point selection sync between map and chart
  const [syncedPointIndex, setSyncedPointIndex] = useState<number | null>(null);

  // Interval timer for live recording
  useEffect(() => {
    let timer: any = null;
    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);

        // Simulate distance accumulation according to sport type
        let distDelta = 0;
        let calDelta = 0;
        if (selectedSport === 'running') {
          distDelta = 0.0035; // ~12.6 km/h
          calDelta = 0.22;
        } else if (selectedSport === 'cycling') {
          distDelta = 0.0068; // ~24.5 km/h
          calDelta = 0.32;
        } else if (selectedSport === 'hiking') {
          distDelta = 0.0013; // ~4.7 km/h
          calDelta = 0.14;
        } else {
          distDelta = 0.002;
          calDelta = 0.2;
        }

        setLiveDistanceKm((d) => {
          const nextDist = parseFloat((d + distDelta).toFixed(3));

          // Every 1 km, add a split
          const currentLapKm = Math.floor(nextDist);
          setLiveSplits((prevSplits) => {
            if (currentLapKm > prevSplits.length && currentLapKm > 0) {
              return [
                ...prevSplits,
                {
                  km: currentLapKm,
                  timeSeconds: 280 + Math.round((Math.random() - 0.5) * 20),
                  paceFormatted: "4'40\"",
                  avgHeartRate: Math.round(currentBiometrics.heartRate),
                  elevationGainMeters: 4,
                  avgCadence: selectedSport === 'running' ? 178 : 84,
                },
              ];
            }
            return prevSplits;
          });

          return nextDist;
        });

        setLiveCalories((c) => Math.round(c + calDelta));

        // Add live GPS point
        setLiveGpsTrack((prev) => {
          const centerLat = 25.0715;
          const centerLng = 121.5360;
          const progress = (prev.length % 100) / 100;
          const angle = progress * Math.PI * 2;
          const r = 1.45;
          const lat = centerLat + ((r * Math.cos(angle)) / 111);
          const lng = centerLng + ((r * Math.sin(angle)) / 102);

          const newPt: GPSPoint = {
            latitude: parseFloat(lat.toFixed(6)),
            longitude: parseFloat(lng.toFixed(6)),
            elevation: Math.round(15 + Math.sin(progress * Math.PI) * 12),
            timestamp: new Date().toISOString(),
            heartRate: Math.max(120, Math.min(185, Math.round(currentBiometrics.heartRate + (Math.random() - 0.5) * 4))),
            speedKmh: selectedSport === 'cycling' ? 24.5 : 12.6,
            paceMinPerKm: selectedSport === 'cycling' ? 2.45 : 4.75,
            cadence: selectedSport === 'running' ? 178 : 84,
            distanceFromStartKm: parseFloat(liveDistanceKm.toFixed(2)),
          };

          return [...prev, newPt];
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRecording, isPaused, selectedSport, currentBiometrics.heartRate, liveDistanceKm]);

  // Format Elapsed Seconds
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Start Workout
  const handleStartWorkout = () => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setLiveDistanceKm(0);
    setLiveCalories(0);
    setLiveGpsTrack([]);
    setLiveSplits([]);
  };

  // Finish Workout
  const handleFinishWorkout = () => {
    setIsRecording(false);
    setIsPaused(false);

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const newSession: WorkoutSession = {
      id: `workout-recorded-${Date.now()}`,
      title: `即時記錄 · ${SPORT_OPTIONS.find((s) => s.id === selectedSport)?.label}`,
      sportType: selectedSport,
      startTime: new Date().toLocaleString('zh-TW', { hour12: false }),
      durationSeconds: elapsedSeconds || 60,
      distanceKm: parseFloat(liveDistanceKm.toFixed(2)) || 1.2,
      caloriesBurned: liveCalories || 45,
      avgHeartRate: Math.round(currentBiometrics.heartRate) || 152,
      maxHeartRate: Math.round(currentBiometrics.heartRate + 15),
      avgPaceFormatted: "4'45\"",
      avgSpeedKmh: 12.6,
      maxSpeedKmh: 14.2,
      elevationGainMeters: 18,
      elevationLossMeters: 16,
      avgCadence: selectedSport === 'running' ? 176 : 82,
      trainingEffect: {
        aerobic: 3.6,
        anaerobic: 1.5,
        description: '良好的有氧刺激，有效促進心肺耐力與代謝燃脂。',
      },
      heartRateZoneDurations: {
        zone1: 60,
        zone2: Math.round(elapsedSeconds * 0.4),
        zone3: Math.round(elapsedSeconds * 0.4),
        zone4: Math.round(elapsedSeconds * 0.15),
        zone5: 10,
      },
      splits: liveSplits.length > 0 ? liveSplits : [
        { km: 1, timeSeconds: 285, paceFormatted: "4'45\"", avgHeartRate: 150, elevationGainMeters: 5, avgCadence: 178 }
      ],
      gpsTrack: liveGpsTrack.length > 5 ? liveGpsTrack : workoutRiverside10K.gpsTrack,
      weather: {
        temperatureC: 26,
        humidityPct: 65,
        condition: '晴天即時記錄',
      },
    };

    setWorkoutList((prev) => [newSession, ...prev]);
    setActiveWorkout(newSession);
  };

  const currentDisplayWorkout = isRecording && liveGpsTrack.length > 3
    ? {
        ...activeWorkout,
        gpsTrack: liveGpsTrack,
        distanceKm: liveDistanceKm,
        durationSeconds: elapsedSeconds,
        caloriesBurned: liveCalories,
        splits: liveSplits.length > 0 ? liveSplits : activeWorkout.splits,
      }
    : activeWorkout;

  return (
    <div id="workout-tracker-view" className="space-y-6">
      {/* 1. Top Sport Type Switcher & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        {/* Sport Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {SPORT_OPTIONS.map((sport) => {
            const isSelected = selectedSport === sport.id;
            return (
              <button
                key={sport.id}
                onClick={() => {
                  setSelectedSport(sport.id);
                  // Find first matching workout or keep current
                  const match = workoutList.find((w) => w.sportType === sport.id);
                  if (match) setActiveWorkout(match);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{sport.icon}</span>
                <span>{sport.label}</span>
              </button>
            );
          })}
        </div>

        {/* GPX Upload & Poster Generation Buttons */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            id="btn-generate-poster-from-workout"
            onClick={() => setIsPosterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>生成運動打卡海報</span>
          </button>
          <button
            onClick={() => setIsGpxModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>匯入 GPX 軌跡檔</span>
          </button>
        </div>
      </div>

      {/* 2. Live Workout Tracker HUD / Recorder */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Navigation className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-100">
                {isRecording ? '🔴 正在即時追蹤運動數據 (Live GPS Session)' : '即時運動訓練控制台'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              高精密度 GPS 定位取樣 · 心率區間即時反饋 · 分段配速自動計算
            </p>
          </div>

          {/* Start / Pause / Finish Buttons */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                onClick={handleStartWorkout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>開始運動追蹤</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                    isPaused
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                  <span>{isPaused ? '繼續' : '暫停'}</span>
                </button>

                <button
                  onClick={handleFinishWorkout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>結束並儲存紀錄</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live HUD Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Time Elapsed */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              運動時間 (Duration)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono my-1">
              {isRecording ? formatTime(elapsedSeconds) : formatTime(activeWorkout.durationSeconds)}
            </div>
            <span className="text-[10px] text-slate-500">時:分:秒</span>
          </div>

          {/* Distance */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              累積距離 (Distance)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono my-1">
              {isRecording ? liveDistanceKm.toFixed(2) : activeWorkout.distanceKm.toFixed(2)}
              <span className="text-sm font-normal text-slate-400 ml-1">km</span>
            </div>
            <span className="text-[10px] text-slate-500">GPS 即時里程計算</span>
          </div>

          {/* Pace / Speed */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              平均配速 (Pace)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono my-1">
              {activeWorkout.avgPaceFormatted}
              <span className="text-sm font-normal text-slate-400 ml-1">/km</span>
            </div>
            <span className="text-[10px] text-slate-500">
              時速 {activeWorkout.avgSpeedKmh} km/h
            </span>
          </div>

          {/* Heart Rate & Zone */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              即時心率 (Heart Rate)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono my-1">
              {currentBiometrics.heartRate}
              <span className="text-sm font-normal text-slate-400 ml-1">bpm</span>
            </div>
            <span className="text-[10px] text-amber-400 font-semibold">
              ● Zone 3 (有氧耐力區)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main GPS Route Heatmap Interactive Canvas */}
      <section aria-label="GPS Route Heatmap">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{activeWorkout.title}</span>
              <span className="text-xs font-normal text-slate-400">({activeWorkout.startTime})</span>
            </h3>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {activeWorkout.gpsTrack.length} 個 GPS 取樣點 · 天氣 {activeWorkout.weather?.temperatureC}°C {activeWorkout.weather?.condition}
          </div>
        </div>

        <GPSRouteMap
          gpsTrack={currentDisplayWorkout.gpsTrack}
          sportType={currentDisplayWorkout.sportType}
          selectedPointIndex={syncedPointIndex}
          onPointSelect={(pt, idx) => setSyncedPointIndex(idx)}
        />
      </section>

      {/* 4. Elevation Profile & Splits Analysis Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ElevationProfileChart
          gpsTrack={currentDisplayWorkout.gpsTrack}
          selectedPointIndex={syncedPointIndex}
          onPointHover={(idx) => setSyncedPointIndex(idx)}
        />

        <WorkoutSplitsCard workout={currentDisplayWorkout} />
      </section>

      {/* 5. Historical Workouts Library / Selector */}
      <section className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">歷史運動紀錄與軌跡分析庫</h3>
              <p className="text-xs text-slate-400">Past Activities & GPX Route Archive</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            共 {workoutList.length} 筆運動資料
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {workoutList.map((w) => {
            const isSelected = activeWorkout.id === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setActiveWorkout(w)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-cyan-400">
                      {w.sportType === 'running' ? '🏃 路跑' : w.sportType === 'cycling' ? '🚴 騎行' : '🥾 健行'}
                    </span>
                    <span className="text-[11px] text-slate-500">{w.startTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 line-clamp-1 mb-2">
                    {w.title}
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">距離</div>
                    <div className="font-bold text-slate-200">{w.distanceKm}k</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">均速/配速</div>
                    <div className="font-bold text-cyan-400">{w.avgPaceFormatted}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">均心率</div>
                    <div className="font-bold text-rose-400">{w.avgHeartRate}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* GPX Import Modal */}
      <GPXImportModal
        isOpen={isGpxModalOpen}
        onClose={() => setIsGpxModalOpen(false)}
        onSelectWorkout={(newW) => {
          setWorkoutList((prev) => [newW, ...prev]);
          setActiveWorkout(newW);
        }}
      />

      {/* Workout Share Poster Modal */}
      {isPosterModalOpen && (
        <WorkoutSharePosterModal
          workout={currentDisplayWorkout}
          biometrics={currentBiometrics}
          badge={INITIAL_BADGES[0]}
          onClose={() => setIsPosterModalOpen(false)}
        />
      )}
    </div>
  );
};
