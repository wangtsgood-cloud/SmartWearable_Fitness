import React from 'react';
import { X, Watch, Bluetooth, Battery, ShieldCheck, Check, Sliders, Radio, Zap } from 'lucide-react';
import { DeviceInfo } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  deviceInfo: DeviceInfo;
  onUpdateDevice: (info: DeviceInfo) => void;
}

const PRESET_DEVICES = [
  { name: "Garmin Forerunner 965", model: "Titanium Edition · Elevate v5 光學心率感測", type: "smartwatch" },
  { name: "Apple Watch Ultra 2", model: "49mm 鈦金屬 · 雙頻 GPS & 心電圖 ECG", type: "smartwatch" },
  { name: "Polar H10 心率胸帶", model: "ECG 胸帶感測器 · 毫秒級 HRV 高精度取樣", type: "cheststrap" },
  { name: "WHOOP 4.0", model: "無螢幕全天候體能修復與睡眠手環", type: "strap" },
];

export const DeviceSimulatorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  deviceInfo,
  onUpdateDevice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Bluetooth className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">穿戴裝置連線與設定</h3>
            <p className="text-xs text-slate-400">Bluetooth Low Energy (BLE) 模擬器</p>
          </div>
        </div>

        {/* Device Selection List */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold text-slate-300">選擇配對穿戴裝置：</label>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_DEVICES.map((d) => {
              const isSelected = deviceInfo.name === d.name;
              return (
                <button
                  key={d.name}
                  onClick={() =>
                    onUpdateDevice({
                      ...deviceInfo,
                      name: d.name,
                      model: d.model,
                    })
                  }
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-md shadow-blue-500/20'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Watch className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{d.name}</div>
                      <div className="text-[11px] text-slate-400">{d.model}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-blue-500 text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Device Battery & Signal sliders */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4 mb-6">
          {/* Battery Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Battery className="w-4 h-4 text-emerald-400" />
                裝置剩餘電量
              </span>
              <span className="text-emerald-400 font-mono font-bold">{deviceInfo.batteryLevel}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={deviceInfo.batteryLevel}
              onChange={(e) =>
                onUpdateDevice({ ...deviceInfo, batteryLevel: parseInt(e.target.value) })
              }
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Connection status toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-300 font-medium">即時藍牙同步狀態</span>
            <button
              onClick={() =>
                onUpdateDevice({ ...deviceInfo, isConnected: !deviceInfo.isConnected })
              }
              className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                deviceInfo.isConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {deviceInfo.isConnected ? '● 已連線同步' : '○ 連線中斷'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
        >
          完成設定並關閉
        </button>
      </div>
    </div>
  );
};
