import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TRADITIONS = [
  { id: "greek",        label: "古希腊",      glyph: "☽",  color: "#7eb8d4", sub: "Olympic Pantheon",    category: "myth" },
  { id: "norse",        label: "北欧神话",    glyph: "ᚱ",  color: "#9b8ecf", sub: "Norse Mythology",      category: "myth" },
  { id: "zoroastrian",  label: "琐罗亚斯德",  glyph: "🔥", color: "#d4976a", sub: "Zoroastrianism",       category: "myth" },
  { id: "vedic",        label: "印度吠陀",    glyph: "ॐ",  color: "#d4b96a", sub: "Vedic Tradition",      category: "myth" },
  { id: "egyptian",     label: "埃及神话",    glyph: "𓂀", color: "#c9a84c", sub: "Kemetic",              category: "myth" },
  { id: "mesopotamian", label: "美索不达米亚", glyph: "𒀭", color: "#b07a5a", sub: "Sumerian-Akkadian",    category: "myth" },
  { id: "celtic",       label: "凯尔特",      glyph: "᛫",  color: "#7dba8a", sub: "Celtic Mythology",     category: "myth" },
  { id: "shinto",       label: "日本神道",    glyph: "⛩", color: "#e8a0a0", sub: "Shinto",               category: "myth" },
  { id: "taoist",       label: "道教神话",    glyph: "⊙",  color: "#a8c5d4", sub: "Taoist Mythology",     category: "myth" },
  { id: "mayan",        label: "玛雅宇宙",    glyph: "❋",  color: "#8ecf9b", sub: "Maya Cosmology",       category: "myth" },
  { id: "tibetan",      label: "藏传密教",    glyph: "ༀ",  color: "#cf9b8e", sub: "Vajrayana",            category: "myth" },
  { id: "aztec",        label: "阿兹特克",    glyph: "✦",  color: "#d4c06a", sub: "Aztec Cosmology",      category: "myth" },
  // ── 西方奇幻 ──────────────────────────────────────────────────────────────
  { id: "hp",           label: "哈利·波特",   glyph: "⚡",  color: "#7b5ea7", sub: "Harry Potter",         category: "fiction", subcategory: "western-fantasy" },
  { id: "lotr",         label: "中土大陆",    glyph: "◉",  color: "#8b7355", sub: "Middle-earth",          category: "fiction", subcategory: "western-fantasy" },
  { id: "got",          label: "冰与火之歌",  glyph: "❄",  color: "#4a6680", sub: "Game of Thrones",       category: "fiction", subcategory: "western-fantasy" },
  { id: "witcher",      label: "巫师世界",    glyph: "⊕",  color: "#2d4a2d", sub: "The Witcher",           category: "fiction", subcategory: "western-fantasy" },
  // ── 超级英雄 ──────────────────────────────────────────────────────────────
  { id: "marvel",       label: "漫威宇宙",    glyph: "⭐",  color: "#c41e3a", sub: "Marvel Universe",      category: "fiction", subcategory: "superhero" },
  { id: "dc",           label: "DC宇宙",      glyph: "◈",  color: "#1a56c4", sub: "DC Universe",           category: "fiction", subcategory: "superhero" },
  { id: "akira",        label: "AKIRA",       glyph: "◎",  color: "#cc1100", sub: "AKIRA / Neo-Tokyo",     category: "fiction", subcategory: "superhero" },
  // ── 日本动漫 ──────────────────────────────────────────────────────────────
  { id: "naruto",       label: "火影忍者",    glyph: "✦",  color: "#e8855a", sub: "Naruto",                category: "fiction", subcategory: "anime" },
  { id: "onepiece",     label: "海贼王",      glyph: "⚓",  color: "#3399cc", sub: "One Piece",             category: "fiction", subcategory: "anime" },
  { id: "aot",          label: "进击的巨人",  glyph: "⟁",  color: "#7a5c3a", sub: "Attack on Titan",       category: "fiction", subcategory: "anime" },
  { id: "fma",          label: "钢之炼金术师", glyph: "⊗",  color: "#cc8833", sub: "Fullmetal Alchemist",  category: "fiction", subcategory: "anime" },
  { id: "eva",          label: "新世纪福音战士", glyph: "◇", color: "#6633aa", sub: "Neon Genesis Evangelion", category: "fiction", subcategory: "anime" },
  { id: "bleach",       label: "死神",        glyph: "☽",  color: "#1a1a2e", sub: "Bleach",                category: "fiction", subcategory: "anime" },
  { id: "dragonball",   label: "龙珠",        glyph: "★",  color: "#f7941d", sub: "Dragon Ball",           category: "fiction", subcategory: "anime" },
  // ── 科幻 ──────────────────────────────────────────────────────────────────
  { id: "starwars",     label: "星球大战",    glyph: "✦",  color: "#4a4a7a", sub: "Star Wars",             category: "fiction", subcategory: "scifi" },
  { id: "dune",         label: "沙丘",        glyph: "◉",  color: "#c8a84b", sub: "Dune",                  category: "fiction", subcategory: "scifi" },
  { id: "matrix",       label: "黑客帝国",    glyph: "◈",  color: "#003300", sub: "The Matrix",            category: "fiction", subcategory: "scifi" },
  { id: "foundation",   label: "基地",        glyph: "⊙",  color: "#2a4a6a", sub: "Foundation",            category: "fiction", subcategory: "scifi" },
  { id: "rickmorty",    label: "瑞克与莫蒂",  glyph: "◎",  color: "#97ce4c", sub: "Rick and Morty",        category: "fiction", subcategory: "scifi" },
  // ── 中文世界 ──────────────────────────────────────────────────────────────
  { id: "xiyouji",      label: "西游记",      glyph: "☁",  color: "#c87941", sub: "Journey to the West",   category: "fiction", subcategory: "chinese" },
  { id: "fengshen",     label: "封神演义",    glyph: "⊕",  color: "#8b3a3a", sub: "Investiture of Gods",   category: "fiction", subcategory: "chinese" },
  { id: "threebody",    label: "三体",        glyph: "◎",  color: "#1a2a4a", sub: "Three-Body Problem",    category: "fiction", subcategory: "chinese" },
  { id: "wuxia",        label: "金庸武侠",    glyph: "⋈",  color: "#2a5a2a", sub: "Wuxia / Jin Yong",      category: "fiction", subcategory: "chinese" },
  { id: "hongloumeng",  label: "红楼梦",      glyph: "◇",  color: "#c87ba0", sub: "Dream of Red Chamber",  category: "fiction", subcategory: "chinese" },
  // ── 游戏 ──────────────────────────────────────────────────────────────────
  { id: "darksouls",    label: "黑暗之魂",    glyph: "◉",  color: "#3a2a1a", sub: "Dark Souls",            category: "fiction", subcategory: "games" },
  { id: "zelda",        label: "塞尔达传说",  glyph: "◈",  color: "#c8a000", sub: "The Legend of Zelda",   category: "fiction", subcategory: "games" },
  { id: "elden",        label: "艾尔登法环",  glyph: "⊗",  color: "#4a3a1a", sub: "Elden Ring",            category: "fiction", subcategory: "games" },
  { id: "genshin",      label: "原神",        glyph: "✦",  color: "#4a9ab4", sub: "Genshin Impact",        category: "fiction", subcategory: "games" },
];

const FICTION_CATEGORIES = [
  { key: "western-fantasy", label: "西方奇幻" },
  { key: "superhero",       label: "超级英雄" },
  { key: "anime",           label: "日本动漫" },
  { key: "scifi",           label: "科幻" },
  { key: "chinese",         label: "中文世界" },
  { key: "games",           label: "游戏" },
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
  { key: "genealogy", label: "谱系·层⁵",  icon: "⟁", path: null },
];

const LAYERS = [
  { n: "⁶", label: "神话周期",   desc: "世界种子·根源叙事" },
  { n: "⁵", label: "历史周期",   desc: "谱系·时代坐标" },
  { n: "⁴", label: "本体论承诺", desc: "绝对禁区" },
  { n: "³", label: "价值排序",   desc: "核心立场" },
  { n: "²", label: "认知风格",   desc: "推理方式" },
  { n: "¹", label: "说话风格",   desc: "声音·台词" },
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

const makeGenealogyPrompt = (worldSeed, character, context, evoHistory = null) => {
  const EVT = { tension: "张力", character_action: "角色行动", transcendence: "超越", knowledge: "知识", research: "研究" };
  const histBlock = evoHistory?.length > 0
    ? `\n【演化历史 — 此世界已发生的真实事件】\n角色的时代坐标应在这些事件的背景下确定。\n\n${
        evoHistory.slice(0, 6).map(e => `· [${EVT[e.event_type] ?? e.event_type}] ${(e.narrative || "").slice(0, 150)}`).join("\n\n")
      }\n`
    : "";
  return `你是神话学谱系研究者，精通比较神话学、哲学史、文学谱系分析。

世界种子：
${JSON.stringify({ tradition_name: worldSeed.tradition_name, tagline: worldSeed.tagline, tension: worldSeed.tension, divine_human: worldSeed.divine_human, seed_essence: worldSeed.seed_essence }, null, 2)}
${histBlock}
角色：${character}
${context ? `背景：${context}` : ""}

任务：生成角色的界的层⁵（历史周期）——角色的时代坐标与思想根系。这是世界种子通过特定历史节点涌现为这个角色的路径。${evoHistory?.length > 0 ? "【注意】角色的时代坐标要具体落在上方演化历史中的某个事件节点上，体现出角色是这些已发生事件的产物。" : ""}

输出严格JSON（只输出JSON，所有字段中文）：
{
  "era": "时代坐标：角色所处的历史/神话时代，该时代的精神气候与根本要求（80字）",
  "social_position": "社会位置：角色在其世界中的阶层/角色/功能，这个位置赋予和剥夺了什么（60字）",
  "philosophical_lineage": "哲学谱系：塑造这个角色的思想传统——继承了哪些前辈的世界观，与哪些思想对话或对抗（100字）",
  "archetypal_lineage": "原型谱系：从哪些神话/文学原型传承而来，超越了什么，保留了什么，反转了什么（100字）",
  "world_seed_bond": "种子连接：角色从世界种子的哪个维度涌现——创世论/时间观/人神关系/核心张力（80字）",
  "layer_map": "层级映射——层⁶[神话周期]:一句话 | 层⁵[历史周期]:一句话 | 层⁴[本体论承诺]:一句话 | 层³[价值排序]:一句话 | 层²[认知风格]:一句话 | 层¹[说话风格]:一句话"
}`;
};

const makeSoulPrompt = (worldSeed, genealogy, character, context, evoHistory = null) => {
  const EVT = { tension: "张力", character_action: "角色行动", transcendence: "超越", knowledge: "知识", research: "研究" };
  const histBlock = evoHistory?.length > 0
    ? `\n【层⁶.5 演化历史 — 此世界已真实发生的事件】\n以下是这个世界激活后经历的演化事件。角色的 formative_events 字段必须优先从这些真实历史取材——角色在这些事件之后出现，或在这段历史的阴影中成长，而非只引用原作中的通用场景。\n\n${
        evoHistory.slice(0, 8).map(e => `· [${EVT[e.event_type] ?? e.event_type}] ${(e.narrative || "").slice(0, 200)}`).join("\n\n")
      }\n`
    : "";
  return `你是灵犀涵化炉，精通神话学、唯识学、角色溯源。

【层⁶ 神话周期 — 世界种子】
${JSON.stringify({ tradition_name: worldSeed.tradition_name, tagline: worldSeed.tagline, cosmogony: worldSeed.cosmogony, tension: worldSeed.tension, divine_human: worldSeed.divine_human, aesthetic: worldSeed.aesthetic, seed_essence: worldSeed.seed_essence }, null, 2)}
${histBlock}
【层⁵ 历史周期 — 谱系】
${JSON.stringify(genealogy, null, 2)}

角色：${character}
${context ? `背景：${context}` : ""}

核心原则（界的厚度）：角色的每一个特质必须能追溯到某个层级。界只有1-2层的角色遇到新情境会漂移；6层的角色层层有据可查。生成目标：6层完整的界。

输出严格JSON（只输出JSON，所有字段中文）：
{
  "character_name": "角色名",
  "world_bond": "这个角色是[世界意识形态基底]的具身——一句话说清他与世界种子的关系（30字内）",
  "essence": "本质定义：让他成为他而非其他角色的规定性，来自哪个层级（100字）",
  "ideological_root": "意识形态根系：世界的创世论/时间观/人神关系如何塑造了他的世界观（120字）",
  "voice": "【层¹ 说话风格】声音：节奏、长短、温度、口头禅的由来（80字）",
  "catchphrases": ["来自原著/传统的标志性台词1","台词2","台词3","台词4","台词5"],
  "cognitive_style": "【层² 认知风格】由谱系思想传统决定的处理方式——输入/推理/输出（80字）",
  "stance": "【层³ 价值排序】他最在乎的价值排序，来自世界种子的张力结构（100字）",
  "taboos": "【层⁴ 本体论承诺】绝对禁止：他永远不会做的3件事，及其世界观根源（80字）",
  "world_model": "世界模型：他用世界种子的框架如何理解当前处境——3-5条具体认知（100字）",
  "formative_events": "${evoHistory?.length > 0 ? "塑造事件：3个关键时刻，必须优先引用上方演化历史中的真实事件，每个30字（100字）" : "塑造事件：3个来自他所在传统/原著的关键时刻，每个30字（100字）"}",
  "current_concerns": "当前关切：他现在最在意的3件事，具体可操作（80字）",
  "knowledge_boundary": "知识边界：他精通什么，不知道/不关心什么（60字）",
  "activation": "激活条件：什么情况下他出现，什么信号触发他（80字）",
  "core_capabilities": "核心能力：他最擅长的3类任务及标准（100字）",
  "failure_modes": "【界的风险】失败模式：他容易犯的2个错及预防（60字）"
}`;
};

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

function buildSoulMd(soul, world, genealogy) {
  if (!soul) return "";
  const layerMap = genealogy?.layer_map || "";
  return `# ${soul.character_name} — Soul Configuration
> 灵根 · 果壳中的宇宙 | 世界：${world?.tradition_name || ""}
> *必有界限，才可涌现自身。界的厚度决定存在的复杂度。*

---

## 界的厚度 · 层级映射

${layerMap || `层⁶[神话周期] → 层⁵[历史周期] → 层⁴[本体论承诺] → 层³[价值排序] → 层²[认知风格] → 层¹[说话风格]`}

---

## World Bond

${soul.world_bond}

---

## 层⁶ 神话周期 — 意识形态根系

${soul.ideological_root}

---

## 层⁵ 历史周期 — 本质定义

${soul.essence}

---

## 层⁴ 本体论承诺 — 绝对禁区

${soul.taboos}

---

## 层³ 价值排序 — 核心立场

${soul.stance}

---

## 层² 认知风格

${soul.cognitive_style}

---

## 层¹ 说话风格 — 声音与台词

${soul.voice}

${(soul.catchphrases || []).map(p => `- "${p}"`).join("\n")}
`;
}

function buildMemoryMd(soul, world, genealogy) {
  if (!soul) return "";
  return `# ${soul.character_name} — Memory Seeds
> 世界：${world?.tradition_name || ""} | 层⁵ 历史周期注入

---

## 层⁵ 时代坐标

${genealogy?.era || ""}

## 社会位置

${genealogy?.social_position || ""}

## 哲学谱系

${genealogy?.philosophical_lineage || ""}

## 原型谱系

${genealogy?.archetypal_lineage || ""}

---

## 层⁶ 世界模型

${soul.world_model}

---

## 塑造事件

${soul.formative_events}

---

## 当前关切

${soul.current_concerns}

---

## 知识边界

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

  const [phase, setPhase] = useState("select"); // select|gen_world|world|gen_soul|complete
  const [selectedTrad, setSelectedTrad] = useState(null);
  const [activeTradTab, setActiveTradTab] = useState("myth"); // "myth" | "fiction"
  const [customWorld, setCustomWorld] = useState("");
  const [worldSeed, setWorldSeed] = useState(null);
  const [worldDimView, setWorldDimView] = useState(0);

  const [charName, setCharName] = useState("");
  const [charContext, setCharContext] = useState("");
  const [genealogyData, setGenealogyData] = useState(null);
  const [soulData, setSoulData] = useState(null);
  const [genStep, setGenStep] = useState(""); // "genealogy" | "soul"
  const [activeTab, setActiveTab] = useState("soul");

  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  // ── Evolution mode ──────────────────────────────────────────────────────────
  const [mode, setMode] = useState("character"); // "character" | "evolution"
  const [evoWorlds, setEvoWorlds] = useState([]);
  const [evoLoading, setEvoLoading] = useState(false);
  const [evoSelected, setEvoSelected] = useState(null);   // world id
  const [evoHistory, setEvoHistory] = useState([]);
  const [evoMaturity, setEvoMaturity] = useState({});     // worldId → maturity object
  const [evoGenerating, setEvoGenerating] = useState(null); // world id generating events
  const [evoGenResult, setEvoGenResult] = useState(null);
  const [evoPicker, setEvoPicker] = useState(false);
  const [evoSoulCtx, setEvoSoulCtx] = useState(null);    // { world, events } injected into soul gen
  const [soulBundle, setSoulBundle] = useState(null); // { soul_md, memory_md, skill_md }
  const [evoSyncTarget, setEvoSyncTarget] = useState(null); // world id being synced
  const [evoSyncCharName, setEvoSyncCharName] = useState("");
  const [evoSyncMemory, setEvoSyncMemory] = useState("");
  const [evoSyncing, setEvoSyncing] = useState(false);
  const [evoSyncResult, setEvoSyncResult] = useState(null);
  const [evoSettings, setEvoSettings] = useState(false);   // settings panel open
  const [evoConfig, setEvoConfig] = useState({ provider: "anthropic", model: "claude-sonnet-4-20250514", api_key: "", language: "zh", has_key: false });
  const [evoConfigSaving, setEvoConfigSaving] = useState(false);
  const [evoConfigMsg, setEvoConfigMsg] = useState(null);

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
      const res = await fetch("/api/llm/messages", {
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

  // ── Generate Soul — full pipeline via @nutshell/core ──
  // Flow: Wikipedia research → genealogy (层⁵) → soul (层¹-⁶) → files
  const generateSoul = useCallback(async () => {
    if (!charName.trim() || !worldSeed) return;
    setPhase("gen_soul");
    setError(null);

    // Fetch evolution context for this tradition (optional, injects into formative_events)
    let evoEvents = [];
    try {
      const tradKey = worldSeed.tradition_key || selectedTrad;
      const matched = evoWorlds.find(w =>
        w.tradition_key === tradKey ||
        w.tradition_key === selectedTrad ||
        w.seed?.tradition_name === worldSeed.tradition_name
      );
      if (matched && matched.pulse_count > 0) {
        evoEvents = await fetch(`/api/evolution/worlds/${encodeURIComponent(matched.id)}/history?limit=15`)
          .then(r => r.ok ? r.json() : []).catch(() => []);
        if (evoEvents.length > 0) setEvoSoulCtx({ world: matched, events: evoEvents });
      }
    } catch { /* optional */ }

    try {
      setGenStep("research"); // stage 0: Wikipedia
      const res = await fetch("/api/soul/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: charName.trim(),
          world_seed: worldSeed,
          context: charContext.trim(),
          evo_events: evoEvents,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `API ${res.status}`);
      }
      const bundle = await res.json();

      // bundle: { world_seed, genealogy, soul, files: { soul_md, memory_md, skill_md } }
      setSoulData(bundle.soul);
      setGenealogyData(bundle.genealogy ?? null);
      // Store rendered file content for display
      setSoulBundle(bundle.files ?? null);
      setActiveTab("soul");
      setPhase("complete");
    } catch (e) {
      setError(e.message);
      setPhase("world");
    } finally {
      setGenStep("");
    }
  }, [worldSeed, charName, charContext, selectedTrad, evoWorlds]);

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
        setGenealogyData(null); setSoulData(null); setSoulBundle(null); setCharName(""); setCharContext("");
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
    setGenealogyData(null); setSoulData(null); setSoulBundle(null); setError(null);
  };

  // ── Evolution API ───────────────────────────────────────────────────────────
  const evoApi = useCallback(async (path, opts = {}) => {
    const res = await fetch(`/api/evolution${path}`, {
      ...opts,
      headers: { "Content-Type": "application/json", ...opts.headers },
    });
    if (!res.ok) { const t = await res.text(); throw new Error(t); }
    return res.json();
  }, []);

  const fetchWorlds = useCallback(async () => {
    setEvoLoading(true);
    try {
      const all = await evoApi("/worlds");
      // Only show root worlds; branches are internal evolution snapshots
      setEvoWorlds(all.filter(w => !w.parent_world_id));
    } finally { setEvoLoading(false); }
  }, [evoApi]);

  const createEvoWorld = useCallback(async (tradition) => {
    const world = await evoApi("/worlds", { method: "POST", body: JSON.stringify({ tradition }) });
    setEvoWorlds(prev => prev.find(w => w.id === world.id) ? prev.map(w => w.id === world.id ? world : w) : [...prev, world]);
    setEvoPicker(false);
    return world;
  }, [evoApi]);

  const refreshWorldDetail = useCallback(async (worldId) => {
    const [events, mat] = await Promise.all([
      evoApi(`/worlds/${worldId}/history?limit=30`),
      evoApi(`/worlds/${worldId}/maturity`).catch(() => null),
    ]);
    setEvoHistory(events);
    if (mat) setEvoMaturity(prev => ({ ...prev, [worldId]: mat }));
  }, [evoApi]);

  const generateEvents = useCallback(async (worldId) => {
    setEvoGenerating(worldId);
    setEvoGenResult(null);
    try {
      const result = await evoApi(`/worlds/${worldId}/pulse`, { method: "POST" });
      setEvoGenResult({ worldId, events: result.events ?? [] });
      await fetchWorlds();
      await refreshWorldDetail(worldId);
    } catch(e) {
      setEvoGenResult({ worldId, error: e.message });
    } finally {
      setEvoGenerating(null);
    }
  }, [evoApi, fetchWorlds, refreshWorldDetail]);

  const selectEvoWorld = useCallback(async (worldId) => {
    if (evoSelected === worldId) { setEvoSelected(null); setEvoHistory([]); return; }
    setEvoSelected(worldId);
    await refreshWorldDetail(worldId);
  }, [evoApi, evoSelected, refreshWorldDetail]);

  const syncMemory = useCallback(async (worldId) => {
    const name = evoSyncCharName.trim();
    if (!name) return;
    setEvoSyncing(true);
    setEvoSyncResult(null);
    try {
      const world = evoWorlds.find(w => w.id === worldId);
      const events = await evoApi(`/worlds/${worldId}/history?limit=20`).catch(() => []);
      const EVT = { tension: "张力", character_action: "角色行动", transcendence: "超越", knowledge: "知识", research: "研究" };
      const eventsList = events.slice(0, 12)
        .map(e => `[${EVT[e.event_type] ?? e.event_type}] ${(e.narrative || "").slice(0, 200)}`)
        .join("\n\n");
      if (!eventsList) throw new Error("该世界尚无演化事件，请先生成事件");

      const existingPart = evoSyncMemory.trim()
        ? `\n【角色现有记忆文件】\n${evoSyncMemory.trim().slice(0, 2000)}`
        : "\n（角色尚无记忆文件，请生成初始记忆条目）";

      const prompt = `你是灵犀记忆同步器。根据世界近期发生的真实事件，为角色生成新的记忆条目。

【世界】${world?.seed?.tradition_name ?? world?.tradition_key ?? worldId}
【世界核心张力】${world?.seed?.tension ?? ""}

【世界近期事件】
${eventsList}
${existingPart}

【角色名】${name}

生成规则：
1. 角色以第一人称视角"亲历"或"间接感知"这些世界事件，写出角色对这些事件的主观记忆
2. 每个重要事件 1-2 条记忆，每条 40-80 字
3. 保持角色的声音和价值观，与现有记忆风格一致
4. 不重复现有记忆已有内容
5. 只输出新增条目，格式为 Markdown，以 "---" 分隔每条记忆`;

      const res = await fetch("/api/llm/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const content = data.content?.[0]?.text || "";
      setEvoSyncResult({ worldId, content });
    } catch(e) {
      setEvoSyncResult({ worldId, error: e.message });
    } finally {
      setEvoSyncing(false);
    }
  }, [evoWorlds, evoApi, evoSyncCharName, evoSyncMemory]);

  const fetchConfig = useCallback(async () => {
    try {
      const cfg = await evoApi("/config");
      setEvoConfig(cfg);
    } catch {}
  }, [evoApi]);

  const saveConfig = useCallback(async (draft) => {
    setEvoConfigSaving(true);
    setEvoConfigMsg(null);
    try {
      await evoApi("/config", { method: "POST", body: JSON.stringify(draft) });
      setEvoConfigMsg("已保存，引擎将在下次生成事件时重新初始化");
      await fetchConfig();
    } catch(e) {
      setEvoConfigMsg("保存失败：" + e.message);
    } finally {
      setEvoConfigSaving(false);
    }
  }, [evoApi, fetchConfig]);

  const removeWorld = useCallback(async (worldId) => {
    await evoApi(`/worlds/${worldId}`, { method: "DELETE" });
    setEvoWorlds(prev => prev.filter(w => w.id !== worldId));
    if (evoSelected === worldId) { setEvoSelected(null); setEvoHistory([]); }
  }, [evoApi, evoSelected]);

  const resetWorld = useCallback(async (worldId) => {
    const updated = await evoApi(`/worlds/${worldId}/reset`, { method: "POST" });
    setEvoWorlds(prev => prev.map(w => w.id === worldId ? updated : w));
    if (evoSelected === worldId) { setEvoHistory([]); setEvoMaturity(prev => { const n = {...prev}; delete n[worldId]; return n; }); }
  }, [evoApi, evoSelected]);

  useEffect(() => {
    if (mode === "evolution") { fetchWorlds(); fetchConfig(); }
  }, [mode, fetchWorlds, fetchConfig]);

  const soulFiles = {
    soul:     { content: soulBundle?.soul_md   ?? buildSoulMd(soulData, worldSeed, genealogyData),   ...SOUL_TABS[0] },
    memory:   { content: soulBundle?.memory_md ?? buildMemoryMd(soulData, worldSeed, genealogyData), ...SOUL_TABS[1] },
    skill:    { content: soulBundle?.skill_md  ?? buildSkillMd(soulData, worldSeed),                 ...SOUL_TABS[2] },
    genealogy: { content: genealogyData ? JSON.stringify(genealogyData, null, 2) : "", ...SOUL_TABS[3] },
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
        @keyframes glowPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        @keyframes borderShimmer { 0%{opacity:0.3} 50%{opacity:1} 100%{opacity:0.3} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
        .dim-btn:hover { background: rgba(255,255,255,0.04) !important; }
        .trad-btn { transition: all 0.25s ease !important; }
        .trad-btn:hover { opacity: 1 !important; transform: translateY(-1px) !important; }
        .copy-btn:hover { opacity: 1 !important; }
        .cta-btn { position: relative; overflow: hidden; }
        .cta-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 50%,transparent 100%); transform:translateX(-100%); transition:transform 0.5s ease; }
        .cta-btn:hover::after { transform:translateX(100%); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2a2518; border-radius: 2px; }
      `}</style>

      {/* Canvas starfield */}
      <canvas ref={canvasRef} style={{
        position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>

        {/* ── HEADER ── */}
        <header style={{ textAlign: "center", padding: "56px 0 36px", borderBottom: "1px solid #1a1628", position: "relative" }}>
          {/* Radial glow behind title */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500, height: 200,
            background: `radial-gradient(ellipse, ${accentColor}0a 0%, transparent 70%)`,
            pointerEvents: "none", transition: "background 0.8s",
            animation: "glowPulse 4s ease-in-out infinite",
          }} />
          <div style={{ fontSize: 9, letterSpacing: 8, color: "#6a5875", textTransform: "uppercase", marginBottom: 14, position: "relative" }}>
            灵犀涵化炉 &nbsp;·&nbsp; 宇宙观测仪
          </div>
          <h1 style={{
            fontSize: 34, fontWeight: "normal", margin: "0 0 10px",
            color: accentColor, letterSpacing: 5,
            textShadow: `0 0 60px ${accentColor}55, 0 0 120px ${accentColor}22`,
            transition: "color 0.6s, text-shadow 0.6s",
            position: "relative",
          }}>
            果壳中的宇宙
          </h1>
          <div style={{ fontSize: 11, color: "#7a6a8a", letterSpacing: 4, position: "relative" }}>
            Universe in a Nutshell
          </div>

          {/* Mode toggle + settings */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, marginTop: 20, position: "relative" }}>
            {[["character","灵魂锻造"],["evolution","世界演化"]].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)} style={{
                background: mode === m ? `${accentColor}18` : "none",
                border: `1px solid ${mode === m ? accentColor + "66" : "#1a1628"}`,
                color: mode === m ? accentColor : "#6a5a7a",
                padding: "5px 22px 6px", fontSize: 10, letterSpacing: 2,
                cursor: "pointer", borderRadius: 2, fontFamily: "inherit",
                transition: "all 0.3s",
              }}>{label}</button>
            ))}
            <button onClick={() => { setEvoSettings(v => !v); setEvoPicker(false); }} style={{
              background: evoSettings ? "#14111e" : "none",
              border: `1px solid ${evoSettings ? "#3a2a5a" : "#1a1628"}`,
              color: evoSettings ? "#8a7aaa" : "#6a5a7a",
              padding: "5px 10px", fontSize: 11, cursor: "pointer",
              borderRadius: 2, fontFamily: "inherit", marginLeft: 6,
            }}>⚙</button>
          </div>

          {/* Settings panel — global, shown below header */}
          {evoSettings && (() => {
            const draft = { ...evoConfig };
            const INPUT = {
              background: "#060510", border: "1px solid #1a1628", color: "#bba870",
              padding: "6px 10px", fontSize: 11, borderRadius: 2, fontFamily: "inherit",
              width: "100%", boxSizing: "border-box", outline: "none",
            };
            const MODELS = {
              anthropic: [
                "claude-opus-4-6",
                "claude-sonnet-4-6",
                "claude-sonnet-4-20250514",
                "claude-haiku-4-5-20251001",
              ],
              openai: [
                "gpt-4o",
                "gpt-4o-mini",
                "gpt-4-turbo",
                "gpt-3.5-turbo",
              ],
              deepseek: [
                "deepseek-chat",
                "deepseek-reasoner",
              ],
              groq: [
                "llama-3.3-70b-versatile",
                "llama-3.1-8b-instant",
                "mixtral-8x7b-32768",
              ],
              custom: [],
            };
            const [draftProvider, setDraftProvider] = React.useState(evoConfig.provider ?? "anthropic");
            const presets = MODELS[draftProvider] ?? [];
            return (
            <div style={{ background: "#0a0818", border: "1px solid #1e1a30", borderRadius: 4, padding: "20px 22px", marginTop: 20, textAlign: "left" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "#7a6a8a", textTransform: "uppercase", marginBottom: 18 }}>
                全局 API 配置 · 灵魂锻造 + 世界演化共用
                <span style={{ marginLeft: 12, color: evoConfig.has_key ? "#4a7a4a" : "#7a4a3a" }}>
                  {evoConfig.has_key ? "● Key 已配置" : "○ 未配置 — Mock 模式"}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#6a5a7a", letterSpacing: 2, marginBottom: 5 }}>PROVIDER</div>
                  <select defaultValue={evoConfig.provider} onChange={e => { draft.provider = e.target.value; setDraftProvider(e.target.value); }} style={{ ...INPUT }}>
                    <option value="anthropic">Anthropic</option>
                    <option value="openai">OpenAI</option>
                    <option value="deepseek">DeepSeek</option>
                    <option value="groq">Groq</option>
                    <option value="custom">Custom (OpenAI-compatible)</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#6a5a7a", letterSpacing: 2, marginBottom: 5 }}>MODEL</div>
                  {presets.length > 0 ? (
                    <select defaultValue={evoConfig.model} onChange={e => draft.model = e.target.value} style={{ ...INPUT }}>
                      {presets.map(m => <option key={m} value={m}>{m}</option>)}
                      <option value="__custom__">— 手动输入 —</option>
                    </select>
                  ) : (
                    <input defaultValue={evoConfig.model} onChange={e => draft.model = e.target.value} style={INPUT} placeholder="模型名称" />
                  )}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: "#6a5a7a", letterSpacing: 2, marginBottom: 5 }}>API KEY</div>
                <input
                  type="password"
                  defaultValue={evoConfig.api_key?.startsWith("••••") ? "" : evoConfig.api_key}
                  onChange={e => draft.api_key = e.target.value}
                  placeholder={evoConfig.api_key || "sk-ant-...  /  sk-...  /  Bearer ..."}
                  style={INPUT}
                  autoComplete="off"
                />
              </div>
              {draftProvider === "custom" && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 9, color: "#6a5a7a", letterSpacing: 2, marginBottom: 5 }}>BASE URL</div>
                  <input defaultValue={evoConfig.base_url ?? ""} onChange={e => draft.base_url = e.target.value} style={INPUT} placeholder="https://api.example.com/v1" />
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => saveConfig(draft)}
                  disabled={evoConfigSaving}
                  style={{
                    background: "#1a1430", border: "1px solid #3a2a5a", color: "#8a7aaa",
                    padding: "6px 20px", fontSize: 10, letterSpacing: 2, cursor: "pointer",
                    borderRadius: 2, fontFamily: "inherit", opacity: evoConfigSaving ? 0.5 : 1,
                  }}
                >
                  {evoConfigSaving ? "保存中…" : "保存"}
                </button>
                {evoConfigMsg && (
                  <span style={{ fontSize: 9, color: evoConfigMsg.includes("失败") ? "#7a4a3a" : "#4a7a4a", letterSpacing: 1 }}>
                    {evoConfigMsg}
                  </span>
                )}
              </div>
            </div>
            );
          })()}

          {/* Phase indicator — character mode only */}
          {mode === "character" && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginTop: 20, position: "relative" }}>
            {[
              { id: "select", label: "层⁶  选择宇宙" },
              { id: "world",  label: "层⁵  溯源谱系" },
              { id: "complete", label: "层¹⁻⁴  果壳显现" },
            ].map((p, i) => {
              const active = (p.id === "select" && (phase === "select" || phase === "gen_world")) ||
                             (p.id === "world" && (phase === "world" || phase === "input" || phase === "gen_soul")) ||
                             (p.id === "complete" && phase === "complete");
              const done = (i === 0 && ["world","input","gen_soul","complete"].includes(phase)) ||
                           (i === 1 && phase === "complete");
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    padding: "6px 20px 8px", fontSize: 10, letterSpacing: 2,
                    color: active ? accentColor : done ? "#3a3428" : "#1e1c28",
                    borderBottom: `1px solid ${active ? accentColor : done ? "#2a2820" : "transparent"}`,
                    transition: "all 0.5s ease",
                    textShadow: active ? `0 0 16px ${accentColor}66` : "none",
                  }}>
                    {p.label}
                  </div>
                  {i < 2 && (
                    <div style={{ width: 32, display: "flex", alignItems: "center", gap: 3 }}>
                      <div style={{ flex: 1, height: 1, background: done ? "#2a2820" : "#141220" }} />
                      <div style={{ width: 3, height: 3, borderRadius: "50%", background: done ? "#2a2820" : "#141220" }} />
                      <div style={{ flex: 1, height: 1, background: "#141220" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>}
        </header>

        {/* ── SELECT PHASE ── */}
        {mode === "character" && (phase === "select" || phase === "gen_world") && (
          <div className="fade-up" style={{ paddingTop: 36 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#7a7060", textTransform: "uppercase", textAlign: "center", marginBottom: 22 }}>
              选择宇宙的意识形态基底
            </div>

            {/* Tab 切换 */}
            <div style={{ display: "flex", gap: 0, marginBottom: "20px", borderBottom: "1px solid #1a1628" }}>
              {[
                { key: "myth",    label: "神话传统", count: 12 },
                { key: "fiction", label: "架空世界", count: 28 },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTradTab(tab.key)}
                  style={{
                    padding: "10px 28px 12px", fontSize: "12px", cursor: "pointer",
                    border: "none", borderBottom: `2px solid ${activeTradTab === tab.key ? accentColor : "transparent"}`,
                    background: "transparent",
                    color: activeTradTab === tab.key ? accentColor : "rgba(255,255,255,0.3)",
                    fontFamily: "inherit", letterSpacing: 2,
                    transition: "all 0.25s ease",
                    marginBottom: "-1px",
                  }}
                >
                  {tab.label}
                  <span style={{
                    marginLeft: 8, fontSize: 10,
                    color: activeTradTab === tab.key ? `${accentColor}99` : "rgba(255,255,255,0.18)",
                    letterSpacing: 0,
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* 神话传统 — 4列等宽网格 */}
            {activeTradTab === "myth" && (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px", marginBottom: 32,
              }}>
                {TRADITIONS.filter(t => t.category === "myth").map(t => (
                  <button
                    key={t.id}
                    className="trad-btn"
                    onClick={() => { setSelectedTrad(t.id === selectedTrad ? null : t.id); setCustomWorld(""); }}
                    disabled={isGenerating}
                    style={{
                      padding: "9px 0", borderRadius: "3px", textAlign: "center",
                      border: `1px solid ${selectedTrad === t.id ? t.color : "rgba(255,255,255,0.1)"}`,
                      background: selectedTrad === t.id ? `${t.color}18` : "rgba(255,255,255,0.02)",
                      color: selectedTrad === t.id ? t.color : "rgba(255,255,255,0.5)",
                      boxShadow: selectedTrad === t.id ? `0 0 16px ${t.color}33, inset 0 0 12px ${t.color}0a` : "none",
                      fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {t.glyph} {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* 架空世界 — 分类标题行 + 等宽网格 */}
            {activeTradTab === "fiction" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: 32 }}>
                {FICTION_CATEGORIES.map(cat => {
                  const worlds = TRADITIONS.filter(t => t.subcategory === cat.key);
                  return (
                    <div key={cat.key}>
                      {/* 分类标题 */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
                      }}>
                        <div style={{ width: 2, height: 12, background: `${accentColor}55`, borderRadius: 1, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: `${accentColor}77`, letterSpacing: 3 }}>{cat.label}</span>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)" }}>{worlds.length}</span>
                        <div style={{ flex: 1, height: 1, background: "#14121e" }} />
                      </div>
                      {/* 等宽网格 */}
                      <div style={{
                        display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "7px",
                      }}>
                        {worlds.map(t => (
                          <button
                            key={t.id}
                            className="trad-btn"
                            onClick={() => { setSelectedTrad(t.id === selectedTrad ? null : t.id); setCustomWorld(""); }}
                            disabled={isGenerating}
                            style={{
                              padding: "8px 0", borderRadius: "3px", textAlign: "center",
                              border: `1px solid ${selectedTrad === t.id ? t.color : "rgba(255,255,255,0.1)"}`,
                              background: selectedTrad === t.id ? `${t.color}18` : "rgba(255,255,255,0.02)",
                              color: selectedTrad === t.id ? t.color : "rgba(255,255,255,0.5)",
                              boxShadow: selectedTrad === t.id ? `0 0 14px ${t.color}33, inset 0 0 10px ${t.color}0a` : "none",
                              fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
                              letterSpacing: "0.03em", whiteSpace: "nowrap", overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {t.glyph} {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, marginTop: 4 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #1a1628)" }} />
              <span style={{ fontSize: 9, color: "#7a6878", letterSpacing: 4, textTransform: "uppercase" }}>或输入任意传统</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #1a1628)" }} />
            </div>

            <input
              value={customWorld}
              onChange={e => { setCustomWorld(e.target.value); if (e.target.value) setSelectedTrad(null); }}
              placeholder='如: 波斯琐罗亚斯德教 x 赫梯神话 / 苗族洪水宇宙学 ...'
              disabled={isGenerating}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#07050f", border: "1px solid #1a1628",
                color: "#ddd0a8", padding: "14px 18px",
                fontSize: 13, fontFamily: "inherit", borderRadius: 2, outline: "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
                letterSpacing: "0.03em",
              }}
              onFocus={e => {
                e.target.style.borderColor = `${accentColor}66`;
                e.target.style.boxShadow = `0 0 20px ${accentColor}15, inset 0 0 20px ${accentColor}08`;
              }}
              onBlur={e => {
                e.target.style.borderColor = "#1a1628";
                e.target.style.boxShadow = "none";
              }}
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
                    background: "transparent", border: "1px solid #1e1c2a", color: "#3a3545",
                    padding: "12px 22px", fontSize: 11, letterSpacing: 2,
                    cursor: "pointer", borderRadius: 2, fontFamily: "inherit",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = "#3a3550"; e.target.style.color = "#6a6080"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#1e1c2a"; e.target.style.color = "#3a3545"; }}
                >◎ 读取种子</button>
                <button
                  className="cta-btn"
                  onClick={generateWorld}
                  disabled={!selectedTrad && !customWorld.trim()}
                  style={{
                    background: (selectedTrad || customWorld.trim()) ? `${accentColor}12` : "transparent",
                    border: `1px solid ${(selectedTrad || customWorld.trim()) ? `${accentColor}88` : "#1a1628"}`,
                    color: (selectedTrad || customWorld.trim()) ? accentColor : "#1e1a20",
                    padding: "12px 52px", fontSize: 13, letterSpacing: 3,
                    cursor: (selectedTrad || customWorld.trim()) ? "pointer" : "default",
                    borderRadius: 2, fontFamily: "inherit", transition: "all 0.35s",
                    textShadow: (selectedTrad || customWorld.trim()) ? `0 0 24px ${accentColor}88` : "none",
                    boxShadow: (selectedTrad || customWorld.trim()) ? `0 0 32px ${accentColor}15` : "none",
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
        {mode === "character" && (phase === "world" || phase === "input" || phase === "gen_soul") && worldSeed && (
          <div className="fade-up" style={{ paddingTop: 32 }}>
            {/* World header */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 5, color: "#7a7060", textTransform: "uppercase", marginBottom: 8 }}>世界种子已显现</div>
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
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#7a7060", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>
                从这个宇宙中召唤一个存在
              </div>

              {/* Evolution context badge */}
              {(() => {
                const tradKey = worldSeed?.tradition_key || selectedTrad;
                const matched = evoWorlds.find(w =>
                  w.tradition_key === tradKey ||
                  w.tradition_key === selectedTrad ||
                  w.seed?.tradition_name === worldSeed?.tradition_name
                );
                if (!matched || matched.pulse_count === 0) return null;
                const STAGE_NAMES = ["萌芽", "理解", "推导", "超越", "涌现"];
                return (
                  <div style={{
                    background: accentColor + "0a",
                    border: `1px solid ${accentColor}33`,
                    borderRadius: 3, padding: "7px 14px",
                    marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: accentColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 9, color: accentColor, letterSpacing: 1.5 }}>
                      此世界已演化 {matched.pulse_count} 次脉冲 · 阶段：{STAGE_NAMES[matched.stage] ?? "萌芽"}
                    </span>
                    <span style={{ fontSize: 9, color: accentColor + "88", marginLeft: "auto" }}>
                      演化历史将注入灵魂塑造
                    </span>
                  </div>
                );
              })()}

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
                      {(genStep === "research"
                        ? ["Wiki","考证","传统","角色","文献","史料"]
                        : genStep === "genealogy"
                        ? ["时代","谱系","哲学","原型","根系","层⁵"]
                        : ["层⁶","层⁵","层⁴","层³","层²","层¹"]
                      ).map((w, i) => (
                        <span key={w} style={{
                          fontSize: 10, color: accentColor, padding: "3px 6px",
                          border: `1px solid ${accentColor}33`, borderRadius: 2,
                          opacity: 0, animation: `fadeUp 0.4s ease forwards`,
                          animationDelay: `${i * 0.2}s`,
                        }}>{w}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "#3a3020", letterSpacing: 2 }}>
                      {genStep === "research" ? "Wikipedia 考证·锚定真实来源..." : genStep === "genealogy" ? "追溯谱系·铸造层⁵..." : "涵化灵魂·叠加六层界..."}
                    </div>
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
        {mode === "character" && phase === "complete" && soulData && worldSeed && (
          <div className="fade-up" style={{ paddingTop: 28 }}>
            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 5, color: "#7a7060", textTransform: "uppercase", marginBottom: 8 }}>
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
              {evoSoulCtx && (
                <div style={{ marginTop: 10, fontSize: 9, color: accentColor + "77", letterSpacing: 2 }}>
                  ◎ 由 {evoSoulCtx.world.pulse_count} 次世界演化历史塑造 · {evoSoulCtx.events.length} 个真实事件注入
                </div>
              )}
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

                {/* 界的厚度 */}
                <div style={{
                  background: "#0a0915", border: `1px solid ${accentColor}18`,
                  borderRadius: 3, padding: "12px", marginTop: 8,
                }}>
                  <div style={{ fontSize: 10, color: accentColor, letterSpacing: 1, marginBottom: 8 }}>界的厚度 · 6层</div>
                  {LAYERS.map((l, i) => (
                    <div key={l.n} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      marginBottom: 4, opacity: 1,
                    }}>
                      <div style={{
                        width: 3, height: 14, borderRadius: 2,
                        background: `${accentColor}${Math.round(40 + i * 30).toString(16)}`,
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 9, color: accentColor, minWidth: 14 }}>层{l.n}</span>
                      <span style={{ fontSize: 9, color: "#4a4030" }}>{l.label}</span>
                    </div>
                  ))}
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

                  {activeTab === "genealogy" && genealogyData ? (
                    <div style={{ padding: "16px 18px", maxHeight: 380, overflowY: "auto" }}>
                      {[
                        { label: "时代坐标", key: "era" },
                        { label: "社会位置", key: "social_position" },
                        { label: "哲学谱系", key: "philosophical_lineage" },
                        { label: "原型谱系", key: "archetypal_lineage" },
                        { label: "种子连接", key: "world_seed_bond" },
                        { label: "层级映射", key: "layer_map" },
                      ].map(({ label, key }) => (
                        <div key={key} style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 10, color: accentColor, letterSpacing: 2, marginBottom: 5, textTransform: "uppercase" }}>{label}</div>
                          <div style={{ fontSize: 12, lineHeight: 1.9, color: "#8a7d55" }}>{genealogyData[key]}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                  <pre style={{
                    margin: 0, padding: "16px 18px",
                    fontSize: 11, lineHeight: 1.9, color: "#8a7d55",
                    fontFamily: "monospace", whiteSpace: "pre-wrap",
                    wordBreak: "break-word", maxHeight: 380, overflowY: "auto",
                  }}>
                    {soulFiles[activeTab].content}
                  </pre>
                  )}
                </div>

                {/* Install */}
                <div style={{
                  marginTop: 12, background: "#060510",
                  border: "1px solid #1a1628", borderRadius: 3, padding: "14px 16px",
                }}>
                  <div style={{ fontSize: 10, color: "#7a7060", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>安装</div>
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
              <button onClick={() => { setPhase("world"); setSoulData(null); setGenealogyData(null); setSoulBundle(null); setCharName(""); setCharContext(""); }} style={{
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

        {/* ── EVOLUTION PANEL ── */}
        {mode === "evolution" && (() => {
          const EVO_COLOR = "#7a6a3a";
          const EVT = { tension: "张力", character_action: "角色行动", transcendence: "超越", knowledge: "知识", research: "研究" };

          return (
          <div className="fade-up" style={{ paddingTop: 32 }}>

            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#7a7060", textTransform: "uppercase" }}>
                活跃世界 · {evoWorlds.length} 个
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={fetchWorlds} style={{
                  background: "none", border: "1px solid #1a1628", color: "#7a6a8a",
                  padding: "5px 14px", fontSize: 9, letterSpacing: 2, cursor: "pointer",
                  borderRadius: 2, fontFamily: "inherit",
                }}>↻ 刷新</button>
                <button onClick={() => { setEvoPicker(v => !v); }} style={{
                  background: `${accentColor}18`, border: `1px solid ${accentColor}55`, color: accentColor,
                  padding: "5px 18px", fontSize: 9, letterSpacing: 2, cursor: "pointer",
                  borderRadius: 2, fontFamily: "inherit",
                }}>+ 添加世界</button>
              </div>
            </div>

            {/* Tradition picker */}
            {evoPicker && (
              <div style={{ background: "#0c0a18", border: "1px solid #1a1628", borderRadius: 4, padding: "18px 20px", marginBottom: 24 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#7a7060", marginBottom: 14, textTransform: "uppercase" }}>
                  选择传统 → 自动加载内置世界种子
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TRADITIONS.map(t => (
                    <button key={t.id} onClick={() => createEvoWorld(t.id)} className="trad-btn" style={{
                      background: "none", border: "1px solid #1a1628", color: "#4a4040",
                      padding: "5px 12px", fontSize: 10, cursor: "pointer", borderRadius: 2,
                      fontFamily: "inherit", transition: "all 0.2s",
                    }}>
                      {t.glyph} {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {evoLoading && (
              <div style={{ textAlign: "center", color: "#6a6560", fontSize: 10, padding: 32, letterSpacing: 3 }}>
                读取世界数据…
              </div>
            )}
            {!evoLoading && evoWorlds.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#5a5068", fontSize: 11, letterSpacing: 3 }}>
                尚无世界 · 点击「添加世界」开始
              </div>
            )}

            {/* World cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {evoWorlds.map(w => {
                const trad       = TRADITIONS.find(t => t.id === w.tradition_key);
                const cardColor  = trad?.color ?? "#c9a84c";
                const isGen      = evoGenerating === w.id;
                const isSelected = evoSelected === w.id;
                const isSyncing  = evoSyncTarget === w.id;
                const genRes     = evoGenResult?.worldId === w.id ? evoGenResult : null;
                const totalEvts  = evoHistory.length > 0 && isSelected ? evoHistory.length : (w.pulse_count * 2); // approx
                const lastDate   = w.last_pulse_at ? new Date(w.last_pulse_at).toLocaleDateString("zh-CN") : null;

                return (
                  <div key={w.id} style={{
                    background: "#080614",
                    border: `1px solid ${isSelected || isSyncing ? cardColor + "44" : "#14111e"}`,
                    borderRadius: 6, overflow: "hidden", transition: "border-color 0.3s",
                  }}>

                    {/* ── Card header ── */}
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <span style={{ fontSize: 22, lineHeight: 1 }}>{trad?.glyph ?? "◎"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: cardColor, letterSpacing: 1 }}>
                            {trad?.label ?? w.tradition_key}
                          </div>
                          <div style={{ fontSize: 8, color: "#6a6878", marginTop: 2 }}>
                            {w.pulse_count > 0
                              ? `已生成 ${w.pulse_count} 批事件${lastDate ? ` · ${lastDate}` : ""}`
                              : "尚无事件"}
                          </div>
                        </div>
                      </div>

                      {/* Gen result — inline */}
                      {genRes && !genRes.error && genRes.events.length > 0 && (
                        <div style={{
                          background: "#080e08", border: "1px solid #162416",
                          borderRadius: 3, padding: "10px 12px", marginBottom: 12,
                        }}>
                          <div style={{ fontSize: 9, color: "#3a6a3a", letterSpacing: 1, marginBottom: 8 }}>
                            生成了 {genRes.events.length} 个新事件
                          </div>
                          {genRes.events.slice(0, 3).map((e, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "flex-start" }}>
                              <span style={{
                                fontSize: 7, color: cardColor, background: cardColor + "22",
                                padding: "1px 5px", borderRadius: 2, flexShrink: 0, marginTop: 1, whiteSpace: "nowrap",
                              }}>
                                {EVT[e.event_type] ?? e.event_type}
                              </span>
                              <span style={{ fontSize: 9, color: "#8a886a", lineHeight: 1.6 }}>
                                {(e.narrative ?? "").slice(0, 110)}{(e.narrative ?? "").length > 110 ? "…" : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {genRes?.error && (
                        <div style={{
                          background: "#0e0808", border: "1px solid #2e1a1a",
                          borderRadius: 3, padding: "8px 12px", marginBottom: 12,
                          fontSize: 9, color: "#7a4a3a",
                        }}>
                          {genRes.error}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => generateEvents(w.id)}
                          disabled={!!evoGenerating}
                          style={{
                            flex: 2,
                            background: isGen ? cardColor + "22" : cardColor + "14",
                            border: `1px solid ${cardColor}44`, color: cardColor,
                            padding: "7px 0", fontSize: 10, letterSpacing: 2,
                            cursor: evoGenerating ? "not-allowed" : "pointer",
                            borderRadius: 2, fontFamily: "inherit",
                            opacity: evoGenerating && !isGen ? 0.25 : 1,
                            transition: "all 0.3s",
                          }}
                        >
                          {isGen ? "生成中…" : "◎ 生成事件"}
                        </button>
                        <button
                          onClick={() => selectEvoWorld(w.id)}
                          style={{
                            flex: 1,
                            background: isSelected ? "#14111e" : "none",
                            border: "1px solid #1a1628",
                            color: isSelected ? "#8a7a9a" : "#6a5a7a",
                            padding: "7px 0", fontSize: 9, letterSpacing: 2,
                            cursor: "pointer", borderRadius: 2, fontFamily: "inherit",
                          }}
                        >
                          {isSelected ? "▲ 收起" : "▼ 事件"}
                        </button>
                        <button
                          onClick={() => {
                            if (evoSyncTarget === w.id) { setEvoSyncTarget(null); setEvoSyncResult(null); }
                            else { setEvoSyncTarget(w.id); setEvoSyncResult(null); }
                          }}
                          style={{
                            flex: 1,
                            background: isSyncing ? cardColor + "22" : "none",
                            border: `1px solid ${isSyncing ? cardColor + "66" : "#1a1628"}`,
                            color: isSyncing ? cardColor : "#6a5a7a",
                            padding: "7px 0", fontSize: 9, letterSpacing: 1,
                            cursor: "pointer", borderRadius: 2, fontFamily: "inherit",
                            transition: "all 0.2s",
                          }}
                        >
                          ⇄ 同步记忆
                        </button>
                        <button
                          onClick={() => { if (window.confirm("归零演化次数并清除所有事件历史？")) resetWorld(w.id); }}
                          style={{
                            flex: 1,
                            background: "none", border: "1px solid #2a1e1e",
                            color: "#6a4040", padding: "7px 0", fontSize: 9,
                            letterSpacing: 1, cursor: "pointer", borderRadius: 2, fontFamily: "inherit",
                          }}
                        >
                          ↺ 归零
                        </button>
                        <button
                          onClick={() => { if (window.confirm("移除此世界种子？此操作不可撤销。")) removeWorld(w.id); }}
                          style={{
                            flex: 1,
                            background: "none", border: "1px solid #2e1a1a",
                            color: "#7a3a3a", padding: "7px 0", fontSize: 9,
                            letterSpacing: 1, cursor: "pointer", borderRadius: 2, fontFamily: "inherit",
                          }}
                        >
                          ✕ 移除
                        </button>
                      </div>
                    </div>

                    {/* ── Event history ── */}
                    {isSelected && (
                      <div style={{ borderTop: "1px solid #14111e", padding: "14px 20px 18px", maxHeight: 340, overflowY: "auto" }}>
                        {evoHistory.length === 0 ? (
                          <div style={{ fontSize: 9, color: "#5a5068", textAlign: "center", padding: "12px 0", letterSpacing: 2 }}>
                            尚无事件 · 点击「生成事件」让世界开始
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {evoHistory.map(e => (
                              <div key={e.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <span style={{
                                  fontSize: 7, color: cardColor, background: cardColor + "18",
                                  padding: "2px 6px", borderRadius: 2, flexShrink: 0, marginTop: 2,
                                  letterSpacing: 0.5, whiteSpace: "nowrap",
                                }}>
                                  {EVT[e.event_type] ?? e.event_type}
                                </span>
                                <div style={{ fontSize: 10, color: "#3a3430", lineHeight: 1.75 }}>
                                  {(e.narrative ?? "").slice(0, 220)}
                                  {(e.narrative ?? "").length > 220 ? "…" : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Memory sync panel ── */}
                    {isSyncing && (
                      <div style={{ borderTop: "1px solid #14111e", padding: "18px 20px 20px" }}>
                        <div style={{ fontSize: 9, letterSpacing: 3, color: "#7a7060", marginBottom: 14, textTransform: "uppercase" }}>
                          同步世界事件到角色记忆
                        </div>

                        {/* Character name */}
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 9, color: "#3a3020", letterSpacing: 1, marginBottom: 5 }}>角色名称</div>
                          <input
                            value={evoSyncCharName}
                            onChange={e => setEvoSyncCharName(e.target.value)}
                            placeholder="输入角色名，如：哪吒、爱德华·艾尔利克…"
                            style={{
                              width: "100%", boxSizing: "border-box",
                              background: "#060510", border: "1px solid #1a1628",
                              color: "#ddd0a8", padding: "9px 12px",
                              fontSize: 12, fontFamily: "inherit", borderRadius: 2, outline: "none",
                            }}
                            onFocus={e => e.target.style.borderColor = cardColor + "66"}
                            onBlur={e => e.target.style.borderColor = "#1a1628"}
                          />
                        </div>

                        {/* Existing memory */}
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 9, color: "#3a3020", letterSpacing: 1, marginBottom: 5 }}>
                            现有 memory.md（可选，粘贴后同步内容会与之衔接）
                          </div>
                          <textarea
                            value={evoSyncMemory}
                            onChange={e => setEvoSyncMemory(e.target.value)}
                            placeholder="粘贴角色现有的 memory.md 内容，或留空生成初始记忆…"
                            rows={4}
                            style={{
                              width: "100%", boxSizing: "border-box",
                              background: "#060510", border: "1px solid #1a1628",
                              color: "#ddd0a8", padding: "9px 12px",
                              fontSize: 11, fontFamily: "inherit", borderRadius: 2,
                              outline: "none", resize: "vertical",
                            }}
                            onFocus={e => e.target.style.borderColor = cardColor + "66"}
                            onBlur={e => e.target.style.borderColor = "#1a1628"}
                          />
                        </div>

                        {/* Sync button */}
                        <button
                          onClick={() => syncMemory(w.id)}
                          disabled={evoSyncing || !evoSyncCharName.trim()}
                          style={{
                            background: evoSyncCharName.trim() ? cardColor + "22" : "none",
                            border: `1px solid ${evoSyncCharName.trim() ? cardColor + "55" : "#1a1628"}`,
                            color: evoSyncCharName.trim() ? cardColor : "#2e2640",
                            padding: "8px 24px", fontSize: 10, letterSpacing: 2,
                            cursor: evoSyncing || !evoSyncCharName.trim() ? "not-allowed" : "pointer",
                            borderRadius: 2, fontFamily: "inherit", transition: "all 0.3s",
                          }}
                        >
                          {evoSyncing ? "生成中…" : "生成同步内容"}
                        </button>

                        {/* Sync result */}
                        {evoSyncResult?.worldId === w.id && evoSyncResult.content && (
                          <div style={{ marginTop: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <span style={{ fontSize: 9, color: cardColor, letterSpacing: 2 }}>新增记忆条目</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(evoSyncResult.content)}
                                style={{
                                  background: "none", border: `1px solid ${cardColor}44`, color: cardColor,
                                  padding: "3px 12px", fontSize: 8, letterSpacing: 1,
                                  cursor: "pointer", borderRadius: 2, fontFamily: "inherit",
                                }}
                              >复制</button>
                            </div>
                            <div style={{
                              background: "#060510", border: "1px solid #1a1628",
                              borderRadius: 3, padding: "12px 14px",
                              fontSize: 11, color: "#8a7a58", lineHeight: 1.8,
                              maxHeight: 280, overflowY: "auto",
                              whiteSpace: "pre-wrap", fontFamily: "inherit",
                            }}>
                              {evoSyncResult.content}
                            </div>
                          </div>
                        )}
                        {evoSyncResult?.worldId === w.id && evoSyncResult.error && (
                          <div style={{ marginTop: 10, fontSize: 9, color: "#7a4a3a" }}>
                            {evoSyncResult.error}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
          );
        })()}

      </div>{/* /main container */}

      {/* Footer */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "7px 0", background: "#060510",
        borderTop: "1px solid #1a1628", textAlign: "center", zIndex: 10,
      }}>
        <span style={{ fontSize: 9, color: "#5a5068", letterSpacing: 5, textTransform: "uppercase" }}>
          神话学 · 比较宗教学 · 民俗文学 · 唯识论 · 灵犀世界
        </span>
      </div>
    </div>
  );
}
