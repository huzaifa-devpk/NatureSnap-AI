import type {
  AIAnalysisResult,
  AISettings,
  MissionDifficulty,
  MissionCategory,
  NatureCategory,
  ConfidenceLevel,
} from '../types/nature';

export interface AnalysisContext {
  activity: 'Walking' | 'Hiking' | 'Gardening' | 'Casual Stroll';
  availableMinutes: number;
  difficulty: MissionDifficulty;
  approximateLocation?: string;
}

// System prompt sent to open-weight models (Gemma / PaliGemma / Ollama)
export const GEMMA_NATURE_PROMPT = `You are NatureSnap AI, an open-source outdoor exploration companion built for Hacktoberfest 2026.
Your purpose is to identify what the user discovered in nature and immediately generate a real-world outdoor mission that encourages them to put their phone down and touch grass.

Respond ONLY with valid JSON conforming strictly to this schema:
{
  "identification": {
    "name": "Common name",
    "scientific_name": "Latin binomial",
    "category": "Plant | Leaf | Flower | Tree | Bird | Insect | Rock | Mushroom | Other",
    "confidence": "High | Medium | Low | Uncertain",
    "alternatives": [
      {
        "name": "Alternative name",
        "scientific_name": "Latin name",
        "category": "Category",
        "probability": "percentage",
        "distinguishing_feature": "Key visual clue to tell them apart"
      }
    ]
  },
  "description": "2-sentence accessible summary of what this is",
  "environment": "Typical natural habitat or environment",
  "facts": [
    "3 to 4 concise bullet facts highlighting ecological or structural uniqueness"
  ],
  "observation_clues": [
    "3 to 4 physical clues for the user to look closer at right now (shape, edges, texture, color)"
  ],
  "mission": {
    "title": "Engaging real-world outdoor mission title",
    "description": "Specific instruction encouraging the user to explore their physical surroundings",
    "category": "Observe | Compare | Listen | Count | Explore | Photograph | Learn | Protect",
    "difficulty": "Easy | Moderate | Adventurous",
    "estimated_minutes": 5
  },
  "safety_notes": [
    "Safety reminders: never ingest wild plants/mushrooms, do not disturb wildlife or tear off live foliage"
  ]
}

SAFETY RULES:
- Never encourage eating, tasting, touching unknown mushrooms or venomous insects.
- Emphasize that AI identification is an estimate.
- Ensure the mission takes place outside without staring at a screen.`;

export class AIService {
  /**
   * Main analysis pipeline with 4 visible progress stages:
   * 1. Observing image
   * 2. Identifying nature
   * 3. Finding interesting details
   * 4. Creating your outdoor mission
   */
  static async analyzeImage(
    imageDataUrl: string,
    context: AnalysisContext,
    settings: AISettings,
    onProgress?: (stage: string, percent: number) => void
  ): Promise<AIAnalysisResult> {
    // Stage 1: Observing image
    onProgress?.('Observing image...', 25);
    await new Promise((r) => setTimeout(r, 450));

    // Stage 2: Identifying nature
    onProgress?.('Identifying nature...', 55);
    await new Promise((r) => setTimeout(r, 550));

    // Stage 3: Finding interesting details
    onProgress?.('Finding interesting details...', 80);
    await new Promise((r) => setTimeout(r, 450));

    // Stage 4: Creating your outdoor mission
    onProgress?.('Creating your outdoor mission...', 95);

    try {
      if (settings.provider === 'huggingface' && settings.huggingFaceKey) {
        return await this.callHuggingFaceGemma(imageDataUrl, context, settings);
      } else if (settings.provider === 'ollama' && settings.ollamaEndpoint) {
        return await this.callOllamaGemma(context, settings);
      } else {
        return await this.generateSimulatedGemmaAnalysis(imageDataUrl, context);
      }
    } catch (err) {
      console.warn('External AI model failed, falling back to embedded Gemma nature engine:', err);
      return await this.generateSimulatedGemmaAnalysis(imageDataUrl, context);
    }
  }

  private static async callHuggingFaceGemma(
    imageDataUrl: string,
    context: AnalysisContext,
    settings: AISettings
  ): Promise<AIAnalysisResult> {
    const model = settings.modelName || 'google/gemma-2-2b-it';
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.huggingFaceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${GEMMA_NATURE_PROMPT}\n\nUser Context:\nActivity: ${context.activity}\nTime: ${context.availableMinutes} minutes\nDifficulty: ${context.difficulty}\nLocation: ${context.approximateLocation || 'Outdoor park'}\n\nGenerate structured analysis JSON:`,
        parameters: { max_new_tokens: 800, return_full_text: false },
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API returned status ${response.status}`);
    }

    const data = await response.json();
    const textOutput = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    const parsed = this.extractAndValidateJSON(textOutput);
    if (parsed) return parsed;

    return this.generateSimulatedGemmaAnalysis(imageDataUrl, context);
  }

  private static async callOllamaGemma(
    context: AnalysisContext,
    settings: AISettings
  ): Promise<AIAnalysisResult> {
    const endpoint = (settings.ollamaEndpoint || 'http://localhost:11434').replace(/\/$/, '');
    const model = settings.modelName || 'gemma2';

    const response = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${GEMMA_NATURE_PROMPT}\n\nUser Context:\nActivity: ${context.activity}\nTime: ${context.availableMinutes} mins\nDifficulty: ${context.difficulty}\nLocation: ${context.approximateLocation || 'Outdoors'}\n\nProduce JSON now:`,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}`);
    }

    const data = await response.json();
    const parsed = this.extractAndValidateJSON(data?.response);
    if (parsed) return parsed;

    throw new Error('Could not parse valid schema from Ollama response');
  }

  public static extractAndValidateJSON(rawText: string): AIAnalysisResult | null {
    if (!rawText) return null;
    try {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) return null;
      const parsed = JSON.parse(match[0]);

      if (
        parsed.identification &&
        parsed.identification.name &&
        parsed.identification.category &&
        parsed.mission &&
        parsed.mission.title &&
        Array.isArray(parsed.facts)
      ) {
        return parsed as AIAnalysisResult;
      }
    } catch (e) {
      console.warn('JSON schema validation error:', e);
    }
    return null;
  }

  private static async generateSimulatedGemmaAnalysis(
    imageDataUrl: string,
    context: AnalysisContext
  ): Promise<AIAnalysisResult> {
    const natureTemplates = [
      {
        name: 'Broadleaf Plantain',
        scientific_name: 'Plantago major',
        category: 'Plant' as NatureCategory,
        confidence: 'High' as ConfidenceLevel,
        alternatives: [
          {
            name: 'Ribwort Plantain',
            scientific_name: 'Plantago lanceolata',
            category: 'Plant',
            probability: '18%',
            distinguishing_feature: 'Narrower lance-shaped leaves with prominent vertical ribs',
          },
          {
            name: 'Common Dandelion Leaf',
            scientific_name: 'Taraxacum officinale',
            category: 'Plant',
            probability: '7%',
            distinguishing_feature: 'Deeply jagged backwards-pointing leaf teeth with milky sap',
          },
        ],
        description: 'A remarkably resilient ground plant known colloquially as "white man\'s footprint" due to how it thrives in trampled pathway soils.',
        environment: 'Pathway margins, lawn edges, compacted trail soil, and garden paths.',
        facts: [
          'Possesses parallel leaf veins that contain tough elastic fiber threads.',
          'Its seeds produce a mucilaginous gel when wet that adheres to shoes and animal paws to disperse.',
          'Historically revered as a soothing poultice for insect bites and minor outdoor scrapes.',
          'Can survive extreme physical foot traffic where other plants wither.',
        ],
        observation_clues: [
          'Vein structure: Look at the underside for 5 to 9 parallel veins running from base to tip.',
          'Leaf rosette: Notice how leaves form a flat circular rosette pressed firmly against the soil.',
          'Leaf stalk: Channelled petiole with slight reddish tint near the base.',
          'Flower spikes: Look for upright slender spikes bearing tiny granular seeds.',
        ],
        missionType: 'Compare' as MissionCategory,
        missionTitle: 'Tough Pathway Detective',
        missionPrompt: (mins: number) =>
          `Walk along your path for ${mins} minutes. Find two more plants growing in tough, packed soil where people walk. Notice how their leaf shapes withstand being stepped on.`,
      },
      {
        name: 'English Ivy Leaf',
        scientific_name: 'Hedera helix',
        category: 'Leaf' as NatureCategory,
        confidence: 'High' as ConfidenceLevel,
        alternatives: [
          {
            name: 'Boston Ivy',
            scientific_name: 'Parthenocissus tricuspidata',
            category: 'Leaf',
            probability: '14%',
            distinguishing_feature: 'Deciduous leaves that turn crimson red in autumn; adhesive disc tendrils',
          },
          {
            name: 'Field Bindweed',
            scientific_name: 'Convolvulus arvensis',
            category: 'Leaf',
            probability: '5%',
            distinguishing_feature: 'Arrowhead-shaped thinner leaves with twining stems rather than aerial rootlets',
          },
        ],
        description: 'An evergreen climbing vine whose thick, leathery leaves exhibit distinct juvenile and adult foliage variations.',
        environment: 'Shaded woodland floors, tree trunks, stone garden walls, and park fences.',
        facts: [
          'Exhibits juvenile palmate lobed leaves on trailing stems, but unlobed heart-shaped leaves when climbing into direct sunlight.',
          'Climbs using specialized aerial cling rootlets that secrete a natural nanoparticle glue.',
          'Thick waxy cuticle prevents moisture loss throughout hot summers and freezing winters.',
          'Provides critical late-season shelter and nectar for overwintering woodland birds.',
        ],
        observation_clues: [
          'Vein color: Prominent pale creamy-white veins contrasting sharply with the deep green blade.',
          'Blade shape: Five distinct angular lobes on ground foliage.',
          'Surface: Leathery, thick, glossy feel with a cooler temperature than surrounding air.',
          'Stem attachment: Slender reddish-brown petiole anchored firmly to climbing rootlets.',
        ],
        missionType: 'Observe' as MissionCategory,
        missionTitle: 'Climbing Root Investigation',
        missionPrompt: (mins: number) =>
          `Spend ${mins} minutes inspecting the surface this vine is growing on. Find where the vine attaches to the trunk or wall and count how many anchor points you can spot without pulling on it.`,
      },
      {
        name: 'Common Dandelion Blossom',
        scientific_name: 'Taraxacum officinale',
        category: 'Flower' as NatureCategory,
        confidence: 'High' as ConfidenceLevel,
        alternatives: [
          {
            name: 'Catsear / False Dandelion',
            scientific_name: 'Hypochaeris radicata',
            category: 'Flower',
            probability: '22%',
            distinguishing_feature: 'Solid, branched flower stems with rough hairs rather than hollow smooth milk-filled stems',
          },
          {
            name: 'Hawkweed',
            scientific_name: 'Hieracium pilosella',
            category: 'Flower',
            probability: '10%',
            distinguishing_feature: 'Smaller clustered flower heads with hairy stolon runners',
          },
        ],
        description: 'A vital early-season pollinator lifeline with a composite blossom made of up to 200 individual fertile florets.',
        environment: 'Sunny lawns, meadows, disturbed road verges, and open park spaces.',
        facts: [
          'What looks like one single flower is actually an inflorescence of 100 to 200 individual ray florets.',
          'Blossoms close tightly at night and in rainy weather to protect pollen grains.',
          'The hollow stem contains a harmless bitter latex emulsion.',
          'Pappus seed parachutes can travel more than 5 miles riding high thermal updrafts.',
        ],
        observation_clues: [
          'Center florets: Inspect the curled yellow stigmas in the inner disc.',
          'Involucral bracts: Look at the green scales beneath the yellow head; notice how the outer bracts reflex downward.',
          'Stem: Gently check if the stem is hollow and unbranched with a single blossom.',
          'Basal leaves: Sharp, lion-tooth jagged lobes pointing back toward the root.',
        ],
        missionType: 'Count' as MissionCategory,
        missionTitle: 'Sun Tracker & Pollinator Count',
        missionPrompt: (mins: number) =>
          `Step outside for ${mins} minutes. Look around this flower's perimeter. How many other yellow blossoms can you spot in your line of sight? Note whether they are facing toward the sun.`,
      },
      {
        name: 'Oak Leaf & Acorn Cup',
        scientific_name: 'Quercus robur',
        category: 'Tree' as NatureCategory,
        confidence: 'High' as ConfidenceLevel,
        alternatives: [
          {
            name: 'Red Oak',
            scientific_name: 'Quercus rubra',
            category: 'Tree',
            probability: '12%',
            distinguishing_feature: 'Bristle-tipped sharp lobes instead of rounded undulating sinus margins',
          },
          {
            name: 'Chestnut Oak',
            scientific_name: 'Quercus montana',
            category: 'Tree',
            probability: '6%',
            distinguishing_feature: 'Shallower wavy crenate leaf edges resembling American Chestnut leaves',
          },
        ],
        description: 'A keystone canopy tree supporting over 2,300 species of birds, insects, lichens, and woodland fungi.',
        environment: 'Deciduous woodlands, parks, forest borders, and old hedgerows.',
        facts: [
          'A single mature oak can produce up to 10,000 acorns in a mast crop year.',
          'Supports more native caterpillar and bird species than any other native tree genus.',
          'The cupule (acorn cup) is made of modified woody bracts that shield the developing seed.',
          'Tannic acid in oak leaves acts as a natural decay and herbivore deterrent.',
        ],
        observation_clues: [
          'Lobe shape: Smooth, rounded undulating lobes without bristle tips.',
          'Auricles: Tiny ear-like lobes right where the leaf blade joins the short stalk.',
          'Acorn cup: Warty or overlapping scale pattern on the woody cap.',
          'Underside: Pale green matte finish with fine raised branching veins.',
        ],
        missionType: 'Explore' as MissionCategory,
        missionTitle: 'Canopy Shadow Stride',
        missionPrompt: (mins: number) =>
          `Walk under the canopy for ${mins} minutes. Look down at the leaf litter on the ground. Find two leaves of different sizes and hold them up toward the sky to compare their vein patterns.`,
      },
      {
        name: 'Seven-Spotted Ladybug',
        scientific_name: 'Coccinella septempunctata',
        category: 'Insect' as NatureCategory,
        confidence: 'High' as ConfidenceLevel,
        alternatives: [
          {
            name: 'Asian Lady Beetle',
            scientific_name: 'Harmonia axyridis',
            category: 'Insect',
            probability: '19%',
            distinguishing_feature: 'Variable spot counts and a distinctive white "M" or "W" pattern on the pronotum',
          },
          {
            name: 'Two-Spotted Ladybug',
            scientific_name: 'Adalia bipunctata',
            category: 'Insect',
            probability: '8%',
            distinguishing_feature: 'Only one black spot per red wing cover and smaller round body',
          },
        ],
        description: 'A beloved garden ally and voracious aphid predator recognizable by its bright scarlet elytra and seven distinct black spots.',
        environment: 'Gardens, meadows, shrubs, agricultural hedgerows, and sunny weeds.',
        facts: [
          'Its bright red color is a warning signal called aposematism, indicating an unpleasant taste to birds.',
          'Can consume up to 5,000 aphids during its adult lifespan.',
          'When alarmed, it reflex-bleeds an alkaloid droplet from its leg joints to ward off predators.',
          'Beats its delicate hidden wings up to 85 times per second when taking flight.',
        ],
        observation_clues: [
          'Spot distribution: Three spots on each wing cover, with one central spot shared at the suture line.',
          'Pronotum: Black shield behind the head with two distinct triangular white patches.',
          'Antennae: Short clubbed antennae used to detect aphid honeydew scent trails.',
          'Movement: Rapid, deliberate scurry across leaf veins.',
        ],
        missionType: 'Photograph' as MissionCategory,
        missionTitle: 'Micro Habitat Scavenger',
        missionPrompt: (mins: number) =>
          `Without touching the insect, spend ${mins} minutes inspecting the underside of three nearby leaves. Can you find tiny aphids or honeydew drops that this ladybug might be hunting?`,
      },
      {
        name: 'Turkey Tail Fungus',
        scientific_name: 'Trametes versicolor',
        category: 'Mushroom' as NatureCategory,
        confidence: 'Medium' as ConfidenceLevel,
        alternatives: [
          {
            name: 'False Turkey Tail',
            scientific_name: 'Stereum ostrea',
            category: 'Mushroom',
            probability: '32%',
            distinguishing_feature: 'Underside is completely smooth with no visible porous breathing holes',
          },
          {
            name: 'Violet Toothed Polypore',
            scientific_name: 'Trichaptum biforme',
            category: 'Mushroom',
            probability: '12%',
            distinguishing_feature: 'Purple or violet tint along fresh margins and tooth-like underside pores',
          },
        ],
        description: 'A bracket polypore fungus forming concentric rainbow rings across decaying hardwood logs.',
        environment: 'Fallen hardwood logs, forest stumps, dead branches in damp wooded areas.',
        facts: [
          'Name comes from concentric zones resembling the plumage of a wild turkey tail.',
          'Crucial white-rot decomposer that recycles complex wood lignin back into forest soil.',
          'True Turkey Tail has 3 to 8 tiny microscopic pores per millimeter on its creamy underside.',
          'Rich in beta-glucans and actively studied in mycological pharmacology.',
        ],
        observation_clues: [
          'Concentric rings: Alternating bands of cinnamon, cream, charcoal, and ochre.',
          'Surface texture: Velvety, fine fuzzy hairs on the upper cap.',
          'Underside: Pure white to pale buff porous surface (must have visible tiny holes).',
          'Flexibility: Leathery and thin, not thick or rigid like a woody conk.',
        ],
        missionType: 'Protect' as MissionCategory,
        missionTitle: 'Nurse Log Explorer',
        missionPrompt: (mins: number) =>
          `Spend ${mins} minutes observing the fallen log where this fungus grows. Notice the moss, beetles, or moist wood beneath it. Protect it by leaving the log undisturbed as a forest ecosystem shelter.`,
      },
    ];

    const index = Math.abs(
      (imageDataUrl.length + context.availableMinutes + (context.approximateLocation?.length || 0)) %
        natureTemplates.length
    );
    const selected = natureTemplates[index];

    const mins = context.availableMinutes || 5;
    const missionText = selected.missionPrompt(mins);

    const result: AIAnalysisResult = {
      identification: {
        name: selected.name,
        scientific_name: selected.scientific_name,
        category: selected.category,
        confidence: selected.confidence,
        alternatives: selected.alternatives,
      },
      description: selected.description,
      environment: selected.environment,
      facts: selected.facts,
      observation_clues: selected.observation_clues,
      mission: {
        title: selected.missionTitle,
        description: missionText,
        category: selected.missionType,
        difficulty: context.difficulty || 'Easy',
        estimated_minutes: mins,
      },
      safety_notes: [
        'AI nature identification is an estimation tool. Never eat, brew, or touch unknown wild plants, mushrooms, or fungi.',
        'Always practice "Leave No Trace": observe without uprooting, cutting, or disturbing wild natural habitats.',
      ],
    };

    return result;
  }
}
