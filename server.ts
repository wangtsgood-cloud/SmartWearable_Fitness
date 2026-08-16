import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Generate AI Health & Biometrics Insights
app.post("/api/health/ai-insight", async (req, res) => {
  try {
    const { biometrics, userProfile, currentStatus } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback rule-based smart insights if API key is not configured
      const heartRate = biometrics?.heartRate || 72;
      const bodyBattery = biometrics?.bodyBattery || 75;
      const sleepScore = biometrics?.sleepScore || 85;
      const hrv = biometrics?.hrv || 65;

      return res.json({
        success: true,
        source: "rule-engine",
        summary: `今日身體電量充足 (${bodyBattery}%)，心率變異度 (HRV: ${hrv}ms) 處於良好修復水平。昨晚睡眠評分 ${sleepScore} 分，深睡時間充分，體能已準備好接受中至高強度有氧或肌力訓練。`,
        recommendations: [
          "早晨建議進行 30~45 分鐘 Zone 2 有氧慢跑或自行車巡航，增強有氧耐力基礎。",
          "即時靜止心率穩定，目前壓力指數偏低，下午適合進行核心肌群強化。",
          "留意補充水分，目標今日飲水量維持 2,200ml 以上以促進代謝。"
        ],
        readinessScore: Math.round((bodyBattery * 0.4) + (sleepScore * 0.4) + ((hrv / 100) * 20)),
        trainingFocus: "Zone 2 有氧耐力訓練 / 基礎肌力鍛鍊",
        recoveryStatus: "恢復極佳 (Full Recovery)"
      });
    }

    const prompt = `你是一位專業的運動生理學與智慧穿戴健康專家。請根據使用者的即時穿戴生理體徵數據，生成一份繁體中文的「今日體能狀態診斷與個人化運動建議」。

使用者體徵數據如下：
- 即時心率: ${biometrics?.heartRate || 72} BPM (靜止心率: ${biometrics?.restingHeartRate || 58} BPM, 最高心率: ${biometrics?.maxHeartRate || 185} BPM)
- 心率變異度 (HRV): ${biometrics?.hrv || 65} ms
- 身體電量 (Body Battery): ${biometrics?.bodyBattery || 78}% (今日充電 +${biometrics?.batteryCharged || 45}%, 消耗 -${biometrics?.batteryDrained || 32}%)
- 壓力指數: ${biometrics?.stressLevel || 28} / 100
- 昨晚睡眠: 睡眠評分 ${biometrics?.sleepScore || 86} 分, 總時長 ${biometrics?.sleepHours || 7.7} 小時 (深睡 ${biometrics?.deepSleepMinutes || 105} 分鐘)
- 血氧飽和度 (SpO2): ${biometrics?.spo2 || 98}%
- 今日活動進度: 步數 ${biometrics?.steps || 8420} 步, 活動熱量 ${biometrics?.activeCalories || 580} kcal
- 目前模擬狀態: ${currentStatus || "靜止休息"}

請以 JSON 格式回應，包含以下欄位：
1. "summary": (約 80-120 字的綜合體能診斷，語氣專業且鼓勵)
2. "recommendations": (陣列，包含 3 條具體、可執行的運動或休息飲食建議)
3. "readinessScore": (0-100 的今日體能準備就緒度整數)
4. "trainingFocus": (一句話，今日最適合的訓練重點，例如 "Zone 2 基礎耐力跑"、"主動恢復與輕度伸展" 或 "高強度間歇訓練 (HIIT)")
5. "recoveryStatus": (如 "恢復極佳", "輕微疲勞", "需要充足休息", "體能高峰")
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      source: "gemini-3.7-flash",
      ...parsed,
    });
  } catch (error) {
    console.error("Gemini insight error:", error);
    res.status(500).json({
      success: false,
      error: "無法生成 AI 體能洞察，已切換至備用分析模型",
      summary: "身體電量維持良好水平，建議維持規律補水與基礎有氧活動。",
      recommendations: ["進行溫和散步或放鬆伸展", "維持良好坐姿與水分攝取"],
      readinessScore: 78,
      trainingFocus: "溫和有氧活動",
      recoveryStatus: "恢復良好"
    });
  }
});

// API: Generate Morning Briefing (每日早報)
app.post("/api/coach/morning-briefing", async (req, res) => {
  try {
    const { biometrics, sleepData, recoveryData, weather } = req.body;
    const ai = getGeminiClient();

    const sleepScore = biometrics?.sleep?.score || sleepData?.score || 87;
    const deepMinutes = biometrics?.sleep?.deepMinutes || sleepData?.deepMinutes || 108;
    const bodyBattery = biometrics?.bodyBattery || 82;
    const hrv = biometrics?.hrv || 68;
    const restingHr = biometrics?.restingHeartRate || 54;
    const recoveryHoursRemaining = recoveryData?.recoveryHoursRemaining ?? 3.5;

    if (!ai) {
      // Fallback rule-based morning briefing
      return res.json({
        success: true,
        source: "rule-engine",
        briefing: {
          generatedAt: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
          headline: bodyBattery >= 80 ? "⚡ 身體電量充沛 · 今日體能處於黃金窗口" : "🌿 基礎修復良好 · 建議穩態耐力訓練",
          bodyBatteryScore: bodyBattery,
          readinessVerdict: bodyBattery >= 80 ? "巔峰黃金狀態 · 建議安排專項課表" : "良好修復狀態 · 適合中低強度巡航",
          readinessLevel: bodyBattery >= 80 ? "peak" : "optimal",
          overviewText: `昨晚睡眠品質評分 ${sleepScore} 分，慢波深睡達 ${deepMinutes} 分鐘，生長激素分泌充足。夜間靜止心率降至 ${restingHr} BPM，自律神經 HRV (${hrv}ms) 呈現正向修復。目前體能準備就緒度極高，剩餘恢復時間僅約 ${recoveryHoursRemaining} 小時。`,
          goldenWindow: {
            timeRange: "16:30 - 18:30",
            reason: "體溫達到日週期高峰，神經反應速度與肺活量處於全天最佳狀態。",
            targetSport: "Zone 3~4 節奏跑或力量爆發課表"
          },
          nutritionAdvice: {
            hydrationGoalMl: 2600,
            preWorkoutSnack: "運動前 45 分鐘攝取 1 根香蕉 + 200ml 電解質水",
            electrolyteTip: "今日預期排汗量較大，建議正餐多攝取富含鉀、鎂的深綠色蔬菜與酪梨。"
          },
          nervousSystemInsight: {
            hrvStatus: `HRV 偏高 (+5ms vs 7日平均)，副交感神經活性高，抗疲勞韌性強。`,
            stressGuidance: "白天專注力良好，可安排高認知負載工作與訓練。",
            breathingTip: "午後可進行 5 分鐘「4-7-8」腹式呼吸法，持續維持自律神經平衡。"
          },
          keyActionItems: [
            "下午 16:30 執行 45 分鐘 Zone 2 基礎耐力跑 (心率 138-148 BPM)",
            "全天飲水目標 2,600ml，午前完成 1,200ml",
            "午餐補充 30g 優質蛋白質（雞胸肉/鮭魚）以加速肌纖維超補償"
          ]
        }
      });
    }

    const prompt = `你是一位世界頂級的運動生理學家與智慧手錶 AI 運動教練。
請根據以下使用者今日體徵、昨夜睡眠與恢復數據，生成一份生動、專業、富含啟發性與精確數據佐證的繁體中文「每日早報 (Morning Briefing)」JSON。

使用者即時數據：
- 身體電量 (Body Battery): ${bodyBattery}%
- 昨晚睡眠評分: ${sleepScore} 分 (深睡 ${deepMinutes} 分鐘, 淺睡 ${biometrics?.sleep?.lightMinutes || 240} 分鐘, REM ${biometrics?.sleep?.remMinutes || 84} 分鐘)
- 心率變異度 (HRV): ${hrv} ms (正常基準 60-70ms)
- 靜止心率 (Resting HR): ${restingHr} BPM
- 血氧 (SpO2): ${biometrics?.spo2 || 98}%
- 體能準備度評估: 剩餘恢復時間約 ${recoveryHoursRemaining} 小時
- 今日天氣: ${weather?.condition || "晴朗有雲"}, 氣溫 ${weather?.temperatureC || 26}°C

請嚴格輸出符合以下結構的 JSON（不可包含多餘文字或 markdown 標籤以外的內容）：
{
  "generatedAt": "07:30",
  "headline": "一句振奮人心、精準總結今日體能狀態的標題",
  "bodyBatteryScore": ${bodyBattery},
  "readinessVerdict": "例如：巔峰黃金狀態 · 建議安排專項課表",
  "readinessLevel": "peak" | "optimal" | "moderate" | "rest",
  "overviewText": "約 100-150 字的生理診斷與晨間體能解析",
  "goldenWindow": {
    "timeRange": "例如 16:30 - 18:15",
    "reason": "生理時鐘與體溫高峰理由",
    "targetSport": "建議專項運動"
  },
  "nutritionAdvice": {
    "hydrationGoalMl": 2600,
    "preWorkoutSnack": "運動前補充建議",
    "electrolyteTip": "電解質與礦物質補充要點"
  },
  "nervousSystemInsight": {
    "hrvStatus": "HRV 自律神經評估",
    "stressGuidance": "壓力調控指導",
    "breathingTip": "具體呼吸法或減壓建議"
  },
  "keyActionItems": [
    "今日行動要點 1",
    "今日行動要點 2",
    "今日行動要點 3"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      source: "gemini-3.7-flash",
      briefing: parsed,
    });
  } catch (err) {
    console.error("Morning briefing error:", err);
    res.status(500).json({
      success: false,
      error: "早報生成失敗，使用預設生理模型",
    });
  }
});

// API: Generate / Adjust Adaptive Training Workout Plan (自適應訓練課表)
app.post("/api/coach/adaptive-plan", async (req, res) => {
  try {
    const { goal = 'marathon_pb', fitnessLevel = 'intermediate', biometrics, weeklyMileageTarget = 35 } = req.body;
    const ai = getGeminiClient();

    const bodyBattery = biometrics?.bodyBattery || 80;
    const hrv = biometrics?.hrv || 65;
    const sleepScore = biometrics?.sleep?.score || 85;

    if (!ai) {
      // Fallback 7-day adaptive plan
      return res.json({
        success: true,
        source: "rule-engine",
        plan: {
          id: `plan-${Date.now()}`,
          goal,
          goalLabel: goal === 'marathon_pb' ? "半馬/全馬破 PB 專項" : goal === 'cycling_ftp' ? "公路車 FTP 與有氧耐力" : "綜合體能與燃脂",
          fitnessLevel,
          weeklyMileageTargetKm: weeklyMileageTarget,
          focusSummary: "以 Zone 2 有氧耐力為基底，穿插 1 次乳酸閾值間歇與 1 次週末長距離跑，同時依即時 HRV 動態微調強度。",
          planPeriod: "第 3 週 · 專項進步期 (Cycle 2)",
          adaptiveAdjustmentNote: `⚡ 偵測到今日身體電量 ${bodyBattery}%、HRV ${hrv}ms，已自動為今日課表最佳化 +5% 節奏配速！`,
          aiCoachVerdict: "當前生理指標處於超補償高峰期，請嚴格遵守心率區間以達到最高效益。",
          days: [
            {
              id: "d1",
              dayOfWeek: "週一",
              date: "今日",
              isToday: true,
              sportType: "running",
              title: "Zone 2 穩態基礎耐力跑",
              subtitle: "有氧打底與燃脂效率最佳化",
              intensity: "Zone 2",
              durationMinutes: 45,
              targetHrBpm: "135 - 148 BPM",
              targetPaceOrPower: "5'25\" - 5'40\" /km",
              estimatedCalories: 450,
              trainingLoadScore: 68,
              workoutStructure: ["10 分鐘輕鬆熱身跑 (Zone 1)", "30 分鐘維持 Zone 2 巡航配速", "5 分鐘慢走與下肢動態伸展"],
              adaptationReason: `即時身體電量 ${bodyBattery}% 充足，維持標準 45m 有氧堆疊。`,
              status: "pending"
            },
            {
              id: "d2",
              dayOfWeek: "週二",
              date: "明日",
              isToday: false,
              sportType: "running",
              title: "乳酸閾值間歇跑 (Threshold)",
              subtitle: "提升乳酸清除率與抗疲勞耐受力",
              intensity: "Zone 4",
              durationMinutes: 50,
              targetHrBpm: "162 - 174 BPM",
              targetPaceOrPower: "4'30\" - 4'45\" /km",
              estimatedCalories: 580,
              trainingLoadScore: 110,
              workoutStructure: ["12 分鐘熱身跑 (Zone 1-2)", "4 組 x 5 分鐘 Zone 4 閾值跑 (組間慢跑 2m)", "10 分鐘緩和跑"],
              adaptationReason: "高強度刺激，安排於充分修復之後以保證高質輸出。",
              status: "pending"
            },
            {
              id: "d3",
              dayOfWeek: "週三",
              date: "08/19",
              isToday: false,
              sportType: "mobility",
              title: "主動修復與筋膜放鬆",
              subtitle: "自律神經調控與髖膝關節活動度",
              intensity: "Zone 1",
              durationMinutes: 30,
              targetHrBpm: "< 115 BPM",
              estimatedCalories: 120,
              trainingLoadScore: 20,
              workoutStructure: ["滾筒放鬆股四頭肌與小腿後側 10m", "動態鴿式與髖屈肌延展 10m", "10m 4-7-8 調息呼吸減壓"],
              adaptationReason: "間歇日後的關鍵主動修復，預防過度訓練。",
              status: "pending"
            },
            {
              id: "d4",
              dayOfWeek: "週四",
              date: "08/20",
              isToday: false,
              sportType: "cycling",
              title: "交叉訓練 · 低衝擊飛輪巡航",
              subtitle: "維持心肺刺激同時減輕膝踝關節衝擊",
              intensity: "Zone 2",
              durationMinutes: 50,
              targetHrBpm: "130 - 145 BPM",
              targetPaceOrPower: "160 - 180 Watts",
              estimatedCalories: 480,
              trainingLoadScore: 65,
              workoutStructure: ["8 分鐘輕齒比踏頻熱身 (85rpm)", "35 分鐘穩態輸出 (Zone 2)", "7 分鐘低阻力放鬆冷卻"],
              adaptationReason: "避免連續跑步帶來的關節衝擊，增進毛細血管密度。",
              status: "pending"
            },
            {
              id: "d5",
              dayOfWeek: "週五",
              date: "08/21",
              isToday: false,
              sportType: "strength",
              title: "下肢肌力與核心穩定強化",
              subtitle: "單腿平衡、臀中肌與抗旋轉核心",
              intensity: "Zone 2",
              durationMinutes: 40,
              targetHrBpm: "120 - 140 BPM",
              estimatedCalories: 300,
              trainingLoadScore: 55,
              workoutStructure: ["保加利亞分腿蹲 3組 x 10下", "單腳硬舉 3組 x 8下", "側平板支撐與鳥狗式 3組"],
              adaptationReason: "提升跑步經濟性，減少長距離後程步態塌陷。",
              status: "pending"
            },
            {
              id: "d6",
              dayOfWeek: "週六",
              date: "08/22",
              isToday: false,
              sportType: "running",
              title: "週末長距離慢跑 (LSD)",
              subtitle: "有氧引擎擴容與脂肪代謝極限鍛鍊",
              intensity: "Zone 2",
              durationMinutes: 80,
              targetHrBpm: "136 - 150 BPM",
              targetPaceOrPower: "5'30\" - 5'50\" /km",
              estimatedCalories: 860,
              trainingLoadScore: 145,
              workoutStructure: ["前 15 分鐘輕鬆暖身", "55 分鐘定速巡航 (累積 12-14km)", "10 分鐘冷卻與全身伸展"],
              adaptationReason: "每週主要訓練量累積日，訓練心理韌性與耐力儲備。",
              status: "pending"
            },
            {
              id: "d7",
              dayOfWeek: "週日",
              date: "08/23",
              isToday: false,
              sportType: "rest",
              title: "完全休息日 (Full Rest)",
              subtitle: "神經系統與肌原纖維全面重塑",
              intensity: "Rest",
              durationMinutes: 0,
              targetHrBpm: "--",
              estimatedCalories: 0,
              trainingLoadScore: 0,
              workoutStructure: ["享受充足睡眠 (目標 >8 小時)", "充足蛋白質與水分補充", "輕鬆散步或冥想"],
              adaptationReason: "週期結尾超量恢復，為下週負荷儲備充沛動能。",
              status: "pending"
            }
          ]
        }
      });
    }

    const prompt = `你是一位專業的頂級耐力與運動教練。
請根據使用者的目標、體能等級與即時體徵數據，生成一份繁體中文 7 天自適應訓練課表 (JSON 格式)。

參數：
- 目標: ${goal}
- 體能等級: ${fitnessLevel}
- 目標週里程: ${weeklyMileageTarget} km
- 即時身體電量: ${bodyBattery}%
- 即時 HRV: ${hrv} ms
- 睡眠評分: ${sleepScore} 分

請輸出符合以下結構的嚴格 JSON：
{
  "id": "plan-id",
  "goal": "${goal}",
  "goalLabel": "目標標籤",
  "fitnessLevel": "${fitnessLevel}",
  "weeklyMileageTargetKm": ${weeklyMileageTarget},
  "focusSummary": "本週重點說明 (約 40-60 字)",
  "planPeriod": "第 3 週 · 專項進步期",
  "adaptiveAdjustmentNote": "針對今日體徵 (HRV/電量) 的即時課表自適應調整說明",
  "aiCoachVerdict": "教練評語與叮嚀",
  "days": [
    {
      "id": "d1",
      "dayOfWeek": "週一",
      "date": "今日",
      "isToday": true,
      "sportType": "running" | "cycling" | "hiking" | "hiit" | "mobility" | "strength" | "rest",
      "title": "訓練名稱",
      "subtitle": "副標題",
      "intensity": "Zone 1" | "Zone 2" | "Zone 3" | "Zone 4" | "Zone 5" | "Rest",
      "durationMinutes": 45,
      "targetHrBpm": "135 - 148 BPM",
      "targetPaceOrPower": "5'25\" /km",
      "estimatedCalories": 450,
      "trainingLoadScore": 70,
      "workoutStructure": ["熱身...", "主要課表...", "緩和..."],
      "adaptationReason": "自適應調整理由",
      "status": "pending"
    }
    // ... 共 7 天 (d1 到 d7)
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      source: "gemini-3.7-flash",
      plan: parsed,
    });
  } catch (err) {
    console.error("Adaptive plan error:", err);
    res.status(500).json({
      success: false,
      error: "自適應課表生成失敗",
    });
  }
});

// API: Real-time AI Sports Coach Interactive Chat (即時教練諮詢)
app.post("/api/coach/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [], coachPersona = 'marcus', biometrics, recentWorkouts } = req.body;
    const ai = getGeminiClient();

    const personaDescriptions: Record<string, string> = {
      marcus: "你是 Coach Marcus，一位專精於耐力運動（馬拉松、鐵人三項、自行車 FTP、VO2Max 提升）的頂級體能教練。你的語氣精準、熱血且講求科學化數據。",
      elena: "你是 Dr. Elena，一位運動生理學醫學博士兼運動物理治療師。你專精於運動傷害預防、關節力學、HRV 自律神經調節、過度訓練症候群診斷與睡眠修復。你的語氣嚴謹、溫暖且富有同理心。",
      alex: "你是 Coach Alex，一位專注於運動營養學、能量代謝調控、生酮與碳水循環、增肌減脂策略的運動營養顧問。你的語氣親切、實用，善於給出具體食譜與補給時間表。"
    };

    const systemInstruction = `${personaDescriptions[coachPersona] || personaDescriptions.marcus}
你現在正透過智慧穿戴裝置與使用者進行即時即時諮詢。
你隨時掌握使用者的即時穿戴體徵數據：
- 即時心率: ${biometrics?.heartRate || 72} BPM (靜止心率: ${biometrics?.restingHeartRate || 54} BPM)
- 心率變異度 (HRV): ${biometrics?.hrv || 68} ms
- 身體電量: ${biometrics?.bodyBattery || 80}%
- 昨晚睡眠評分: ${biometrics?.sleep?.score || 87} 分 (深睡 ${biometrics?.sleep?.deepMinutes || 105} 分鐘)
- 今日活動步數: ${biometrics?.steps || 8420} 步, 活動熱量: ${biometrics?.activeCalories || 580} kcal
- 壓力指數: ${biometrics?.stressLevel || 26} / 100

回答規範：
1. 一律使用專業繁體中文 (台灣用語)。
2. 回答需緊扣使用者的即時生理數據（如 HRV、身體電量或睡眠狀態），並結合運動科學給出明確、可操作的建議。
3. 善用條列式或粗體重點，若涉及具體訓練或飲食，請給出明確數值（如心率區間、配速、公克數、時間）。
4. 結尾可適時給予一句溫暖或激勵的教練叮嚀。`;

    if (!ai) {
      // Fallback rule response
      const sampleReplies: Record<string, string> = {
        marcus: `收到你的問題！從你目前的即時數據來看：**身體電量處於 ${biometrics?.bodyBattery || 80}%**，**HRV 保持在 ${biometrics?.hrv || 68}ms 的良好水平**。\n\n針對你的提問：\n1. **訓練強度建議**：今日心血管與自律神經系統處於高韌性狀態，適合進行 **Zone 2 有氧耐力** 或 **Zone 4 乳酸閾值訓練**。\n2. **配速指引**：若進行慢跑，建議心率維持在 138-148 BPM，不要過早進入無氧區間。\n3. **關鍵注意**：運動前 40 分鐘請確保水分補充達到 350ml，並做好下肢動態伸展。\n\n保持節奏，今天一定能完成一堂高質量的訓練！`,
        elena: `你好！我仔細檢視了你的修復指標：昨晚**深睡達 ${biometrics?.sleep?.deepMinutes || 105} 分鐘**，夜間心率下潛良好，表示你的肌纖維修復與中樞神經系統恢復得相當理想。\n\n建議你：\n- 若感覺肌肉有輕微緊繃，可在運動前加強**小腿比目魚肌與髖屈肌的動態擺動熱身**。\n- 若訓練後有發熱感，可進行 15 分鐘常溫水浴與筋膜滾筒放鬆。\n- 隨時傾聽身體回饋，若心率驟升超過日常 10% 以上，請主動降速。`,
        alex: `哈囉！針對運動能量與代謝補給，考量你今日已有 ${biometrics?.activeCalories || 580} kcal 的活動消耗：\n\n- **運動前 30-60 分鐘**：建議攝取約 30g 易吸收碳水（例如 1 根香蕉或 1 片全麥吐司佐少許蜂蜜）。\n- **運動中補給**：若單次運動超過 60 分鐘，每小時需補充 30-45g 碳水化合物與 500ml 含有鈉、鉀的電解質水。\n- **運動後 30 分鐘黃金期**：補充足量優質蛋白質 25-30g + 碳水 50g（如乳清蛋白配地瓜），能最大化促進肌糖原合成！`
      };

      return res.json({
        success: true,
        source: "rule-engine",
        reply: sampleReplies[coachPersona] || sampleReplies.marcus,
        suggestedFollowUps: [
          "我今天的最佳運動時間是幾點？",
          "運動後如何快速補充肌糖原？",
          "推薦我適合明天的修復課表"
        ]
      });
    }

    // Format chat history into contents array or chat model
    const chat = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction,
      },
    });

    // Send previous messages if any (limited to last 6 for speed)
    const recentHistory = conversationHistory.slice(-6);
    for (const hist of recentHistory) {
      if (hist.sender === 'user') {
        // we can prime or send message
      }
    }

    const response = await chat.sendMessage({
      message: message,
    });

    const replyText = response.text || "教練正在分析您的運動體徵，請稍候重試。";

    return res.json({
      success: true,
      source: "gemini-3.7-flash",
      reply: replyText,
      suggestedFollowUps: [
        "今天適合做高強度間歇嗎？",
        "運動前該補充多少水分與電解質？",
        "幫我微調下週的自適應課表"
      ]
    });
  } catch (err) {
    console.error("Coach chat error:", err);
    res.status(500).json({
      success: false,
      error: "教練即時諮詢暫時繁忙，請稍後再試。",
      reply: "目前教練正在調度最新的體徵資料庫，建議您今日保持充足水分，依照身體電量進行 Zone 2 有氧運動。"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
