import React, { useState, useEffect } from 'react';
import { SequenceStep } from '../types';
import { MEANDER_SEQUENCE_STEPS } from '../constants';

interface SequenceReorderProps {
  onComplete: (score: number, maxScore: number, confidence: string) => void;
}

export const SequenceReorder: React.FC<SequenceReorderProps> = ({ onComplete }) => {
  const [items, setItems] = useState<SequenceStep[]>([]);
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState<{ correct: number; total: number; bonus: number } | null>(null);

  // Dragging state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    // Shuffle items on mount
    const shuffled = [...MEANDER_SEQUENCE_STEPS].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const handleSubmit = () => {
    // Calculate correctness
    let correctCount = 0;
    items.forEach((item, index) => {
      // The original array in constants is the correct order
      if (item.id === MEANDER_SEQUENCE_STEPS[index].id) {
        correctCount++;
      }
    });

    const total = items.length;
    let multiplier = 1;
    let bonus = 0;

    // Confidence Logic
    if (confidence === 'high') {
      multiplier = 1.5;
      if (correctCount === total) bonus = 50; // High stakes bonus
    } else if (confidence === 'medium') {
      multiplier = 1.2;
      if (correctCount === total) bonus = 20;
    } else {
      multiplier = 1; // Safe play
    }

    const finalScore = Math.round((correctCount * 100 * multiplier) + bonus);
    setScoreData({ correct: correctCount, total, bonus: finalScore });
    setIsSubmitted(true);

    // Send data back to app
    onComplete(correctCount, total, confidence);
  };

  if (isSubmitted && scoreData) {
    return (
      <div className="bg-white rounded-xl border-2 border-eco-500 p-6 my-4 shadow-lg text-center animate-fade-in">
        <div className="inline-block p-4 bg-eco-100 rounded-full mb-4">
          <span className="text-4xl">🏆</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Sequence Complete!</h3>
        <div className="flex justify-center gap-8 mb-4 text-sm">
          <div className="flex flex-col">
             <span className="text-slate-500">Accuracy</span>
             <span className="font-bold text-slate-800">{scoreData.correct} / {scoreData.total}</span>
          </div>
           <div className="flex flex-col">
             <span className="text-slate-500">Confidence</span>
             <span className="font-bold text-eco-600 uppercase">{confidence}</span>
          </div>
        </div>
        
        <p className="text-lg text-slate-600 mb-6">
          {scoreData.correct === scoreData.total 
            ? "Perfect sequence! You've mastered river evolution mechanics." 
            : "Good effort! Review the steps below to correct your understanding."}
        </p>

        <div className="space-y-2 text-left bg-slate-50 p-4 rounded-lg">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Correct Order:</h4>
          {MEANDER_SEQUENCE_STEPS.map((step, idx) => (
             <div key={step.id} className="flex items-center gap-2 text-sm text-slate-700">
               <span className="font-mono text-eco-500 font-bold">{idx + 1}.</span>
               <span>{step.visual} {step.label}</span>
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md my-4 overflow-hidden">
      <div className="bg-eco-50 px-6 py-4 border-b border-eco-100">
        <h3 className="font-bold text-eco-800 flex items-center gap-2">
          <span>🔄</span> Reorder the Sequence
        </h3>
        <p className="text-sm text-eco-700 mt-1">
          Drag the stages of river evolution into the correct chronological order.
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-2 mb-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable={!isSubmitted}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative flex items-center gap-4 p-3 rounded-lg border-2 cursor-move transition-all
                ${draggedItemIndex === index ? 'opacity-50 border-dashed border-eco-400 bg-eco-50' : 'bg-white border-slate-100 hover:border-eco-200 hover:shadow-sm'}
              `}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 font-mono text-sm font-bold select-none">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xl" role="img" aria-label="icon">{item.visual}</span>
                  <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
                </div>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <div className="text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Confidence Wager</label>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setConfidence(level)}
                className={`
                  py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all capitalize
                  ${confidence === level 
                    ? 'border-eco-500 bg-eco-50 text-eco-700' 
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'}
                `}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            Submit Sequence
          </button>
        </div>
      </div>
    </div>
  );
};