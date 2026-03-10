/**
 * @nutshell/adapter-sillytavern
 *
 * Exports a SoulBundle to SillyTavern's character card format (V2).
 * Character cards are PNG files with embedded JSON metadata.
 *
 * Spec: https://github.com/malfoyslastname/character-card-spec-v2
 */
import type { NutshellAdapter, SoulBundle, ExportResult } from "@nutshell/core";
export declare class SillyTavernAdapter implements NutshellAdapter {
    name: string;
    description: string;
    platforms: string[];
    export(bundle: SoulBundle, outputDir: string): Promise<ExportResult>;
}
declare const _default: SillyTavernAdapter;
export default _default;
