/**
 * @nutshell/adapter-openclaw
 *
 * Exports a SoulBundle to OpenClaw's file structure:
 *   ~/.openclaw/soul.md
 *   ~/.openclaw/memory/{character}-init.md
 *   ~/.openclaw/skills/{character}-core.md
 */

import * as fs from "fs/promises";
import * as path from "path";
import type { NutshellAdapter, SoulBundle, ExportResult } from "@nutshell/core";

const slug = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

export class OpenClawAdapter implements NutshellAdapter {
  name = "openclaw";
  description = "Export to OpenClaw's soul/memory/skills directory structure";
  platforms = ["openclaw >= 0.2.0"];

  async export(bundle: SoulBundle, outputDir: string): Promise<ExportResult> {
    const { soul, files } = bundle;
    const name = slug(soul.character_name);
    const dir = outputDir.replace("~", process.env.HOME || "~");

    // Ensure directories exist
    await fs.mkdir(path.join(dir), { recursive: true });
    await fs.mkdir(path.join(dir, "memory"), { recursive: true });
    await fs.mkdir(path.join(dir, "skills"), { recursive: true });

    const soulPath = path.join(dir, "soul.md");
    const memoryPath = path.join(dir, "memory", `${name}-init.md`);
    const skillPath = path.join(dir, "skills", `${name}-core.md`);

    await fs.writeFile(soulPath, files.soul_md, "utf-8");
    await fs.writeFile(memoryPath, files.memory_md, "utf-8");
    await fs.writeFile(skillPath, files.skill_md, "utf-8");

    return {
      files: [
        { path: soulPath, description: "Character soul (personality kernel)" },
        { path: memoryPath, description: "Initial memory seeds" },
        { path: skillPath, description: "Core behavioral skill" },
      ],
      install_command: `openclaw restart`,
      notes: `Soul installed. Run 'openclaw restart' to activate ${soul.character_name}.`,
    };
  }
}

export default new OpenClawAdapter();
