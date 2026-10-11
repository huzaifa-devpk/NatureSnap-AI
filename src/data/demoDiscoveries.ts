import type { AIAnalysisResult, JournalEntry, Achievement } from '../types/nature';

// High quality botanical SVG artwork data URIs so demo images never fail offline
export const DEMO_IMAGES = {
  neemLeaf: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%231e3a1f"/>
        <stop offset="50%" stop-color="%232d5a30"/>
        <stop offset="100%" stop-color="%23132e15"/>
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%2386efac"/>
        <stop offset="40%" stop-color="%2322c55e"/>
        <stop offset="100%" stop-color="%2315803d"/>
      </linearGradient>
      <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="%23bbf7d0"/>
        <stop offset="100%" stop-color="%23166534"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(%23bg)"/>
    <circle cx="400" cy="300" r="280" fill="%234ade80" opacity="0.08"/>
    <!-- Stem -->
    <path d="M 120 540 Q 300 380 680 120" stroke="url(%23stemGrad)" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Leaf pairs -->
    <path d="M 220 460 C 160 410, 180 340, 290 390 C 240 430, 230 450, 220 460 Z" fill="url(%23leafGrad)"/>
    <path d="M 260 430 C 320 370, 390 390, 340 470 C 290 460, 270 440, 260 430 Z" fill="url(%23leafGrad)"/>
    <path d="M 320 380 C 250 320, 280 250, 400 300 C 350 350, 330 370, 320 380 Z" fill="url(%23leafGrad)"/>
    <path d="M 370 340 C 440 280, 500 310, 460 400 C 410 370, 390 350, 370 340 Z" fill="url(%23leafGrad)"/>
    <path d="M 430 290 C 380 220, 420 160, 520 220 C 470 260, 450 280, 430 290 Z" fill="url(%23leafGrad)"/>
    <path d="M 490 250 C 560 180, 620 210, 590 300 C 530 280, 500 260, 490 250 Z" fill="url(%23leafGrad)"/>
    <!-- Terminal Leaf -->
    <path d="M 620 160 C 660 110, 720 90, 710 160 C 680 180, 640 170, 620 160 Z" fill="url(%23leafGrad)"/>
    <text x="400" y="550" font-family="sans-serif" font-size="20" fill="%2386efac" text-anchor="middle" letter-spacing="3" font-weight="600">NEEM (AZADIRACHTA INDICA)</text>
  </svg>`,

  wildflower: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="wfBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%231a2e3b"/>
        <stop offset="50%" stop-color="%23244254"/>
        <stop offset="100%" stop-color="%2312212b"/>
      </linearGradient>
      <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%2393c5fd"/>
        <stop offset="50%" stop-color="%233b82f6"/>
        <stop offset="100%" stop-color="%231d4ed8"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(%23wfBg)"/>
    <circle cx="400" cy="300" r="260" fill="%2360a5fa" opacity="0.08"/>
    <!-- Stem -->
    <path d="M 400 580 Q 395 420 400 300" stroke="%234ade80" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M 400 460 Q 330 420 300 370 C 350 380 390 410 400 430" fill="%2322c55e"/>
    <!-- Flower Petals in Star/Radial pattern -->
    <g transform="translate(400, 280)">
      <ellipse cx="0" cy="-90" rx="16" ry="70" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(30)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(60)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(90)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(120)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(150)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(180)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(210)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(240)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(270)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(300)" fill="url(%23petalGrad)"/>
      <ellipse cx="0" cy="-90" rx="16" ry="70" transform="rotate(330)" fill="url(%23petalGrad)"/>
      <!-- Flower Center -->
      <circle cx="0" cy="0" r="34" fill="%23f59e0b"/>
      <circle cx="0" cy="0" r="28" fill="%23fbbf24"/>
      <circle cx="0" cy="0" r="16" fill="%23d97706"/>
    </g>
    <text x="400" y="550" font-family="sans-serif" font-size="20" fill="%2393c5fd" text-anchor="middle" letter-spacing="3" font-weight="600">COMMON CHICORY (CICHORIUM INTYBUS)</text>
  </svg>`,

  treeBark: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="barkBg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="%23e2e8f0"/>
        <stop offset="25%" stop-color="%23f8fafc"/>
        <stop offset="60%" stop-color="%23cbd5e1"/>
        <stop offset="100%" stop-color="%2394a3b8"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(%23barkBg)"/>
    <!-- Lenticels and horizontal fissures of Birch Bark -->
    <path d="M 60 90 Q 240 95 380 90" stroke="%23334155" stroke-width="4" stroke-linecap="round"/>
    <path d="M 440 120 Q 600 115 720 125" stroke="%231e293b" stroke-width="6" stroke-linecap="round"/>
    <path d="M 120 170 Q 280 180 460 170" stroke="%23475569" stroke-width="5" stroke-linecap="round"/>
    <path d="M 520 210 Q 640 205 760 215" stroke="%23334155" stroke-width="4" stroke-linecap="round"/>
    <path d="M 80 260 Q 320 255 580 265" stroke="%231e293b" stroke-width="7" stroke-linecap="round"/>
    <!-- Peeling paper curl -->
    <path d="M 300 240 C 350 210, 480 220, 520 260 C 460 280, 360 270, 300 240 Z" fill="%23f1f5f9" stroke="%2364748b" stroke-width="2"/>
    <path d="M 140 330 Q 380 340 680 330" stroke="%23334155" stroke-width="5" stroke-linecap="round"/>
    <path d="M 90 410 Q 300 400 480 415" stroke="%231e293b" stroke-width="6" stroke-linecap="round"/>
    <path d="M 540 450 Q 680 460 770 450" stroke="%23475569" stroke-width="4" stroke-linecap="round"/>
    <path d="M 160 500 Q 420 495 720 505" stroke="%23334155" stroke-width="6" stroke-linecap="round"/>
    <!-- Subtle lichen tint -->
    <circle cx="210" cy="220" r="32" fill="%2384cc16" opacity="0.25"/>
    <circle cx="620" cy="380" r="45" fill="%23eab308" opacity="0.2"/>
    <rect x="0" y="520" width="800" height="80" fill="%230f172a" opacity="0.85"/>
    <text x="400" y="565" font-family="sans-serif" font-size="20" fill="%23f8fafc" text-anchor="middle" letter-spacing="3" font-weight="600">PAPER BIRCH BARK (BETULA PAPYRIFERA)</text>
  </svg>`,
};

export const DEMO_ANALYSIS_NEEM: AIAnalysisResult = {
  identification: {
    name: "Neem Leaf",
    scientific_name: "Azadirachta indica",
    category: "Plant",
    confidence: "High",
    alternatives: [
      {
        name: "Chinaberry Leaf",
        scientific_name: "Melia azedarach",
        category: "Plant",
        probability: "14%",
        distinguishing_feature: "Doubly compound leaves with more deeply lobed margins"
      },
      {
        name: "Curry Leaf",
        scientific_name: "Murraya koenigii",
        category: "Plant",
        probability: "6%",
        distinguishing_feature: "Strong pungent aromatic citrus scent when crushed, smaller rounded leaflets"
      }
    ]
  },
  description: "A hardy, fast-growing evergreen tree native to the Indian subcontinent, renowned in traditional forestry and medicine as 'nature's pharmacy'.",
  environment: "Warm outdoor environments, subtropical plains, dry sunny soils, and park landscapes.",
  facts: [
    "Known for its distinctive pinnate leaf structure with serrated, curved edges.",
    "Common in warm subtropical environments and widely planted for shade.",
    "Contains natural azadirachtin compounds that act as natural eco-friendly insect deterrents.",
    "Leaves stay deeply green even through high summer heat and dry spells."
  ],
  observation_clues: [
    "Leaf shape: Asymmetric blade base curved like a small sickle.",
    "Leaf margin: Distinctive sharp saw-toothed serrations along both edges.",
    "Arrangement: Alternate pinnate leaflets arranged oppositely along a central rachis.",
    "Texture: Smooth, waxy upper surface with a lighter matte underside."
  ],
  mission: {
    title: "Look Closer: Leaf Edge Detective",
    description: "Find two more leaves nearby that have a similar shape. Compare their edges and color in natural sunlight without picking them.",
    category: "Compare",
    difficulty: "Easy",
    estimated_minutes: 5
  },
  safety_notes: [
    "AI identification is an estimate. Never consume or ingest wild leaves or plants based on AI recognition.",
    "Observe leaves gently on the branch without tearing off live foliage."
  ]
};

export const DEMO_ANALYSIS_WILDFLOWER: AIAnalysisResult = {
  identification: {
    name: "Common Chicory",
    scientific_name: "Cichorium intybus",
    category: "Flower",
    confidence: "High",
    alternatives: [
      {
        name: "Cornflower / Bachelor's Button",
        scientific_name: "Centaurea cyanus",
        category: "Flower",
        probability: "18%",
        distinguishing_feature: "Tubular florets with deeper blue-violet center and grayish-green foliage"
      },
      {
        name: "Blue Aster",
        scientific_name: "Symphyotrichum laeve",
        category: "Flower",
        probability: "8%",
        distinguishing_feature: "Narrower ray petals radiating around a yellow center disk"
      }
    ]
  },
  description: "A cheerful, tough perennial wildflower famous for vivid sky-blue petals that open wide in morning sunlight and close during overcast afternoons.",
  environment: "Meadows, sunny roadsides, dry grasslands, urban gravel edges, and park borders.",
  facts: [
    "The bright sky-blue blossoms are phototropic, opening with direct morning sun.",
    "Roots have historically been roasted and brewed as a caffeine-free coffee substitute.",
    "Deep taproots enable chicory to thrive in packed, dry, nutrient-poor soil.",
    "Attracts a rich variety of native solitary bees, hoverflies, and pollinators."
  ],
  observation_clues: [
    "Petal structure: Toothed squared tips at the end of each ray petal (usually 5 tiny notches).",
    "Center: Intricate blue-tipped stamens and coiled stigmas.",
    "Stem texture: Stiff, zig-zagging, ribbed stems with rough hairs.",
    "Growth habit: Blossoms grow clamped closely against the rough branching stalk."
  ],
  mission: {
    title: "Pollinator Watch: Blossom Tracker",
    description: "Sit quietly 1 meter away from this wildflower or a nearby blossom for 3 minutes. Count how many insects or breezes touch the petals.",
    category: "Observe",
    difficulty: "Easy",
    estimated_minutes: 6
  },
  safety_notes: [
    "Wild plants should not be harvested from roadsides or parks.",
    "Watch out for active bees pollinating flowers; enjoy observing them from a respectful distance."
  ]
};

export const DEMO_ANALYSIS_TREE_BARK: AIAnalysisResult = {
  identification: {
    name: "Paper Birch Bark",
    scientific_name: "Betula papyrifera",
    category: "Tree",
    confidence: "High",
    alternatives: [
      {
        name: "River Birch",
        scientific_name: "Betula nigra",
        category: "Tree",
        probability: "15%",
        distinguishing_feature: "Darker, salmon-cinnamon shaggy peeling curls rather than white chalky sheets"
      },
      {
        name: "Quaking Aspen Bark",
        scientific_name: "Populus tremuloides",
        category: "Tree",
        probability: "9%",
        distinguishing_feature: "Greenish-white smooth bark that does not peel into paper-thin horizontal strips"
      }
    ]
  },
  description: "A northern hardwood tree recognized worldwide for its luminous white bark that naturally peels in delicate, horizontal parchment-thin sheets.",
  environment: "Temperate forests, wooded hillsides, riparian park edges, and cool climates.",
  facts: [
    "Horizontal dark slits across the bark are called lenticels, functioning as respiratory breathing pores for the trunk.",
    "Bark contains betulin crystals, making it water-resistant and historically used for canoes and waterproof baskets.",
    "The brilliant white color reflects harsh winter sunlight, preventing sunscald trunk damage.",
    "Hosts unique symbiotic fungi and moss colonies along sheltered bark crevasses."
  ],
  observation_clues: [
    "Texture: Touch the trunk gently; notice the chalky powder, horizontal breathing slits (lenticels), and paper curls.",
    "Color variations: Look for subtle orange/pink under-layers where older white sheets peel.",
    "Lichen colonies: Check the north-facing bark for dusty green or golden-yellow crustose lichens.",
    "Trunk base: Darker furrowed ridges near the root collar compared to the white upper trunk."
  ],
  mission: {
    title: "Texture Touch: The Bark Rubbing Quest",
    description: "Gently place your palm on the bark. Feel the horizontal breathing pores (lenticels). Then find another tree nearby and compare how their textures feel.",
    category: "Compare",
    difficulty: "Easy",
    estimated_minutes: 5
  },
  safety_notes: [
    "Never peel live bark off healthy trees, as this exposes the cambium to infections and pests.",
    "Watch for harmless lichen or tree sap on your fingertips."
  ]
};

export const DEMO_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "demo-neem-leaf-01",
    createdAt: "2026-10-10T09:30:00.000Z",
    imageUrl: DEMO_IMAGES.neemLeaf,
    analysis: DEMO_ANALYSIS_NEEM,
    isDemo: true,
    missionStatus: "completed",
    missionStartedAt: "2026-10-10T09:32:00.000Z",
    missionCompletedAt: "2026-10-10T09:41:00.000Z",
    userNotes: "Found by the garden path. The sickle-curved edges matched the guide perfectly!",
    approximateLocation: "Sunny Garden Walkway",
    userContext: {
      activity: "Walking",
      availableMinutes: 15,
      difficulty: "Easy"
    }
  },
  {
    id: "demo-wildflower-02",
    createdAt: "2026-10-09T14:15:00.000Z",
    imageUrl: DEMO_IMAGES.wildflower,
    analysis: DEMO_ANALYSIS_WILDFLOWER,
    isDemo: true,
    missionStatus: "completed",
    missionStartedAt: "2026-10-09T14:17:00.000Z",
    missionCompletedAt: "2026-10-09T14:26:00.000Z",
    userNotes: "Saw two hoverflies landing on the square-toothed blue petals. Very peaceful.",
    approximateLocation: "Meadow Verge",
    userContext: {
      activity: "Casual Stroll",
      availableMinutes: 10,
      difficulty: "Easy"
    }
  },
  {
    id: "demo-tree-bark-03",
    createdAt: "2026-10-08T16:45:00.000Z",
    imageUrl: DEMO_IMAGES.treeBark,
    analysis: DEMO_ANALYSIS_TREE_BARK,
    isDemo: true,
    missionStatus: "not_started",
    userNotes: "The horizontal lenticels look like little dark brushstrokes on white paper.",
    approximateLocation: "North Trail",
    userContext: {
      activity: "Hiking",
      availableMinutes: 30,
      difficulty: "Moderate"
    }
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_discovery",
    title: "🌱 First Discovery",
    description: "Photograph and identify your first outdoor finding.",
    icon: "🌱",
    unlocked: true,
    unlockedAt: "2026-10-08T16:45:00.000Z",
    progress: 3,
    maxProgress: 1
  },
  {
    id: "curious_explorer",
    title: "🔎 Curious Explorer",
    description: "Make 5 nature discoveries out in the wild.",
    icon: "🔎",
    unlocked: false,
    progress: 3,
    maxProgress: 5
  },
  {
    id: "trail_observer",
    title: "🥾 Trail Observer",
    description: "Complete 10 real-world outdoor nature missions.",
    icon: "🥾",
    unlocked: false,
    progress: 2,
    maxProgress: 10
  },
  {
    id: "nature_week",
    title: "🌿 Nature Week",
    description: "Explore outside on 7 different days.",
    icon: "🌿",
    unlocked: false,
    progress: 3,
    maxProgress: 7
  },
  {
    id: "biodiversity_scout",
    title: "🦋 Biodiversity Scout",
    description: "Discover items across at least 4 distinct nature categories.",
    icon: "🦋",
    unlocked: false,
    progress: 3,
    maxProgress: 4
  },
  {
    id: "master_of_grass",
    title: "🍃 Master of Grass",
    description: "Put down your phone and complete 5 micro-missions outdoors.",
    icon: "🍃",
    unlocked: false,
    progress: 2,
    maxProgress: 5
  }
];
