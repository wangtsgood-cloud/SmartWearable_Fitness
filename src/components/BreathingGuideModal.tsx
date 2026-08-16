import React, { useState, useEffect } from 'react';
import { X, Wind, Play, Pause, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (heartRateReduction: number) => void;
}

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const BreathingGuideModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSessionComplete,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(60); // 1 minute session
  const [simulatedHr, setSimulatedHr] = useState(76);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setTotalSecondsLeft(60);
      setPhase('inhale');
      setCountdown(4);
      setSimulatedHr(76);
      return;
    }
    setIsActive(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Switch phase
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'hold1';
            if (currentPhase === 'hold1') return 'exhale';
            if (currentPhase === 'exhale') return 'hold2';
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });

      setTotalSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onSessionComplete(8); // reduced 8 bpm
          return 0;
        }
        // Gradually lower simulated heart rate
        if (prev % 6 === 0) {
          setSimulatedHr((hr) => Math.max(58, hr - 1));
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, onSessionComplete]);

  if (!isOpen) return null;

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return { title: '緩慢深吸氣', desc: '透過鼻子緩緩吸氣，感受胸腔與腹部擴張', scale: 1.35, color: '#38bdf8' };
      case 'hold1':
        return { title: '屏住呼吸', desc: '放鬆肩膀，保持平靜屏息', scale: 1.35, color: '#818cf8' };
      case 'exhale':
        return { title: '慢慢吐氣', desc: '透過嘴巴平穩慢吐，釋放累積的所有壓力', scale: 0.85, color: '#34d399' };
      case 'hold2':
        return { title: '平靜屏息', desc: '放空思緒，感受心跳逐漸趨於平穩', scale: 0.85, color: '#a78bfa' };
    }
  };

  const currentInfo = getPhaseText();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold mb-2">
              <Wind className="w-3.5 h-3.5" />
              <span>4-4-4-4 箱式呼吸減壓導引</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">放鬆副交感神經</h3>
            <p className="text-xs text-slate-400 mt-0.5">降低心率、舒緩焦慮與恢復身體電量</p>
          </div>

          {/* Animated Circle Breathing Stage */}
          <div className="relative h-64 flex items-center justify-center my-2">
            {/* Outer animated ripple */}
            <motion.div
              animate={{
                scale: isActive ? [1, 1.25, 1] : 1,
                opacity: [0.15, 0.4, 0.15],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-52 h-52 rounded-full bg-teal-500/10 border border-teal-500/30"
            />

            {/* Main Breathing Bubble */}
            <motion.div
              animate={{
                scale: currentInfo.scale,
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center text-center shadow-2xl border-2 transition-colors duration-1000"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: currentInfo.color,
                boxShadow: `0 0 30px ${currentInfo.color}33`,
              }}
            >
              <span className="text-3xl font-extrabold font-mono text-white">
                {countdown}
              </span>
              <span className="text-xs font-bold text-slate-200 mt-1" style={{ color: currentInfo.color }}>
                {currentInfo.title}
              </span>
            </motion.div>
          </div>

          {/* Phase explanation */}
          <div className="text-center px-4 mb-4">
            <p className="text-xs text-slate-300 font-medium h-8">
              {currentInfo.desc}
            </p>
          </div>

          {/* Live Calming HR & Timer Bar */}
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400">即時監測心率</div>
                <div className="text-sm font-bold text-slate-100 font-mono">
                  {simulatedHr} <span className="text-[10px] text-slate-400">BPM (降心率中)</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400">剩餘時長</div>
              <div className="text-sm font-bold text-teal-400 font-mono">
                {totalSecondsLeft} 秒
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isActive ? '暫停導引' : '繼續導引'}</span>
            </button>
            <button
              onClick={() => {
                setTotalSecondsLeft(60);
                setCountdown(4);
                setPhase('inhale');
                setIsActive(true);
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="重新開始"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
