/**
 * @nutshell/adapter-openclaw
 *
 * Exports a SoulBundle to OpenClaw's file structure:
 *   ~/.openclaw/soul.md
 *   ~/.openclaw/memory/{character}-init.md
 *   ~/.openclaw/skills/{character}-core.md
 */
import type { NutshellAdapter, SoulBundle, ExportResult } from "@nutshell/core";
export declare class OpenClawAdapter implements NutshellAdapter {
    name: string;
    description: string;
    platforms: string[];
    export(bundle: SoulBundle, outputDir: string): Promise<ExportResult>;
}
declare const _default: OpenClawAdapter;
export default _default;
