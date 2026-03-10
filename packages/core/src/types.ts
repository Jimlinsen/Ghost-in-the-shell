/**
 * @nutshell/core — Types
 *
 * The data model for world seeds and soul bundles.
 * All types are designed to be serializable to JSON.
 */

// ─── WORLD SEED ──────────────────────────────────────────────────────────────

/**
 * A WorldSeed is the ideological substrate of a fictional world.
 * It captures not the plot or the setting, but the *way this world thinks* —
 * its cosmology, its conception of time, its relationship between humans and
 * the divine. Every character crystallized from this seed will carry these
 * dimensions in their soul.
 *
 * Grounded in: Campbell (monomyth), Eliade (sacred/profane), Jung (archetypes),
 * Müller (comparative religion), Otto (the holy), Propp (folk morphology).
 */
export interface WorldSeed {
  /** Canonical name of the tradition */
  tradition_name: string;

  /** One-line poetic essence of this world (≤20 chars) */
  tagline: string;

  /** How this world came to be. The logic and cost of creation. */
  cosmogony: string;

  /** Levels of existence. The structure of gods/humans/nature. Whether boundaries can be crossed. */
  ontology: string;

  /** Linear, cyclical, or spiral? Does history have direction? Do ages decline? */
  time: string;

  /** Who is bound by fate, who can resist, at what cost. */
  fate: string;

  /** Are gods parents, contractors, predators, or peers? How does one approach the divine? */
  divine_human: string;

  /** What does death mean? What lies beyond? How does death relate to life? */
  death: string;

  /**
   * The fundamental conflict that drives all narrative in this world.
   * This tension can never be finally resolved — only dramatically re-enacted.
   */
  tension: string;

  /** Colors, rhythms, textures, sounds. If this world were music, what key? */
  aesthetic: string;

  /** 5-7 symbols that carry the most meaning in this world. */
  symbols: string;

  /**
   * One paragraph that captures the full breath of this world seed.
   * Reading this, one should feel how this world thinks.
   */
  seed_essence: string;
}

// ─── CHARACTER GENEALOGY ─────────────────────────────────────────────────────

/**
 * The four-layer genealogy that grounds a character in history and thought.
 * Filled in by the genealogy pipeline before soul generation.
 */
export interface CharacterGenealogy {
  /** When and where. The core tensions of this era and locale. */
  era: string;

  /** The philosophical tradition(s) that shape this character's world view. */
  philosophical_lineage: string;

  /** Direct literary/mythological predecessors and what was inherited vs. transcended. */
  archetypal_lineage: string;

  /** The aesthetic and cultural DNA. */
  world_seed_connection: string;
}

// ─── SOUL ────────────────────────────────────────────────────────────────────

/**
 * A Soul is the character's operational kernel —
 * who they are, how they think, what they will and won't do.
 *
 * Every field should be traceable to a dimension of the WorldSeed.
 */
export interface Soul {
  character_name: string;

  /** "This character is [ideological force] embodied" — one sentence */
  world_bond: string;

  /** What makes this character irreducibly themselves, traced to world seed */
  essence: string;

  /** How the world seed's philosophy shaped this character's world view */
  ideological_root: string;

  /** Rhythm, temperature, length, characteristic patterns of speech */
  voice: string;

  /** Signature phrases from the original source, not invented */
  catchphrases: string[];

  /** Core value hierarchy, derived from world seed's tension structure */
  stance: string;

  /** Three things this character will never do, and why (from world view) */
  taboos: string;

  /** How this character understands reality, using world seed as framework */
  world_model: string;

  /** Three defining moments from the character's tradition/source */
  formative_events: string;

  /** What this character is most preoccupied with right now */
  current_concerns: string;

  /** What they know deeply / what they don't care about */
  knowledge_boundary: string;

  /** When does this character activate, what signals call them forth */
  activation: string;

  /** Input processing → reasoning path → output shape */
  cognitive_style: string;

  /** Three categories of task this character excels at */
  core_capabilities: string;

  /** Common failure modes and how to prevent them */
  failure_modes: string;
}

// ─── SOUL BUNDLE ─────────────────────────────────────────────────────────────

/**
 * A SoulBundle is the complete package for one character:
 * their world seed + their soul + their three output files.
 * This is what adapters receive and transform.
 */
export interface SoulBundle {
  /** The world this character comes from */
  world_seed: WorldSeed;

  /** Optional genealogy notes used during generation */
  genealogy?: CharacterGenealogy;

  /** The character's soul */
  soul: Soul;

  /** Generated file contents */
  files: {
    soul_md: string;
    memory_md: string;
    skill_md: string;
  };

  /** Generation metadata */
  meta: {
    generated_at: string;
    model: string;
    version: string;
  };
}

// ─── ADAPTER ─────────────────────────────────────────────────────────────────

/**
 * An adapter transforms a SoulBundle into platform-specific files.
 * Implement this interface to support a new platform.
 */
export interface NutshellAdapter {
  /** Unique identifier for this adapter */
  name: string;

  /** Human-readable description */
  description: string;

  /** Supported platforms / versions */
  platforms: string[];

  /**
   * Transform a SoulBundle into platform-specific output files.
   * @param bundle The complete character bundle
   * @param outputDir Where to write files
   * @returns Paths to files that were written
   */
  export(bundle: SoulBundle, outputDir: string): Promise<ExportResult>;
}

export interface ExportResult {
  files: Array<{
    path: string;
    description: string;
  }>;
  install_command?: string;
  notes?: string;
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────

export type LLMProvider = "anthropic" | "openai" | "ollama" | "custom" | "mock";

export interface NutshellConfig {
  provider: LLMProvider;
  model: string;
  api_key?: string;
  base_url?: string;
  default_adapter: string;
  output_dir: string;
  language: "zh" | "en" | "auto";
}

export const DEFAULT_CONFIG: NutshellConfig = {
  provider: "anthropic",
  model: "claude-sonnet-4-20250514",
  default_adapter: "openclaw",
  output_dir: "~/.openclaw",
  language: "auto",
};

// ─── GENERATION OPTIONS ───────────────────────────────────────────────────────

export interface WorldSeedOptions {
  /** Named tradition (e.g. "greek", "norse", "fengshen") */
  tradition?: string;
  /** Free-form description of the world */
  description?: string;
  /** Output language preference */
  language?: "zh" | "en";
  /** Pre-fetched research context (Wikipedia) to inject into the prompt */
  researchContext?: string;
}

export interface SoulOptions {
  /** The character's name */
  character: string;
  /** Additional context about the character */
  context?: string;
  /** Pre-computed world seed to use */
  world_seed: WorldSeed;
  /** Output language preference */
  language?: "zh" | "en";
  /** Pre-fetched research context (Wikipedia) to inject into the prompt */
  researchContext?: string;
}
