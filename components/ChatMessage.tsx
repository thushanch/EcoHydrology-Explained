import React, { useContext } from 'react';
import { Message } from '../types';
import { SequenceReorder } from './SequenceReorder';

interface ChatMessageProps {
  message: Message;
  onWidgetComplete?: (data: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onWidgetComplete }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) return null;

  const handleSequenceComplete = (score: number, max: number, confidence: string) => {
    if (onWidgetComplete) {
      const percentage = Math.round((score / max) * 100);
      onWidgetComplete(`Interactive Task Result: I scored ${score}/${max} (${percentage}%) with ${confidence} confidence.`);
    }
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[95%] md:max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Avatar / Name */}
        <div className="flex items-center mb-1 text-xs text-slate-400 uppercase tracking-wider font-semibold">
          {isUser ? 'You' : 'EcoHydro Tutor'}
        </div>

        {/* Text Bubble */}
        <div 
          className={`
            p-4 rounded-2xl text-base leading-relaxed shadow-sm
            ${isUser 
              ? 'bg-hydro-600 text-white rounded-tr-none' 
              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }
          `}
        >
          {message.text.split('\n').map((line, i) => (
            <p key={i} className={`min-h-[1.5rem] ${i > 0 ? 'mt-2' : ''}`}>
              {line}
            </p>
          ))}
        </div>

        {/* Generated Image (Only for Model) */}
        {message.imageUrl && !isUser && (
          <div className="mt-4 w-full overflow-hidden rounded-xl border border-slate-200 shadow-lg bg-white">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-eco-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Simulation Visualization</span>
            </div>
            <img 
              src={message.imageUrl} 
              alt="Ecohydrological Simulation" 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Interactive Widget (Only for Model) */}
        {message.widget === 'meander-sequence' && (
          <div className="w-full mt-2 animate-slide-up">
            <SequenceReorder onComplete={handleSequenceComplete} />
          </div>
        )}

      </div>
    </div>
  );
};