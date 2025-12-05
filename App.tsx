import React, { useState, useEffect, useRef } from 'react';
import { Module, AppState, Message } from './types';
import { MODULES } from './constants';
import { ModuleCard } from './components/ModuleCard';
import { ChatMessage } from './components/ChatMessage';
import { StudyGuide } from './components/StudyGuide';
import { sendMessageToGemini, generateEcoImage, startChatSession } from './services/geminiService';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SELECTION);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, isGeneratingImage]);

  useEffect(() => {
    startChatSession();
  }, []);

  const handleModuleSelect = async (module: Module) => {
    setAppState(AppState.SESSION);
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        text: `Starting module: ${module.title}...`,
        isThinking: true
      }
    ]);

    await processAIResponse(module.initialPrompt);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    await processAIResponse(inputText);
  };

  // Called when a widget (like Sequence Reorder) completes
  const handleWidgetResult = async (resultText: string) => {
     // We treat the widget result as a silent user message or a system info message 
     // that we immediately send to AI so it can react.
     
     // Optionally show it in UI? Let's just send it to AI and let AI reply.
     // We can add a small "system" message to UI or just let the AI reply to "hidden" context.
     // For clarity, we'll append a user message representing the result.
     
     const resultMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: resultText
     };
     setMessages(prev => [...prev, resultMsg]);
     setIsThinking(true);
     await processAIResponse(resultText);
  };

  const processAIResponse = async (input: string) => {
    setIsThinking(true);
    
    try {
      // 1. Get Text Response
      const rawText = await sendMessageToGemini(input);
      
      // 2. Parse tags
      const drawTagRegex = /<DRAW>(.*?)<\/DRAW>/s;
      const widgetTagRegex = /<WIDGET:([A-Z_]+)>/;

      const drawMatch = rawText.match(drawTagRegex);
      const widgetMatch = rawText.match(widgetTagRegex);
      
      let cleanText = rawText
        .replace(drawTagRegex, '')
        .replace(widgetTagRegex, '')
        .trim();
      
      // Determine widget type
      let widgetType: 'meander-sequence' | undefined = undefined;
      if (widgetMatch && widgetMatch[1] === 'MEANDER_SEQUENCE') {
        widgetType = 'meander-sequence';
      }

      // Update UI with text first
      setMessages(prev => {
        // Remove temp loading messages
        const filtered = prev.filter(m => !m.isThinking);
        return [...filtered, {
          id: Date.now().toString(),
          role: 'model',
          text: cleanText,
          imageUrl: undefined,
          widget: widgetType
        }];
      });

      setIsThinking(false);

      // 3. Generate Image if needed
      if (drawMatch && drawMatch[1]) {
        setIsGeneratingImage(true);
        const imagePrompt = drawMatch[1].trim();
        const base64Image = await generateEcoImage(imagePrompt);
        
        if (base64Image) {
          setMessages(prev => {
            const newHistory = [...prev];
            const lastMsg = newHistory[newHistory.length - 1];
            if (lastMsg.role === 'model') {
              lastMsg.imageUrl = base64Image;
            }
            return newHistory;
          });
        }
        setIsGeneratingImage(false);
      }

    } catch (error) {
      console.error(error);
      setIsThinking(false);
      setIsGeneratingImage(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered a connection error. Please try again."
      }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // -- RENDER HELPERS --

  const renderSelectionScreen = () => (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-eco-100 rounded-2xl mb-6">
          <span className="text-4xl">🌊</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          EcoHydro <span className="text-eco-600">Visualizer</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Master ecohydrological systems through interactive simulations. 
          Select a knowledge module to begin your visual study session.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {MODULES.map(module => (
          <ModuleCard key={module.id} module={module} onClick={handleModuleSelect} />
        ))}
      </div>
      
      <div className="flex justify-center mb-12">
        <button 
          onClick={() => setAppState(AppState.GUIDE)}
          className="group flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-eco-300 transition-all"
        >
          <span className="p-2 bg-slate-100 rounded-lg group-hover:bg-eco-100 transition-colors">📚</span>
          <div className="text-left">
            <h3 className="font-bold text-slate-800">Comprehensive Guide & Flashcards</h3>
            <p className="text-xs text-slate-500">Review terms and test your knowledge</p>
          </div>
          <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-slate-400">Powered by Gemini 2.5 Flash & Flash-Image</p>
      </div>
    </div>
  );

  const renderSessionScreen = () => (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAppState(AppState.SELECTION)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            title="Back to Modules"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-800 leading-tight">EcoHydro Visualizer</h1>
            <span className="text-xs text-eco-600 font-medium tracking-wide">Live Session</span>
          </div>
        </div>
        <div className="hidden md:block text-xs text-slate-400 font-mono">
          Interactive Tutor Mode
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onWidgetComplete={handleWidgetResult} />
          ))}
          
          {/* Typing Indicators */}
          {(isThinking || isGeneratingImage) && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                 <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-eco-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-eco-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-eco-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
                 <span className="text-xs font-medium text-slate-500">
                   {isGeneratingImage ? 'Rendering Simulation...' : 'Analyzing Physics...'}
                 </span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer or question here..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent resize-none shadow-sm h-[60px] max-h-[120px]"
            disabled={isThinking || isGeneratingImage}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isThinking || isGeneratingImage}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-eco-600 hover:bg-eco-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-2 text-center">
             <p className="text-[10px] text-slate-400">
               Predict the outcome to advance the simulation.
             </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {appState === AppState.SELECTION && renderSelectionScreen()}
      {appState === AppState.SESSION && renderSessionScreen()}
      {appState === AppState.GUIDE && <StudyGuide onBack={() => setAppState(AppState.SELECTION)} />}
    </>
  );
}