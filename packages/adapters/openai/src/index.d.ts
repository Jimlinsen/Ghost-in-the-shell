/**
 * @nutshell/adapter-openai
 *
 * Exports a SoulBundle as an OpenAI Assistants configuration.
 * Outputs a JSON config you can POST to /v1/assistants,
 * plus knowledge files for file_search.
 */
import type { NutshellAdapter, SoulBundle, ExportResult } from "@nutshell/core";
export declare class OpenAIAdapter implements NutshellAdapter {
    name: string;
    description: string;
    platforms: string[];
    export(bundle: SoulBundle, outputDir: string): Promise<ExportResult>;
}
declare const _default: OpenAIAdapter;
export default _default;
