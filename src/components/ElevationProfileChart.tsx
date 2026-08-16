import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { GPSPoint } from '../types';
import { Mountain, Heart, Gauge } from 'lucide-react';

interface Props {
  gpsTrack: GPSPoint[];
  selectedPointIndex?: number | null;
  onPointHover?: (index: number) => void;
}

export const ElevationProfileChart: React.FC<Props> = ({
  gpsTrack,
  selectedPointIndex,
  onPointHover,
}) => {
  // Downsample if too large for chart performance
  const chartData = React.useMemo(() => {
    return gpsTrack.map((pt, idx) => ({
      index: idx,
      dist: pt.distanceFromStartKm,
      elevation: pt.elevation,
      heartRate: pt.heartRate,
      pace: pt.paceMinPerKm,
      speed: pt.speedKmh,
    }));
  }, [gpsTrack]);

  const minElev = Math.min(...gpsTrack.map((p) => p.elevation));
  const maxElev = Math.max(...gpsTrack.map((p) => p.elevation));

  return (
    <div
      id="elevation-profile-card"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Mountain className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">高度剖面與心率負荷疊加分析</h3>
            <p className="text-xs text-slate-400">Elevation Profile & Heart Rate Strain Correlation</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">高度: {minElev}m ~ {maxElev}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-300">即時心率 (BPM)</span>
          </div>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined && onPointHover) {
                onPointHover(Number(state.activeTooltipIndex));
              }
            }}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="dist"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(val) => `${val}km`}
            />

            {/* Left Y Axis: Elevation */}
            <YAxis
              yAxisId="left"
              stroke="#f59e0b"
              fontSize={11}
              domain={['dataMin - 10', 'dataMax + 10']}
              tickFormatter={(val) => `${val}m`}
            />

            {/* Right Y Axis: Heart Rate */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f43f5e"
              fontSize={11}
              domain={[80, 200]}
              tickFormatter={(val) => `${val}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 font-mono">
                      <div className="font-bold text-slate-100 border-b border-slate-800 pb-1 flex items-center justify-between">
                        <span>距離: {data.dist.toFixed(2)} km</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-amber-400">
                        <span className="text-slate-400">海拔高度:</span>
                        <span className="font-bold">{data.elevation} m</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-rose-400">
                        <span className="text-slate-400">心率:</span>
                        <span className="font-bold">{data.heartRate} bpm</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-cyan-400">
                        <span className="text-slate-400">配速:</span>
                        <span className="font-bold">
                          {Math.floor(data.pace)}'{Math.round((data.pace % 1) * 60).toString().padStart(2, '0')}"/km
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Elevation Area Chart */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="elevation"
              name="海拔高度"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#elevGrad)"
            />

            {/* Heart Rate Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="heartRate"
              name="心率 (BPM)"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
