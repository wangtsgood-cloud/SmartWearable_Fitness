import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Flame, 
  Heart, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Trash2,
  HelpCircle,
  Clock
} from 'lucide-react';
import Markdown from 'react-markdown';
import { AICoachPersona, AICoachMessage, BiometricsData } from '../../types';

interface Props {
  biometrics: BiometricsData;
  onSendMessage: (text: string, persona: string) => Promise<string>;
  onApplySuggestedAction?: (actionType: string, payload?: any) => void;
}

export const LiveAICoachChatCard: React.FC<Props> = ({
  biometrics,
  onSendMessage,
  onApplySuggestedAction,
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('marcus');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const personas: AICoachPersona[] = [
    {
      id: 'marcus',
      name: 'Coach Marcus',
      title: '菁英耐力與配速總教練',
      specialty: '馬拉松破速 · VO2Max 提升 · 功率踏頻調控',
      avatarEmoji: '🏅',
      color: 'from-amber-500 to-orange-600',
      systemRoleDescription: '熱血、科學化數據導向、精確心率配速指導'
    },
    {
      id: 'elena',
      name: 'Dr. Elena',
      title: '運動生理與修復醫學顧問',
      specialty: 'HRV 自律神經 · 關節防護 · 睡眠修復診斷',
      avatarEmoji: '🩺',
      color: 'from-teal-500 to-emerald-600',
      systemRoleDescription: '嚴謹專業、溫暖同理、過度訓練預防'
    },
    {
      id: 'alex',
      name: 'Coach Alex',
      title: '運動營養與代謝調控師',
      specialty: '肌糖原補給 · 碳水循環 · 電解質平衡',
      avatarEmoji: '🥗',
      color: 'from-blue-500 to-indigo-600',
      systemRoleDescription: '實用食譜、運動前後能量補充精算'
    }
  ];

  const currentPersona = personas.find(p => p.id === selectedPersonaId) || personas[0];

  const [messages, setMessages] = useState<AICoachMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'coach',
      coachId: 'marcus',
      timestamp: '剛剛',
      text: `你好！我是 **Coach Marcus**。我隨時掌握你的即時穿戴體徵：目前身體電量 **${biometrics.bodyBattery}%**、HRV **${biometrics.hrv}ms**、昨晚睡眠評分 **${biometrics.sleep.score}分**。\n\n今天想諮詢什麼運動問題？無論是今日配速微調、間歇課表安排、還是補給策略，我隨時為你提供精準的運動科學建議！`,
      suggestedActions: [
        { label: '🏃 評估今日最佳跑步時間', actionType: 'query_golden_window' },
        { label: '⚡ 今日身體電量適合重訓嗎？', actionType: 'query_workout_type' },
        { label: '💧 運動前 40 分鐘補給策略', actionType: 'query_nutrition' },
      ]
    }
  ]);

  const quickPrompts = [
    "我今天下午該練間歇還是慢跑？",
    "昨晚深睡 105 分鐘，現在心率 72，適合重訓嗎？",
    "運動前 30 分鐘該吃什麼最能提升耐力？",
    "剛跑完 10K 腳踝微緊，有什麼修復伸展建議？",
    "如何依照我目前的 HRV 調整明天的課表？"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    const userMsg: AICoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      text: textToSend.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const reply = await onSendMessage(textToSend, selectedPersonaId);
      const coachMsg: AICoachMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        coachId: selectedPersonaId,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        text: reply,
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      const errorMsg: AICoachMessage = {
        id: `err-${Date.now()}`,
        sender: 'coach',
        coachId: selectedPersonaId,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        text: '教練目前連線繁忙，建議您依照目前身體電量維持 Zone 2 穩態運動並補充足量水分。',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的瀏覽器暫不支援即時語音辨識');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = 'zh-TW';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputMessage(prev => prev ? `${prev} ${transcript}` : transcript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechMsgId === msgId) {
      window.speechSynthesis.cancel();
      setActiveSpeechMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.05;

    utterance.onend = () => setActiveSpeechMsgId(null);
    utterance.onerror = () => setActiveSpeechMsgId(null);

    window.speechSynthesis.speak(utterance);
    setActiveSpeechMsgId(msgId);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'coach',
        coachId: selectedPersonaId,
        timestamp: '剛剛',
        text: `已重設對話紀錄。我是 **${currentPersona.name}**，隨時為你提供客製化運動與體徵解析！`,
      }
    ]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100 flex flex-col h-[720px]">
      {/* Header & Persona Switcher */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border-b border-slate-800 p-4 sm:p-5 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${currentPersona.color} flex items-center justify-center text-xl shadow-lg shrink-0`}>
              {currentPersona.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">{currentPersona.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {currentPersona.title}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="在線中" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentPersona.specialty}</p>
            </div>
          </div>

          {/* Persona Switch Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
            {personas.map(p => {
              const isSelected = selectedPersonaId === p.id;
              return (
                <button
                  key={p.id}
                  id={`persona-btn-${p.id}`}
                  onClick={() => setSelectedPersonaId(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{p.avatarEmoji}</span>
                  <span>{p.name.replace('Coach ', '').replace('Dr. ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Biometrics Telemetry HUD Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto gap-3 text-[11px] text-slate-300 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400">教練掌握之即時數據：</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              <Heart className="w-3 h-3 text-rose-400" />
              <strong className="text-rose-300">{biometrics.heartRate}</strong> BPM
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              <Zap className="w-3 h-3 text-amber-400" />
              <strong className="text-amber-300">{biometrics.bodyBattery}%</strong> 電量
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <strong className="text-emerald-300">{biometrics.hrv}</strong> ms HRV
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              <Clock className="w-3 h-3 text-indigo-400" />
              昨晚睡眠 <strong className="text-indigo-300">{biometrics.sleep.score}</strong> 分
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950/40">
        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isCoach ? '' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 mt-1 shadow-md ${
                  isCoach
                    ? `bg-gradient-to-br ${currentPersona.color} text-white`
                    : 'bg-emerald-500 text-slate-950 font-bold'
                }`}
              >
                {isCoach ? currentPersona.avatarEmoji : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div className={`flex items-center gap-2 ${isCoach ? '' : 'justify-end'}`}>
                  <span className="text-[11px] font-bold text-slate-400">
                    {isCoach ? currentPersona.name : '您'}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>

                  {isCoach && (
                    <button
                      onClick={() => handleSpeakText(msg.id, msg.text)}
                      className="text-slate-400 hover:text-amber-400 transition-colors ml-1 cursor-pointer"
                      title="語音播報此回覆"
                    >
                      {activeSpeechMsgId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isCoach
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                      : 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                  }`}
                >
                  {isCoach ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm space-y-2">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                {/* Suggested Action Chips (if coach provided) */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestedActions.map((act, actIdx) => (
                      <button
                        key={actIdx}
                        onClick={() => handleSend(act.label)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/80 text-[11px] font-semibold text-indigo-300 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isSending && (
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentPersona.color} flex items-center justify-center text-sm shrink-0 shadow-md`}>
              {currentPersona.avatarEmoji}
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>{currentPersona.name} 正在結合最新體徵進行運動生理分析...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] text-slate-400 shrink-0 font-medium">常見諮詢：</span>
        {quickPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Clear Chat Button */}
          <button
            type="button"
            onClick={handleClearChat}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="清空對話"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title={isListening ? '點擊停止語音輸入' : '語音輸入問題'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Text Input */}
          <input
            id="input-coach-chat"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`向 ${currentPersona.name} 諮詢訓練、修復或配速問題...`}
            disabled={isSending}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            id="btn-send-coach-chat"
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">發送</span>
          </button>
        </form>
      </div>
    </div>
  );
};
