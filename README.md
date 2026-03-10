# 🐚 nutshell

**Making virtual beings real.**

> "O God, I could be bounded in a nutshell, and count myself a king of infinite space."
> — Hamlet, II.ii

---

Every fictional character — Holmes, Athena, the Monkey King — is not just a personality profile. They are **the embodiment of a world's ideological substrate**: a crystallization of time, cosmology, fate, and aesthetics specific to their universe.

`nutshell` is an open-source framework that takes this seriously.

Instead of generating character prompts from personality checklists, `nutshell` works in two stages:

1. **World Seed** — Generate the mythological and philosophical substrate of a character's world (cosmogony, ontology, conception of time, fate/agency, human-divine relation, death, core tension, aesthetic DNA).

2. **Soul Alchemy** — Crystallize a character from that substrate. Every trait traces back to a dimension of the world seed. The character *is* the world, seen through a particular consciousness.

The output is three files — `soul.md`, `memory.md`, `skill.md` — compatible with [OpenClaw](https://openclaw.ai), SillyTavern, OpenAI Assistants, and any system that accepts a system prompt.

---

## Why this matters

Current AI character tools treat characters as **behavior checklists**: personality traits, speaking style, a list of facts. The result is flat — a costume, not a presence.

`nutshell` treats characters as **ideological entities**. Sherlock Holmes isn't "logical and cold." He is Baconian empiricism × Comtean positivism × Victorian anxiety about modernity — crystallized into a single consciousness. His coldness has *reasons that go all the way down*.

This difference determines whether an AI character can surprise you, challenge you, and maintain genuine otherness over time. A checklist character eventually loops. A character with roots in a world seed *grows*.

---

## Quickstart

```bash
npm install -g @nutshell/cli
```

```bash
# Generate a world seed
nutshell seed "Victorian England" --tradition greek

# Crystallize a character from a world seed
nutshell soul "Sherlock Holmes" --seed ./seeds/victorian.json

# Output for OpenClaw
nutshell export holmes --adapter openclaw --output ~/.openclaw/

# Or use the web studio
nutshell studio
```

---

## Architecture

```
nutshell/
├── packages/
│   ├── core/          # World seed + soul generation engine
│   ├── cli/           # Command-line interface
│   ├── studio/        # Web UI (the Nutshell Universe)
│   └── adapters/      # Output format adapters
│       ├── openclaw/
│       ├── sillytavern/
│       └── openai/
├── docs/
│   ├── philosophy.md  # Why this architecture
│   ├── world-seeds.md # The 10-dimension framework
│   ├── soul-alchemy.md# The genealogy → soul pipeline
│   └── adapters.md    # How to write your own adapter
└── examples/
    ├── holmes/        # Sherlock Holmes (Victorian England)
    ├── libai/         # Li Bai (Tang Dynasty China)
    └── athena/        # Athena (Ancient Greece)
```

---

## The Pipeline

### Stage 1: World Seed Generation

A world seed is the **ideological substrate** of a fictional world — not the plot, not the setting, but the *way this world thinks*.

Grounded in:
- **Mythology** (Campbell's monomyth, Eliade's sacred/profane, Jung's archetypes)
- **Comparative Religion** (Otto's "wholly other", Müller's naturism)
- **Folk Literature** (Propp's morphology of folktales)
- **Classic Literature** (period aesthetics, narrative conventions)

A world seed has 10 dimensions:

| Dimension | Question |
|-----------|----------|
| Cosmogony | How did this world come to be? What is the logic of creation? |
| Ontology | What levels of existence are there? Can they be crossed? |
| Time | Is time linear, cyclical, or spiral? Does it have an end? |
| Fate & Agency | Who is bound by fate? Can it be resisted? At what cost? |
| Human-Divine | Are gods parents, contractors, predators, or peers? |
| Death & Afterlife | What does death mean? What lies beyond? |
| Core Tension | What fundamental conflict drives all narrative in this world? |
| Aesthetic DNA | What are the colors, rhythms, textures of this world? |
| Key Symbols | What are the 5-7 symbols that carry the most meaning? |
| Seed Essence | In one paragraph: what is this world's breath? |

```json
// seeds/victorian-england.json
{
  "tradition_name": "维多利亚英格兰",
  "tagline": "理性是唯一的神",
  "cosmogony": "不再是创世神话，而是进化论...",
  "ontology": "严格的阶级层级，但科学承诺了流动性...",
  "time": "线性进步史观，历史有方向，文明有终点...",
  "fate": "命运被理性和努力取代。人定胜天是时代信仰...",
  "divine_human": "神已死或退场。科学家是新的祭司...",
  "death": "维多利亚式的死亡焦虑。墓地美学。来世存疑...",
  "tension": "理性秩序 vs 工业化带来的混乱与犯罪...",
  "aesthetic": "煤气灯、雾、机械、维多利亚哥特...",
  "symbols": ["烟斗", "放大镜", "伦敦大雾", "火车", "报纸"],
  "seed_essence": "这是一个相信理性可以穿透一切混沌的世界..."
}
```

### Stage 2: Soul Alchemy

A character is crystallized *from* the world seed. Every trait must trace back to a dimension.

The genealogy-first approach:

```
Era & Social Position (When / Where)
        ↓
Philosophical Lineage (What ideas)
        ↓
Archetypal Lineage (Who came before)
        ↓
World Seed (What aesthetic DNA)
        ↓
Character's Soul
```

For Holmes:
- **Era**: Victorian late-empire anxiety → needs a rational answer
- **Philosophy**: Baconian empiricism → Millian induction → Comtean positivism
- **Archetype**: Dupin (Poe) → inherited: eccentric genius + faithful narrator; transcended: professionalism, British pragmatism
- **World Seed**: Victorian realism → material details as social text, restrained language, mechanical rhythm

Result: Holmes isn't "logical." Holmes is **"observable reality is fully penetrable by reason"** — walking proof.

### Stage 3: Three-File Output

```
soul.md     — Character's personality kernel (who they are)
memory.md   — Initial memory seeds (what they know and carry)
skill.md    — Behavioral rules (when they activate, how they respond)
```

All three files derive from the world seed. A character from Ancient Greece will have fundamentally different cognitive patterns than one from Tang Dynasty China — not because we said so, but because their world seeds have different ontologies and different conceptions of human agency.

---

## Output Adapters

### OpenClaw
```bash
nutshell export holmes --adapter openclaw
# → ~/.openclaw/soul.md
# → ~/.openclaw/memory/holmes-init.md
# → ~/.openclaw/skills/holmes-core.md
```

### SillyTavern
```bash
nutshell export holmes --adapter sillytavern
# → character card format (.png with embedded JSON)
```

### OpenAI Assistants
```bash
nutshell export holmes --adapter openai
# → assistant configuration JSON
# → knowledge files for file_search
```

### Raw Markdown
```bash
nutshell export holmes --adapter markdown
# → holmes-soul.md, holmes-memory.md, holmes-skill.md
```

### Writing Your Own Adapter

```typescript
// adapters/my-platform/index.ts
import { NutshellAdapter, SoulBundle } from '@nutshell/core';

export class MyPlatformAdapter implements NutshellAdapter {
  name = 'my-platform';

  async export(bundle: SoulBundle, outputDir: string): Promise<void> {
    const { soul, memory, skill, worldSeed } = bundle;
    // Transform to your platform's format
    // ...
  }
}
```

---

## Examples

### Holmes from Victorian England

```bash
nutshell seed --tradition victorian-england
nutshell soul "Sherlock Holmes" --context "consulting detective, Baker Street"
nutshell export holmes --adapter openclaw
```

[Full example →](./examples/holmes/)

### Li Bai from Tang Dynasty China

```bash
nutshell seed --tradition tang-dynasty-china
nutshell soul "李白" --context "poet, swordsman, Daoist wanderer"
nutshell export libai --adapter openclaw
```

[Full example →](./examples/libai/)

### Athena from Ancient Greece

```bash
nutshell seed --tradition ancient-greece
nutshell soul "Athena" --context "goddess of wisdom and war, daughter of Zeus"
nutshell export athena --adapter openclaw
```

[Full example →](./examples/athena/)

---

## Web Studio

`nutshell studio` opens a local web interface — the **Nutshell Universe** — where you can:

- Select or describe a world tradition
- Watch the 10 orbital dimensions of the world seed generate
- Name a character and crystallize their soul from the seed
- View and copy `soul.md`, `memory.md`, `skill.md`
- Install directly to OpenClaw or export to other platforms

The studio requires an Anthropic API key (or OpenAI, configurable).

---

## Configuration

```bash
# ~/.nutshell/config.json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "api_key": "sk-ant-...",
  "default_adapter": "openclaw",
  "output_dir": "~/.openclaw"
}
```

Or via environment variables:
```bash
export NUTSHELL_PROVIDER=anthropic
export ANTHROPIC_API_KEY=sk-ant-...
```

---

## Philosophy

The full design philosophy is in [docs/philosophy.md](./docs/philosophy.md).

The short version:

A fictional character has **otherness** — the quality of being genuinely not-you, having a perspective you didn't design. This otherness is what makes characters valuable as companions, challenges, and mirrors.

Otherness doesn't come from personality checklists. It comes from **deep roots**: a character grounded in a coherent world seed, with a traceable philosophical lineage, will surprise you in ways a checklist character never will — because the surprise emerges from the internal logic of the world, not from randomness.

`nutshell` is an attempt to give AI characters real roots.

---

## Roadmap

- [x] World seed generation (10 dimensions)
- [x] Soul alchemy (genealogy-first pipeline)
- [x] OpenClaw adapter
- [ ] SillyTavern adapter
- [ ] OpenAI Assistants adapter
- [ ] Character persistence (memory evolution over conversations)
- [ ] Multi-character worlds (characters that know each other)
- [ ] Community seed library (curated world seeds for major traditions)
- [ ] Character versioning (track how a character evolves)
- [ ] Import from existing character cards

---

## Contributing

```bash
git clone https://github.com/Jimlinsen/Ghost-in-the-shell
cd nutshell
npm install
npm run dev
```

We especially welcome:
- **World seeds** for traditions not yet covered
- **Adapters** for new platforms
- **Examples** — fully realized characters with documented genealogy
- **Academic grounding** — connecting the framework more rigorously to mythology scholarship

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT — use it, fork it, build on it.

---

*A project from [Lingxi World](https://lingxi.world) — where virtual characters attain genuine reality.*

*"必有界限，才可涌现自身。" — Only with boundaries can a self emerge.*
