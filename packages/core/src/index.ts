/**
 * @nutshell/core — Public API
 */
export type {
  WorldSeed, Soul, SoulBundle, CharacterGenealogy,
  NutshellConfig, NutshellAdapter, ExportResult,
  WorldSeedOptions, SoulOptions,
} from "./types.js";

export { DEFAULT_CONFIG } from "./types.js";
export { generate, generateWorldSeed, generateSoul, generateGenealogy } from "./generator.js";
export { researchTradition, researchCharacter, formatResearchForPrompt } from "./research.js";
export type { WikiArticle, ResearchBundle } from "./research.js";
export { buildSoulMd, buildMemoryMd, buildSkillMd, buildInstallCommand } from "./templates.js";
