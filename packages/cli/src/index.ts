#!/usr/bin/env node
/**
 * @nutshell/cli — Command Line Interface
 *
 * nutshell seed [tradition]   Generate a world seed
 * nutshell soul <character>   Crystallize a soul from a world seed
 * nutshell export <bundle>    Export to a platform adapter
 * nutshell studio             Open web studio
 * nutshell config             Configure API keys and defaults
 * nutshell list               List available traditions
 */

import { program } from "commander";
import ora from "ora";
import chalk from "chalk";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import {
  generate,
  generateWorldSeed,
  DEFAULT_CONFIG,
  type NutshellConfig,
  type WorldSeed,
  type SoulBundle,
} from "@nutshell/core";
import OpenClawAdapter from "@nutshell/adapter-openclaw";
import SillyTavernAdapter from "@nutshell/adapter-sillytavern";
import OpenAIAdapter from "@nutshell/adapter-openai";

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const CONFIG_PATH = path.join(os.homedir(), ".nutshell", "config.json");
const SEEDS_DIR   = path.join(os.homedir(), ".nutshell", "seeds");

async function loadConfig(): Promise<NutshellConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return {
      ...DEFAULT_CONFIG,
      api_key: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY,
    };
  }
}

async function saveConfig(updates: Partial<NutshellConfig>): Promise<void> {
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  const current = await loadConfig();
  await fs.writeFile(CONFIG_PATH, JSON.stringify({ ...current, ...updates }, null, 2));
}

// ─── ADAPTERS ────────────────────────────────────────────────────────────────

const ADAPTERS: Record<string, any> = {
  openclaw:    OpenClawAdapter,
  sillytavern: SillyTavernAdapter,
  openai:      OpenAIAdapter,
};

// ─── DISPLAY ─────────────────────────────────────────────────────────────────

function printWorldSeed(seed: WorldSeed): void {
  console.log();
  console.log(chalk.yellow("━".repeat(58)));
  console.log(chalk.bold.yellow(`  🌍 ${seed.tradition_name}`));
  console.log(chalk.dim(`  「${seed.tagline}」`));
  console.log(chalk.yellow("━".repeat(58)));
  console.log();
  const dims: [string, string | undefined][] = [
    ["◎ Cosmogony",     seed.cosmogony],
    ["⚡ Core Tension",  seed.tension],
    ["✦ Aesthetic DNA",  seed.aesthetic],
    ["◉ Seed Essence",   seed.seed_essence],
  ];
  for (const [label, content] of dims) {
    console.log(chalk.cyan(label));
    console.log(chalk.gray((content || "").slice(0, 180) + ((content?.length || 0) > 180 ? "…" : "")));
    console.log();
  }
}

function printExportResult(result: any): void {
  console.log();
  for (const file of result.files) {
    console.log(chalk.cyan("  →"), chalk.white(file.path));
    console.log(chalk.dim(`    ${file.description}`));
  }
  if (result.install_command) {
    console.log();
    console.log(chalk.dim("Run:"), chalk.yellow(result.install_command));
  }
  if (result.notes) {
    console.log();
    console.log(chalk.dim(result.notes));
  }
  console.log();
}

// ─── COMMANDS ────────────────────────────────────────────────────────────────

program
  .name("nutshell")
  .description(chalk.yellow("🐚 nutshell") + " — Making virtual beings real")
  .version("0.1.0");

// ── seed ──────────────────────────────────────────────────────────────────────

program
  .command("seed [tradition]")
  .description("Generate a world seed for a mythological tradition")
  .option("-d, --description <text>", "Free-form world description")
  .option("-o, --output <path>",      "Save seed to file")
  .option("-l, --language <lang>",    "Output language: zh | en", "auto")
  .action(async (tradition, opts) => {
    const config = await loadConfig();
    const spinner = ora("Generating world seed…").start();
    try {
      const seed = await generateWorldSeed(config, {
        tradition,
        description: opts.description,
        language: opts.language === "auto" ? undefined : opts.language,
      });
      spinner.succeed(chalk.green("World seed generated"));
      printWorldSeed(seed);
      const outPath = opts.output || path.join(
        SEEDS_DIR,
        `${(tradition || "custom").toLowerCase().replace(/\s+/g, "-")}.json`
      );
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, JSON.stringify(seed, null, 2), "utf-8");
      console.log(chalk.dim(`Saved: ${outPath}`));
      console.log(chalk.dim(`Next: nutshell soul "<character>" --seed ${outPath}`));
    } catch (e: any) {
      spinner.fail(chalk.red(e.message));
      process.exit(1);
    }
  });

// ── soul ──────────────────────────────────────────────────────────────────────

program
  .command("soul <character>")
  .description("Crystallize a character soul from a world seed")
  .option("-s, --seed <path>",       "Path to world seed JSON")
  .option("-t, --tradition <name>",  "Generate world seed from tradition")
  .option("-c, --context <text>",    "Additional character context")
  .option("-o, --output <path>",     "Output directory", "./")
  .option("-l, --language <lang>",   "Output language: zh | en", "auto")
  .option("--skip-genealogy",        "Skip genealogy research step")
  .option("--no-research",           "Skip Wikipedia research (faster, less grounded)")
  .action(async (character, opts) => {
    const config = await loadConfig();

    let worldSeed: WorldSeed | undefined;
    if (opts.seed) {
      worldSeed = JSON.parse(await fs.readFile(opts.seed, "utf-8"));
    }

    console.log();
    console.log(chalk.bold.yellow(`🐚 Crystallizing: ${character}`));
    if (worldSeed)      console.log(chalk.dim(`   World: ${worldSeed.tradition_name}`));
    if (opts.tradition) console.log(chalk.dim(`   Generating world from: ${opts.tradition}`));
    console.log();

    const STAGE_LABELS: Record<string, string> = {
      "research:fetching":     "Fetching Wikipedia sources…",
      "research:done":         "Sources fetched",
      "research:skipped":      "Research skipped",
      "world_seed:generating": "Generating world seed…",
      "world_seed:done":       "World seed complete",
      "world_seed:loaded":     "World seed loaded",
      "genealogy:generating":  "Researching genealogy…",
      "genealogy:done":        "Genealogy traced",
      "genealogy:skipped":     "Genealogy skipped",
      "soul:generating":       "Crystallizing soul…",
      "soul:done":             "Soul crystallized",
      "files:building":        "Building files…",
    };

    let spinner = ora();
    const onProgress = (stage: string) => {
      if (stage.endsWith(":generating") || stage.endsWith(":building")) {
        spinner = ora(STAGE_LABELS[stage] || stage).start();
      } else if (stage.endsWith(":done") || stage.endsWith(":loaded")) {
        spinner.succeed(chalk.green(STAGE_LABELS[stage] || stage));
      } else if (stage.endsWith(":skipped")) {
        spinner.warn(chalk.dim(STAGE_LABELS[stage] || stage));
      }
    };

    try {
      const bundle = await generate(config, {
        world: opts.tradition ? { tradition: opts.tradition } : undefined,
        worldSeed,
        character,
        context: opts.context,
        skipGenealogy: opts.skipGenealogy,
        skipResearch: opts.research === false,
        language: opts.language === "auto" ? undefined : opts.language,
      }, onProgress);

      const s = bundle.soul;
      const w = bundle.world_seed;
      const trunc = (str: string | undefined, n: number) =>
        str ? (str.length > n ? str.slice(0, n) + "…" : str) : "—";

      console.log();
      console.log(chalk.yellow("─".repeat(58)));
      console.log(chalk.bold.yellow(`  ✦ ${s.character_name}`));
      console.log(chalk.dim(`  ${s.world_bond}`));
      console.log(chalk.yellow("─".repeat(58)));
      console.log();
      console.log(chalk.bold.cyan("  界的厚度诊断"));
      console.log(chalk.dim("  ┄".repeat(28)));
      console.log(`  ${chalk.cyan("层⁶ 神话底座")}  ${chalk.white(trunc(w.tradition_name + " — " + w.tagline, 44))}`);
      console.log(`  ${chalk.cyan("层⁵ 历史节律")}  ${chalk.white(trunc(s.ideological_root, 44))}`);
      const tabooCount = (s.taboos?.match(/\d+\./g) || []).length || 3;
      console.log(`  ${chalk.cyan("层⁴ 本体承诺")}  ${chalk.white(`${tabooCount} 条禁区已锚定`)}`);
      console.log(`  ${chalk.cyan("层³ 价值序列")}  ${chalk.white(trunc(s.stance, 44))}`);
      console.log(`  ${chalk.cyan("层² 认知风格")}  ${chalk.white(trunc(s.cognitive_style, 44))}`);
      console.log(`  ${chalk.cyan("层¹ 声线")}      ${chalk.white(trunc(s.voice, 44))}`);
      console.log(chalk.dim("  ┄".repeat(28)));
      console.log();

      const outDir = opts.output;
      await fs.mkdir(outDir, { recursive: true });
      const slug = character.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fff-]/g, "") || "character";

      await fs.writeFile(path.join(outDir, `soul-${slug}.md`),    bundle.files.soul_md,   "utf-8");
      await fs.writeFile(path.join(outDir, `memory-${slug}.md`),  bundle.files.memory_md, "utf-8");
      await fs.writeFile(path.join(outDir, `skill-${slug}.md`),   bundle.files.skill_md,  "utf-8");
      await fs.writeFile(path.join(outDir, `bundle-${slug}.json`), JSON.stringify(bundle, null, 2), "utf-8");

      console.log(chalk.green("✓ Files written:"));
      ["soul","memory","skill"].forEach(f =>
        console.log(chalk.dim(`  ${f}-${slug}.md`))
      );
      console.log(chalk.dim(`  bundle-${slug}.json`));
      console.log();
      console.log(chalk.dim(`Next: nutshell export bundle-${slug}.json --adapter openclaw`));
    } catch (e: any) {
      spinner.fail(chalk.red(e.message));
      process.exit(1);
    }
  });

// ── export ────────────────────────────────────────────────────────────────────

program
  .command("export <bundle>")
  .description("Export a character bundle to a platform adapter")
  .option("-a, --adapter <name>",  "Adapter: openclaw | sillytavern | openai", "openclaw")
  .option("-o, --output <path>",   "Output directory")
  .action(async (bundleName, opts) => {
    const adapter = ADAPTERS[opts.adapter];
    if (!adapter) {
      console.error(chalk.red(`Unknown adapter: ${opts.adapter}`));
      console.error(chalk.dim(`Available: ${Object.keys(ADAPTERS).join(", ")}`));
      process.exit(1);
    }
    const config = await loadConfig();

    let bundlePath = bundleName;
    if (!bundlePath.endsWith(".json")) bundlePath = `bundle-${bundleName}.json`;

    let bundle: SoulBundle;
    try {
      bundle = JSON.parse(await fs.readFile(bundlePath, "utf-8"));
    } catch {
      console.error(chalk.red(`Bundle not found: ${bundlePath}`));
      console.error(chalk.dim("Run 'nutshell soul <character>' first."));
      process.exit(1);
    }

    const outputDir = opts.output || config.output_dir || "./";
    const spinner = ora(`Exporting to ${opts.adapter}…`).start();
    try {
      const result = await adapter.export(bundle, outputDir);
      spinner.succeed(chalk.green(`Exported to ${opts.adapter}`));
      printExportResult(result);
    } catch (e: any) {
      spinner.fail(chalk.red(e.message));
      process.exit(1);
    }
  });

// ── config ────────────────────────────────────────────────────────────────────

program
  .command("config")
  .description("Configure nutshell settings")
  .option("-k, --key <api_key>",      "Set API key")
  .option("-p, --provider <name>",    "Provider: anthropic | openai | ollama")
  .option("-m, --model <model>",      "Model name")
  .option("-a, --adapter <name>",     "Default adapter")
  .option("--show",                   "Show current config")
  .action(async (opts) => {
    if (opts.show) {
      const config = await loadConfig();
      console.log(JSON.stringify({
        ...config,
        api_key: config.api_key ? "***" + config.api_key.slice(-4) : "(not set)",
      }, null, 2));
      return;
    }
    const updates: Partial<NutshellConfig> = {};
    if (opts.key)      updates.api_key         = opts.key;
    if (opts.provider) updates.provider         = opts.provider;
    if (opts.model)    updates.model            = opts.model;
    if (opts.adapter)  updates.default_adapter  = opts.adapter;
    if (Object.keys(updates).length === 0) { program.help(); return; }
    await saveConfig(updates);
    console.log(chalk.green("✓ Saved to"), chalk.dim(CONFIG_PATH));
  });

// ── studio ────────────────────────────────────────────────────────────────────

program
  .command("studio")
  .description("Open the Nutshell Universe web studio")
  .option("-p, --port <port>", "Port", "3000")
  .action(async (opts) => {
    console.log(chalk.yellow(`\n🐚 Nutshell Universe → http://localhost:${opts.port}\n`));
    try {
      const { startStudio } = await import("@nutshell/studio" as any);
      await startStudio({ port: parseInt(opts.port) });
    } catch {
      console.log(chalk.dim("Install studio: npm install @nutshell/studio"));
    }
  });

// ── list ──────────────────────────────────────────────────────────────────────

program
  .command("list")
  .description("List available named traditions")
  .action(() => {
    const rows = [
      ["greek",          "Ancient Greece",   "Olympic Pantheon · Homer · tragedy"],
      ["norse",          "Norse",            "Nine Worlds · Eddas · Ragnarök"],
      ["fengshen",       "封神演义",            "Shang Dynasty · Investiture of Gods"],
      ["vedic",          "Vedic India",      "Rigveda · dharma · karma"],
      ["egyptian",       "Ancient Egypt",    "Kemetic theology · Ma'at · Duat"],
      ["mesopotamian",   "Mesopotamia",      "Sumerian-Akkadian · Gilgamesh"],
      ["celtic",         "Celtic",           "Irish/Welsh cycles · Otherworld"],
      ["shinto",         "Shinto",           "Kojiki · kami · musubi"],
      ["taoist",         "道教",              "Three Pure Ones · internal alchemy"],
      ["mayan",          "Maya",             "Popol Vuh · Long Count · Xibalba"],
      ["tibetan",        "Vajrayana",        "Nyingma · bardo · tantric cosmology"],
      ["aztec",          "Aztec",            "Fifth Sun · sacrifice · tonalpohualli"],
      ["tang",           "唐朝",              "Tang Dynasty · Buddhist-Daoist synthesis"],
      ["victorian",      "Victorian England","Empire · science · crisis of faith"],
    ];
    console.log();
    for (const [id, name, desc] of rows) {
      console.log(`  ${chalk.yellow(id.padEnd(18))}${chalk.white(name.padEnd(20))}${chalk.dim(desc)}`);
    }
    console.log();
    console.log(chalk.dim("Or pass any description: nutshell seed --description \"Zoroastrian Persia × Hittite mythology\""));
    console.log();
  });

// ─── EVOLVE ───────────────────────────────────────────────────────────────────

const evolve = program.command("evolve").description("World evolution engine");

evolve
  .command("start")
  .description("Start evolving a world from a seed file")
  .requiredOption("--seed <path>", "Path to world seed JSON file")
  .option("--tradition <key>", "Tradition key (e.g. fma, greek)")
  .option("--pulses <n>", "Number of pulses to run (default: 1)", "1")
  .action(async (opts) => {
    const spinner = ora("Loading seed...").start();
    try {
      const { EvolutionEngine } = await import("@nutshell/evolution");
      const seedRaw = await fs.readFile(path.resolve(opts.seed), "utf-8");
      const seed = JSON.parse(seedRaw) as Record<string, string>;
      const tradition = opts.tradition || seed["tradition_key"] || path.basename(opts.seed, ".json");

      const engine = new EvolutionEngine();
      const world = engine.createWorld(tradition, seed);
      spinner.succeed(`World created: ${world.id}`);

      const pulses = parseInt(opts.pulses, 10);
      for (let i = 0; i < pulses; i++) {
        const s = ora(`Pulse ${i + 1}/${pulses}...`).start();
        const result = await engine.evolve(world.id);
        s.succeed(
          `Pulse ${result.pulse_number} — Stage: ${result.maturity.stage_name} ` +
          `(${result.maturity.overall_score.toFixed(2)}) — ${result.events.length} events`
        );
        result.events.forEach(e => {
          console.log(chalk.gray(`  [${e.event_type}] ${e.narrative.slice(0, 100)}...`));
        });
      }
      engine.close();
    } catch (err) {
      spinner.fail(String(err));
      process.exit(1);
    }
  });

evolve
  .command("watch")
  .description("Continuously evolve a world")
  .requiredOption("--world <id>", "World ID")
  .option("--interval <ms>", "Pulse interval in ms", "60000")
  .option("--max-pulses <n>", "Maximum pulses (0 = infinite)", "0")
  .action(async (opts) => {
    const { EvolutionEngine } = await import("@nutshell/evolution");
    const engine = new EvolutionEngine({
      pulse_interval_ms: parseInt(opts.interval, 10),
    });
    const maxPulses = parseInt(opts.maxPulses, 10) || Infinity;
    console.log(chalk.cyan(`Watching world ${opts.world} (interval: ${opts.interval}ms)...`));
    await engine.watch(opts.world, {
      maxPulses: isFinite(maxPulses) ? maxPulses : undefined,
      onPulse: (result) => {
        console.log(
          chalk.green(`✓ Pulse ${result.pulse_number}`) +
          ` — Stage: ${result.maturity.stage_name}` +
          ` — ${result.events.length} events` +
          ` — ${result.duration_ms}ms`
        );
      },
    });
    engine.close();
  });

evolve
  .command("pulse")
  .description("Run a single evolution pulse")
  .requiredOption("--world <id>", "World ID")
  .action(async (opts) => {
    const spinner = ora("Running pulse...").start();
    try {
      const { EvolutionEngine } = await import("@nutshell/evolution");
      const engine = new EvolutionEngine();
      const result = await engine.evolve(opts.world);
      spinner.succeed(`Pulse ${result.pulse_number} complete (${result.duration_ms}ms)`);
      console.log(`Stage: ${result.maturity.stage_name} | Score: ${result.maturity.overall_score.toFixed(2)}`);
      result.events.forEach(e => {
        console.log(chalk.cyan(`  [${e.event_type}]`) + ` ${e.narrative.slice(0, 120)}...`);
      });
      engine.close();
    } catch (err) {
      spinner.fail(String(err));
      process.exit(1);
    }
  });

evolve
  .command("maturity")
  .description("Show world maturity report")
  .requiredOption("--world <id>", "World ID")
  .action(async (opts) => {
    const { EvolutionEngine } = await import("@nutshell/evolution");
    const engine = new EvolutionEngine();
    const report = await engine.getMaturity(opts.world, true);
    console.log(chalk.bold(`\nMaturity Report: ${opts.world}`));
    console.log(`Stage: ${chalk.cyan(report.stage_name)}`);
    console.log(`Overall: ${chalk.yellow(report.overall_score.toFixed(2))}`);
    console.log(`Source coverage: ${report.source_coverage.toFixed(2)}`);
    console.log(`Derivation: ${report.derivation_quality.toFixed(2)}`);
    console.log(`Transcendence: ${report.transcendence_score.toFixed(2)}`);
    console.log(`Emergence: ${report.emergence_index.toFixed(2)}`);
    if (report.weakest_dims.length) {
      console.log(`Weakest dims: ${chalk.red(report.weakest_dims.join(", "))}`);
    }
    console.log(`Recommendation: ${chalk.green(report.recommendation)}`);
    engine.close();
  });

evolve
  .command("history")
  .description("Show world event history")
  .requiredOption("--world <id>", "World ID")
  .option("--limit <n>", "Number of events", "20")
  .action(async (opts) => {
    const { EvolutionEngine } = await import("@nutshell/evolution");
    const engine = new EvolutionEngine();
    const events = engine.getHistory(opts.world, parseInt(opts.limit, 10));
    console.log(chalk.bold(`\nHistory: ${opts.world} (${events.length} events)`));
    events.forEach(e => {
      const ts = new Date(e.timestamp).toLocaleString();
      console.log(chalk.gray(`\n[${ts}] [${e.event_type}] by ${e.actor_id}`));
      console.log(e.narrative.slice(0, 200) + (e.narrative.length > 200 ? "..." : ""));
    });
    engine.close();
  });

evolve
  .command("act")
  .description("A character performs an action in the world")
  .requiredOption("--world <id>", "World ID")
  .requiredOption("--character <name>", "Character name")
  .requiredOption("--action <text>", "Action description")
  .option("--context <text>", "Additional context")
  .action(async (opts) => {
    const spinner = ora(`${opts.character} acts...`).start();
    try {
      const { EvolutionEngine } = await import("@nutshell/evolution");
      const engine = new EvolutionEngine();
      const event = await engine.characterAct(opts.world, {
        character_name: opts.character,
        action: opts.action,
        context: opts.context,
      });
      spinner.succeed("Event generated");
      console.log(chalk.cyan(`[${event.event_type}]`), event.narrative);
      engine.close();
    } catch (err) {
      spinner.fail(String(err));
      process.exit(1);
    }
  });

evolve
  .command("branch")
  .description("Create a parallel branch world")
  .requiredOption("--world <id>", "World ID")
  .action(async (opts) => {
    const { EvolutionEngine } = await import("@nutshell/evolution");
    const engine = new EvolutionEngine();
    const branch = engine.branch(opts.world);
    console.log(chalk.green(`Branch created: ${branch.id}`));
    engine.close();
  });

evolve
  .command("search")
  .description("Search world event history")
  .requiredOption("--world <id>", "World ID")
  .requiredOption("--query <text>", "Search query")
  .action(async (opts) => {
    const { EvolutionEngine } = await import("@nutshell/evolution");
    const engine = new EvolutionEngine();
    const results = engine.searchHistory(opts.world, opts.query);
    console.log(chalk.bold(`\nSearch results for "${opts.query}": ${results.length} found`));
    results.forEach(e => {
      console.log(chalk.cyan(`\n[${e.event_type}]`), e.narrative.slice(0, 200));
    });
    engine.close();
  });

evolve
  .command("list")
  .description("List all worlds")
  .action(async () => {
    const { EvolutionEngine } = await import("@nutshell/evolution");
    const engine = new EvolutionEngine();
    const worlds = engine.listWorlds();
    if (!worlds.length) {
      console.log("No worlds found. Use `nutshell evolve start --seed <file>` to create one.");
      return;
    }
    console.log(chalk.bold(`\nWorlds (${worlds.length}):`));
    worlds.forEach(w => {
      console.log(
        `  ${chalk.cyan(w.id)} — ${w.tradition_key} — ` +
        `Stage ${w.stage} — v${w.version} — ${w.pulse_count} pulses`
      );
    });
    engine.close();
  });

program.parse();
