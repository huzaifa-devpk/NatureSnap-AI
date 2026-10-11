import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Eye,
  Camera,
} from 'lucide-react';
import type { JournalEntry } from '../types/nature';

interface JournalViewProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onExportJson: () => void;
  onExportMarkdown: () => void;
  onOpenCapture: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onExportJson,
  onExportMarkdown,
  onOpenCapture,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'completed' | 'pending'>('All');

  const filteredEntries = entries.filter((e) => {
    const iden = e.analysis.identification;
    const matchesSearch =
      iden.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iden.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.userNotes && e.userNotes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || iden.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'completed' && e.missionStatus === 'completed') ||
      (statusFilter === 'pending' && e.missionStatus !== 'completed');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Nature Field Journal
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {entries.length} {entries.length === 1 ? 'Discovery' : 'Discoveries'}
            </span>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Your personal digital field log of everything identified and explored outdoors.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportMarkdown}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl shadow-2xs transition-colors"
            title="Download Field Notes in Markdown"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Markdown</span>
          </button>
          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl shadow-2xs transition-colors"
            title="Export JSON Backup"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="nature-card rounded-2xl p-4 border border-stone-200/80 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by common name, scientific name, notes..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Plant">Plants</option>
            <option value="Leaf">Leaves</option>
            <option value="Flower">Flowers</option>
            <option value="Tree">Trees</option>
            <option value="Bird">Birds</option>
            <option value="Insect">Insects</option>
            <option value="Rock">Rocks</option>
            <option value="Mushroom">Mushrooms</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | 'completed' | 'pending')}
            className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="completed">✓ Mission Done</option>
            <option value="pending">⏳ Mission Pending</option>
          </select>
        </div>
      </div>

      {/* Grid of Journal Cards (Section 12) */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700">No field discoveries found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchTerm || categoryFilter !== 'All'
              ? 'Try adjusting your search query or filters.'
              : 'Head outside, snap your first natural specimen, and begin your field journal!'}
          </p>
          <button
            onClick={onOpenCapture}
            className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs"
          >
            <Camera className="w-4 h-4" />
            <span>Make First Discovery</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEntries.map((entry) => {
            const iden = entry.analysis.identification;
            const isCompleted = entry.missionStatus === 'completed';
            const dateStr = new Date(entry.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={entry.id}
                className="nature-card rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-md transition-all group flex flex-col"
              >
                {/* Photo Header */}
                <div
                  onClick={() => onSelectEntry(entry)}
                  className="relative aspect-16/10 bg-stone-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={entry.imageUrl}
                    alt={iden.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      {iden.category}
                    </span>
                    {entry.isDemo && (
                      <span className="bg-amber-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        Demo
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-bold backdrop-blur-md flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-900/70 text-stone-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{isCompleted ? 'Mission Done ✓' : 'Pending'}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                      {entry.approximateLocation && (
                        <span className="truncate max-w-[120px]">{entry.approximateLocation}</span>
                      )}
                    </div>

                    <h3
                      onClick={() => onSelectEntry(entry)}
                      className="font-extrabold text-stone-900 text-base hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {iden.name}
                    </h3>
                    <p className="text-xs italic text-stone-500 -mt-0.5">
                      {iden.scientific_name}
                    </p>

                    <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                      {entry.analysis.description}
                    </p>

                    {/* Mission Badge & User Note */}
                    <div className="mt-3 p-2 bg-stone-50 rounded-xl border border-stone-200/60 text-[11px] text-stone-700">
                      <span className="font-bold text-emerald-800">Mission:</span>{' '}
                      {entry.analysis.mission.title}
                    </div>

                    {entry.userNotes && (
                      <p className="text-[11px] italic text-stone-500 mt-2 line-clamp-1">
                        “{entry.userNotes}”
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectEntry(entry)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Clues & Mission</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${iden.name}" from your field journal?`)) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Entry"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
