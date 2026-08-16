import { WorkoutSession, GPSPoint, SplitLap } from '../types';

export const parseGPXString = (gpxText: string, title?: string): WorkoutSession => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxText, 'application/xml');

  const trkpts = Array.from(xmlDoc.querySelectorAll('trkpt'));
  if (trkpts.length === 0) {
    throw new Error('未在 GPX 檔案中偵測到有效的 trkpt 軌跡點');
  }

  const gpsTrack: GPSPoint[] = [];
  let cumDistance = 0;
  let totalElevGain = 0;
  let totalElevLoss = 0;
  let prevPt: { lat: number; lng: number; elev: number; time: Date } | null = null;
  let totalHr = 0;
  let maxHr = 0;
  let totalPace = 0;
  let validPaceCount = 0;

  // Haversine distance in KM
  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  trkpts.forEach((pt, idx) => {
    const lat = parseFloat(pt.getAttribute('lat') || '0');
    const lng = parseFloat(pt.getAttribute('lon') || '0');
    const eleNode = pt.querySelector('ele');
    const elev = eleNode ? parseFloat(eleNode.textContent || '0') : 0;
    const timeNode = pt.querySelector('time');
    const timeStr = timeNode?.textContent || new Date().toISOString();
    const time = new Date(timeStr);

    // Heart rate extraction from extensions (e.g. gpxtpx:hr or hr)
    const hrNode = pt.querySelector('hr') || pt.querySelector('TrackPointExtension > hr');
    const hr = hrNode ? parseInt(hrNode.textContent || '145') : Math.round(140 + Math.sin(idx / 5) * 20);

    let speedKmh = 12;
    let paceMinPerKm = 5.0;

    if (prevPt) {
      const dKm = haversineKm(prevPt.lat, prevPt.lng, lat, lng);
      cumDistance += dKm;

      const dElev = elev - prevPt.elev;
      if (dElev > 0) totalElevGain += dElev;
      if (dElev < 0) totalElevLoss += Math.abs(dElev);

      const dSec = Math.max(1, (time.getTime() - prevPt.time.getTime()) / 1000);
      speedKmh = parseFloat(((dKm / (dSec / 3600)) || 12).toFixed(1));
      if (speedKmh > 0 && speedKmh < 60) {
        paceMinPerKm = parseFloat((60 / speedKmh).toFixed(2));
        totalPace += paceMinPerKm;
        validPaceCount++;
      }
    }

    if (hr > 0) {
      totalHr += hr;
      if (hr > maxHr) maxHr = hr;
    }

    prevPt = { lat, lng, elev, time };

    gpsTrack.push({
      latitude: lat,
      longitude: lng,
      elevation: Math.round(elev),
      timestamp: timeStr,
      heartRate: hr,
      speedKmh,
      paceMinPerKm,
      cadence: 176,
      distanceFromStartKm: parseFloat(cumDistance.toFixed(2)),
    });
  });

  const avgHr = Math.round(totalHr / gpsTrack.length) || 150;
  const avgPaceVal = validPaceCount > 0 ? totalPace / validPaceCount : 5.0;
  const paceMinutes = Math.floor(avgPaceVal);
  const paceSecs = Math.round((avgPaceVal - paceMinutes) * 60);
  const avgPaceFormatted = `${paceMinutes}'${paceSecs < 10 ? '0' : ''}${paceSecs}"`;

  const totalDistance = parseFloat(cumDistance.toFixed(2)) || 5.0;
  const startTime = gpsTrack[0]?.timestamp || new Date().toISOString();
  const endTime = gpsTrack[gpsTrack.length - 1]?.timestamp || new Date().toISOString();
  const durationSecs = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000) || 1800;

  // Build 1km splits
  const splits: SplitLap[] = [];
  let currentLapStartDist = 0;
  let lapKm = 1;

  for (let i = 0; i < gpsTrack.length; i++) {
    if (gpsTrack[i].distanceFromStartKm >= lapKm) {
      splits.push({
        km: lapKm,
        timeSeconds: Math.round(avgPaceVal * 60),
        paceFormatted: avgPaceFormatted,
        avgHeartRate: Math.round(avgHr + (Math.random() - 0.5) * 6),
        elevationGainMeters: Math.round(totalElevGain / (totalDistance || 1)),
        avgCadence: 178,
      });
      lapKm++;
    }
  }

  return {
    id: `gpx-${Date.now()}`,
    title: title || '已匯入 GPX 運動軌跡',
    sportType: totalDistance > 20 ? 'cycling' : 'running',
    startTime: new Date(startTime).toLocaleString('zh-TW', { hour12: false }),
    durationSeconds: durationSecs,
    distanceKm: totalDistance,
    caloriesBurned: Math.round(totalDistance * 65),
    avgHeartRate: avgHr,
    maxHeartRate: maxHr || 178,
    avgPaceFormatted,
    avgSpeedKmh: parseFloat(((totalDistance / (durationSecs / 3600)) || 12).toFixed(1)),
    maxSpeedKmh: 16.5,
    elevationGainMeters: Math.round(totalElevGain),
    elevationLossMeters: Math.round(totalElevLoss),
    avgCadence: 178,
    trainingEffect: {
      aerobic: 3.8,
      anaerobic: 1.8,
      description: '穩定有氧刺激，強化燃脂代謝與心肺耐力基礎。',
    },
    heartRateZoneDurations: {
      zone1: Math.round(durationSecs * 0.1),
      zone2: Math.round(durationSecs * 0.4),
      zone3: Math.round(durationSecs * 0.35),
      zone4: Math.round(durationSecs * 0.12),
      zone5: Math.round(durationSecs * 0.03),
    },
    splits,
    gpsTrack,
    weather: {
      temperatureC: 25,
      humidityPct: 70,
      condition: '自訂匯入天氣',
    },
  };
};
