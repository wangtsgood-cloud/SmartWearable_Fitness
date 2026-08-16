# 智慧穿戴與運動追蹤平台 (Smart Wearable & Fitness Tracking Hub) - 專案規劃書 (PROJECT.md)

---

## 1. 專案概述 (Project Overview)

本專案旨在打造一個現代化、全方位且高互動性的**智慧穿戴與運動追蹤平台**。系統整合即時生理數據監測（心率、血氧、HRV、身體電量）、多運動模式追蹤（GPS 軌跡、配速分段、高程剖面）、深度睡眠品質分析，以及基於 **Gemini AI** 的個人化智慧運動教練與自適應訓練課表。

### 1.1 核心目標
- **全方位健康監控**：提供即時與歷史體徵數據視覺化，包括心率區間、壓力指數、睡眠分期與身體電量（Body Battery）。
- **專業運動分析**：支援路跑、騎行、游泳、重訓等多元運動模式，具備 GPS 動態軌跡回放與分段配速分析。
- **AI 驅動的智慧教練**：利用 Gemini AI 根據使用者今日生理狀態與疲勞程度，動態產生每日訓練建議與恢復指導。
- **跨平台數據相容性**：支援 `.GPX` / `.FIT` 軌跡檔案匯入匯出，並具備 Web Bluetooth (BLE) 外部感測器對接設計。

---

## 2. 系統架構與技術棧 (System Architecture & Tech Stack)

```
┌─────────────────────────────────────────────────────────────┐
│                      前端展示層 (Client SPA)                  │
│  React 19 + TypeScript + Tailwind CSS + Lucide + Motion     │
│  圖表視覺化: Recharts / D3.js | 地圖軌跡: Canvas / SVG       │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    後端服務層 (Express Server)               │
│  Node.js + Express API + TypeScript (tsx / esbuild)         │
│  運動數據解析 (GPX/FIT Parser) + 體能演算法模組              │
└──────────────────────────────┬──────────────────────────────┘
                               │ Google Gen AI SDK
┌──────────────────────────────▼──────────────────────────────┐
│                      AI 引擎 (Gemini 2.5)                   │
│  Gemini Flash: 每日健康洞察、自適應課表、過度訓練預警        │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 技術選型
| 模組 | 技術 / 工具 | 說明 |
| :--- | :--- | :--- |
| **前端框架** | React 19, TypeScript | 高效能組件化開發，具備強型別保障 |
| **樣式設計** | Tailwind CSS v4, Motion (Framer Motion) | 現代化流暢響應式排版與資料動畫 |
| **圖表與可視化** | Recharts, D3.js, Canvas 2D | 繪製心率區間、睡眠分期、高度剖面與 GPS 軌跡 |
| **後端框架** | Node.js, Express, tsx | 提供 RESTful API、數據處理與 AI 代理串接 |
| **AI 智慧服務** | `@google/genai` (Gemini 2.5 Flash) | 負責訓練負荷分析、個性化建議與對話式諮詢 |
| **圖標庫** | `lucide-react` | 運動、健康、設備狀態之標準向量圖標 |

---

## 3. 核心功能模組 (Core Functional Modules)

### 3.1 即時健康與體徵儀表板 (Biometrics Dashboard)
1. **即時心率與區間分析 (Heart Rate & Zones)**：
   - 即時脈搏跳動波形動畫與當前心率 (BPM)。
   - 心率五大區間分佈（暖身放鬆、脂肪燃燒、有氧耐力、無氧乳酸、極限衝刺）。
   - 靜止心率（RHR）與異常高低心率預警。
2. **身體電量與壓力指數 (Body Battery & Stress Index)**：
   - 綜合睡眠修復、活動消耗、心率變異度 (HRV)，即時計算 0~100 的動態能量存量。
   - 全天壓力趨勢圖與深呼吸減壓導引。
3. **日常活動圓環 (Activity Rings)**：
   - 活動熱量（Active Calories / BMR）。
   - 每日步數與爬樓梯高度（Elevation / Floors）。
   - 有氧活動時長與久坐起身次數追蹤。

### 3.2 多運動模式追蹤與 GPS 軌跡 (Workout Tracking & Route Analytics)
1. **多模式切換**：
   - 支援戶外路跑、室內跑步機、自行車騎行、泳池游泳、高強度間歇 (HIIT)、肌力重訓、登山健行。
2. **即時運動監控面板**：
   - 超大字體即時數據看板（配速、距離、累計時間、即時心率、步頻 Cadence）。
3. **GPS 互動式軌跡與熱力圖**：
   - 支援 GPS 經緯度軌跡繪製，可切換「配速漸層」或「心率區間」彩色路線。
   - 每公里分段配速柱狀圖（Lap / Split Times）與高度落差剖面圖（Elevation Profile）。
4. **檔案匯入/匯出**：
   - 支援標準 `.GPX` / `.FIT` 運動軌跡檔案解析與自訂檔案匯入。

### 3.3 全天候睡眠與修復評估 (Sleep Architecture & Recovery)
1. **睡眠分期圖譜**：
   - 詳細記錄並繪製「清醒 (Awake)」、「REM (快速動眼期)」、「淺層睡眠 (Light)」、「深層睡眠 (Deep)」時間帶。
2. **睡眠品質評分 (Sleep Score)**：
   - 依據睡眠時長、深睡佔比、夜間心率下降率（Dip Ratio）及夜間翻身次數給予 0~100 分。
3. **恢復時間建議 (Recovery Advisor)**：
   - 評估昨日訓練強度與睡眠品質，提供運動後建議修復時數倒數。

### 3.4 Gemini AI 智慧運動教練 (AI Coach & Insights)
1. **每日早報與體能洞察**：
   - 自動統整昨日睡眠與當前身體電量，生成個人化白話建議（例如：「昨日深睡充足且 HRV 上升，今天非常適合進行長距離慢跑或高強度間歇」）。
2. **目標導向自適應課表 (Adaptive Training Plans)**：
   - 使用者可設定目標（如：半馬破 2、體脂降至 15%、肌力增強）。
   - AI 依據每日實際體能表現自動增減訓練量與強度。
3. **互動式運動諮詢助理**：
   - 隨時回答使用者關於補給、跑姿、心率控制、運動傷害防護等專業運動問題。

### 3.5 遊戲化與社交成就 (Gamification & Challenges)
1. **成就勳章 (Badges & Milestones)**：
   - 累計里程成就（100km、環島成就）、早鳥運動勳章、連續達標天數（Streaks）。
2. **虛擬路線挑戰賽 (Virtual Challenges)**：
   - 虛擬環島路跑挑戰、單車登頂賽、好友週步數排行榜。
3. **運動打卡海報一鍵生成 (Social Share Card)**：
   - 一鍵匯出結合軌跡地圖、核心數據（配速、卡路里、心率）的質感分享卡。

---

## 4. 資料模型設計 (Data Models & Contracts)

### 4.1 使用者設定與體能資料 (`UserProfile`)
```typescript
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  maxHeartRate: number;
  restingHeartRate: number;
  vo2Max: number;
  dailyStepGoal: number;
  dailyCalorieGoal: number;
  activeMinutesGoal: number;
}
```

### 4.2 運動活動記錄 (`WorkoutSession`)
```typescript
export interface GPSPoint {
  latitude: number;
  longitude: number;
  elevation: number;
  timestamp: string;
  heartRate: number;
  speedKmh: number;
}

export interface WorkoutSession {
  id: string;
  type: 'running' | 'cycling' | 'swimming' | 'hiit' | 'strength' | 'hiking';
  title: string;
  startTime: string;
  durationSeconds: number;
  distanceMeters: number;
  caloriesBurned: number;
  avgHeartRate: number;
  maxHeartRate: number;
  avgPaceMinutesPerKm?: number;
  avgCadence?: number;
  elevationGainMeters: number;
  trainingEffect: {
    aerobic: number;    // 0.0 - 5.0
    anaerobic: number;  // 0.0 - 5.0
  };
  heartRateZones: {
    warmupSec: number;
    fatBurnSec: number;
    aerobicSec: number;
    anaerobicSec: number;
    peakSec: number;
  };
  gpsTrack?: GPSPoint[];
  splits?: { km: number; pace: string; avgHr: number }[];
}
```

### 4.3 睡眠分析記錄 (`SleepLog`)
```typescript
export interface SleepStageSegment {
  stage: 'deep' | 'light' | 'rem' | 'awake';
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface SleepLog {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  totalDurationMinutes: number;
  sleepScore: number; // 0 - 100
  stages: {
    deepMinutes: number;
    lightMinutes: number;
    remMinutes: number;
    awakeMinutes: number;
  };
  timeline: SleepStageSegment[];
  avgHrv: number;
  avgRestingHr: number;
  insights: string;
}
```

---

## 5. 前端介面佈局規劃 (UI/UX Layout Architecture)

1. **頂部導航列 (Top Navigation Header)**：
   - 品牌識別、使用者頭像、目前裝置連線狀態（Apple Watch / Garmin / BLE 心率帶模擬）、快速切換運動模式按鈕。
2. **主視圖模組 (Tab Views)**：
   - **總覽儀表板 (Dashboard)**：即時心率動態卡、身體電量能量條、今日三大圓環、最近運動摘要、AI 每日速報。
   - **運動分析室 (Workouts & GPS)**：歷史運動列表、單次運動深度剖析（互動式地圖軌跡、分段配速表、心率區間直方圖）。
   - **睡眠與健康 (Sleep & Recovery)**：睡眠分期甘特圖、HRV 趨勢圖、壓力曲線、建議修復時間計時器。
   - **AI 智慧教練 (AI Coach)**：個人化訓練計畫、體能進步預測、即時對話諮詢。
   - **社群與成就 (Community & Badges)**：成就勳章牆、排行榜、自訂運動海報生成工具。

---

## 6. 開發路線圖 (Development Roadmap)

- [x] **階段一：專案架構與規格定義**（完成 `PROJECT.md` 與資料結構定義）。
- [ ] **階段二：後端 Express API 與 Gemini 服務建立**（健康資料 API、運動記錄 CRUD、Gemini AI 分析端點）。
- [ ] **階段三：即時體徵儀表板與圖表視覺化實作**（心率區間、活動圓環、身體電量動態曲線）。
- [ ] **階段四：運動軌跡繪製與 GPS 檔案解析**（路跑軌跡 Canvas/SVG 漸層地圖、分段配速圖）。
- [ ] **階段五：睡眠分期與 AI 智慧教練互動視窗**（睡眠甘特圖、自適應訓練課表與 Gemini 運動諮詢）。
- [ ] **階段六：成就海報匯出與多裝置連線模擬**（卡片匯出、BLE 藍牙設備狀態模擬與驗證）。
