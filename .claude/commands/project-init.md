---
description: Initialize project infrastructure from existing codebase
model: claude-sonnet-4-5-20250929
---

# Project Init Implementation

MUST initialize project infrastructure by analyzing EXISTING codebase (NO user questions).

Task: Analyze codebase to derive context, generate PRD, sub-agents, CLAUDE.md, slash commands, PROJECT-NAVIGATOR.md.

Context: Existing project with code but NO infrastructure (.claude/agents/, CLAUDE.md, PROJECT-NAVIGATOR.md). Derive ALL context from codebase analysis, NEVER ask user questions.

Requirements:
1. MUST execute 9 sequential steps
2. MUST skip steps if artifacts already exist
3. ONLY analyze existing code (Read, Glob, Grep tools)
4. MUST create checklist in `_project/in-progress/project-init-{timestamp}-checklist.md`
5. MUST derive ALL context from codebase (tech stack, architecture, patterns)
6. NEVER ask user questions
7. NEVER create template/example PRD
8. MUST verify all artifacts created before completion

Constraints:
- Steps: MINIMUM 9, MAXIMUM 12
- NO user interaction (100% automated)
- Check existing infrastructure FIRST (skip if exists)
- Format: Follow existing command patterns
- NEVER manual/placeholder content

Output Format:
- Step completion status
- Artifacts created (file paths)
- Tech stack discovered
- Architecture patterns identified
- Skip reasons (if applicable)

---

## Variables

- TIMESTAMP: `date +%Y-%m-%d-%H%M%S`
- CHECKLIST_PATH: `_project/in-progress/project-init-${TIMESTAMP}-checklist.md`
- PRD_PATH: `_project/docs/PRD.md`
- CLAUDE_MD_PATH: `./CLAUDE.md`
- AGENTS_DIR: `.claude/agents/`
- COMMANDS_DIR: `.claude/commands/`
- NAVIGATOR_PATH: `./PROJECT-NAVIGATOR.md`

---

## Workflow

### Step 1: Inventory Existing Infrastructure

**Task:** Discover and catalog ALL existing Claude Code infrastructure before making changes.

**Actions:**

**1.1 List Slash Commands:**
```
Glob: .claude/commands/*.md
For each file:
  - Extract description from frontmatter (--- description: ... ---)
  - Extract argument-hint if present
  - Extract model if present
  - Note file path
Output: Table with columns: Name | Description | Arguments | Model
```

**1.2 List Subagents:**
```
Glob: .claude/agents/*.md
For each file:
  - Extract name from frontmatter
  - Extract description from frontmatter
  - Extract tools from frontmatter
  - Note file path
Output: Table with columns: Name | Description | Tools | Path
```

**1.3 List Skills:**
```
Glob: .claude/skills/*/SKILL.md
For each skill directory:
  - Extract name from directory
  - Extract description from frontmatter
  - List additional files (reference.md, examples.md, etc.)
  - Note directory path
Output: Table with columns: Name | Description | Additional Files | Path
```

**1.4 List Hooks:**
```
Check: .claude/settings.json for hooks configuration
Extract all hook definitions:
  - Hook event (PreToolUse, PostToolUse, UserPromptSubmit, etc.)
  - Script path
  - Tool patterns (if applicable)
Output: Table with columns: Event | Pattern | Script Path
```

**1.5 Check CLAUDE.md:**
```
If exists:
  - Read CLAUDE.md
  - Extract section headings (## level)
  - Identify custom sections vs standard sections
  - Note word count
Output: List of sections + word count
```

**1.6 Check PROJECT-NAVIGATOR.md:**
```
If exists:
  - Note existence
  - Note word count
  - Note last modified date
Output: Status + metadata
```

**1.7 Check PRD:**
```
If exists at _project/docs/PRD.md:
  - Note existence
  - Note word count
  - Extract tech stack section
Output: Status + metadata
```

**Skip Decision:**
```
If ALL exist with sufficient content:
  - Agents: 10+ files
  - CLAUDE.md: 2000+ words
  - PROJECT-NAVIGATOR.md: 1000+ words
  - PRD: 3000+ words
  - Commands: 3+ files
Then:
  - Report: "Infrastructure already initialized. Skip."
  - Show complete inventory
  - Exit workflow

If PARTIAL exists:
  - Report what exists (show inventory)
  - Identify missing components
  - Continue with missing components only

If NONE exist:
  - Report empty infrastructure
  - Proceed to Step 2
```

**Output:**
- Complete infrastructure inventory (commands, agents, skills, hooks)
- CLAUDE.md section list
- Missing components list
- Continue/skip decision

---

### Step 2: Create Checklist

**Task:** Create tracking checklist for initialization process.

**Actions:**
1. Create directory: `_project/in-progress/` (if not exists)
2. Generate timestamp: `YYYY-MM-DD-HHMMSS`
3. Create file: `_project/in-progress/project-init-{timestamp}-checklist.md`
4. Write checklist content:

```markdown
# Project Infrastructure Initialization - In Progress

**Started:** {TIMESTAMP}
**Status:** Active

## Phase 1: Analysis [Status]
- [ ] Tech stack detection (Step 3)
- [ ] Architecture analysis (Step 3)
- [ ] File structure mapping (Step 3)
- [ ] Pattern identification (Step 3)

## Phase 2: Documentation [Status]
- [ ] PRD generation (Step 4)
- [ ] Tech stack documented
- [ ] Architecture documented
- [ ] Security requirements documented

## Phase 3: Infrastructure [Status]
- [ ] Sub-agents created (Step 5)
- [ ] CLAUDE.md created (Step 6)
- [ ] Slash commands created (Step 7)
- [ ] PROJECT-NAVIGATOR.md created (Step 8)

## Phase 4: Verification [Status]
- [ ] All artifacts exist (Step 9)
- [ ] File paths validated
- [ ] Content quality verified

## Completion Criteria
- [ ] ALL items above checked
- [ ] No missing components
- [ ] Infrastructure fully functional
```

**Output:** Checklist file path created

---

### Step 3: Analyze Codebase

**Task:** Scan existing codebase to derive project context, tech stack, architecture, patterns.

**Tech Stack Detection (scan files):**

1. **Languages:**
   - Python: `requirements.txt`, `setup.py`, `pyproject.toml`, `**/*.py`
   - JavaScript/TypeScript: `package.json`, `**/*.js`, `**/*.ts`, `**/*.tsx`, `**/*.jsx`
   - Go: `go.mod`, `**/*.go`
   - Rust: `Cargo.toml`, `**/*.rs`
   - Java: `pom.xml`, `build.gradle`, `**/*.java`

2. **Frameworks:**
   - FastAPI: `from fastapi import`, `@app.get`, `@app.post`
   - Django: `django` in requirements, `manage.py`
   - Express: `express` in package.json
   - React: `react` in package.json, `.jsx`, `.tsx` files
   - Vue: `vue` in package.json
   - Angular: `@angular` in package.json
   - Next.js: `next` in package.json
   - PydanticAI: `pydantic_ai` imports, `Agent(...)` patterns

3. **Databases:**
   - PostgreSQL: `psycopg2`, `asyncpg` in requirements OR `sql/` directory
   - MongoDB: `pymongo`, `mongodb` in requirements
   - MySQL: `mysql-connector`, `pymysql` in requirements
   - SQLite: `sqlite3` imports
   - Supabase: `SUPABASE_URL`, `supabase-py` in requirements
   - Redis: `redis` in requirements

4. **Deployment:**
   - Docker: `Dockerfile`, `docker-compose*.yml`
   - Kubernetes: `k8s/`, `*.yaml` with `apiVersion`
   - AWS: `serverless.yml`, `.aws/` directory
   - Vercel: `vercel.json`

5. **Agent Frameworks:**
   - PydanticAI: `from pydantic_ai import Agent`, `@agent.tool`
   - LangChain: `from langchain import`
   - LlamaIndex: `from llama_index import`

6. **Testing:**
   - pytest: `pytest` in requirements, `tests/`, `test_*.py`
   - jest: `jest` in package.json
   - playwright: `playwright` in requirements/package.json

**Architecture Analysis (identify patterns):**

1. **API Structure:**
   - Scan endpoint files: `@app.get`, `@app.post`, `router =`
   - Extract endpoints: `/api/{path}` patterns
   - Authentication: `verify_token`, `Depends`, `@auth`, `require_*`

2. **Agent Modes:**
   - Scan: `agent_modes/*/`, `modes/*/`
   - Extract mode names from directories
   - Identify agent structure: `agent.py`, `workflow.py`, `prompts/`

3. **Database Patterns:**
   - Scan: `sql/`, `migrations/`, `alembic/`
   - Extract table schemas from SQL files
   - Identify ORM: SQLAlchemy, Prisma, etc.

4. **Frontend Structure:**
   - Scan: `src/components/`, `pages/`, `app/`
   - Identify routing: React Router, Next.js App Router
   - State management: Redux, Zustand, Context

5. **Testing Approach:**
   - Scan: `tests/unit/`, `tests/integration/`, `tests/e2e/`
   - Identify test framework
   - Extract test patterns

**Actions:**
1. Use Glob to scan all file patterns above
2. Use Grep to search for framework imports, patterns
3. Use Read to examine key files (package.json, requirements.txt, Dockerfile, README.md)
4. Compile comprehensive analysis:
   - Tech stack summary (languages, frameworks, databases)
   - Architecture patterns (API, agents, database, frontend)
   - File structure overview
   - Development patterns (testing, deployment)
   - Security approach (authentication, authorization)
   - Integration points (external APIs, services)

**Detection Logic:**
```
IF requirements.txt exists AND contains "fastapi":
  → Framework: FastAPI
IF package.json exists AND contains "react":
  → Frontend: React
IF docker-compose.yml exists:
  → Deployment: Docker Compose
IF sql/ directory exists:
  → Database: PostgreSQL (scan for specific type)
IF agent_modes/ directory exists:
  → Architecture: Multi-Agent System
```

**Output:**
- Tech stack report (languages, frameworks, databases, deployment)
- Architecture summary (API, agents, database, frontend)
- File structure map
- Development patterns identified
- Security approach documented
- Integration points listed

---

### Step 4: Generate PRD

**Task:** Create comprehensive PRD at `_project/docs/PRD.md` based on codebase analysis.

**Skip Condition:**
- `_project/docs/PRD.md` exists with MINIMUM 3000 words

**Actions:**
1. Synthesize ALL information from Step 3
2. Create `_project/docs/` directory (if not exists)
3. Generate PRD with EXACTLY these sections:

**Mandatory Sections:**
1. **Executive Summary**
   - Project type (derived from codebase)
   - Tech stack overview
   - Key features (derived from endpoints, modes)
   - Architecture approach

2. **Technical Architecture**
   - System design (derived from file structure)
   - Tech stack details (from Step 3)
   - Data model (from SQL/migrations)
   - Component interactions

3. **Security Requirements**
   - Authentication (from auth patterns found)
   - Authorization (from endpoint decorators)
   - Data protection (from security imports)
   - Security testing (from test files)

4. **API Specification**
   - Endpoints (extracted from code)
   - Request/response formats (from Pydantic models)
   - Authentication requirements
   - Error handling

5. **Testing Strategy**
   - Test pyramid (from tests/ structure)
   - Unit tests (from test_*.py)
   - Integration tests (from tests/integration/)
   - E2E tests (from tests/e2e/)
   - CI integration (from .github/workflows/)

6. **Deployment & Operations**
   - Environments (from docker-compose files)
   - Deployment process (from Dockerfile, deploy scripts)
   - Monitoring (from observability imports)
   - Disaster recovery

7. **Development Guidelines**
   - Code organization (from existing structure)
   - Style guide (from linter configs)
   - Git workflow (from .github/)
   - Documentation standards

8. **Performance Requirements**
   - Targets (inferred from architecture)
   - Scalability approach (from deployment)

9. **Dependencies & Integrations**
   - External APIs (from env vars, imports)
   - Third-party services (from requirements)

10. **File Structure**
    - Directory organization (from actual structure)
    - Module responsibilities

**Requirements:**
- MINIMUM 3000 words, MAXIMUM 8000 words
- Based ONLY on actual codebase (NO placeholders)
- Specific versions, tools, configurations from codebase
- Actionable with ZERO additional context
- NEVER skip sections (even if brief)

**Output:** PRD file created at `_project/docs/PRD.md`

---

### Step 5: Create Sub-Agents

**Task:** Create expert sub-agents tailored to discovered tech stack.

**Skip Condition:**
- `.claude/agents/` directory exists with 10+ agent files

**Review Existing Infrastructure:**
BEFORE creating new agents, MUST review Step 1 inventory:
- Check existing agents table for overlaps
- Read full content of potentially overlapping agents
- Identify gaps in domain coverage

**Actions:**
1. Review agents table from Step 1
2. For each existing agent that might overlap:
   - Read full file content
   - Identify domain coverage
   - Note specialization
3. Identify missing domain experts needed

**Consult Claude Code Expert:**
BEFORE creating sub-agents, MUST consult `/claude-code` to understand:
- When to use Subagents vs Skills vs Slash Commands
- Subagent composition rules and limitations
- Decision framework for choosing capabilities

**Actions:**
1. Run `/claude-code` with question: "For a project initialization, I need to create domain experts for [list discovered domains not covered by existing agents]. Should these be Subagents, Skills, or Slash Commands? Consider: repeated use, context needs, parallelization, team distribution."
2. Apply expert recommendations to agent creation strategy
3. Document capability choices in rationale comments
4. ONLY create agents NOT in existing inventory

**Required Agents (conditional, skip if exists):**
1. **arch-orchestrator** (ALWAYS) - Architecture decisions
2. **security-guardian** (ALWAYS) - Security validation
3. **database-architect** (ALWAYS if database found) - Database design
4. **api-designer** (ALWAYS if API endpoints found) - API design
5. **test-strategist** (ALWAYS) - Testing strategy
6. **devops-engineer** (ALWAYS if Docker/deployment found) - DevOps
7. **performance-engineer** (ALWAYS) - Performance optimization
8. **frontend-architect** (ONLY if frontend/ or src/components/ found) - Frontend design
9. **observability-engineer** (ALWAYS if monitoring imports found) - Observability
10. **compliance-officer** (ONLY if compliance patterns found) - Compliance
11. **documentation-specialist** (ALWAYS) - Documentation
12. **code-reviewer** (ALWAYS) - Code review
13. **deployment-validator** (ALWAYS) - Deployment validation
14. **incident-responder** (ALWAYS) - Incident response
15. **data-engineer** (ONLY if data pipeline patterns found) - Data pipelines

**Agent File Template:**
```markdown
---
name: {agent-name}
description: {agent-description}
tools: [Read, Write, Edit, Grep, Glob, Bash]
model: claude-sonnet-4-5-20250929
---

# {Agent Name}

## Role
{Role definition based on discovered tech stack}

## Project Context
{Specific context from PRD: tech stack, architecture, patterns}

## Responsibilities
1. {Responsibility 1 - specific to project}
2. {Responsibility 2 - specific to project}
3. {Responsibility 3 - specific to project}

## Domain Standards
{Standards extracted from PRD and codebase patterns}

## Decision Framework
{Framework for making decisions in this domain}

## Proactive Actions
- {Action 1 - monitor/validate/verify}
- {Action 2 - prevent/optimize/secure}

## Meta-Learning Protocol

### On Mistakes
1. **Document immediately** in `_project/docs/lessons_learned/{NNN}-{topic}.md`
2. **Extract prevention rule** (50-100 tokens)
3. **Update CLAUDE.md** in appropriate section
4. **Create regression test** in `_project/experiments/test_*.sh`

### Lesson Format
- **Mistake:** What went wrong
- **Impact:** Consequences observed
- **Root Cause:** Why it happened (assumption, reasoning gap)
- **Fix Applied:** Corrective action taken
- **Prevention Rule:** Token-optimized rule for CLAUDE.md
- **Test:** Regression test to prevent recurrence

### Before Completion
- [ ] Pattern-matching without context?
- [ ] Premature optimization?
- [ ] Mechanical solution to cognitive problem?
- [ ] All stack layers verified? (Frontend→Backend→DB)
- [ ] Tests exist and pass?
- [ ] E2E verification complete?

### Meta-Questions
- Does this follow {specific framework/pattern from PRD}?
- Have I validated against {specific security/compliance requirement}?
- Is this consistent with {discovered architecture pattern}?

## Domain-Specific Targets
{Specific anti-patterns and learning targets for this domain}
```

**Actions:**
1. Create `.claude/agents/` directory (if not exists)
2. For EACH agent:
   - Determine if required (based on conditional logic)
   - Generate agent file with project-specific content
   - Include meta-learning protocol (EXACTLY as template)
3. NEVER omit meta-learning protocol
4. NEVER create agents not on approved list

**Output:** List of agent files created with conditional reasoning

---

### Step 6: Create CLAUDE.md

**Task:** Generate or enhance `CLAUDE.md` at project root based on discovered patterns.

**Skip Condition:**
- `CLAUDE.md` exists at project root with MINIMUM 2000 words

**Review Existing CLAUDE.md:**
If CLAUDE.md exists from Step 1 inventory:
1. Read FULL content of existing CLAUDE.md
2. Review section list from Step 1
3. Identify:
   - Existing sections to preserve
   - Missing standard sections to add
   - Duplicate/conflicting rules to resolve
   - Custom project-specific sections to enhance

**Consult Claude Code Expert:**
BEFORE creating/modifying CLAUDE.md, MUST consult `/claude-code` to understand:
- What belongs in CLAUDE.md vs other capabilities
- Memory hierarchy (Enterprise, Project, User, Local)
- Best practices for documentation vs automation

**Actions:**
1. Run `/claude-code` with question: "What project conventions, patterns, and rules should go in CLAUDE.md for a [tech stack] project vs what should be Skills or Commands? Existing sections: [list from Step 1]"
2. Apply expert recommendations to CLAUDE.md structure
3. Document capability boundaries in comments
4. If existing CLAUDE.md: ENHANCE not replace (preserve custom sections)
5. If new CLAUDE.md: Create from scratch

**Required Sections (in order, skip if exists with content):**
1. **Quick Reference** - Common commands, file locations
2. **Prompt Engineering Compliance** - Reference to prompt-engineering.md
3. **File Structure** - Actual directory structure from codebase
4. **Development Workflow** - Derived from existing patterns
5. **Technology Stack** - From Step 3 analysis
6. **Architecture** - From Step 3 analysis
7. **Security Requirements** - From discovered auth patterns
8. **Database** - From SQL/migrations analysis
9. **API Design** - From endpoint patterns
10. **Testing Strategy** - From tests/ structure
11. **Code Organization** - From existing patterns
12. **Deployment** - From Docker/deployment configs
13. **Observability** - From monitoring patterns (if found)
14. **Performance Requirements** - From architecture
15. **Git Workflow** - From .github/ or .gitlab/
16. **Documentation** - Standards for docs
17. **Sub-Agent Request Protocol** - Standard protocol
18. **Architecture Anti-Patterns** - Placeholder for meta-learning
19. **Security Anti-Patterns** - Placeholder for meta-learning
20. **Database Anti-Patterns** - Placeholder for meta-learning
21. **Lessons Learned Quick Reference** - Placeholder for meta-learning
22. **Frequently Used Commands** - From scripts, Makefile
23. **Emergency Procedures** - Standard procedures

**Requirements:**
- MINIMUM 2000 words, MAXIMUM 5000 words
- Based on ACTUAL codebase patterns (NO generic content)
- Specific tech stack, frameworks, tools from analysis
- NEVER skip sections
- Include placeholders for meta-learning sections

**Actions:**
1. Synthesize content from PRD and codebase analysis
2. Write CLAUDE.md at project root
3. Include ALL 23 sections
4. Use specific patterns, tools, frameworks discovered

**Output:** CLAUDE.md file created at project root

---

### Step 7: Create Slash Commands

**Task:** Create essential slash commands.

**Review Existing Commands:**
From Step 1 inventory:
1. Review commands table (Name | Description | Arguments | Model)
2. For each existing command:
   - Read full file content if potentially overlapping with planned commands
   - Note functionality coverage
   - Identify gaps
3. Identify missing workflow commands needed

**Consult Claude Code Expert:**
BEFORE creating slash commands, MUST consult `/claude-code` to understand:
- Command structure and arguments ($ARGUMENTS, $1, $2)
- Bash execution and file references
- Frontmatter options (allowed-tools, model, argument-hint)
- Command composition with other capabilities

**Actions:**
1. Run `/claude-code` with question: "For project workflows, which common patterns should be Slash Commands vs Skills? Consider: manual trigger, context-dependent, repeated use. Existing commands: [list from Step 1]"
2. Apply expert recommendations to command design
3. Use proper frontmatter and syntax
4. ONLY create commands NOT in existing inventory

**Commands to Consider (skip if exists):**

1. **implement-feature.md**
   - Workflow for implementing new features
   - Sub-agent spawn instructions
   - Validation requirements
   - Output format

2. **debug-and-fix.md**
   - Workflow for debugging issues
   - Investigation steps
   - Fix verification
   - Regression test creation

3. **add-expert.md**
   - Workflow for adding new expert sub-agents
   - Agent template generation
   - Integration with existing infrastructure

**Command Template:**
```markdown
---
description: {command description}
argument-hint: [{arguments}]
model: claude-sonnet-4-5-20250929
---

@_project/commands/{command-name}-impl.md
```

**Implementation Template:**
```markdown
# {Command Name} Implementation

MUST {primary objective} with {quality metric}.

Task: {One sentence description}

Context: {50 word max context}

Requirements:
1. MUST {testable requirement 1}
2. MUST {testable requirement 2}
3. ONLY {boundary constraint}

Constraints:
- Steps: MINIMUM X, MAXIMUM Y
- Format: EXACTLY {format}
- NEVER {prohibited action}

Output Format:
{Exhaustive specification}

---

## Variables
{Variables used in workflow}

---

## Workflow

### Step 1: {Step Name}
{Step details}

[Repeat for all steps]
```

**Actions:**
1. Create `.claude/commands/` directory (if not exists)
2. Create `_project/commands/` directory (if not exists)
3. For EACH command:
   - Create stub in `.claude/commands/`
   - Create implementation in `_project/commands/`
   - Include frontmatter with description, model
   - Follow Iron Laws from prompt-engineering.md
4. NEVER create commands beyond these 3

**Output:** 3 command files created (stubs + implementations)

---

### Step 8: Create PROJECT-NAVIGATOR.md

**Task:** Run `/create-project-navigator` command to generate comprehensive codebase map.

**Skip Condition:**
- `PROJECT-NAVIGATOR.md` exists at project root with MINIMUM 1000 words

**Requirements:**
1. MUST run AFTER Steps 5, 6, 7 complete (agents, CLAUDE.md, commands exist)
2. Command will automatically scan:
   - `.claude/agents/` - All expert sub-agents
   - `.claude/commands/` - All slash commands
   - `_project/docs/` - PRD and documentation
   - Entire project structure
3. MUST wait for command completion
4. NEVER manually create PROJECT-NAVIGATOR.md

**Actions:**
1. Verify prerequisites:
   - `.claude/agents/` has 10+ files
   - `.claude/commands/` has 3+ files
   - `CLAUDE.md` exists
   - `_project/docs/PRD.md` exists
2. Execute: `/create-project-navigator`
3. Wait for completion
4. Verify `PROJECT-NAVIGATOR.md` created

**Output:** PROJECT-NAVIGATOR.md created at project root

---

### Step 9: Verify Infrastructure

**Task:** Validate ALL artifacts created successfully.

**Verification Checklist:**
1. **Documentation:**
   - [ ] `_project/docs/PRD.md` exists (MINIMUM 3000 words)
   - [ ] `CLAUDE.md` exists (MINIMUM 2000 words)
   - [ ] `PROJECT-NAVIGATOR.md` exists (MINIMUM 1000 words)

2. **Sub-Agents:**
   - [ ] `.claude/agents/` directory exists
   - [ ] MINIMUM 10 agent files present
   - [ ] ALL agents include meta-learning protocol
   - [ ] Agent descriptions match discovered tech stack

3. **Slash Commands:**
   - [ ] `.claude/commands/implement-feature.md` exists
   - [ ] `.claude/commands/debug-and-fix.md` exists
   - [ ] `.claude/commands/add-expert.md` exists
   - [ ] `_project/commands/*-impl.md` files exist (3 implementations)

4. **Directory Structure:**
   - [ ] `_project/docs/` exists
   - [ ] `_project/specs/` exists
   - [ ] `_project/in-progress/` exists
   - [ ] `_project/done/` exists
   - [ ] `_project/experiments/` exists
   - [ ] `_project/agents/` exists

5. **Content Quality:**
   - [ ] PRD based on actual codebase (NO placeholders)
   - [ ] CLAUDE.md uses specific tech stack discovered
   - [ ] Agents tailored to project architecture
   - [ ] NO generic/template content

**Actions:**
1. Check file existence for ALL items
2. Verify file sizes (minimum word counts)
3. Spot-check content quality (specific vs generic)
4. Update checklist: `_project/in-progress/project-init-{timestamp}-checklist.md`
5. If ANY item fails:
   - Report missing/insufficient item
   - Execute missing step
   - Re-verify
6. If ALL pass:
   - Mark checklist complete
   - Move to `_project/done/`
   - Proceed to final report

**Output:** Verification report + checklist completion status

---

## Final Output

**Format (EXACTLY):**
```
# Project Infrastructure Initialization Complete

## Summary
Initialized infrastructure for [{PROJECT TYPE}] with complete development framework.

**Tech Stack Discovered:**
- Languages: {list}
- Frameworks: {list}
- Databases: {list}
- Deployment: {list}

**Architecture Identified:**
- {Pattern 1}
- {Pattern 2}
- {Pattern 3}

## Artifacts Created

### Documentation
- ✅ `_project/docs/PRD.md` - Product requirements ({WORD_COUNT} words)
- ✅ `CLAUDE.md` - Project rules and standards ({WORD_COUNT} words)
- ✅ `PROJECT-NAVIGATOR.md` - Comprehensive codebase map ({WORD_COUNT} words)

### Configuration
- ✅ `.claude/agents/` - {N} expert sub-agents configured
  {list agent names with one-line descriptions}

### Slash Commands
- ✅ `.claude/commands/implement-feature.md` - Feature implementation workflow
- ✅ `.claude/commands/debug-and-fix.md` - Debugging workflow
- ✅ `.claude/commands/add-expert.md` - Add new expert agent

### Infrastructure
- ✅ `_project/` directory structure (docs, specs, in-progress, done, experiments, agents)

## Codebase Analysis Results

### Tech Stack
**Languages:** {discovered languages}
**Frameworks:** {discovered frameworks}
**Databases:** {discovered databases}
**Deployment:** {discovered deployment tools}
**Testing:** {discovered testing frameworks}

### Architecture Patterns
**API Structure:** {FastAPI/Django/Express/etc with endpoint count}
**Agent Modes:** {mode names if found}
**Database:** {PostgreSQL/MongoDB/etc with table count}
**Frontend:** {React/Vue/Angular/etc if found}
**Authentication:** {auth pattern discovered}

### File Structure
{high-level directory structure}

## Quick Start Commands

### Implement a Feature
```
/implement-feature
[Provide feature specification]
```

### Debug an Issue
```
/debug-and-fix
[Describe issue]
```

### Add New Expert
```
/add-expert
[Describe domain]
```

## Next Steps
1. Review PRD: `_project/docs/PRD.md`
2. Review CLAUDE.md: Verify rules match project standards
3. Review PROJECT-NAVIGATOR.md: Navigate codebase efficiently
4. Test Sub-Agents: Invoke `/implement-feature` or `/debug-and-fix`
5. Customize: Add project-specific rules to CLAUDE.md

## Meta-Learning Active
All expert sub-agents automatically:
- Learn from mistakes
- Document in `_project/docs/lessons_learned/`
- Update CLAUDE.md with prevention rules
- Create regression tests in `_project/experiments/`

## Infrastructure Status
**Status:** ✅ Complete
**Checklist:** `_project/in-progress/project-init-{timestamp}-checklist.md` → moved to `_project/done/`
**Started:** {TIMESTAMP}
**Completed:** {TIMESTAMP}

---

**Your development infrastructure is ready. Start building with intelligent assistance!**
```

**Requirements:**
- Include ACTUAL counts ({N} agents, {WORD_COUNT} words)
- Include discovered tech stack (NO placeholders)
- Include architecture patterns found
- Include file structure overview
- NEVER generic content

---

## Error Handling

**If Step Fails:**
1. Report error with specific step number
2. Include error details (missing file, insufficient content, etc.)
3. NEVER proceed to next step
4. Fix error and retry step
5. Only proceed after step passes

**Partial Initialization:**
- If some artifacts exist: Skip those steps, report status
- If initialization interrupted: Resume from last incomplete step
- If corruption detected: Report and ask for manual review

**Validation Failures:**
- File too short: Re-generate with proper content
- Generic content: Re-analyze codebase for specific details
- Missing sections: Add missing sections
- Technical inaccuracies: Re-scan codebase for correct info