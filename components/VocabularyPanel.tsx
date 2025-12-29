
import React from 'react';
import { VocabularyItem } from '../types';

interface VocabularyPanelProps {
  items: VocabularyItem[];
  onRemove: (id: string) => void;
}

export const VocabularyPanel: React.FC<VocabularyPanelProps> = ({ items, onRemove }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden border-l border-slate-200 bg-white shadow-sm w-full">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-book-sparkles text-emerald-500"></i>
          Spellbook
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {items.length === 0 ? 'Your spellbook is empty' : `Magic words: ${items.length}`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 group relative">
            <button 
              onClick={() => onRemove(item.id)}
              className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="font-bold text-emerald-700 text-lg">{item.word}</div>
            <div className="text-slate-600 text-sm mb-1">{item.translation}</div>
            <div className="text-xs italic text-slate-400">"{item.example}"</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <i className="fa-solid fa-wand-sparkles text-4xl mb-3 block opacity-20"></i>
            <p className="text-sm px-4">Talk to Elfas to discover new magic phrases!</p>
          </div>
        )}
      </div>
    </div>
  );
};
