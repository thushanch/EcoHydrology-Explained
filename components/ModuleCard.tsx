import React from 'react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  onClick: (module: Module) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  return (
    <button
      onClick={() => onClick(module)}
      className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-eco-500 transition-all duration-300 w-full text-left group"
    >
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-4xl filter group-hover:scale-110 transition-transform duration-300">{module.icon}</span>
        <div className="h-8 w-8 rounded-full bg-eco-50 flex items-center justify-center text-eco-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-eco-700">{module.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{module.description}</p>
    </button>
  );
};