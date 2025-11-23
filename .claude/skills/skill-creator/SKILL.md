---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt
---

# Skill Creator

MUST create effective skills following project patterns with EXACTLY specified structure.

## About Skills

Skills extend Claude's capabilities with specialized knowledge, workflows, and tools. Transform general-purpose agent into specialized agent with procedural knowledge.

### What Skills Provide

1. **Specialized workflows** - Multi-step procedures
2. **Tool integrations** - File formats/APIs
3. **Domain expertise** - Schemas, business logic
4. **Bundled resources** - Scripts, references, assets

### Anatomy of a Skill

**Structure:**
```
skill-name/
├── SKILL.md (YAML frontmatter + instructions)
└── scripts/, references/, assets/ (optional)
```

**SKILL.md (required):** YAML frontmatter (`name`, `description`) determines when skill triggers. Use third-person ("This skill should be used when...").

**Bundled Resources (optional):**

| Type | Purpose | Examples | When |
|------|---------|----------|------|
| `scripts/` | Executable code | `rotate_pdf.py` | Repeated code, deterministic tasks |
| `references/` | Loaded as-needed docs | `schema.md`, `api_docs.md` | Database schemas, API specs, policies |
| `assets/` | Output files (NOT loaded) | `logo.png`, `template.pptx` | Templates, boilerplate, images |

**Avoid duplication:** Information lives in SKILL.md OR references, not both. Prefer references for details; keep SKILL.md lean (essential workflow only).

### Progressive Disclosure

Three-level loading for context efficiency:
1. **Metadata** - Always in context (~100w)
2. **SKILL.md body** - When skill triggers (<5kw)
3. **Bundled resources** - As needed (unlimited: scripts execute without context load)

## Skill Creation Process

MUST follow these steps in order. Skip ONLY if not applicable.

### Step 1: Understand Skill with Concrete Examples

**Task:** Collect usage examples (user-provided or generated + validated).

**Questions:**
- "What functionality should this skill support?"
- "Examples of how this skill would be used?"
- "What would trigger this skill?"

**Decision:** Skip if usage patterns already clear. Otherwise gather examples until functionality scope is understood.

### Step 2: Plan Reusable Skill Contents

**Task:** Analyze each example → identify reusable resources.

**Analysis:**
1. How to execute from scratch?
2. What resources help repeat execution?

**Examples:**
- `pdf-editor` ("rotate PDF") → `scripts/rotate_pdf.py` (repeated code)
- `frontend-webapp-builder` ("build todo app") → `assets/hello-world/` (boilerplate)
- `big-query` ("users logged today") → `references/schema.md` (table schemas)

**Output:** List of scripts, references, assets to include.

### Step 3: Initialize Skill

**Task:** Create skill structure using initialization script.

**Decision:** Skip if skill already exists (continue to Step 4).

**Usage:**
```bash
.claude/lib/init_skill.py <skill-name> --path <output-directory>
```

**Script generates:**
- Skill directory at specified path
- SKILL.md template (frontmatter + TODOs)
- Example directories: `scripts/`, `references/`, `assets/`
- Example files (customize or delete)

After initialization: customize/remove generated files.

### Step 4: Edit the Skill

**CRITICAL:** MUST follow prompt-engineering compliance (Iron Laws, power words, validation).

#### A. Implement Reusable Resources

1. Create `scripts/`, `references/`, `assets/` files identified in Step 2
2. Delete unused example files from initialization
3. Request user input if needed (brand assets, documentation)

#### B. Apply Prompt-Engineering Compliance

**MUST follow `_project/docs/prompt-engineering.md`:**
- ✅ Iron Laws: Single objective, testable requirements, exact numbers, constraints last
- ✅ Power words: MUST (96), ONLY (95), NEVER (93), EXACTLY (88)
- ✅ Structure: Request → Context → Requirements → Constraints → Output
- ✅ Validation: If can't write `assert`, model can't comply

#### C. Apply Token Optimization (70-80% reduction)

**MUST optimize for token density:**
- ✅ Tables over paragraphs
- ✅ Bullets over prose
- ✅ `✅`/`❌` shorthand
- ✅ Remove "Why" sections
- ✅ One example (not multiple)
- ✅ Merge overlapping sections

#### D. Update SKILL.md

**Writing Style:** Imperative/infinitive form ("To accomplish X, do Y" NOT "You should do X").

**MUST answer:**
1. Purpose (few sentences)
2. When to use skill
3. How Claude uses skill (reference all bundled resources)

#### E. Checklist Pattern (Multi-Session Skills)

**If skill generates checklist → Create `_project/checklists/{skill-name}/`**
- NEVER TodoWrite for multi-session work
- Track in `_project/checklists/` (NOT ephemeral TodoWrite)

### Step 5: Iterate

**Iteration workflow:**
1. Use skill on real tasks
2. Notice struggles/inefficiencies
3. Identify SKILL.md or bundled resource updates
4. Implement changes and test again

**Refinement loop:** Test → Notice gaps → Update → Retest
