import React, { useState } from 'react';
import { GlossaryItem } from '../types';
import { GLOSSARY_TERMS } from '../constants';

interface StudyGuideProps {
  onBack: () => void;
}

type Tab = 'glossary' | 'flashcards';

export const StudyGuide: React.FC<StudyGuideProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('glossary');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Group terms for glossary view
  const categories = Array.from(new Set(GLOSSARY_TERMS.map(item => item.category)));

  // Flashcard logic
  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % GLOSSARY_TERMS.length);
    }, 200);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + GLOSSARY_TERMS.length) % GLOSSARY_TERMS.length);
    }, 200);
  };

  const currentCard = GLOSSARY_TERMS[currentCardIndex];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-800 leading-tight">Study Center</h1>
            <span className="text-xs text-eco-600 font-medium tracking-wide">Comprehensive Guide</span>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'glossary' ? 'bg-white text-eco-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Glossary
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'flashcards' ? 'bg-white text-eco-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Flashcards
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          {activeTab === 'glossary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category) => (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-eco-800 mb-4 pb-2 border-b border-eco-100 flex items-center gap-2">
                    {category}
                  </h2>
                  <div className="space-y-4">
                    {GLOSSARY_TERMS.filter(t => t.category === category).map((item) => (
                      <div key={item.term} className="group">
                        <dt className="font-semibold text-slate-800 text-base group-hover:text-eco-600 transition-colors">{item.term}</dt>
                        <dd className="text-slate-600 text-sm leading-relaxed mt-1">{item.definition}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              
              {/* Card */}
              <div 
                className="perspective-1000 w-full max-w-xl h-80 cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  
                  {/* Front */}
                  <div 
                    className="absolute w-full h-full backface-hidden bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-xs font-bold text-eco-500 uppercase tracking-widest mb-4">{currentCard.category}</span>
                    <h3 className="text-4xl font-extrabold text-slate-800">{currentCard.term}</h3>
                    <p className="mt-8 text-slate-400 text-sm font-medium animate-pulse">Click to flip</p>
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute w-full h-full backface-hidden bg-eco-600 rounded-3xl text-white flex flex-col items-center justify-center p-10 text-center rotate-y-180"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <h3 className="text-2xl font-bold mb-4">{currentCard.term}</h3>
                    <p className="text-lg leading-relaxed font-medium">{currentCard.definition}</p>
                  </div>

                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6 mt-12">
                <button 
                  onClick={handlePrevCard}
                  className="p-4 bg-white rounded-full shadow-md text-slate-600 hover:text-eco-600 hover:shadow-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <span className="text-slate-400 font-mono text-sm">
                  {currentCardIndex + 1} / {GLOSSARY_TERMS.length}
                </span>
                <button 
                  onClick={handleNextCard}
                  className="p-4 bg-white rounded-full shadow-md text-slate-600 hover:text-eco-600 hover:shadow-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};