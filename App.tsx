
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from '@google/genai';
import { Message, VocabularyItem, Correction, Topic, ViewType, LevelResult, DifficultyLevel } from './types';
import { TOPICS } from './data/topics';
import { ChatBubble } from './components/ChatBubble';
import { VocabularyPanel } from './components/VocabularyPanel';
import { analyzeMessage, suggestVocabulary } from './services/geminiService';
import { decode, encode, decodeAudioData, floatTo16BitPCM } from './utils/audio';

const DIFFICULTY_ORDER: Record<DifficultyLevel, number> = {
  'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5
};

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  'A1': 'bg-green-500 text-white',
  'A2': 'bg-emerald-500 text-white',
  'B1': 'bg-blue-500 text-white',
  'B2': 'bg-indigo-500 text-white',
  'C1': 'bg-purple-500 text-white'
};

const DIFFICULTY_BG: Record<DifficultyLevel, string> = {
  'A1': 'bg-green-50',
  'A2': 'bg-emerald-50',
  'B1': 'bg-blue-50',
  'B2': 'bg-indigo-50',
  'C1': 'bg-purple-50'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('FREE_CHAT');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: "Hello! I am Elfas. Let's practice English. Where shall we start?", timestamp: Date.now() }
  ]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [levelHistory, setLevelHistory] = useState<LevelResult[]>([]);
  
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [activeCorrection, setActiveCorrection] = useState<Correction | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Topic Filtering & Search
  const [filterLevel, setFilterLevel] = useState<DifficultyLevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = useMemo(() => {
    let list = TOPICS;
    
    if (filterLevel !== 'ALL') {
      list = list.filter(t => t.difficulty === filterLevel);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      const diffComp = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      return diffComp !== 0 ? diffComp : a.title.localeCompare(b.title);
    });
  }, [filterLevel, searchQuery]);

  // Refs for audio
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);

  const [lastUserTranscription, setLastUserTranscription] = useState('');
  const [lastAiTranscription, setLastAiTranscription] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('elfas_level_history');
    if (savedHistory) setLevelHistory(JSON.parse(savedHistory));
    
    const savedVocab = localStorage.getItem('elfas_vocabulary');
    if (savedVocab) setVocabulary(JSON.parse(savedVocab));

    if (window.innerWidth >= 1024) setIsSidebarOpen(true);

    // PWA Install Prompt Handler
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    localStorage.setItem('elfas_level_history', JSON.stringify(levelHistory));
  }, [levelHistory]);

  useEffect(() => {
    localStorage.setItem('elfas_vocabulary', JSON.stringify(vocabulary));
  }, [vocabulary]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, lastAiTranscription, lastUserTranscription]);

  const stopAllAudio = useCallback(() => {
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const addMessage = useCallback((role: 'user' | 'assistant', text: string) => {
    const newMessage: Message = { id: Math.random().toString(36).substr(2, 9), role, text, timestamp: Date.now() };
    setMessages(prev => [...prev, newMessage]);
    if (role === 'user' && currentView !== 'LEVEL_TEST') analyzeUserMistake(text);
  }, [currentView]);

  const analyzeUserMistake = async (text: string) => {
    const result = await analyzeMessage(text);
    if (result && result.corrected !== result.original) {
      setActiveCorrection(result);
    } else {
      setActiveCorrection(null);
    }
    await suggestVocabulary(text);
  };

  const playTts = async (text: string) => {
    if (!isTtsEnabled) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!outputAudioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
        }
        const ctx = outputAudioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => sourcesRef.current.delete(source);
        sourcesRef.current.add(source);
        source.start();
      }
    } catch (err) { console.error("TTS Error:", err); }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    
    stopAllAudio();
    const text = inputText;
    setInputText('');
    addMessage('user', text);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let systemInstruction = "You are Elfas, a magical English tutor.";
      if (currentView === 'TOPICS' && currentTopic) {
        systemInstruction = currentTopic.systemPrompt;
      } else if (currentView === 'LEVEL_TEST') {
        systemInstruction = "You are the Grand Mage Elfas. Conduct a language level test. Ask the user 5 varied questions to assess grammar, vocabulary, and expression. After 5 responses, provide a CEFR level in JSON format.";
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => `${m.role === 'user' ? 'User' : 'Elfas'}: ${m.text}`), `User: ${text}`].join('\n'),
        config: { systemInstruction }
      });
      
      const aiResponse = response.text || '...';
      
      if (currentView === 'LEVEL_TEST' && messages.length >= 10) {
         const analysis = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze the following conversation and determine the user's English level (A1-C2). Return JSON: { "level": "string", "score": number 0-100, "feedback": "string", "skills": { "grammar": 0-10, "vocabulary": 0-10, "fluency": 0-10 } }. Conversation: ${messages.map(m => m.text).join(' ')}`,
            config: { responseMimeType: "application/json" }
         });
         const result = JSON.parse(analysis.text || '{}') as LevelResult;
         result.timestamp = Date.now();
         setLevelHistory(prev => [result, ...prev]);
         addMessage('assistant', `Magic! Your English level is **${result.level}**. ${result.feedback}`);
      } else {
         addMessage('assistant', aiResponse);
         if (isTtsEnabled) playTts(aiResponse);
      }
    } catch (err) { addMessage('assistant', 'Magic error!'); } finally { setIsLoading(false); }
  };

  const startVoiceSession = async () => {
    try {
      if (isVoiceActive) { stopVoiceSession(); return; }
      stopAllAudio();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      const inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsVoiceActive(true);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = floatTo16BitPCM(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: encode(pcmData), mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const src = ctx.createBufferSource();
              src.buffer = buffer;
              src.connect(ctx.destination);
              src.onended = () => sourcesRef.current.delete(src);
              sourcesRef.current.add(src);
              src.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
            if (message.serverContent?.inputTranscription) setLastUserTranscription(prev => prev + message.serverContent?.inputTranscription?.text);
            if (message.serverContent?.outputTranscription) setLastAiTranscription(prev => prev + message.serverContent?.outputTranscription?.text);
            if (message.serverContent?.turnComplete) {
              setLastUserTranscription(t => { if (t) addMessage('user', t); return ''; });
              setLastAiTranscription(t => { if (t) addMessage('assistant', t); return ''; });
            }
            if (message.serverContent?.interrupted) { stopAllAudio(); }
          },
          onclose: () => setIsVoiceActive(false),
          onerror: (e) => { console.error('Session error', e); setIsVoiceActive(false); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: currentView === 'TOPICS' && currentTopic ? currentTopic.systemPrompt : "You are Elfas, a magical English tutor."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { alert("Microphone error."); }
  };

  const stopVoiceSession = () => {
    if (sessionRef.current) { sessionRef.current.close(); sessionRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); }
    setIsVoiceActive(false);
    stopAllAudio();
  };

  const navigateTo = (view: ViewType) => {
    stopAllAudio();
    setCurrentView(view);
    setCurrentTopic(null);
    setIsNavOpen(false);
    if (view === 'FREE_CHAT') {
      setMessages([{ id: '1', role: 'assistant', text: "Ready for more practice! What's on your mind?", timestamp: Date.now() }]);
    } else if (view === 'LEVEL_TEST') {
      setMessages([{ id: '1', role: 'assistant', text: "Greetings! I am the Grand Mage. Let's find out your English power level. Answer my questions naturally. Ready? Question 1: Tell me about your typical morning routine.", timestamp: Date.now() }]);
    } else if (view === 'TOPICS') {
      setMessages([]);
      setSearchQuery('');
      setFilterLevel('ALL');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    if (value.length > 0) stopAllAudio();
  };

  const currentLevel = levelHistory[0]?.level || 'Unranked';

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative font-sans">
      
      {/* Sidebar Navigation */}
      <div className={`fixed inset-0 z-[60] lg:relative lg:inset-auto lg:z-auto lg:w-64 flex-shrink-0 transition-opacity duration-300 ${isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}>
         <div className="absolute inset-0 bg-slate-900/40 lg:hidden" onClick={() => setIsNavOpen(false)}></div>
         <aside className={`absolute lg:relative left-0 top-0 h-full w-64 bg-emerald-900 text-white shadow-2xl lg:shadow-none transition-transform duration-300 ${isNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-hat-wizard text-emerald-700 text-xl"></i>
                </div>
                <div>
                  <h1 className="font-bold leading-none text-xl">Elfas</h1>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Magic English</span>
                </div>
              </div>

              <nav className="space-y-2 flex-1">
                <button onClick={() => navigateTo('FREE_CHAT')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentView === 'FREE_CHAT' ? 'bg-white/10 text-white' : 'text-emerald-300 hover:bg-white/5'}`}>
                  <i className="fa-solid fa-comments w-5"></i> Free Chat
                </button>
                <button onClick={() => navigateTo('TOPICS')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentView === 'TOPICS' ? 'bg-white/10 text-white' : 'text-emerald-300 hover:bg-white/5'}`}>
                  <i className="fa-solid fa-map-location-dot w-5"></i> Topics
                </button>
                <button onClick={() => navigateTo('LEVEL_TEST')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentView === 'LEVEL_TEST' ? 'bg-white/10 text-white' : 'text-emerald-300 hover:bg-white/5'}`}>
                  <i className="fa-solid fa-graduation-cap w-5"></i> Level Test
                </button>

                {installPrompt && (
                  <button onClick={handleInstallClick} className="w-full flex items-center gap-3 p-3 mt-4 rounded-xl bg-yellow-400 text-emerald-900 font-bold hover:bg-yellow-300 transition-all">
                    <i className="fa-solid fa-download w-5"></i> Install App
                  </button>
                )}
              </nav>

              <div className="mt-10 pt-10 border-t border-white/10">
                <div className="text-[10px] text-emerald-400 uppercase font-bold mb-4">Magic Progress</div>
                <div className="bg-emerald-800/50 p-4 rounded-2xl border border-white/5">
                   <div className="text-xs text-emerald-300">Current Level</div>
                   <div className="text-3xl font-black text-white">{currentLevel}</div>
                   {levelHistory.length > 0 && (
                     <div className="mt-2 text-[10px] text-emerald-400 truncate">
                       History: {levelHistory.slice(0, 3).map(h => h.level).join(', ')}
                     </div>
                   )}
                </div>
              </div>
            </div>
         </aside>
      </div>

      <div className="flex flex-col flex-1 h-full relative z-0 min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <button onClick={() => setIsNavOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-emerald-600 transition-colors">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">
                 {currentView === 'TOPICS' && currentTopic && (
                   <>
                     <button onClick={() => { setCurrentTopic(null); setMessages([]); }} className="hover:text-emerald-600 transition-colors">Topics</button>
                     <i className="fa-solid fa-chevron-right mx-1.5 text-[8px] opacity-50"></i>
                   </>
                 )}
                 <span className="truncate">{currentView === 'FREE_CHAT' ? 'Practice' : currentView === 'TOPICS' ? 'Topics' : 'Evaluation'}</span>
              </div>
              <h2 className="font-bold text-slate-800 text-sm md:text-base truncate leading-none">
                {currentView === 'FREE_CHAT' ? 'Free Chat' : currentView === 'TOPICS' ? (currentTopic?.title || 'Explore Topics') : 'Level Test'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setIsTtsEnabled(!isTtsEnabled)} className={`p-2 w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${isTtsEnabled ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}>
              <i className={`fa-solid ${isTtsEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${isSidebarOpen ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-100 text-slate-400'}`}>
              <i className="fa-solid fa-book-open"></i>
            </button>
          </div>
        </header>

        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-slate-50 scroll-smooth">
          {currentView === 'TOPICS' && !currentTopic ? (
             <div className="max-w-6xl mx-auto space-y-6 py-4">
                {/* Search & Filter Panel */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-10">
                   <div className="flex flex-wrap items-center gap-2 flex-1">
                     <button onClick={() => setFilterLevel('ALL')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterLevel === 'ALL' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>All</button>
                     {(['A1', 'A2', 'B1', 'B2', 'C1'] as DifficultyLevel[]).map(lvl => (
                       <button key={lvl} onClick={() => setFilterLevel(lvl)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterLevel === lvl ? DIFFICULTY_COLORS[lvl] : 'text-slate-500 hover:bg-slate-50'}`}>
                          {lvl}
                       </button>
                     ))}
                   </div>
                   <div className="relative md:w-64">
                     <input 
                       type="text" 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder="Search topics..."
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                     />
                     <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {filteredTopics.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => { setCurrentTopic(t); setMessages([{ id: Date.now().toString(), role: 'assistant', text: t.initialMessage, timestamp: Date.now() }]); if (isTtsEnabled) playTts(t.initialMessage); }} 
                      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left flex flex-col gap-3 group relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-black tracking-widest ${DIFFICULTY_COLORS[t.difficulty]}`}>
                        {t.difficulty}
                      </div>
                      <div className={`w-12 h-12 ${DIFFICULTY_BG[t.difficulty]} text-emerald-600 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`fa-solid ${t.icon}`}></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight mb-1 truncate">{t.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
                
                {filteredTopics.length === 0 && (
                  <div className="text-center py-20 text-slate-400">
                    <i className="fa-solid fa-wand-sparkles text-5xl mb-4 opacity-10"></i>
                    <p className="font-medium">No topics match your search.</p>
                    <button onClick={() => { setSearchQuery(''); setFilterLevel('ALL'); }} className="mt-4 text-emerald-600 font-bold text-sm underline">Reset filters</button>
                  </div>
                )}
             </div>
          ) : (
            <>
              {messages.map((m) => <ChatBubble key={m.id} message={m} />)}
              {(lastUserTranscription || lastAiTranscription) && (
                 <div className="space-y-2 opacity-60 italic text-sm text-slate-500 animate-pulse">
                   {lastUserTranscription && <div className="text-right">You: {lastUserTranscription}</div>}
                   {lastAiTranscription && <div className="text-left">Elfas: {lastAiTranscription}</div>}
                 </div>
              )}
            </>
          )}
          {isLoading && (
            <div className="flex justify-start p-4 bg-white rounded-2xl border border-slate-100 w-16 h-10 shadow-sm flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {activeCorrection && currentView !== 'LEVEL_TEST' && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-20">
            <div className="bg-white rounded-[2rem] border-2 border-emerald-100 shadow-2xl p-6 animate-in zoom-in duration-300">
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
                   <i className="fa-solid fa-wand-magic-sparkles animate-pulse"></i> Spell Correction
                 </div>
                 <button onClick={() => setActiveCorrection(null)} className="text-slate-300 hover:text-slate-500"><i className="fa-solid fa-xmark"></i></button>
               </div>
               <div className="space-y-3">
                 <div className="text-red-400/60 line-through text-sm italic">{activeCorrection.original}</div>
                 <div className="text-emerald-700 font-black text-lg bg-emerald-50 p-3 rounded-2xl border border-emerald-100">{activeCorrection.corrected}</div>
                 <div className="text-xs text-slate-500 leading-relaxed italic bg-slate-50 p-3 rounded-2xl">
                    <span className="font-bold text-slate-400 mr-2">NATIVE:</span> {activeCorrection.nativeAlternative}
                 </div>
                 <p className="text-xs text-slate-600 px-1">{activeCorrection.explanation}</p>
                 <button onClick={() => { setVocabulary(v => [...v, { id: Date.now().toString(), word: activeCorrection.corrected, translation: 'Note', example: activeCorrection.explanation, dateAdded: Date.now() }]); setActiveCorrection(null); }} className="w-full bg-emerald-600 text-white text-xs font-black py-3 rounded-2xl mt-2 shadow-lg hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest">Add to Spellbook</button>
               </div>
            </div>
          </div>
        )}

        {!(currentView === 'TOPICS' && !currentTopic) && (
          <div className="p-4 bg-white border-t border-slate-200 z-10 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
              <button type="button" onClick={startVoiceSession} className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-md ${isVoiceActive ? 'bg-red-500 text-white pulse' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                <i className={`fa-solid ${isVoiceActive ? 'fa-square' : 'fa-microphone'} text-xl`}></i>
              </button>
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={inputText} 
                  onChange={handleInputChange} 
                  placeholder="Type your message..." 
                  disabled={isVoiceActive} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50" 
                />
                <button type="submit" disabled={!inputText.trim() || isVoiceActive} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-2xl text-white disabled:bg-slate-300 shadow-sm hover:bg-emerald-700 transition-colors">
                  <i className="fa-solid fa-paper-plane text-xs md:text-sm"></i>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Vocabulary Sidebar */}
      <div className={`fixed inset-0 z-[70] lg:relative lg:inset-auto lg:z-auto lg:w-80 flex-shrink-0 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}>
        <div className="absolute inset-0 bg-slate-900/40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <aside className={`absolute lg:relative right-0 top-0 h-full w-80 bg-white shadow-2xl lg:shadow-none transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}`}>
          <VocabularyPanel items={vocabulary} onRemove={(id) => setVocabulary(prev => prev.filter(v => v.id !== id))} />
        </aside>
      </div>
    </div>
  );
};

export default App;
