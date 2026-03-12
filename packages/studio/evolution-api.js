/**
 * Vite plugin: evolution API middleware
 * Exposes /api/evolution/* routes backed by @nutshell/evolution (SQLite).
 */
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { spawn } from "child_process";
import { EvolutionEngine } from "@nutshell/evolution";

function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, CLAUDECODE: "" };
    const child = spawn("claude", ["-p", prompt], {
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "", err = "";
    child.stdout.on("data", d => (out += d));
    child.stderr.on("data", d => (err += d));
    child.on("close", code => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(err.trim() || `claude exited ${code}`));
    });
  });
}

function normalizeSeed(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw ?? {})) {
    if (Array.isArray(v))         out[k] = v.join("、");
    else if (typeof v === "string") out[k] = v;
    else if (v != null)           out[k] = String(v);
  }
  return out;
}

async function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => { try { resolve(JSON.parse(body || "{}")); } catch { resolve({}); } });
  });
}

function json(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(data));
}

let _engine = null;
const cfgPath = path.join(os.homedir(), ".nutshell", "config.json");

function readCfg() {
  try { return JSON.parse(fs.readFileSync(cfgPath, "utf-8")); } catch { return {}; }
}

function isMock(cfg) {
  return !(cfg.api_key || process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

function getEngine() {
  if (_engine) return _engine;
  const cfg = readCfg();
  const mock = isMock(cfg);

  const llm = mock
    ? { provider: "custom", model: "claude-cli", api_key: "mock", base_url: "http://localhost:5173/api/evo-mock" }
    : { provider: cfg.provider ?? "anthropic", model: cfg.model ?? "claude-sonnet-4-20250514", api_key: cfg.api_key ?? process.env.ANTHROPIC_API_KEY ?? process.env.OPENAI_API_KEY };

  const mockSearchFn = mock
    ? async (query) => {
        const snippet = `关于"${query}"的相关知识：此传统世界拥有丰富的神话体系与文化积淀，其中涉及神灵、人物与事件的复杂关系网络。`;
        return [
          { query, url: "mock://seed/1", title: query, snippet },
          { query, url: "mock://seed/2", title: `${query} — 延伸`, snippet: `"${query}"在该世界观中具有深远的象征意义，与核心矛盾张力相互呼应。` },
        ];
      }
    : undefined;

  _engine = new EvolutionEngine({
    llm,
    language: cfg.language === "auto" ? "zh" : (cfg.language ?? "zh"),
    ...(mockSearchFn ? { searchFn: mockSearchFn } : {}),
    skip_bifurcation: mock,
  });
  return _engine;
}

export function evolutionApiPlugin(seedsDir) {
  _engine = null;
  return {
    name: "evolution-api",
    configureServer(server) {

      // ── Unified LLM proxy for soul generation ────────────────────────────────
      // POST /api/llm/messages  →  proxies to Anthropic or Claude CLI
      server.middlewares.use("/api/llm/messages", async (req, res) => {
        if (req.method === "OPTIONS") {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-api-key,anthropic-version");
          res.statusCode = 204; return res.end();
        }
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        const cfg = readCfg();
        const apiKey = cfg.api_key || process.env.ANTHROPIC_API_KEY;
        const body = await parseBody(req);

        if (!apiKey) {
          // No key — use Claude CLI mock
          const msgs = body.messages ?? [];
          const sys = msgs.find(m => m.role === "system")?.content ?? "";
          const usr = msgs.filter(m => m.role === "user").map(m => m.content).join("\n");
          const prompt = sys ? `${sys}\n\n${usr}` : usr;
          try {
            const text = await callClaude(prompt);
            return json(res, { id: "mock-" + Date.now(), content: [{ type: "text", text }], model: "claude-cli", stop_reason: "end_turn", usage: { input_tokens: 0, output_tokens: 0 } });
          } catch(e) { return json(res, { error: { message: e.message } }, 500); }
        }

        // Forward to Anthropic
        try {
          const upstream = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify(body),
          });
          const data = await upstream.json();
          res.statusCode = upstream.status;
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(data));
        } catch(e) { json(res, { error: { message: e.message } }, 500); }
      });

      // ── Mock LLM endpoint (OpenAI-compatible chat completions via Claude CLI) ──
      // Always registered; only active when no real API key is configured.
      server.middlewares.use("/api/evo-mock/v1/chat/completions", async (req, res) => {
          if (!isMock(readCfg())) { res.statusCode = 404; return res.end(); }
          if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
            res.statusCode = 204; return res.end();
          }
          const body = await parseBody(req);
          const msgs = body.messages ?? [];
          const sys  = msgs.find(m => m.role === "system")?.content ?? "";
          const usr  = msgs.find(m => m.role === "user")?.content ?? "";
          const prompt = sys ? `${sys}\n\n${usr}` : usr;
          try {
            const text = await callClaude(prompt);
            json(res, {
              id: "evo-mock-" + Math.random().toString(36).slice(2),
              choices: [{ message: { role: "assistant", content: text }, finish_reason: "stop" }],
              usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            });
          } catch(e) {
            json(res, { error: { message: e.message } }, 500);
          }
        });

      server.middlewares.use("/api/evolution", async (req, res, next) => {
        // Connect strips the prefix, so req.url here is e.g. "/worlds"
        const urlObj  = new URL(req.url, "http://localhost");
        const p       = urlObj.pathname;
        const method  = req.method;

        // CORS preflight
        if (method === "OPTIONS") {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.statusCode = 204;
          return res.end();
        }

        try {
          const engine = await getEngine();

          // GET /worlds
          if (method === "GET" && p === "/worlds") {
            return json(res, engine.listWorlds());
          }

          // POST /worlds  { tradition }
          if (method === "POST" && p === "/worlds") {
            const { tradition } = await parseBody(req);
            if (!tradition) return json(res, { error: "tradition required" }, 400);
            const existing = engine.listWorlds().find(w => w.tradition_key === tradition);
            if (existing) return json(res, existing);
            let seed = {};
            try {
              const raw = JSON.parse(fs.readFileSync(path.join(seedsDir, `${tradition}.json`), "utf-8"));
              seed = normalizeSeed(raw);
            } catch { seed = { tradition_name: tradition }; }
            return json(res, engine.createWorld(tradition, seed));
          }

          // POST /worlds/:id/pulse
          const pulseM = p.match(/^\/worlds\/([^/]+)\/pulse$/);
          if (method === "POST" && pulseM) {
            const result = await engine.evolve(decodeURIComponent(pulseM[1]));
            return json(res, result);
          }

          // GET /worlds/:id/maturity
          const matM = p.match(/^\/worlds\/([^/]+)\/maturity$/);
          if (method === "GET" && matM) {
            return json(res, await engine.getMaturity(decodeURIComponent(matM[1]), true));
          }

          // GET /worlds/:id/history
          const histM = p.match(/^\/worlds\/([^/]+)\/history$/);
          if (method === "GET" && histM) {
            const limit = parseInt(urlObj.searchParams.get("limit") ?? "15");
            return json(res, engine.getHistory(decodeURIComponent(histM[1]), limit));
          }

          // GET /config
          if (method === "GET" && p === "/config") {
            let cfg = {};
            try { cfg = JSON.parse(fs.readFileSync(cfgPath, "utf-8")); } catch {}
            // Mask api_key
            return json(res, {
              provider: cfg.provider ?? "anthropic",
              model: cfg.model ?? "claude-sonnet-4-20250514",
              api_key: cfg.api_key ? "••••" + cfg.api_key.slice(-4) : "",
              language: cfg.language ?? "zh",
              has_key: !!(cfg.api_key || process.env.ANTHROPIC_API_KEY),
            });
          }

          // POST /config
          if (method === "POST" && p === "/config") {
            const body = await parseBody(req);
            let existing = {};
            try { existing = JSON.parse(fs.readFileSync(cfgPath, "utf-8")); } catch {}
            const next = { ...existing };
            if (body.provider) next.provider = body.provider;
            if (body.model)    next.model    = body.model;
            if (body.api_key && !body.api_key.startsWith("••••")) next.api_key = body.api_key;
            if (body.language) next.language = body.language;
            fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
            fs.writeFileSync(cfgPath, JSON.stringify(next, null, 2));
            _engine = null; // force re-init with new config
            return json(res, { ok: true });
          }

          // DELETE /worlds/:id
          const delM = p.match(/^\/worlds\/([^/]+)$/);
          if (method === "DELETE" && delM) {
            engine.deleteWorld(decodeURIComponent(delM[1]));
            return json(res, { ok: true });
          }

          // POST /worlds/:id/reset
          const resetM = p.match(/^\/worlds\/([^/]+)\/reset$/);
          if (method === "POST" && resetM) {
            engine.resetWorld(decodeURIComponent(resetM[1]));
            return json(res, engine.getWorld(decodeURIComponent(resetM[1])));
          }

          next();
        } catch (err) {
          console.error("[evolution-api]", err.message);
          json(res, { error: err.message }, 500);
        }
      });
    },
  };
}
