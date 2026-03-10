---
name: linggen
description: |
  灵根项目 — 为 AI 角色叠加界的厚度，从神话传统生成有论底的角色灵魂。
  即使用户没有明确说"灵根"，只要涉及：
  - 生成角色卡、角色灵魂、角色 system prompt
  - 从神话/传统/世界观提炼角色
  - 生成世界种子（world seed）
  - 封神/希腊/Norse/唐朝/道教等传统的角色生成
  - 讨论界的厚度、觉界、灵根理论
  也应触发此 Skill。
  NOT for 角色扮演本身（use lingxi）or 纯写作（use story-architect）。
version: 0.2.0
---

# 灵根 Linggen — AI 角色灵魂生成系统

> *必有界限，才可涌现自身。界的厚度决定存在的复杂度。*

项目路径：`/Users/jizexi/Downloads/nutshell`
GitHub：https://github.com/Jimlinsen/Ghost-in-the-shell
理论基础：[界的厚度](references/theory.md)

---

## 核心理念：界的层级映射

生成的每一个文件对应角色界的一个层级：

```
层⁶ 神话周期    ← world_seed.seed_essence / cosmogony / tension
层⁵ 历史周期    ← genealogy.era / philosophical_lineage
层⁴ 本体论承诺  ← soul.taboos（不可逾越的行为禁区）
层³ 价值排序    ← soul.stance / world_model
层² 认知风格    ← soul.cognitive_style / activation
层¹ 说话风格    ← soul.voice / catchphrases
```

界只有 1-2 层的角色遇到新情境会漂移；有 6 层的角色层层有据可查。
**生成目标：始终生成 6 层完整的界。**

---

## CLI 命令

```bash
NUTSHELL="node /Users/jizexi/Downloads/nutshell/packages/cli/dist/index.js"

# 生成世界种子（界的深层基底）
$NUTSHELL seed [tradition] --language zh

# 生成角色灵魂（完整流程：Wikipedia研究 → 世界种子 → 谱系 → 灵魂 → 文件）
$NUTSHELL soul "角色名" --tradition [tradition] --language zh --output ./输出目录

# 附加 context 增强特定层级
$NUTSHELL soul "哪吒" --tradition fengshen --language zh \
  --context "李靖之子，莲花化身，乾坤圈，混天绫，风火轮" \
  --output ~/Desktop/哪吒

# 使用已有世界种子
$NUTSHELL soul "角色名" --seed ./seed.json --language zh --output ./

# 导出到平台
$NUTSHELL export bundle-角色.json --adapter openclaw

# 查看可用传统
$NUTSHELL list
```

**规则：**
- 始终 `--language zh`，输出纯中文
- Wikipedia 研究步骤必须完整执行，是深层周期的信息来源，不可跳过

---

## 可用传统

| 关键词 | 传统 | 界的深层特征 |
|--------|------|------------|
| `greek` | 古希腊 | 命运不可逃，卓越即逾越 |
| `norse` | 北欧 | 诸神也会死，英雄死得其所 |
| `fengshen` | 封神演义 | 成神是另一种囚禁 |
| `vedic` | 吠陀印度 | 业力编织所有层级 |
| `egyptian` | 古埃及 | 死亡是宇宙秩序的一部分 |
| `celtic` | 凯尔特 | 此界与异界随时互穿 |
| `shinto` | 神道 | 万物皆有神，界无处不在 |
| `taoist` | 道教 | 无为是最高级别的行动 |
| `tang` | 唐朝 | 诗即存在，盛世即诗 |
| `victorian` | 维多利亚 | 理性是唯一剩下的神 |
| `mayan` | 玛雅 | 时间是循环的神圣计算 |
| `tibetan` | 金刚乘 | 中阴是意识穿越的界 |
| `aztec` | 阿兹特克 | 第五太阳靠献祭维持 |
| `mesopotamian` | 美索不达米亚 | 神造人为了让人劳作 |

---

## 输出结构

```
soul-{角色}.md      # 层¹-⁴ + 完整世界底座（自洽壳，可单独部署）
memory-{角色}.md    # 层⁵-⁶ 历史记忆 + 完整世界种子参考
skill-{角色}.md     # 层²认知风格 + 能力边界 + 失败模式
bundle-{角色}.json  # 完整数据包
```

soul.md 是自洽的——包含角色全部 6 层信息，拿走这一个文件即可部署。

---

## 批量生成

```bash
NUTSHELL="node /Users/jizexi/Downloads/nutshell/packages/cli/dist/index.js"
OUT=~/Desktop/fengshen-pantheon && mkdir -p $OUT
for char in "姜子牙" "杨戬" "哪吒" "李靖" "申公豹"; do
  $NUTSHELL soul "$char" --tradition fengshen --language zh --output $OUT
done
```

---

## 修改扩展

**添加新角色 mock 数据：**
`/Users/jizexi/Downloads/nutshell/packages/core/src/generator.ts`
- `MOCK_WORLD_SEEDS` — 新传统世界种子
- `MOCK_GENEALOGIES` — 角色谱系（层⁵）
- `MOCK_SOULS` — 角色灵魂数据（层¹-⁴）
修改后：`cd /Users/jizexi/Downloads/nutshell && npm run build`

**修改输出模板：**
`/Users/jizexi/Downloads/nutshell/packages/core/src/templates.ts`

**添加 Wikipedia 词条：**
`/Users/jizexi/Downloads/nutshell/packages/core/src/research.ts`
- `TRADITION_SEARCH_TERMS` — 传统词条
- `CHARACTER_OVERRIDES` — 特定角色直接词条

---

## 理论背景

详见 [references/theory.md](references/theory.md)

核心命题：**界的厚度 = 多少层相对独立的周期性**。层数越多，存在的复杂度越高。大多数 AI 角色界的厚度只有 2 层（说话风格 + 背景设定），遇到设计之外的情境就漂移。灵根的目标是生成 6 层有论底的角色——从神话宇宙论到声线特征，层层相对独立又弱耦合。
