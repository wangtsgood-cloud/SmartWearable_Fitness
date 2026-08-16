import React, { useState } from 'react';
import { 
  Sun, 
  Sparkles, 
  Clock, 
  Droplets, 
  Zap, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Compass, 
  ShieldCheck, 
  Coffee, 
  TrendingUp,
  BrainCircuit,
  Heart
} from 'lucide-react';
import { MorningBriefingData, BiometricsData } from '../../types';

interface Props {
  briefing: MorningBriefingData | null;
  biometrics: BiometricsData;
  isLoading: boolean;
  onRefresh: () => void;
  onNavigateToWorkout?: () => void;
}

export const MorningBriefingCard: React.FC<Props> = ({
  briefing,
  biometrics,
  isLoading,
  onRefresh,
  onNavigateToWorkout,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCompletedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const currentBriefing: MorningBriefingData = {
    generatedAt: briefing?.generatedAt || "07:30",
    headline: briefing?.headline || "⚡ 身體電量充沛 · 今日體能處於超量恢復黃金期",
    bodyBatteryScore: briefing?.bodyBatteryScore ?? biometrics.bodyBattery,
    readinessVerdict: briefing?.readinessVerdict || "巔峰狀態 · 適合進行專項強度突破",
    readinessLevel: briefing?.readinessLevel || "peak",
    overviewText: briefing?.overviewText || `昨夜睡眠評分 ${biometrics.sleep.score} 分，深睡慢波修復達 ${biometrics.sleep.deepMinutes} 分鐘，夜間靜止心率穩定在 ${biometrics.restingHeartRate} BPM。心率變異度 (HRV ${biometrics.hrv}ms) 呈現正向提升，自律神經恢復極佳，今日具備高強度間歇或長距離巡航的耐受力。`,
    goldenWindow: {
      timeRange: briefing?.goldenWindow?.timeRange || "16:30 - 18:30",
      reason: briefing?.goldenWindow?.reason || "生理核心體溫達到峰值，神經傳導速率加快，肌肉爆發力與肺通氣效率最佳。",
      targetSport: briefing?.goldenWindow?.targetSport || "Zone 3~4 乳酸閾值間歇或節奏耐力跑"
    },
    nutritionAdvice: {
      hydrationGoalMl: briefing?.nutritionAdvice?.hydrationGoalMl || 2600,
      preWorkoutSnack: briefing?.nutritionAdvice?.preWorkoutSnack || "運動前 40 分鐘補充香蕉 1 根 + 300ml 電解質水",
      electrolyteTip: briefing?.nutritionAdvice?.electrolyteTip || "今日排汗預期較高，建議正餐多攝取富含鎂與鉀的深綠蔬菜與堅果。"
    },
    nervousSystemInsight: {
      hrvStatus: briefing?.nervousSystemInsight?.hrvStatus || `HRV 處於 ${biometrics.hrv}ms 高位區間，副交感神經優勢顯著，抗疲勞韌性強。`,
      stressGuidance: briefing?.nervousSystemInsight?.stressGuidance || "晨間壓力指數低 (26/100)，工作與訓練專注度將維持高效。",
      breathingTip: briefing?.nervousSystemInsight?.breathingTip || "午後可進行 5 分鐘「4-7-8」調息呼吸法，進一步鎖定副交感神經修復。"
    },
    keyActionItems: (briefing?.keyActionItems && Array.isArray(briefing.keyActionItems) && briefing.keyActionItems.length > 0) 
      ? briefing.keyActionItems 
      : [
        "下午 16:30 執行 45 分鐘 Zone 2 穩態耐力訓練 (心率 138-148 BPM)",
        "全天完成 2,600ml 水分攝取 (午後前達標 1,400ml)",
        "訓練後 30 分鐘內補充 25g 蛋白質與 40g 優質碳水加速肌糖原重建"
      ]
  };

  const handleSpeakBriefing = () => {
    if (!('speechSynthesis' in window)) {
      alert('您的瀏覽器暫不支援語音朗讀功能');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = `早安！今日體能早報。${currentBriefing.headline}。${currentBriefing.overviewText}。今日黃金運動窗口為 ${currentBriefing.goldenWindow.timeRange}，建議進行 ${currentBriefing.goldenWindow.targetSport}。全天飲水目標 ${currentBriefing.nutritionAdvice.hydrationGoalMl} 毫升。祝你有美好充實的一天！`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-slate-900 border-b border-slate-800/80 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
              <Sun className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  🌅 每日晨間生理早報
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  生成於今日 {currentBriefing.generatedAt}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini 3.7 Flash 生理分析
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-1">
                {currentBriefing.headline}
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              id="btn-speak-briefing"
              onClick={handleSpeakBriefing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
              title="語音朗讀早報"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{isPlayingAudio ? '停止朗讀' : '語音播報'}</span>
            </button>

            <button
              id="btn-refresh-briefing"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all disabled:opacity-50 cursor-pointer"
              title="依最新體徵重新生成早報"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? '生成中...' : '同步更新'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Readiness Verdict & Summary Box */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black text-emerald-400">{currentBriefing.bodyBatteryScore}</span>
              <span className="text-[10px] text-slate-400 font-medium">身體電量</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">體能就緒度判定</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {currentBriefing.readinessVerdict}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                {currentBriefing.overviewText}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl shrink-0 w-full md:w-auto justify-between md:justify-start">
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400">昨晚深睡</div>
              <div className="text-xs font-bold text-indigo-300">{biometrics.sleep.deepMinutes} 分鐘</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400">夜間 HRV</div>
              <div className="text-xs font-bold text-emerald-300">{biometrics.hrv} ms</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400">靜止心率</div>
              <div className="text-xs font-bold text-rose-300">{biometrics.restingHeartRate} BPM</div>
            </div>
          </div>
        </div>

        {/* 3 Grid Pillars: Golden Window, Nutrition, Nervous System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Golden Workout Window */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/10 to-slate-950 border border-amber-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-300">今日黃金訓練窗口</h3>
                    <p className="text-[10px] text-slate-400">晝夜節律體溫與神經反應高峰</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-amber-500/30 text-center mb-3">
                <div className="text-base font-extrabold text-amber-300 tracking-wide">
                  {currentBriefing.goldenWindow.timeRange}
                </div>
                <div className="text-xs text-amber-200/90 font-medium mt-0.5">
                  推薦：{currentBriefing.goldenWindow.targetSport}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentBriefing.goldenWindow.reason}
              </p>
            </div>

            {onNavigateToWorkout && (
              <button
                id="btn-goto-workout-from-briefing"
                onClick={onNavigateToWorkout}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>載入今日建議訓練</span>
              </button>
            )}
          </div>

          {/* Pillar 2: Nutrition & Hydration */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-cyan-500/10 to-slate-950 border border-cyan-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-cyan-300">能量補給與補水目標</h3>
                  <p className="text-[10px] text-slate-400">預防脫水與運動中肌糖原耗竭</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-300">全日補水目標</span>
                  </div>
                  <span className="text-xs font-bold text-cyan-300">{currentBriefing.nutritionAdvice.hydrationGoalMl} ml</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1 mb-1">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>運動前 40 分鐘補給</span>
                  </div>
                  <p className="text-xs text-slate-300">{currentBriefing.nutritionAdvice.preWorkoutSnack}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>電解質與礦物質建議</span>
                  </div>
                  <p className="text-xs text-slate-300">{currentBriefing.nutritionAdvice.electrolyteTip}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Nervous System & HRV */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-indigo-500/10 to-slate-950 border border-indigo-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-indigo-300">自律神經與壓力調控</h3>
                  <p className="text-[10px] text-slate-400">交感與副交感神經平衡狀態</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1 mb-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>HRV 恢復態勢</span>
                  </div>
                  <p className="text-xs text-slate-300">{currentBriefing.nervousSystemInsight.hrvStatus}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>日間壓力與認知引導</span>
                  </div>
                  <p className="text-xs text-slate-300">{currentBriefing.nervousSystemInsight.stressGuidance}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>調息減壓技巧</span>
                  </div>
                  <p className="text-xs text-slate-300">{currentBriefing.nervousSystemInsight.breathingTip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Morning Action Checklist */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>今日教練晨間行動清單 (Daily Action Checklist)</span>
            </h3>
            <span className="text-xs text-slate-400">
              已完成 {Object.values(completedItems).filter(Boolean).length} / {currentBriefing.keyActionItems.length} 項
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {currentBriefing.keyActionItems.map((item, idx) => {
              const isDone = !!completedItems[idx];
              return (
                <button
                  key={idx}
                  id={`action-item-${idx}`}
                  onClick={() => toggleItem(idx)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </span>
                  <span className={`text-xs leading-relaxed ${isDone ? 'line-through opacity-80' : ''}`}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
