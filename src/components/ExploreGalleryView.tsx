import React, { useState } from 'react';
import { Compass, Camera, ArrowUpRight } from 'lucide-react';
import type { JournalEntry } from '../types/nature';

interface ExploreGalleryViewProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onOpenCapture: () => void;
  onStartDemo: (demoId: 'neem' | 'wildflower' | 'treeBark') => void;
}

export const ExploreGalleryView: React.FC<ExploreGalleryViewProps> = ({
  entries,
  onSelectEntry,
  onOpenCapture,
  onStartDemo,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories: Array<{ id: string; label: string; icon: string }> = [
    { id: 'All', label: 'All', icon: '🌿' },
    { id: 'Plant', label: 'Plants', icon: '🌱' },
    { id: 'Leaf', label: 'Leaves', icon: '🍃' },
    { id: 'Flower', label: 'Flowers', icon: '🌸' },
    { id: 'Tree', label: 'Trees', icon: '🪵' },
    { id: 'Bird', label: 'Birds', icon: '🦅' },
    { id: 'Insect', label: 'Insects', icon: '🐞' },
    { id: 'Rock', label: 'Rocks', icon: '🪨' },
    { id: 'Mushroom', label: 'Mushrooms', icon: '🍄' },
    { id: 'Other', label: 'Other', icon: '✨' },
  ];

  const filtered = entries.filter((e) => {
    if (activeCategory === 'All') return true;
    return e.analysis.identification.category === activeCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Explore Nature Discoveries
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filtered.length} Items
            </span>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Browse cataloged species, observation clues, and micro-expeditions.
          </p>
        </div>

        <button
          onClick={onOpenCapture}
          className="self-start sm:self-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>Snap New Finding</span>
        </button>
      </div>

      {/* Category Filter Pills (Section 15) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-xs scale-102'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of Discoveries */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
          <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700">No {activeCategory} discoveries cataloged yet</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try a demo discovery or grab your phone to photograph something outside in this category!
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={() => onStartDemo('neem')}
              className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-medium"
            >
              🌿 Neem Leaf Demo
            </button>
            <button
              onClick={() => onStartDemo('wildflower')}
              className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-medium"
            >
              🌸 Wildflower Demo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((entry) => {
            const iden = entry.analysis.identification;
            const m = entry.analysis.mission;

            return (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="nature-card rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 bg-stone-900 overflow-hidden">
                    <img
                      src={entry.imageUrl}
                      alt={iden.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {iden.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-emerald-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-emerald-700 transition-colors">
                      {iden.name}
                    </h3>
                    <p className="text-xs italic text-stone-500 font-medium -mt-0.5">
                      {iden.scientific_name}
                    </p>

                    <p className="text-xs text-stone-600 line-clamp-2 mt-2.5 leading-relaxed">
                      {entry.analysis.description}
                    </p>

                    {/* Mission Hook */}
                    <div className="mt-4 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100/70 text-xs">
                      <div className="flex items-center justify-between text-emerald-900 font-bold mb-1">
                        <span>Mission: {m.title}</span>
                        <span className="text-[10px] text-emerald-700">{m.estimated_minutes}m</span>
                      </div>
                      <p className="text-stone-600 line-clamp-2 text-[11px]">
                        “{m.description}”
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 pt-1 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100">
                  <span>Confidence: {iden.confidence}</span>
                  <span className="text-emerald-700 font-bold group-hover:underline">View Specimen →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
