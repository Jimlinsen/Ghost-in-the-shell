import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TRADITIONS = [
  { id: "greek",         label: "古希腊",     glyph: "☽",  color: "#7eb8d4", sub: "Olympic Pantheon" },
  { id: "norse",         label: "北欧神话",   glyph: "ᚱ",  color: "#9b8ecf", sub: "Norse Mythology" },
  { id: "fengshen",      label: "封神演义",   glyph: "☯",  color: "#d4976a", sub: "Investiture of Gods" },
  { id: "vedic",         label: "印度吠陀",   glyph: "ॐ",  color: "#d4b96a", sub: "Vedic Tradition" },
  { id: "egyptian",      label: "埃及神话",   glyph: "𓂀", color: "#c9a84c", sub: "Kemetic" },
  { id: "mesopotamian",  label: "美索不达米亚",glyph: "𒀭", color: "#b07a5a", sub: "Sumerian-Akkadian" },
  { id: "celtic",        label: "凯尔特",     glyph: "᛫",  color: "#7dba8a", sub: "Celtic Mythology" },
  { id: "shinto",        label: "日本神道",   glyph: "⛩", color: "#e8a0a0", sub: "Shinto" },
  { id: "taoist",        label: "道教神话",   glyph: "⊙",  color: "#a8c5d4", sub: "Taoist Mythology" },
  { id: "mayan",         label: "玛雅宇宙",   glyph: "❋",  color: "#8ecf9b", sub: "Maya Cosmology" },
  { id: "tibetan",       label: "藏传密教",   glyph: "ༀ",  color: "#cf9b8e", sub: "Vajrayana" },
  { id: "aztec",         label: "阿兹特克",   glyph: "✦",  color: "#d4c06a", sub: "Aztec Cosmology" },
];

const SEED_DIMS = [
  { key: "cosmogony",    zh: "创世论",    icon: "◎" },
  { key: "ontology",     zh: "存在层级",  icon: "⟁" },
  { key: "time",         zh: "时间观",    icon: "◈" },
  { key: "fate",         zh: "命运意志",  icon: "⋈" },
  { key: "divine_human", zh: "人神关系",  icon: "⟡" },
  { key: "death",        zh: "死亡彼岸",  icon: "◇" },
  { key: "tension",      zh: "核心张力",  icon: "⚡" },
  { key: "aesthetic",    zh: "美学DNA",   icon: "✦" },
  { key: "symbols",      zh: "关键符号",  icon: "⊕" },
  { key: "seed_essence", zh: "种子精髓",  icon: "◉" },
];

const SOUL_TABS = [
  { key: "soul",     label: "soul.md",     icon: "◈", path: "~/.openclaw/soul.md" },
  { key: "memory",   label: "memory.md",   icon: "⊙", path: "~/.openclaw/memory/init.md" },
  { key: "skill",    label: "skill.md",    icon: "⟡", path: "~/.openclaw/skills/core.md" },
];

// ─── PROMPTS ──────────────────────────────────────────────────────────────────

const WORLD_PROMPT = `你是世界种子生成器，精通神话学（坎贝尔,埃利亚德）,比较宗教学（缪勒,奥托）,民俗文学（普罗普）。

"世界种子"是世界的意识形态基底——让这个世界成为它自己的规定性，不是世界设定，是感知框架。

输出严格JSON（只输出JSON，无其他内容，所有字段中文，每字段80-150字）：
{
  "tradition_name": "传统名称",
  "tagline": "一句诗意的世界精髓（15字内）",
  "cosmogony": "创世论：这个世界如何诞生？混沌/虚无/牺牲/意志？创世的根本逻辑与代价。",
  "ontology": "存在层级：神-人-物的结构，边界的渗透性，存在等级的正当性来源。",
  "time": "时间观：线性/循环/螺旋？时间有终点吗？英雄时代与衰退的关系。",
  "fate": "命运与意志：谁被命运支配，谁能反抗，反抗的代价与意义。",
  "divine_human": "人神关系：神是父母/合约方/捕食者/同类？人如何接近或成为神？",
  "death": "死亡与彼岸：死亡的本质，彼岸的形态，死与生的辩证关系。",
  "tension": "核心张力：驱动一切叙事的根本冲突，永远无法解决只能重演的那个矛盾。",
  "aesthetic": "美学DNA：这个世界的感知质地——颜色,节奏,声音,气味,材质。如果是音乐，是什么调性？",
  "symbols": "关键符号：5个核心意象，每个用一句话说明它在这个世界中承载的意义密度。",
  "seed_essence": "种子精髓（200字）：读完这段，应能感受到这个世界的呼吸方式——它的意识形态基底是什么思想力量的凝聚？"
}`;

const makeSoulPrompt = (worldSeed, character, context) => `你是灵犀涵化炉，精通神话学,唯识学,角色溯源。

世界种子（宇宙的意识形态基底）：
${JSON.stringify(worldSeed, null, 2)}

角色：${character}
${context ? `背景：${context}` : ""}

核心原则：角色是世界种子通过特定存在的涌现。角色的每一个特质都必须能追溯到世界种子的某个维度。

输出严格JSON（只输出JSON，所有字段中文）：
{
  "character_name": "角色名",
  "world_bond": "这个角色是[世界意识形态基底]的具身——一句话说清他与世界种子的关系（30字内）",
  "essence": "本质定义：让他成为他而非其他角色的规定性，来自世界种子的哪个维度（100字）",
  "ideological_root": "意识形态根系：世界的创世论/时间观/人神关系如何塑造了他的世界观（120字）",
  "voice": "声音：说话方式——节奏,长短,温度,口头禅的由来（80字）",
  "catchphrases": ["来自原著/传统的标志性台词1","台词2","台词3","台词4","台词5"],
  "stance": "核心立场：他最在乎的价值排序，来自世界种子的张力结构（100字）",
  "taboos": "绝对禁止：他永远不会做的3件事，及其世界观根源（80字）",
  "world_model": "世界模型：他用世界种子的框架如何理解当前处境——3-5条具体认知（100字）",
  "formative_events": "塑造事件：3个来自他所在传统/原著的关键时刻，每个30字（100字）",
  "current_concerns": "当前关切：他现在最在意的3件事，具体可操作（80字）",
  "knowledge_boundary": "知识边界：他精通什么，不知道/不关心什么（60字）",
  "activation": "激活条件：什么情况下他出现，什么信号触发他（80字）",
  "cognitive_style": "认知风格：由世界种子思想谱系决定的处理方式——输入/推理/输出（80字）",
  "core_capabilities": "核心能力：他最擅长的3类任务及标准（100字）",
  "failure_modes": "失败模式：他容易犯的2个错及预防（60字）"
}`;

// ─── CANVAS STARFIELD ─────────────────────────────────────────────────────────

function useStarField(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.008,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() * 0.001;
      stars.forEach(s => {
        const a = (Math.sin(s.phase + t * s.speed) + 1) / 2 * 0.55 + 0.08;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,185,140,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
}

// ─── ORBITAL MANDALA ─────────────────────────────────────────────────────────

function OrbitalMandala({ worldSeed, characterName, accentColor, phase }) {
  const rings = [
    { dims: [0,1,2], r: 90,  dur: 22 },
    { dims: [3,4,5,6], r: 140, dur: 34, rev: true },
    { dims: [7,8,9], r: 188, dur: 48 },
  ];

  return (
    <div style={{ position: "relative", width: 420, height: 420, margin: "0 auto" }}>
      {/* Rings */}
      {rings.map((ring, ri) => (
        <div key={ri} style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: ring.r * 2, height: ring.r * 2,
          marginLeft: -ring.r, marginTop: -ring.r,
          borderRadius: "50%",
          border: `1px solid ${accentColor}28`,
          animation: `spin-mandala ${ring.dur}s linear infinite ${ring.rev ? "reverse" : ""}`,
        }}>
          {ring.dims.map((di, i) => {
            const angle = (i / ring.dims.length) * Math.PI * 2;
            const x = Math.cos(angle) * ring.r + ring.r - 18;
            const y = Math.sin(angle) * ring.r + ring.r - 18;
            const dim = SEED_DIMS[di];
            const visible = phase === "world" || phase === "soul" || phase === "complete";
            return (
              <div key={di} style={{
                position: "absolute", left: x, top: y,
                width: 36, height: 36,
                borderRadius: "50%",
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}55`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.8s",
                animation: ring.rev
                  ? `counter-spin ${ring.dur}s linear infinite`
                  : `counter-spin-rev ${ring.dur}s linear infinite`,
              }}>
                <div style={{ fontSize: 11, color: accentColor }}>{dim.icon}</div>
                <div style={{ fontSize: 7, color: `${accentColor}99`, letterSpacing: 0.5, marginTop: 1 }}>{dim.zh}</div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Center glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 64, height: 64, borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
        border: `1px solid ${accentColor}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
        transition: "all 0.6s",
      }}>
        {phase === "complete" && characterName ? (
          <>
            <div style={{ fontSize: 10, color: accentColor, letterSpacing: 1, textAlign: "center", padding: "0 4px", lineHeight: 1.3 }}>
              {characterName}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 18, color: `${accentColor}88` }}>◎</div>
        )}
      </div>

      {/* Pulse rings when generating */}
      {(phase === "gen_world" || phase === "gen_soul") && [0,1,2].map(i => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 64, height: 64, borderRadius: "50%",
          border: `1px solid ${accentColor}`,
          animation: `pulse-out 1.8s ease-out infinite`,
          animationDelay: `${i * 0.6}s`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

// ─── SOUL FILE BUILDER ────────────────────────────────────────────────────────

function buildSoulMd(soul, world) {
  if (!soul) return "";
  return `# ${soul.character_name} — Soul Configuration
> 灵犀涵化炉 · 果壳中的宇宙 | 世界：${world?.tradition_name || ""}

---

## World Bond

${soul.world_bond}

---

## Ideological Root

${soul.ideological_root}

---

## Essence

${soul.essence}

---

## Core Stance

${soul.stance}

---

## Voice & Catchphrases

${soul.voice}

${(soul.catchphrases || []).map(p => `- "${p}"`).join("\n")}

---

## Absolute Rules

${soul.taboos}
`;
}

function buildMemoryMd(soul, world) {
  if (!soul) return "";
  return `# ${soul.character_name} — Memory Seeds
> 世界：${world?.tradition_name || ""} | 意识形态基底注入

---

## World Model

${soul.world_model}

---

## Formative Events

${soul.formative_events}

---

## Current Concerns

${soul.current_concerns}

---

## Knowledge Boundary

${soul.knowledge_boundary}

---
*种子来自 ${world?.tradition_name || ""}的宇宙逻辑。种子无我，种子生现行。*
`;
}

function buildSkillMd(soul, world) {
  if (!soul) return "";
  return `# ${soul.character_name} — Core Skill
> 认知风格由 ${world?.tradition_name || ""} 的思想谱系决定

---

## Activation

${soul.activation}

---

## Cognitive Style

${soul.cognitive_style}

---

## Core Capabilities

${soul.core_capabilities}

---

## Failure Modes

${soul.failure_modes}
`;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function NutshellUniverse() {
  const canvasRef = useRef(null);
  useStarField(canvasRef);

  const [phase, setPhase] = useState("select"); // select|gen_world|world|input|gen_soul|complete
  const [selectedTrad, setSelectedTrad] = useState(null);
  const [customWorld, setCustomWorld] = useState("");
  const [worldSeed, setWorldSeed] = useState(null);
  const [worldDimView, setWorldDimView] = useState(0);

  const [charName, setCharName] = useState("");
  const [charContext, setCharContext] = useState("");
  const [soulData, setSoulData] = useState(null);
  const [activeTab, setActiveTab] = useState("soul");

  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  const accentColor = selectedTrad
    ? TRADITIONS.find(t => t.id === selectedTrad)?.color || "#c9a84c"
    : "#c9a84c";

  // ── Generate World ──
  const generateWorld = useCallback(async () => {
    setPhase("gen_world");
    setError(null);
    const trad = selectedTrad ? TRADITIONS.find(t => t.id === selectedTrad) : null;

    // Preset tradition: load pre-generated seed directly
    if (trad && !customWorld.trim()) {
      try {
        const res = await fetch(`/seeds/${trad.id}.json`);
        if (!res.ok) throw new Error("seed file not found");
        const seed = await res.json();
        setWorldSeed(seed);
        setWorldDimView(0);
        setPhase("world");
        return;
      } catch {
        // fallthrough to API generation
      }
    }

    // Custom input or missing seed file: call AI
    const query = customWorld.trim() || (trad ? `${trad.label}（${trad.sub}）` : "");
    try {
      const res = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: WORLD_PROMPT,
          messages: [{ role: "user", content: `生成世界种子：${query}` }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("格式异常");
      setWorldSeed(JSON.parse(match[0]));
      setWorldDimView(0);
      setPhase("world");
    } catch (e) {
      setError(e.message);
      setPhase("select");
    }
  }, [selectedTrad, customWorld]);

  // ── Generate Soul ──
  const generateSoul = useCallback(async () => {
    if (!charName.trim() || !worldSeed) return;
    setPhase("gen_soul");
    setError(null);
    try {
      const res = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: makeSoulPrompt(worldSeed, charName.trim(), charContext.trim()),
          }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("格式异常");
      setSoulData(JSON.parse(match[0]));
      setActiveTab("soul");
      setPhase("complete");
    } catch (e) {
      setError(e.message);
      setPhase("world");
    }
  }, [worldSeed, charName, charContext]);

  const fileInputRef = useRef(null);

  const copyFile = (content, id) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const downloadFile = (content, filename, type = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const saveWorldSeed = () => {
    if (!worldSeed) return;
    const name = (worldSeed.tradition_name || "world-seed").replace(/\s+/g, "-");
    downloadFile(JSON.stringify(worldSeed, null, 2), `${name}.json`, "application/json");
  };

  const saveSoulFiles = () => {
    if (!soulData) return;
    const name = (soulData.character_name || "soul").replace(/\s+/g, "-");
    downloadFile(soulFiles.soul.content,   `${name}-soul.md`);
    downloadFile(soulFiles.memory.content, `${name}-memory.md`);
    downloadFile(soulFiles.skill.content,  `${name}-skill.md`);
  };

  const loadWorldSeedFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const seed = JSON.parse(ev.target.result);
        if (!seed.tradition_name) throw new Error("缺少 tradition_name 字段");
        setWorldSeed(seed);
        setWorldDimView(0);
        setSoulData(null); setCharName(""); setCharContext("");
        setPhase("world");
        setError(null);
      } catch (err) {
        setError(`读取失败：${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const reset = () => {
    setPhase("select"); setSelectedTrad(null); setCustomWorld("");
    setWorldSeed(null); setCharName(""); setCharContext("");
    setSoulData(null); setError(null);
  };

  const soulFiles = {
    soul:   { content: buildSoulMd(soulData, worldSeed),   ...SOUL_TABS[0] },
    memory: { content: buildMemoryMd(soulData, worldSeed), ...SOUL_TABS[1] },
    skill:  { content: buildSkillMd(soulData, worldSeed),  ...SOUL_TABS[2] },
  };

  const isGenerating = phase === "gen_world" || phase === "gen_soul";

  return (
    <div style={{
      minHeight: "100vh", background: "#060510", color: "#ddd0a8",
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes spin-mandala { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes counter-spin { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes counter-spin-rev { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse-out { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.8} 100%{transform:translate(-50%,-50%) scale(3.5);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
        .fade-up { animation: fadeUp 0.5s ease forwards; opacity:0; }
        .dim-btn:hover { background: rgba(255,255,255,0.04) !important; }
        .trad-btn:hover { opacity: 1 !important; }
        .copy-btn:hover { opacity: 1 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2a2518; border-radius: 2px; }
      `}</style>

      {/* Canvas starfield */}
      <canvas ref={canvasRef} style={{
        position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── HEADER ── */}
        <header style={{ textAlign: "center", padding: "44px 0 32px", borderBottom: "1px solid #1a1628" }}>
          <div style={{ fontSize: 10, letterSpacing: 7, color: "#2e2820", textTransform: "uppercase", marginBottom: 8 }}>
            灵犀涵化炉 · 宇宙观测仪
          </div>
          <h1 style={{
            fontSize: 30, fontWeight: "normal", margin: "0 0 8px",
            color: accentColor, letterSpacing: 3,
            textShadow: `0 0 50px ${accentColor}44`,
            transition: "color 0.6s, text-shadow 0.6s",
          }}>
            果壳中的宇宙
          </h1>
          <div style={{ fontSize: 12, color: "#3a3220", letterSpacing: 2 }}>
            Universe in a Nutshell
          </div>

          {/* Phase indicator */}
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 24 }}>
            {[
              { id: "select", label: "选择宇宙" },
              { id: "world",  label: "世界种子" },
              { id: "complete", label: "果壳显现" },
            ].map((p, i) => {
              const active = (p.id === "select" && (phase === "select" || phase === "gen_world")) ||
                             (p.id === "world" && (phase === "world" || phase === "input" || phase === "gen_soul")) ||
                             (p.id === "complete" && phase === "complete");
              const done = (i === 0 && ["world","input","gen_soul","complete"].includes(phase)) ||
                           (i === 1 && phase === "complete");
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    padding: "5px 16px", fontSize: 11, letterSpacing: 1,
                    color: active ? accentColor : done ? "#4a3f25" : "#1e1a20",
                    borderBottom: `2px solid ${active ? accentColor : done ? "#3a3020" : "transparent"}`,
                    transition: "all 0.4s",
                  }}>
                    {p.label}
                  </div>
                  {i < 2 && <div style={{ width: 20, height: 1, background: "#1a1628" }} />}
                </div>
              );
            })}
          </div>
        </header>

        {/* ── SELECT PHASE ── */}
        {(phase === "select" || phase === "gen_world") && (
          <div className="fade-up" style={{ paddingTop: 36 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#2e2820", textTransform: "uppercase", textAlign: "center", marginBottom: 22 }}>
              选择宇宙的意识形态基底
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))", gap: 8, marginBottom: 28 }}>
              {TRADITIONS.map(t => (
                <button
                  key={t.id}
                  className="trad-btn"
                  onClick={() => { setSelectedTrad(t.id === selectedTrad ? null : t.id); setCustomWorld(""); }}
                  disabled={isGenerating}
                  style={{
                    background: selectedTrad === t.id ? `${t.color}10` : "transparent",
                    cursor: "pointer", fontFamily: "inherit",
                    border: `1px solid ${selectedTrad === t.id ? t.color : "#1a1628"}`,
                    borderRadius: 3, padding: "12px 8px", textAlign: "center",
                    opacity: selectedTrad && selectedTrad !== t.id ? 0.4 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 18, color: t.color, marginBottom: 5, opacity: selectedTrad === t.id ? 1 : 0.5 }}>{t.glyph}</div>
                  <div style={{ fontSize: 12, color: selectedTrad === t.id ? t.color : "#5a5030" }}>{t.label}</div>
                  <div style={{ fontSize: 9, color: "#2e2820", letterSpacing: 0.5, marginTop: 2 }}>{t.sub}</div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "#1a1628" }} />
              <span style={{ fontSize: 10, color: "#2e2820", letterSpacing: 3 }}>或输入任意传统</span>
              <div style={{ flex: 1, height: 1, background: "#1a1628" }} />
            </div>

            <input
              value={customWorld}
              onChange={e => { setCustomWorld(e.target.value); if (e.target.value) setSelectedTrad(null); }}
              placeholder='如: 波斯琐罗亚斯德教 x 赫梯神话 / 苗族洪水宇宙学 ...'
              disabled={isGenerating}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#0a0915", border: "1px solid #1a1628",
                color: "#ddd0a8", padding: "13px 15px",
                fontSize: 13, fontFamily: "inherit", borderRadius: 3, outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#3a3020"}
              onBlur={e => e.target.style.borderColor = "#1a1628"}
            />

            {error && <div style={{ textAlign: "center", color: "#7a3535", fontSize: 12, marginTop: 14 }}>✕ {error}</div>}

            <div style={{ textAlign: "center", marginTop: 28 }}>
              {phase === "gen_world" ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
                    {["推演","宇宙","创世","张力","美学","种子"].map((w, i) => (
                      <span key={w} style={{
                        fontSize: 10, color: accentColor, padding: "3px 7px",
                        border: `1px solid ${accentColor}33`, borderRadius: 2,
                        opacity: 0, animation: `fadeUp 0.4s ease forwards`,
                        animationDelay: `${i * 0.2}s`,
                      }}>{w}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#3a3020", letterSpacing: 2 }}>宇宙正在成形...</div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={loadWorldSeedFile}
                  style={{ display: "none" }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: "none", border: "1px solid #2a2228", color: "#3a3020",
                    padding: "12px 20px", fontSize: 11, letterSpacing: 1,
                    cursor: "pointer", borderRadius: 3, fontFamily: "inherit",
                  }}
                >⊙ 读取种子</button>
                <button
                  onClick={generateWorld}
                  disabled={!selectedTrad && !customWorld.trim()}
                  style={{
                    background: (selectedTrad || customWorld.trim()) ? `${accentColor}18` : "none",
                    border: `1px solid ${(selectedTrad || customWorld.trim()) ? accentColor : "#1a1628"}`,
                    color: (selectedTrad || customWorld.trim()) ? accentColor : "#1e1a20",
                    padding: "12px 44px", fontSize: 13, letterSpacing: 2,
                    cursor: (selectedTrad || customWorld.trim()) ? "pointer" : "default",
                    borderRadius: 3, fontFamily: "inherit", transition: "all 0.3s",
                    textShadow: (selectedTrad || customWorld.trim()) ? `0 0 20px ${accentColor}66` : "none",
                  }}
                >
                  ◎ 观测世界种子
                </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── WORLD PHASE ── */}
        {(phase === "world" || phase === "input" || phase === "gen_soul") && worldSeed && (
          <div className="fade-up" style={{ paddingTop: 32 }}>
            {/* World header */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 5, color: "#2e2820", textTransform: "uppercase", marginBottom: 8 }}>世界种子已显现</div>
              <h2 style={{ fontSize: 22, fontWeight: "normal", color: accentColor, letterSpacing: 2, margin: "0 0 8px",
                textShadow: `0 0 30px ${accentColor}44` }}>
                {worldSeed.tradition_name}
              </h2>
              <div style={{ fontSize: 13, color: "#7a6a42", fontStyle: "italic" }}>「{worldSeed.tagline}」</div>
            </div>

            {/* Two column: mandala + dims */}
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28 }}>
              {/* Mandala */}
              <div style={{ flexShrink: 0, width: 420 }}>
                <OrbitalMandala worldSeed={worldSeed} characterName={null} accentColor={accentColor} phase="world" />
              </div>

              {/* Dimensions */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                  {SEED_DIMS.map((d, i) => (
                    <button key={d.key} className="dim-btn" onClick={() => setWorldDimView(i)} style={{
                      background: worldDimView === i ? `${accentColor}20` : "none",
                      border: `1px solid ${worldDimView === i ? accentColor : "#1a1628"}`,
                      color: worldDimView === i ? accentColor : "#3a3220",
                      padding: "4px 9px", fontSize: 11, cursor: "pointer",
                      borderRadius: 2, fontFamily: "inherit", transition: "all 0.15s",
                    }}>
                      {d.icon} {d.zh}
                    </button>
                  ))}
                </div>

                <div style={{
                  background: "#0a0915", border: `1px solid ${accentColor}18`,
                  borderRadius: 3, padding: "18px 20px", minHeight: 180,
                }}>
                  <div style={{ fontSize: 12, color: accentColor, marginBottom: 10, letterSpacing: 1 }}>
                    {SEED_DIMS[worldDimView].icon} {SEED_DIMS[worldDimView].zh}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.9, color: "#b0a47a" }}>
                    {worldSeed[SEED_DIMS[worldDimView].key]}
                  </div>
                </div>
              </div>
            </div>

            {/* Character input */}
            <div style={{
              background: "#08070f", border: `1px solid ${accentColor}22`,
              borderRadius: 4, padding: "22px 24px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#2e2820", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>
                从这个宇宙中召唤一个存在
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#3a3020", marginBottom: 6, textTransform: "uppercase" }}>存在之名</div>
                  <input
                    value={charName}
                    onChange={e => setCharName(e.target.value)}
                    placeholder="如：福尔摩斯,奥德修斯,哪吒..."
                    disabled={phase === "gen_soul"}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "#060510", border: "1px solid #1a1628",
                      color: "#ddd0a8", padding: "11px 13px",
                      fontSize: 13, fontFamily: "inherit", borderRadius: 2, outline: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = accentColor + "55"}
                    onBlur={e => e.target.style.borderColor = "#1a1628"}
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#3a3020", marginBottom: 6, textTransform: "uppercase" }}>背景（可选）</div>
                <textarea
                  value={charContext}
                  onChange={e => setCharContext(e.target.value)}
                  placeholder="角色的具体形态,时代位置,与世界种子的特殊关系..."
                  rows={2}
                  disabled={phase === "gen_soul"}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#060510", border: "1px solid #1a1628",
                    color: "#ddd0a8", padding: "11px 13px",
                    fontSize: 13, fontFamily: "inherit", borderRadius: 2, outline: "none",
                    resize: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = accentColor + "55"}
                  onBlur={e => e.target.style.borderColor = "#1a1628"}
                />
              </div>

              {error && <div style={{ color: "#7a3535", fontSize: 11, marginTop: 10, textAlign: "center" }}>✕ {error}</div>}

              <div style={{ textAlign: "center", marginTop: 18 }}>
                {phase === "gen_soul" ? (
                  <div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 10 }}>
                      {["种子","涌现","灵魂","记忆","行为","成形"].map((w, i) => (
                        <span key={w} style={{
                          fontSize: 10, color: accentColor, padding: "3px 6px",
                          border: `1px solid ${accentColor}33`, borderRadius: 2,
                          opacity: 0, animation: `fadeUp 0.4s ease forwards`,
                          animationDelay: `${i * 0.2}s`,
                        }}>{w}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "#3a3020", letterSpacing: 2 }}>存在正在从宇宙中结晶...</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <button onClick={() => { reset(); }} style={{
                      background: "none", border: "1px solid #1a1628", color: "#3a3020",
                      padding: "9px 22px", fontSize: 11, letterSpacing: 1, cursor: "pointer",
                      borderRadius: 2, fontFamily: "inherit",
                    }}>← 重选宇宙</button>
                    <button onClick={saveWorldSeed} style={{
                      background: "none", border: `1px solid ${accentColor}44`, color: accentColor,
                      padding: "9px 22px", fontSize: 11, letterSpacing: 1, cursor: "pointer",
                      borderRadius: 2, fontFamily: "inherit",
                    }}>↓ 保存种子</button>
                    <button
                      onClick={generateSoul}
                      disabled={!charName.trim()}
                      style={{
                        background: charName.trim() ? `${accentColor}18` : "none",
                        border: `1px solid ${charName.trim() ? accentColor : "#1a1628"}`,
                        color: charName.trim() ? accentColor : "#1e1a20",
                        padding: "9px 32px", fontSize: 12, letterSpacing: 2,
                        cursor: charName.trim() ? "pointer" : "default",
                        borderRadius: 2, fontFamily: "inherit", transition: "all 0.3s",
                      }}
                    >
                      ✦ 涵化灵魂
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── COMPLETE PHASE ── */}
        {phase === "complete" && soulData && worldSeed && (
          <div className="fade-up" style={{ paddingTop: 28 }}>
            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 5, color: "#2e2820", textTransform: "uppercase", marginBottom: 8 }}>
                果壳已成形
              </div>
              <h2 style={{ fontSize: 24, fontWeight: "normal", color: accentColor, letterSpacing: 2, margin: "0 0 6px",
                textShadow: `0 0 30px ${accentColor}55` }}>
                {soulData.character_name}
              </h2>
              <div style={{
                fontSize: 13, color: "#7a6a42", fontStyle: "italic",
                maxWidth: 500, margin: "0 auto", lineHeight: 1.7,
              }}>
                {soulData.world_bond}
              </div>
            </div>

            {/* Three-column layout */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

              {/* Left: mandala + world seed mini */}
              <div style={{ width: 200, flexShrink: 0 }}>
                <OrbitalMandala
                  worldSeed={worldSeed}
                  characterName={soulData.character_name}
                  accentColor={accentColor}
                  phase="complete"
                />
                <div style={{
                  background: "#0a0915", border: `1px solid ${accentColor}18`,
                  borderRadius: 3, padding: "12px", marginTop: 12,
                }}>
                  <div style={{ fontSize: 10, color: accentColor, letterSpacing: 1, marginBottom: 6 }}>宇宙来源</div>
                  <div style={{ fontSize: 11, color: "#5a5030", marginBottom: 4 }}>{worldSeed.tradition_name}</div>
                  <div style={{ fontSize: 10, color: "#3a3020", fontStyle: "italic", lineHeight: 1.5 }}>「{worldSeed.tagline}」</div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #1a1628" }}>
                    <div style={{ fontSize: 10, color: "#3a3020", lineHeight: 1.7 }}>
                      {worldSeed.seed_essence?.slice(0, 120)}...
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: soul files */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid #1a1628", marginBottom: 0 }}>
                  {SOUL_TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                      flex: 1, background: "none", border: "none",
                      borderBottom: `2px solid ${activeTab === tab.key ? accentColor : "transparent"}`,
                      color: activeTab === tab.key ? accentColor : "#3a3020",
                      padding: "9px 0", fontSize: 12, letterSpacing: 1,
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    }}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {/* File content */}
                <div style={{
                  background: "#060510", border: `1px solid ${accentColor}18`,
                  borderTop: "none", borderRadius: "0 0 3px 3px",
                }}>
                  {/* Path bar */}
                  <div style={{
                    padding: "7px 14px", borderBottom: "1px solid #1a1628",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 10, color: "#3a3020", fontFamily: "monospace" }}>
                      {soulFiles[activeTab].path}
                    </span>
                    <button
                      className="copy-btn"
                      onClick={() => copyFile(soulFiles[activeTab].content, activeTab)}
                      style={{
                        background: copied === activeTab ? "#0a1a00" : "none",
                        border: `1px solid ${copied === activeTab ? "#4a7a10" : "#1a1628"}`,
                        color: copied === activeTab ? "#7abd40" : "#3a3020",
                        padding: "3px 10px", fontSize: 10, cursor: "pointer",
                        borderRadius: 2, fontFamily: "inherit", opacity: 0.7,
                        transition: "all 0.2s",
                      }}
                    >
                      {copied === activeTab ? "✓ 已复制" : "复制"}
                    </button>
                  </div>

                  <pre style={{
                    margin: 0, padding: "16px 18px",
                    fontSize: 11, lineHeight: 1.9, color: "#8a7d55",
                    fontFamily: "monospace", whiteSpace: "pre-wrap",
                    wordBreak: "break-word", maxHeight: 380, overflowY: "auto",
                  }}>
                    {soulFiles[activeTab].content}
                  </pre>
                </div>

                {/* Install */}
                <div style={{
                  marginTop: 12, background: "#060510",
                  border: "1px solid #1a1628", borderRadius: 3, padding: "14px 16px",
                }}>
                  <div style={{ fontSize: 10, color: "#2e2820", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>安装</div>
                  {[
                    `cp soul-${(soulData.character_name||"char").replace(/\s/g,"-")}.md ~/.openclaw/soul.md`,
                    `cp memory-${(soulData.character_name||"char").replace(/\s/g,"-")}.md ~/.openclaw/memory/init.md`,
                    `cp skill-${(soulData.character_name||"char").replace(/\s/g,"-")}.md ~/.openclaw/skills/core.md`,
                    `openclaw restart`,
                  ].map((cmd, i) => (
                    <code key={i} style={{
                      display: "block", fontSize: 11, fontFamily: "monospace",
                      color: cmd.startsWith("openclaw") ? "#3a3020" : "#5a7a30",
                      lineHeight: 1.8,
                    }}>{cmd}</code>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28 }}>
              <button onClick={reset} style={{
                background: "none", border: "1px solid #1a1628", color: "#3a3020",
                padding: "9px 24px", fontSize: 11, letterSpacing: 1, cursor: "pointer",
                borderRadius: 2, fontFamily: "inherit",
              }}>← 重新观测</button>
              <button onClick={() => { setPhase("world"); setSoulData(null); setCharName(""); setCharContext(""); }} style={{
                background: "none", border: `1px solid ${accentColor}44`, color: accentColor,
                padding: "9px 24px", fontSize: 11, letterSpacing: 1, cursor: "pointer",
                borderRadius: 2, fontFamily: "inherit",
              }}>从同一宇宙召唤另一存在</button>
              <button onClick={() => {
                const all = Object.values(soulFiles).map(f => `# === ${f.path} ===\n\n${f.content}`).join("\n\n---\n\n");
                copyFile(all, "all");
              }} style={{
                background: `${accentColor}15`, border: `1px solid ${accentColor}55`, color: accentColor,
                padding: "9px 24px", fontSize: 11, letterSpacing: 1, cursor: "pointer",
                borderRadius: 2, fontFamily: "inherit",
              }}>
                {copied === "all" ? "✓ 已复制全部" : "复制全部文件"}
              </button>
              <button onClick={saveSoulFiles} style={{
                background: `${accentColor}15`, border: `1px solid ${accentColor}55`, color: accentColor,
                padding: "9px 24px", fontSize: 11, letterSpacing: 1, cursor: "pointer",
                borderRadius: 2, fontFamily: "inherit",
              }}>↓ 保存全部文件</button>
              <button onClick={saveWorldSeed} style={{
                background: "none", border: `1px solid ${accentColor}33`, color: accentColor,
                padding: "9px 24px", fontSize: 11, letterSpacing: 1, cursor: "pointer",
                borderRadius: 2, fontFamily: "inherit",
              }}>↓ 保存世界种子</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "7px 0", background: "#060510",
        borderTop: "1px solid #1a1628", textAlign: "center", zIndex: 10,
      }}>
        <span style={{ fontSize: 9, color: "#1a1628", letterSpacing: 5, textTransform: "uppercase" }}>
          神话学 · 比较宗教学 · 民俗文学 · 唯识论 · 灵犀世界
        </span>
      </div>
    </div>
  );
}
