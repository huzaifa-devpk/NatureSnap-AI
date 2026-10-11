import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DashboardStats } from './components/DashboardStats';
import { NatureCaptureModal } from './components/NatureCaptureModal';
import { AnalysisLoading } from './components/AnalysisLoading';
import { DiscoveryResultView } from './components/DiscoveryResultView';
import { LeaveTheScreenView } from './components/LeaveTheScreenView';
import { MissionCompleteModal } from './components/MissionCompleteModal';
import { JournalView } from './components/JournalView';
import { MissionsView } from './components/MissionsView';
import { AchievementsView } from './components/AchievementsView';
import { ExploreGalleryView } from './components/ExploreGalleryView';
import { AboutModal } from './components/AboutModal';
import { SettingsModal } from './components/SettingsModal';

import type {
  JournalEntry,
  ExplorationStats,
  Achievement,
  AISettings,
  AIAnalysisResult,
  NatureMission,
} from './types/nature';
import { StorageService } from './services/storageService';
import { AIService } from './services/aiService';
import type { AnalysisContext } from './services/aiService';
import {
  DEMO_ANALYSIS_NEEM,
  DEMO_ANALYSIS_WILDFLOWER,
  DEMO_ANALYSIS_TREE_BARK,
  DEMO_IMAGES,
} from './data/demoDiscoveries';

export function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Core Data
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<ExplorationStats>(StorageService.getStats());
  const [achievements, setAchievements] = useState<Achievement[]>(StorageService.getAchievements());
  const [aiSettings, setAiSettings] = useState<AISettings>(StorageService.getSettings());

  // Capture & Analysis
  const [isCaptureOpen, setIsCaptureOpen] = useState<boolean>(false);
  const [captureInitialMode, setCaptureInitialMode] = useState<'camera' | 'upload'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStage, setAnalysisStage] = useState<string>('Observing image...');
  const [analysisPercent, setAnalysisPercent] = useState<number>(10);

  // Discovery Result Modal / View
  const [activeResult, setActiveResult] = useState<{
    entry?: JournalEntry;
    result: AIAnalysisResult;
    imageUrl: string;
    isDemo?: boolean;
  } | null>(null);

  // Leave The Screen UX View
  const [activeOutdoorMission, setActiveOutdoorMission] = useState<{
    mission: NatureMission;
    specimenName: string;
    entryId: string;
  } | null>(null);

  // Mission Complete Modal
  const [completingMissionId, setCompletingMissionId] = useState<string | null>(null);

  // Modals
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const entries = StorageService.getJournalEntries();
    setJournalEntries(entries);
    setStats(StorageService.getStats());
    setAchievements(StorageService.getAchievements());
    setAiSettings(StorageService.getSettings());
  };

  // Launch Demo Discovery (Section 26)
  const handleLaunchDemo = (demoId: 'neem' | 'wildflower' | 'treeBark') => {
    let result: AIAnalysisResult;
    let img: string;

    if (demoId === 'neem') {
      result = DEMO_ANALYSIS_NEEM;
      img = DEMO_IMAGES.neemLeaf;
    } else if (demoId === 'wildflower') {
      result = DEMO_ANALYSIS_WILDFLOWER;
      img = DEMO_IMAGES.wildflower;
    } else {
      result = DEMO_ANALYSIS_TREE_BARK;
      img = DEMO_IMAGES.treeBark;
    }

    // Check if demo is already in journal or create demo entry
    let entry = journalEntries.find((e) => e.analysis.identification.name === result.identification.name);
    if (!entry) {
      entry = {
        id: `demo-${demoId}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        imageUrl: img,
        analysis: result,
        isDemo: true,
        missionStatus: 'not_started',
      };
      StorageService.addJournalEntry(entry);
      refreshData();
    }

    setActiveResult({
      entry,
      result,
      imageUrl: img,
      isDemo: true,
    });
  };

  // Image analysis flow
  const handleAnalyzePhoto = async (imageDataUrl: string, context: AnalysisContext) => {
    setIsCaptureOpen(false);
    setIsAnalyzing(true);
    setAnalysisPercent(15);
    setAnalysisStage('Observing image...');

    try {
      const result = await AIService.analyzeImage(
        imageDataUrl,
        context,
        aiSettings,
        (stage, percent) => {
          setAnalysisStage(stage);
          setAnalysisPercent(percent);
        }
      );

      // Create journal entry
      const newEntry: JournalEntry = {
        id: `discovery-${Date.now()}`,
        createdAt: new Date().toISOString(),
        imageUrl: imageDataUrl,
        analysis: result,
        isDemo: false,
        missionStatus: 'not_started',
        approximateLocation: context.approximateLocation,
        userContext: context,
      };

      StorageService.addJournalEntry(newEntry);
      refreshData();

      setActiveResult({
        entry: newEntry,
        result,
        imageUrl: imageDataUrl,
        isDemo: false,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      alert('NatureSnap could not analyze that photo. Try taking a clearer picture with the subject centered.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Start Outdoor Mission -> Triggers "Leave the Screen UX" (Section 14)
  const handleStartMission = (entry?: JournalEntry, customResult?: AIAnalysisResult) => {
    const targetEntry = entry || activeResult?.entry;
    const mission = targetEntry?.analysis.mission || customResult?.mission || activeResult?.result.mission;
    const name = targetEntry?.analysis.identification.name || customResult?.identification.name || activeResult?.result.identification.name || 'Outdoor Specimen';

    if (!targetEntry || !mission) return;

    // Update status to in_progress
    StorageService.updateJournalEntry(targetEntry.id, {
      missionStatus: 'in_progress',
      missionStartedAt: new Date().toISOString(),
    });
    refreshData();

    setActiveResult(null);
    setActiveOutdoorMission({
      mission,
      specimenName: name,
      entryId: targetEntry.id,
    });
  };

  // Complete Mission flow
  const handleTriggerComplete = (entryId?: string) => {
    const id = entryId || activeOutdoorMission?.entryId;
    if (!id) return;
    setActiveOutdoorMission(null);
    setCompletingMissionId(id);
  };

  const handleConfirmMissionComplete = (evidenceUrl?: string, notes?: string) => {
    if (!completingMissionId) return;

    StorageService.completeMission(completingMissionId, evidenceUrl);
    if (notes) {
      StorageService.updateJournalEntry(completingMissionId, { userNotes: notes });
    }

    setCompletingMissionId(null);
    refreshData();
    setCurrentTab('journal');
  };

  // Exports
  const handleExportJson = () => {
    const jsonStr = StorageService.exportJournalJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naturesnap-field-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const mdStr = StorageService.exportJournalMarkdown();
    const blob = new Blob([mdStr], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naturesnap-field-journal-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete entry
  const handleDeleteEntry = (entryId: string) => {
    StorageService.deleteJournalEntry(entryId);
    refreshData();
  };

  // Active missions count for badge
  const pendingMissionsCount = journalEntries.filter((e) => e.missionStatus !== 'completed').length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveResult(null);
          if (tab === 'about') {
            setIsAboutOpen(true);
          } else if (tab === 'settings') {
            setIsSettingsOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenCapture={() => {
          setCaptureInitialMode('camera');
          setIsCaptureOpen(true);
        }}
        journalCount={journalEntries.length}
        activeMissionCount={pendingMissionsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If viewing a specific discovery result */}
        {activeResult ? (
          <DiscoveryResultView
            imageUrl={activeResult.imageUrl}
            result={activeResult.result}
            isDemo={activeResult.isDemo}
            onStartMission={() => handleStartMission(activeResult.entry)}
            onSaveForLater={() => {
              setActiveResult(null);
              setCurrentTab('missions');
            }}
            onClose={() => setActiveResult(null)}
          />
        ) : (
          <>
            {/* Tab: Dashboard */}
            {currentTab === 'dashboard' && (
              <div>
                <LandingHero
                  onStartExploring={() => {
                    setCaptureInitialMode('camera');
                    setIsCaptureOpen(true);
                  }}
                  onOpenHowItWorks={() => setIsAboutOpen(true)}
                  onTryDemo={handleLaunchDemo}
                />

                <DashboardStats
                  stats={stats}
                  onTakePhoto={() => {
                    setCaptureInitialMode('camera');
                    setIsCaptureOpen(true);
                  }}
                  onUploadPhoto={() => {
                    setCaptureInitialMode('upload');
                    setIsCaptureOpen(true);
                  }}
                  onStartDemo={handleLaunchDemo}
                />
              </div>
            )}

            {/* Tab: Explore Gallery */}
            {currentTab === 'explore' && (
              <ExploreGalleryView
                entries={journalEntries}
                onSelectEntry={(entry) =>
                  setActiveResult({
                    entry,
                    result: entry.analysis,
                    imageUrl: entry.imageUrl,
                    isDemo: entry.isDemo,
                  })
                }
                onOpenCapture={() => {
                  setCaptureInitialMode('camera');
                  setIsCaptureOpen(true);
                }}
                onStartDemo={handleLaunchDemo}
              />
            )}

            {/* Tab: Journal */}
            {currentTab === 'journal' && (
              <JournalView
                entries={journalEntries}
                onSelectEntry={(entry) =>
                  setActiveResult({
                    entry,
                    result: entry.analysis,
                    imageUrl: entry.imageUrl,
                    isDemo: entry.isDemo,
                  })
                }
                onDeleteEntry={handleDeleteEntry}
                onExportJson={handleExportJson}
                onExportMarkdown={handleExportMarkdown}
                onOpenCapture={() => {
                  setCaptureInitialMode('camera');
                  setIsCaptureOpen(true);
                }}
              />
            )}

            {/* Tab: Missions */}
            {currentTab === 'missions' && (
              <MissionsView
                entries={journalEntries}
                onStartMission={(entry) => handleStartMission(entry)}
                onOpenCapture={() => {
                  setCaptureInitialMode('camera');
                  setIsCaptureOpen(true);
                }}
              />
            )}

            {/* Tab: Achievements */}
            {currentTab === 'achievements' && (
              <AchievementsView stats={stats} achievements={achievements} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block py-8 border-t border-stone-200/80 bg-white/50 text-xs text-stone-500 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">NatureSnap AI</span>
            <span>•</span>
            <span>Hacktoberfest 2026 Open-Source AI Challenge</span>
            <span>•</span>
            <span className="font-semibold text-emerald-800">Theme: “Touch Grass”</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-stone-900 transition-colors">
              How It Works
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="hover:text-stone-900 transition-colors">
              AI Settings
            </button>
            <span>MIT License</span>
          </div>
        </div>
      </footer>

      {/* Capture Modal (Section 6) */}
      <NatureCaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onAnalyze={handleAnalyzePhoto}
        initialMode={captureInitialMode}
      />

      {/* Progressive AI Analysis Loading Screen (Section 7) */}
      {isAnalyzing && (
        <AnalysisLoading stage={analysisStage} percent={analysisPercent} />
      )}

      {/* LEAVE THE SCREEN UX (Section 14) */}
      {activeOutdoorMission && (
        <LeaveTheScreenView
          mission={activeOutdoorMission.mission}
          specimenName={activeOutdoorMission.specimenName}
          onCompleteMission={() => handleTriggerComplete(activeOutdoorMission.entryId)}
          onExit={() => setActiveOutdoorMission(null)}
        />
      )}

      {/* Mission Complete Celebration Modal (Section 11) */}
      <MissionCompleteModal
        isOpen={completingMissionId !== null}
        onClose={() => setCompletingMissionId(null)}
        onConfirm={handleConfirmMissionComplete}
        missionTitle={
          journalEntries.find((e) => e.id === completingMissionId)?.analysis.mission.title || 'Outdoor Mission'
        }
      />

      {/* About & Touch Grass Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* AI Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={aiSettings}
        onSaveSettings={(s) => {
          StorageService.saveSettings(s);
          setAiSettings(s);
        }}
        onResetDemoData={() => {
          StorageService.resetToDemo();
          refreshData();
        }}
      />
    </div>
  );
}

export default App;
