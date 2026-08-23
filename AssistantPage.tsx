import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Mic, Volume2, Square, AlertCircle, Sparkles } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateAIResponse, getSuggestedQuestions } from '@/services/aiEngine';
import { generateDemoWeather } from '@/services/weather';
import type { AIResponse } from '@/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  response?: AIResponse;
}

export default function AssistantPage() {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggested = getSuggestedQuestions(language);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput('');
    setLoading(true);
    setVoiceError(null);

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate processing delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const weather = generateDemoWeather(profile?.location || 'Tamil Nadu');
    const response = generateAIResponse(text, {
      profile: profile || {
        id: '', user_id: '', full_name: '', phone: '', preferred_language: language,
        location: '', state: '', farmer_type: 'small', farm_size_acres: 0,
        crop: '', crop_variety: '', crop_stage: '', soil_type: '', irrigation_type: '',
        budget_inr: 0, farming_objective: '', created_at: '', updated_at: '',
      },
      weather,
      language,
    });

    const assistantMsg: ChatMessage = { role: 'assistant', content: response.answer, response };
    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  const handleVoiceInput = () => {
    setVoiceError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError(t('assistant.voiceUnsupported'));
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      handleSend(transcript);
    };
    recognition.onerror = (event: any) => {
      setListening(false);
      if (event.error === 'not-allowed') {
        setVoiceError(t('assistant.micPermissionDenied'));
      } else {
        setVoiceError(t('assistant.voiceUnsupported'));
      }
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const speakResponse = (text: string) => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-180px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('assistant.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('assistant.subtitle')}</p>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">{t('assistant.demoNotice')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {suggested.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-left px-4 py-2.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-3`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.response && (
                <div className="mt-3 pt-3 border-t border-gray-200/30 space-y-2">
                  {msg.response.risk_level && (
                    <p className="text-xs opacity-80">
                      <strong>{t('assistant.riskLevel')}:</strong> {msg.response.risk_level}
                    </p>
                  )}
                  {msg.response.why && (
                    <p className="text-xs opacity-80"><strong>{t('assistant.why')}:</strong> {msg.response.why}</p>
                  )}
                  {msg.response.action && (
                    <p className="text-xs opacity-80"><strong>{t('assistant.recommendedAction')}:</strong> {msg.response.action}</p>
                  )}
                  {msg.response.warning && (
                    <p className="text-xs opacity-80"><strong>{t('assistant.warning')}:</strong> {msg.response.warning}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => speakResponse(msg.content)}
                      className="text-xs flex items-center gap-1 opacity-70 hover:opacity-100"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {speaking ? t('assistant.stopSpeaking') : 'Listen'}
                    </button>
                    {msg.response.is_demo && (
                      <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-700 rounded-full">
                        {t('common.demoMode')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4">
        {voiceError && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-red-50 text-red-700 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{voiceError}</span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
          <button
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
              listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
            aria-label={t('assistant.voiceInput')}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder={listening ? t('assistant.listening') : t('assistant.placeholder')}
            className="flex-1 px-2 py-2 text-sm focus:outline-none bg-transparent"
            disabled={listening}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {listening && (
          <p className="text-xs text-red-500 mt-1 text-center animate-pulse">{t('assistant.listening')}</p>
        )}
      </div>
    </div>
  );
}
