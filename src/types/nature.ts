export type NatureCategory =
  | 'Plant'
  | 'Leaf'
  | 'Flower'
  | 'Tree'
  | 'Bird'
  | 'Insect'
  | 'Rock'
  | 'Mushroom'
  | 'Other';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Uncertain';

export type MissionCategory =
  | 'Observe'
  | 'Compare'
  | 'Listen'
  | 'Count'
  | 'Explore'
  | 'Photograph'
  | 'Learn'
  | 'Protect';

export type MissionDifficulty = 'Easy' | 'Moderate' | 'Adventurous';

export interface AlternativeIdentification {
  name: string;
  scientific_name?: string;
  category?: string;
  probability?: string;
  distinguishing_feature: string;
}

export interface NatureIdentification {
  name: string;
  scientific_name: string;
  category: NatureCategory;
  confidence: ConfidenceLevel;
  alternatives: AlternativeIdentification[];
}

export interface NatureMission {
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  estimated_minutes: number;
}

export interface AIAnalysisResult {
  identification: NatureIdentification;
  description: string;
  environment?: string;
  facts: string[];
  observation_clues: string[];
  mission: NatureMission;
  safety_notes: string[];
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  imageUrl: string;
  evidenceImageUrl?: string;
  analysis: AIAnalysisResult;
  isDemo?: boolean;
  missionStatus: 'not_started' | 'in_progress' | 'completed';
  missionStartedAt?: string;
  missionCompletedAt?: string;
  userNotes?: string;
  approximateLocation?: string;
  userContext?: {
    activity: 'Walking' | 'Hiking' | 'Gardening' | 'Casual Stroll';
    availableMinutes: number;
    difficulty: MissionDifficulty;
  };
}

export interface ExplorationStats {
  missionsCompleted: number;
  natureDiscoveries: number;
  outdoorStreakDays: number;
  minutesOutdoors: number;
  lastActiveDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export type AIProvider = 'simulated_gemma' | 'huggingface' | 'ollama';

export interface AISettings {
  provider: AIProvider;
  modelName: string;
  huggingFaceKey?: string;
  ollamaEndpoint?: string;
}
