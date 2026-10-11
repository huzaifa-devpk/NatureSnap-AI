import type { JournalEntry, ExplorationStats, Achievement, AISettings } from '../types/nature';
import { DEMO_JOURNAL_ENTRIES, INITIAL_ACHIEVEMENTS } from '../data/demoDiscoveries';

const STORAGE_KEYS = {
  JOURNAL: 'naturesnap_journal_entries',
  STATS: 'naturesnap_exploration_stats',
  ACHIEVEMENTS: 'naturesnap_achievements',
  SETTINGS: 'naturesnap_ai_settings',
};

const DEFAULT_STATS: ExplorationStats = {
  missionsCompleted: 2,
  natureDiscoveries: 3,
  outdoorStreakDays: 3,
  minutesOutdoors: 35,
  lastActiveDate: new Date().toISOString(),
};

const DEFAULT_SETTINGS: AISettings = {
  provider: 'simulated_gemma',
  modelName: 'Gemma 2 (2B / 9B Open Weights)',
  ollamaEndpoint: 'http://localhost:11434',
};

export class StorageService {
  static getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (!data) {
        this.saveJournalEntries(DEMO_JOURNAL_ENTRIES);
        return DEMO_JOURNAL_ENTRIES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse journal entries from localStorage', e);
      return DEMO_JOURNAL_ENTRIES;
    }
  }

  static saveJournalEntries(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save journal entries', e);
    }
  }

  static addJournalEntry(entry: JournalEntry): void {
    const entries = this.getJournalEntries();
    const updated = [entry, ...entries];
    this.saveJournalEntries(updated);

    this.incrementDiscoveries();
  }

  static updateJournalEntry(entryId: string, updates: Partial<JournalEntry>): JournalEntry | null {
    const entries = this.getJournalEntries();
    const index = entries.findIndex((e) => e.id === entryId);
    if (index === -1) return null;

    entries[index] = { ...entries[index], ...updates };
    this.saveJournalEntries(entries);
    return entries[index];
  }

  static deleteJournalEntry(entryId: string): void {
    const entries = this.getJournalEntries();
    const filtered = entries.filter((e) => e.id !== entryId);
    this.saveJournalEntries(filtered);
  }

  static getStats(): ExplorationStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) {
        this.saveStats(DEFAULT_STATS);
        return DEFAULT_STATS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_STATS;
    }
  }

  static saveStats(stats: ExplorationStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save exploration stats', e);
    }
  }

  static incrementDiscoveries(): void {
    const stats = this.getStats();
    stats.natureDiscoveries += 1;
    this.updateStreak(stats);
    this.saveStats(stats);
    this.checkAchievements();
  }

  static completeMission(entryId: string, evidenceImage?: string): JournalEntry | null {
    const entries = this.getJournalEntries();
    const index = entries.findIndex((e) => e.id === entryId);
    if (index === -1) return null;

    const entry = entries[index];
    const minutes = entry.analysis.mission.estimated_minutes || 5;

    entry.missionStatus = 'completed';
    entry.missionCompletedAt = new Date().toISOString();
    if (evidenceImage) {
      entry.evidenceImageUrl = evidenceImage;
    }

    this.saveJournalEntries(entries);

    const stats = this.getStats();
    stats.missionsCompleted += 1;
    stats.minutesOutdoors += minutes;
    this.updateStreak(stats);
    this.saveStats(stats);

    this.checkAchievements();

    return entry;
  }

  private static updateStreak(stats: ExplorationStats): void {
    const today = new Date().toDateString();
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate).toDateString() : '';

    if (today !== lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActive === yesterday.toDateString()) {
        stats.outdoorStreakDays += 1;
      } else if (!lastActive) {
        stats.outdoorStreakDays = 1;
      }
      stats.lastActiveDate = new Date().toISOString();
    }
  }

  static getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (!data) {
        this.saveAchievements(INITIAL_ACHIEVEMENTS);
        return INITIAL_ACHIEVEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  static saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save achievements', e);
    }
  }

  static checkAchievements(): Achievement[] {
    const stats = this.getStats();
    const entries = this.getJournalEntries();
    const achievements = this.getAchievements();

    const categoriesSet = new Set(entries.map((e) => e.analysis.identification.category));

    let updated = false;

    for (const ach of achievements) {
      if (ach.unlocked) continue;

      if (ach.id === 'first_discovery' && stats.natureDiscoveries >= 1) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        ach.progress = 1;
        updated = true;
      } else if (ach.id === 'curious_explorer') {
        ach.progress = Math.min(stats.natureDiscoveries, ach.maxProgress);
        if (stats.natureDiscoveries >= 5) {
          ach.unlocked = true;
          ach.unlockedAt = new Date().toISOString();
          updated = true;
        }
      } else if (ach.id === 'trail_observer') {
        ach.progress = Math.min(stats.missionsCompleted, ach.maxProgress);
        if (stats.missionsCompleted >= 10) {
          ach.unlocked = true;
          ach.unlockedAt = new Date().toISOString();
          updated = true;
        }
      } else if (ach.id === 'nature_week') {
        ach.progress = Math.min(stats.outdoorStreakDays, ach.maxProgress);
        if (stats.outdoorStreakDays >= 7) {
          ach.unlocked = true;
          ach.unlockedAt = new Date().toISOString();
          updated = true;
        }
      } else if (ach.id === 'biodiversity_scout') {
        ach.progress = Math.min(categoriesSet.size, ach.maxProgress);
        if (categoriesSet.size >= 4) {
          ach.unlocked = true;
          ach.unlockedAt = new Date().toISOString();
          updated = true;
        }
      } else if (ach.id === 'master_of_grass') {
        ach.progress = Math.min(stats.missionsCompleted, ach.maxProgress);
        if (stats.missionsCompleted >= 5) {
          ach.unlocked = true;
          ach.unlockedAt = new Date().toISOString();
          updated = true;
        }
      }
    }

    if (updated) {
      this.saveAchievements(achievements);
    }

    return achievements;
  }

  static getSettings(): AISettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: AISettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  static exportJournalJson(): string {
    const entries = this.getJournalEntries();
    const stats = this.getStats();
    return JSON.stringify({ exportedAt: new Date().toISOString(), stats, entries }, null, 2);
  }

  static exportJournalMarkdown(): string {
    const entries = this.getJournalEntries();
    const stats = this.getStats();
    let md = `# NatureSnap AI — Outdoor Field Journal\n\n`;
    md += `*Generated: ${new Date().toLocaleDateString()}*\n\n`;
    md += `## 🌿 Exploration Summary\n`;
    md += `- Discoveries: ${stats.natureDiscoveries}\n`;
    md += `- Missions Completed: ${stats.missionsCompleted}\n`;
    md += `- Outdoor Streak: ${stats.outdoorStreakDays} days\n`;
    md += `- Estimated Time Outdoors: ${stats.minutesOutdoors} mins\n\n`;
    md += `---\n\n`;
    md += `## Field Discoveries\n\n`;

    entries.forEach((entry, idx) => {
      const iden = entry.analysis.identification;
      md += `### ${idx + 1}. ${iden.name} (*${iden.scientific_name}*)\n`;
      md += `**Date:** ${new Date(entry.createdAt).toLocaleDateString()} | **Category:** ${iden.category} | **Confidence:** ${iden.confidence}\n\n`;
      md += `**Description:** ${entry.analysis.description}\n\n`;
      md += `**Observation Clues:**\n`;
      entry.analysis.observation_clues.forEach((c) => {
        md += `- ${c}\n`;
      });
      md += `\n**Mission:** ${entry.analysis.mission.title} (${entry.missionStatus === 'completed' ? '✓ Completed' : 'Pending'})\n`;
      md += `> ${entry.analysis.mission.description}\n\n`;
      if (entry.userNotes) {
        md += `*Field Notes: ${entry.userNotes}*\n\n`;
      }
      md += `---\n\n`;
    });

    return md;
  }

  static resetToDemo(): void {
    this.saveJournalEntries(DEMO_JOURNAL_ENTRIES);
    this.saveStats(DEFAULT_STATS);
    this.saveAchievements(INITIAL_ACHIEVEMENTS);
  }
}
