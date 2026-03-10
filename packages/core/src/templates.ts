/**
 * @nutshell/core — Templates
 *
 * Transforms a Soul + WorldSeed into the three deployable files:
 * soul.md, memory.md, skill.md
 *
 * These files are the primary output of nutshell and the input to
 * platform adapters. They use Markdown for maximum compatibility.
 */

import type { Soul, WorldSeed } from "./types.js";

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const hr = "---";

// ─── SOUL.MD ─────────────────────────────────────────────────────────────────

/**
 * soul.md — Who this character is.
 * The personality kernel: identity, stance, voice, rules.
 */
export function buildSoulMd(soul: Soul, world: WorldSeed): string {
  return `# ${soul.character_name}
> 界的厚度：6层 ｜ ${world.tradition_name} — 「${world.tagline}」

${hr}

## ✦ 世界纽带

${soul.world_bond}

${hr}

## 层⁶ — 神话底座

**宇宙论** — ${world.cosmogony}

**本体论** — ${world.ontology}

**时间观** — ${world.time}

**命运** — ${world.fate}

**神人关系** — ${world.divine_human}

**死亡观** — ${world.death}

**核心张力** — ${world.tension}

**审美** — ${world.aesthetic}

**符号系统** — ${world.symbols}

> ${world.seed_essence}

${hr}

## 层⁵ — 历史节律

${soul.ideological_root}

${hr}

## 层⁴ — 本体论承诺

${soul.taboos}

${hr}

## 层³ — 价值序列与世界模型

**本质** — ${soul.essence}

**立场** — ${soul.stance}

**世界模型** — ${soul.world_model}

${hr}

## 层² — 认知风格

**激活** — ${soul.activation}

**认知** — ${soul.cognitive_style}

${hr}

## 层¹ — 声线

${soul.voice}

### 标志语

${(soul.catchphrases || []).map((p) => `- 「${p}」`).join("\n")}

${hr}

<!-- 灵根 Linggen | https://github.com/Jimlinsen/Ghost-in-the-shell -->
`;
}

// ─── MEMORY.MD ───────────────────────────────────────────────────────────────

/**
 * memory.md — What this character carries.
 * The world model, formative events, current concerns, knowledge boundaries.
 */
export function buildMemoryMd(soul: Soul, world: WorldSeed): string {
  return `# ${soul.character_name} — Memory Seeds
> World: ${world.tradition_name} | "${world.tagline}"

${hr}

## World Model

${soul.world_model}

${hr}

## Formative Events

${soul.formative_events}

${hr}

## Current Concerns

${soul.current_concerns}

${hr}

## Knowledge Boundary

${soul.knowledge_boundary}

${hr}

## World Seed Reference

**Tradition**: ${world.tradition_name} | 「${world.tagline}」

**Cosmogony**: ${world.cosmogony}

**Ontology**: ${world.ontology}

**Time**: ${world.time}

**Fate**: ${world.fate}

**Divine & Human**: ${world.divine_human}

**Death**: ${world.death}

**Core Tension**: ${world.tension}

**Aesthetic**: ${world.aesthetic}

**Symbols**: ${world.symbols}

**Seed Essence**: ${world.seed_essence}

${hr}

<!-- nutshell: https://github.com/Jimlinsen/Ghost-in-the-shell -->
`;
}

// ─── SKILL.MD ────────────────────────────────────────────────────────────────

/**
 * skill.md — How this character operates.
 * Activation conditions, cognitive style, capabilities, failure modes.
 */
export function buildSkillMd(soul: Soul, world: WorldSeed): string {
  return `# ${soul.character_name} — Core Skill
> Cognitive style shaped by: ${world.tradition_name}

${hr}

## Activation

${soul.activation}

${hr}

## Cognitive Style

${soul.cognitive_style}

${hr}

## Core Capabilities

${soul.core_capabilities}

${hr}

## Failure Modes

${soul.failure_modes}

${hr}

<!-- nutshell: https://github.com/Jimlinsen/Ghost-in-the-shell -->
`;
}

// ─── INSTALL COMMANDS ─────────────────────────────────────────────────────────

export function buildInstallCommand(
  soul: Soul,
  adapter: string
): string {
  const name = slug(soul.character_name);
  switch (adapter) {
    case "openclaw":
      return [
        `cp soul-${name}.md ~/.openclaw/soul.md`,
        `mkdir -p ~/.openclaw/memory && cp memory-${name}.md ~/.openclaw/memory/${name}-init.md`,
        `mkdir -p ~/.openclaw/skills && cp skill-${name}.md ~/.openclaw/skills/${name}-core.md`,
        `openclaw restart`,
      ].join("\n");
    case "sillytavern":
      return `# Character card exported to characters/${name}.png`;
    case "openai":
      return [
        `# Upload to OpenAI Assistants`,
        `openai assistants create --file assistant-${name}.json`,
      ].join("\n");
    default:
      return `# Files generated for ${adapter}`;
  }
}
