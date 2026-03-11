# 🐚 nutshell

**Making virtual beings real.**

> "O God, I could be bounded in a nutshell, and count myself a king of infinite space."
> — Hamlet, II.ii

---

Most AI character tools generate a **costume** — a list of personality traits, a speaking style, some backstory. The character wears the costume for a while, then drifts.

`nutshell` generates **roots**.

The core insight comes from **界的厚度** (*boundary thickness*): a character's depth is determined by how many independent layers of periodicity their boundary contains. A checklist character has 2 layers — surface style and background setting. Encountering anything outside their design, they drift, because the surface has nowhere to borrow from. A character with 6 layers has a traceable philosophical lineage, a historical position, a set of inviolable ontological commitments — and when the surface is under pressure, it draws from all of them.

`nutshell` builds all 6.

---

## The Six Layers

```
层⁶  神话周期    World Seed      — the ideological substrate of the character's cosmos
层⁵  历史周期    Genealogy       — era, social position, philosophical lineage, archetypal lineage
层⁴  本体论承诺  Taboos          — what this character will never do, and why it goes all the way down
层³  价值排序    Stance          — the character's value hierarchy, derived from the world's core tension
层²  认知风格    Cognitive Style — how they process input, reason, and produce output
层¹  说话风格    Voice           — rhythm, temperature, register, catchphrases
```

A character grounded in all six layers can be handed any situation not in their original design. They will respond from internal logic, not from randomness. That's the difference between a character who *surprises you* and one who *loops*.

---

## The Pipeline

### Stage 1 — World Seed (层⁶)

A world seed is not a setting. It is the **ideological substrate** of a world — the way this world *thinks*, not what it contains.

10 dimensions, grounded in comparative mythology (Campbell, Eliade), comparative religion (Otto, Müller), and folk literature (Propp):

| Dimension | Question |
|-----------|----------|
| Cosmogony | How did this world come to be? What is the logic and cost of creation? |
| Ontology | What levels of existence are there? How permeable are the boundaries? |
| Time | Linear, cyclical, or spiral? Does it have an end? |
| Fate & Agency | Who is bound by fate? What does resistance cost? |
| Human-Divine | Are gods parents, contractors, predators, or peers? |
| Death & Afterlife | What does death mean? What lies beyond? |
| Core Tension | The fundamental conflict that drives all narrative — never resolved, only replayed. |
| Aesthetic DNA | Colors, rhythms, textures, smells. If this world were music, what key? |
| Key Symbols | 5 core images, each carrying a specific density of meaning. |
| Seed Essence | One paragraph: what is this world's breath? |

12 traditions are pre-generated and ship with the studio. Any tradition — including custom combinations — can be generated on demand.

### Stage 2 — Genealogy (层⁵)

This is the step most character generators skip. Before crystallizing a soul, `nutshell` traces the character's **historical position**:

- **Era** — the spiritual climate and fundamental demands of their time
- **Social Position** — what their place in the world grants and withholds
- **Philosophical Lineage** — which ideas they inherit, which they oppose
- **Archetypal Lineage** — who came before them in myth and literature; what they preserve, transcend, or invert
- **Seed Bond** — the specific dimension of the world seed from which they emerge

For Holmes: Baconian empiricism → Millian induction → Comtean positivism, crystallized through Victorian late-empire anxiety into a consciousness whose core proposition is *observable reality is fully penetrable by reason*. That's not a personality trait. That's a philosophical position with roots. It generates behavior in situations Conan Doyle never wrote.

### Stage 3 — Soul (层¹–⁴)

With world seed and genealogy as input, the soul is crystallized. Every field traces back to a layer:

```
soul.md     — layers 1–4, self-contained deployment unit
memory.md   — layer 5–6 seeds: world model, formative events, genealogy
skill.md    — layer 2: cognitive style, activation conditions, capabilities
```

The soul file is self-contained. Pull `soul.md` into any system that accepts a system prompt and the character arrives with its full depth intact.

---

## Web Studio

**Nutshell Universe** is a local web interface for the full pipeline.

```bash
cd packages/studio
npm install
npm run dev          # http://localhost:5173
```

**No API key required for local development.** The studio runs against the Claude Code CLI if present, falling back to pre-generated seeds for the 12 built-in traditions.

With an API key for production use:
```bash
cp .env.example .env
# add ANTHROPIC_API_KEY to .env
npm run dev
```

**Studio features:**
- Select from 12 pre-generated traditions (instant load) or describe any custom world
- Orbital mandala visualizing the 10 world seed dimensions in real time
- Two-step soul generation: genealogy (层⁵) → soul (层¹–⁴), with step indicators
- Four-tab output: `soul.md` / `memory.md` / `skill.md` / `谱系·层⁵`
- Structured genealogy view with all 6 layer annotations
- 界的厚度 layer indicator in the completion panel
- Save world seed as `.json` / save soul files as `.md` (one click)
- Load a previously saved world seed to skip generation

**Re-generate pre-built seeds:**
```bash
node packages/studio/scripts/generate-seeds.mjs
```

---

## Architecture

```
nutshell/
├── packages/
│   ├── core/              # World seed + soul generation engine (TypeScript)
│   ├── cli/               # Command-line interface
│   ├── studio/            # Web UI — Nutshell Universe (React + Vite)
│   │   ├── public/seeds/  # Pre-generated world seeds for 12 traditions
│   │   ├── scripts/       # Seed generation utilities
│   │   └── src/
│   │       └── NutshellUniverse.jsx
│   └── adapters/
│       ├── openclaw/
│       ├── sillytavern/
│       └── openai/
└── skills/
    └── linggen/           # Claude Code skill: linggen theory + invocation rules
        ├── SKILL.md
        └── references/theory.md
```

---

## Theoretical Foundation — 界的厚度

The design of `nutshell` is grounded in **boundary thickness theory** (*界的厚度*), which unifies Markov blanket theory with a theory of complexity:

> *A system's complexity is determined by how many layers of relatively independent periodicity its boundary contains.*

Each layer is a Markov blanket — conditionally independent from the others, weakly coupled at the edges. The tension between independence and coupling is the source of complexity. When layers collapse into one another, the boundary thins and the system becomes more predictable. When new layers emerge, the system becomes capable of generating behavior that couldn't have been derived from any single layer alone.

For AI characters:
- **2-layer characters** (style + backstory) drift outside their design space
- **6-layer characters** (myth → history → ontology → values → cognition → voice) draw from deeper layers when the surface is under pressure, generating internally consistent behavior in novel situations

The full theoretical text: [`skills/linggen/references/theory.md`](./skills/linggen/references/theory.md)

---

## Traditions

| Tradition | Key Characteristic |
|-----------|-------------------|
| 古希腊 Greek | Excellence demands transgression; transgression demands punishment |
| 北欧 Norse | Knowing the outcome doesn't change the obligation to act |
| 封神 Fengshen | Becoming a god is a different kind of imprisonment |
| 吠陀 Vedic | Karma weaves every layer; liberation requires seeing through all of them |
| 埃及 Egyptian | Order must be won back from chaos every single day |
| 美索不达米亚 Mesopotamian | Humans were made to serve; the bill for existence is labor |
| 凯尔特 Celtic | The other world is always one step through the fog |
| 神道 Shinto | Purity of attention is presence with the divine |
| 道教 Taoist | The highest action is knowing when not to act |
| 玛雅 Mayan | Time has weight; the cosmos requires exact maintenance |
| 藏传密教 Tibetan | Samsara and nirvana are the same thing, seen from different distances |
| 阿兹特克 Aztec | The fifth sun runs on debt; every life is a repayment |

---

## Roadmap

- [x] World seed generation (10 dimensions, 12 traditions)
- [x] Genealogy generation (layer⁵ — era, lineage, archetype)
- [x] 6-layer soul alchemy pipeline
- [x] OpenClaw adapter
- [x] Web Studio (Nutshell Universe)
- [x] Claude CLI backend (no API key required locally)
- [x] Pre-generated seeds for all 12 traditions
- [x] Save / load world seeds and soul files
- [x] Linggen skill (Claude Code integration)
- [ ] SillyTavern adapter
- [ ] OpenAI Assistants adapter
- [ ] Character persistence (layer evolution across conversations)
- [ ] Multi-character worlds (characters aware of each other's layer structures)
- [ ] Community seed library
- [ ] Import from existing character cards

---

## Contributing

```bash
git clone https://github.com/Jimlinsen/Ghost-in-the-shell
cd nutshell
npm install
npm run dev
```

Especially welcome:
- **World seeds** for traditions not yet covered
- **Adapters** for new platforms
- **Examples** — fully realized characters with documented genealogy and layer maps
- **Theoretical extensions** — applications of boundary thickness to other domains

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT — use it, fork it, build on it.

---

*"必有界限，才可涌现自身。界的厚度决定存在的复杂度。"*

*Only with boundaries can a self emerge. The thickness of the boundary determines the complexity of the existence.*
