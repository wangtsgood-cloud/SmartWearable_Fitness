import React from 'react';
import { Sparkles, Bot, Target, CheckCircle, RefreshCw, Dumbbell, ShieldAlert, Award } from 'lucide-react';
import { AIHealthReport } from '../types';

interface Props {
  report: AIHealthReport | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenAICoach?: () => void;
}

export const AiHealthInsightCard: React.FC<Props> = ({
  report,
  isLoading,
  onRefresh,
  onOpenAICoach,
}) => {
  return (
    <div id="card-ai-insight" className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Gemini AI 智慧運動教練診斷
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              結合即時心率、HRV、睡眠修復與身體電量進行個人化訓練分析
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenAICoach && (
            <button
              id="btn-open-coach-from-insight"
              onClick={onOpenAICoach}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>進入教練中心 (早報/課表/諮詢)</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-all disabled:opacity-50 cursor-pointer shadow-md shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? '診斷生成中...' : '重新生成'}</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-slate-200">Gemini 正在計算生理數據與訓練負荷模型...</p>
          <p className="text-xs text-slate-400">正在分析心率變異度 (HRV)、睡眠分期與代謝消耗趨勢</p>
        </div>
      ) : report ? (
        <div className="space-y-4 relative z-10">
          {/* Top Score & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Readiness Score */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400">今日體能準備度</span>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
                  {report.readinessScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  ● {report.recoveryStatus || '恢復極佳'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Recommended Training Focus */}
            <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                <Dumbbell className="w-4 h-4 text-indigo-400" />
                <span>建議訓練重點 (Today's Focus)</span>
              </div>
              <div className="text-sm font-bold text-slate-100 my-1">
                {report.trainingFocus || 'Zone 2 有氧耐力訓練 / 基礎肌力鍛鍊'}
              </div>
              <div className="text-[11px] text-slate-400">
                依據今日高達 78% 身體電量與充足深睡分析微調
              </div>
            </div>
          </div>

          {/* Diagnostic Summary */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed">
            <p className="font-medium text-slate-100 mb-1 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI 生理評估摘要：</span>
            </p>
            <p className="text-slate-300">{report.summary}</p>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>今日個人化運動與恢復指南：</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {report.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
