import React, { useRef, useEffect, useState, useMemo } from 'react';
import { GPSPoint, SportType } from '../types';
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Heart,
  Gauge,
  Mountain,
  Flame,
  Zap,
} from 'lucide-react';

export type HeatmapColorMode = 'heartRate' | 'pace' | 'elevation' | 'speed';

interface Props {
  gpsTrack: GPSPoint[];
  sportType: SportType;
  selectedPointIndex?: number | null;
  onPointSelect?: (point: GPSPoint, index: number) => void;
  className?: string;
}

export const GPSRouteMap: React.FC<Props> = ({
  gpsTrack,
  sportType,
  selectedPointIndex,
  onPointSelect,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [colorMode, setColorMode] = useState<HeatmapColorMode>('heartRate');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(5);

  // Pan and Zoom states
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<{ point: GPSPoint; index: number; x: number; y: number } | null>(null);

  // Calculate Bounds
  const bounds = useMemo(() => {
    if (!gpsTrack || gpsTrack.length === 0) {
      return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 };
    }
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    gpsTrack.forEach((pt) => {
      if (pt.latitude < minLat) minLat = pt.latitude;
      if (pt.latitude > maxLat) maxLat = pt.latitude;
      if (pt.longitude < minLng) minLng = pt.longitude;
      if (pt.longitude > maxLng) maxLng = pt.longitude;
    });

    const latPad = (maxLat - minLat) * 0.12 || 0.005;
    const lngPad = (maxLng - minLng) * 0.12 || 0.005;

    return {
      minLat: minLat - latPad,
      maxLat: maxLat + latPad,
      minLng: minLng - lngPad,
      maxLng: maxLng + lngPad,
    };
  }, [gpsTrack]);

  // Color functions for heatmaps
  const getPointColor = (pt: GPSPoint): string => {
    if (colorMode === 'heartRate') {
      const hr = pt.heartRate;
      if (hr < 120) return '#38bdf8'; // Zone 1: Light Blue
      if (hr < 140) return '#34d399'; // Zone 2: Emerald
      if (hr < 160) return '#facc15'; // Zone 3: Yellow
      if (hr < 175) return '#fb923c'; // Zone 4: Orange
      return '#f43f5e'; // Zone 5: Rose/Red
    }

    if (colorMode === 'pace') {
      // Faster pace (lower number) -> cyan/green, slower pace -> rose
      const pace = pt.paceMinPerKm;
      if (sportType === 'cycling') {
        if (pace < 2.0) return '#22d3ee';
        if (pace < 2.5) return '#34d399';
        if (pace < 3.0) return '#facc15';
        return '#f43f5e';
      }
      if (pace <= 4.3) return '#22d3ee'; // < 4'18"
      if (pace <= 4.8) return '#34d399'; // ~ 4'48"
      if (pace <= 5.5) return '#facc15'; // ~ 5'30"
      if (pace <= 6.5) return '#fb923c'; // ~ 6'30"
      return '#f43f5e';
    }

    if (colorMode === 'elevation') {
      const minElev = Math.min(...gpsTrack.map((p) => p.elevation));
      const maxElev = Math.max(...gpsTrack.map((p) => p.elevation));
      const range = maxElev - minElev || 1;
      const ratio = (pt.elevation - minElev) / range;
      if (ratio < 0.25) return '#06b6d4';
      if (ratio < 0.5) return '#10b981';
      if (ratio < 0.75) return '#f59e0b';
      return '#ec4899';
    }

    // Speed mode
    const speed = pt.speedKmh;
    if (speed > 25) return '#ec4899';
    if (speed > 15) return '#38bdf8';
    if (speed > 10) return '#34d399';
    return '#facc15';
  };

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackIndex((prev) => {
        if (prev >= gpsTrack.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, Math.max(20, 200 / playbackSpeed));

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, gpsTrack.length]);

  // Sync external point selection
  useEffect(() => {
    if (selectedPointIndex !== undefined && selectedPointIndex !== null) {
      setPlaybackIndex(selectedPointIndex);
    }
  }, [selectedPointIndex]);

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gpsTrack || gpsTrack.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Background styling
    ctx.fillStyle = '#090d16'; // Deep midnight slate
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Map Grid lines & Radar Rings
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1;
    const gridSize = 40 * zoom;
    const startX = (panOffset.x % gridSize);
    const startY = (panOffset.y % gridSize);

    for (let x = startX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = startY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Transform GPS point (lat, lng) to canvas screen coords (x, y)
    const latSpan = bounds.maxLat - bounds.minLat || 0.01;
    const lngSpan = bounds.maxLng - bounds.minLng || 0.01;

    const project = (lat: number, lng: number) => {
      // Normal 0 to 1
      const normX = (lng - bounds.minLng) / lngSpan;
      const normY = 1 - (lat - bounds.minLat) / latSpan; // Invert Y for canvas

      // Center in canvas with zoom and pan
      const centerX = width / 2;
      const centerY = height / 2;
      const x = centerX + (normX * width * 0.8 - width * 0.4 + panOffset.x) * zoom;
      const y = centerY + (normY * height * 0.8 - height * 0.4 + panOffset.y) * zoom;
      return { x, y };
    };

    // 1. Draw Glowing Backing Shadow / Outer Contour
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.lineWidth = 9 * zoom;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';

    gpsTrack.forEach((pt, i) => {
      const { x, y } = project(pt.latitude, pt.longitude);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // 2. Draw Multi-Segment Heatmap Route Lines
    for (let i = 0; i < gpsTrack.length - 1; i++) {
      const p1 = gpsTrack[i];
      const p2 = gpsTrack[i + 1];
      const pt1Screen = project(p1.latitude, p1.longitude);
      const pt2Screen = project(p2.latitude, p2.longitude);

      const color1 = getPointColor(p1);
      const color2 = getPointColor(p2);

      const grad = ctx.createLinearGradient(pt1Screen.x, pt1Screen.y, pt2Screen.x, pt2Screen.y);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);

      ctx.beginPath();
      ctx.moveTo(pt1Screen.x, pt1Screen.y);
      ctx.lineTo(pt2Screen.x, pt2Screen.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 5 * Math.max(0.8, zoom * 0.9);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // 3. Draw Kilometer / Mile Milestone Markers
    let currentLap = 1;
    gpsTrack.forEach((pt) => {
      if (pt.distanceFromStartKm >= currentLap) {
        const { x, y } = project(pt.latitude, pt.longitude);

        // Marker circle
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // KM Text
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${currentLap}k`, x, y);

        currentLap++;
      }
    });

    // 4. Draw Start & Finish Flag Points
    if (gpsTrack.length > 0) {
      // Start Point (Green)
      const startPt = project(gpsTrack[0].latitude, gpsTrack[0].longitude);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(startPt.x, startPt.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Finish Point (Red/Checkerboard)
      const finishPt = project(
        gpsTrack[gpsTrack.length - 1].latitude,
        gpsTrack[gpsTrack.length - 1].longitude
      );
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(finishPt.x, finishPt.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 5. Draw Active Runner / Playback Cursor
    const activePt = gpsTrack[playbackIndex] || gpsTrack[0];
    if (activePt) {
      const activeScreen = project(activePt.latitude, activePt.longitude);

      // Outer Pulsing Wave
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(activeScreen.x, activeScreen.y, 16, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Glowing Pin
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.beginPath();
      ctx.arc(activeScreen.x, activeScreen.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(activeScreen.x, activeScreen.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [gpsTrack, bounds, zoom, panOffset, colorMode, playbackIndex]);

  // Handle Mouse Drag / Pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    // Check point hover
    const canvas = canvasRef.current;
    if (!canvas || !gpsTrack.length) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const latSpan = bounds.maxLat - bounds.minLat || 0.01;
    const lngSpan = bounds.maxLng - bounds.minLng || 0.01;

    let closestDist = Infinity;
    let closestIndex = -1;

    gpsTrack.forEach((pt, i) => {
      const normX = (pt.longitude - bounds.minLng) / lngSpan;
      const normY = 1 - (pt.latitude - bounds.minLat) / latSpan;
      const centerX = width / 2;
      const centerY = height / 2;
      const x = centerX + (normX * width * 0.8 - width * 0.4 + panOffset.x) * zoom;
      const y = centerY + (normY * height * 0.8 - height * 0.4 + panOffset.y) * zoom;

      const dist = Math.hypot(mouseX - x, mouseY - y);
      if (dist < 18 && dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    if (closestIndex >= 0) {
      setHoveredPoint({
        point: gpsTrack[closestIndex],
        index: closestIndex,
        x: mouseX,
        y: mouseY,
      });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredPoint) {
      setPlaybackIndex(hoveredPoint.index);
      if (onPointSelect) {
        onPointSelect(hoveredPoint.point, hoveredPoint.index);
      }
    }
  };

  const activePoint = gpsTrack[playbackIndex] || gpsTrack[0];

  return (
    <div
      ref={containerRef}
      id="gps-route-map-container"
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col ${className}`}
    >
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Heatmap Color Mode Selector */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            熱力圖層:
          </span>
          <button
            onClick={() => setColorMode('heartRate')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              colorMode === 'heartRate'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3 h-3 text-rose-400" />
            心率區間
          </button>
          <button
            onClick={() => setColorMode('pace')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              colorMode === 'pace'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3 h-3 text-cyan-400" />
            即時配速
          </button>
          <button
            onClick={() => setColorMode('elevation')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              colorMode === 'elevation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mountain className="w-3 h-3 text-amber-400" />
            高度地形
          </button>
        </div>

        {/* Zoom & Pan Controls */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.min(3.5, z + 0.25))}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="放大地圖"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.25))}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="縮小地圖"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="重設中心點"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Vector Canvas */}
      <div className="relative w-full h-[360px] sm:h-[440px] cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />

        {/* Hover Point Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-30 pointer-events-none p-2.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md text-xs space-y-1 transform -translate-x-1/2 -translate-y-full mb-3 min-w-[130px]"
            style={{ left: hoveredPoint.x, top: hoveredPoint.y }}
          >
            <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>📍 {hoveredPoint.point.distanceFromStartKm} km</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(hoveredPoint.point.timestamp).toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-slate-400">心率:</span>
              <span className="font-mono font-bold">{hoveredPoint.point.heartRate} bpm</span>
            </div>
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-slate-400">配速:</span>
              <span className="font-mono font-bold">
                {Math.floor(hoveredPoint.point.paceMinPerKm)}'
                {Math.round((hoveredPoint.point.paceMinPerKm % 1) * 60).toString().padStart(2, '0')}"/km
              </span>
            </div>
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-slate-400">海拔:</span>
              <span className="font-mono font-bold">{hoveredPoint.point.elevation} m</span>
            </div>
          </div>
        )}

        {/* Heatmap Legend Bar */}
        <div className="absolute bottom-16 right-3 z-20 pointer-events-auto p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md text-[11px] space-y-1">
          <div className="font-semibold text-slate-300 text-[10px]">
            {colorMode === 'heartRate' && '心率強度分佈 (HR Zones)'}
            {colorMode === 'pace' && '即時配速分佈 (Pace)'}
            {colorMode === 'elevation' && '海拔高度 (Elevation)'}
          </div>
          {colorMode === 'heartRate' && (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" title="Zone 1 暖身" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" title="Zone 2 燃脂" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" title="Zone 3 有氧" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c]" title="Zone 4 閾值" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" title="Zone 5 無氧" />
              <span className="text-slate-400 ml-1">110 ~ 185+ BPM</span>
            </div>
          )}
          {colorMode === 'pace' && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
              <span className="text-cyan-400 font-bold">快 (3'50")</span>
              <div className="w-16 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 to-rose-500" />
              <span className="text-rose-400 font-bold">慢 (6'30")</span>
            </div>
          )}
          {colorMode === 'elevation' && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
              <span className="text-cyan-400 font-bold">低谷</span>
              <div className="w-16 h-2 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 via-amber-500 to-pink-500" />
              <span className="text-pink-400 font-bold">峰頂</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Route Playback & Scrubber Controls */}
      <div className="p-4 bg-slate-900 border-t border-slate-800/80 flex flex-col gap-3">
        {/* Scrubber Range slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-400 font-mono">
                {activePoint ? activePoint.distanceFromStartKm.toFixed(2) : '0.00'} km
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400 font-mono">
                {gpsTrack[gpsTrack.length - 1]?.distanceFromStartKm.toFixed(2)} km
              </span>
            </div>

            {/* Instantaneous stats during playback */}
            {activePoint && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  {activePoint.heartRate} bpm
                </span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" />
                  {Math.floor(activePoint.paceMinPerKm)}'
                  {Math.round((activePoint.paceMinPerKm % 1) * 60).toString().padStart(2, '0')}"
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5" />
                  {activePoint.elevation} m
                </span>
                {activePoint.cadence && (
                  <span className="text-indigo-300 hidden sm:inline-flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {activePoint.cadence} spm
                  </span>
                )}
              </div>
            )}
          </div>

          <input
            type="range"
            min="0"
            max={Math.max(0, gpsTrack.length - 1)}
            value={playbackIndex}
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              setPlaybackIndex(idx);
              if (onPointSelect) onPointSelect(gpsTrack[idx], idx);
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>暫停重播</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>軌跡重播</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setPlaybackIndex(0);
                setIsPlaying(false);
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="重設至起點"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Playback Speed toggles */}
            <div className="flex items-center gap-1 ml-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {[1, 5, 10, 20].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                    playbackSpeed === s
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-slate-500" />
            <span>拖曳平移地圖 · 滾輪/縮放檢視</span>
          </div>
        </div>
      </div>
    </div>
  );
};
