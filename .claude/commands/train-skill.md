---
description: Train and validate Claude Code skill with 100% confidence verification
argument-hint: [skill-name] [skill-topic]
model: sonnet
---

# Train Skill Workflow

MUST create and validate Claude Code skill with EXACTLY 100% confidence before completion.

## Objective

Execute complete skill training workflow: research → prompt → create → validate → iterate until 100% confidence achieved.

## Variables

- SKILL_NAME: First argument (kebab-case name for skill directory)
- SKILL_TOPIC: Remaining arguments (topic for research and skill content)

## Instructions

### Phase 1: Expert Research

MUST run `/expert-research $SKILL_TOPIC` to gather comprehensive knowledge.

**Actions:**
1. Execute `/expert-research $SKILL_TOPIC`
2. Wait for research completion (all 5 agents + synthesis)
3. Verify deliverables exist:
   - `01_foundation_research.md`
   - `02_implementation_patterns.md`
   - `03_edge_cases_limitations.md`
   - `04_competing_approaches.md`
   - `05_security_production.md`
   - `master_research_report.md`

**Validation:**
- [ ] ALL 5 agent reports generated
- [ ] Master research report synthesized
- [ ] MINIMUM 21 tool calls executed
- [ ] Research depth level ≥ 4

**If validation fails:** Re-run research phase with corrections.

### Phase 2: Identify and Research Sub-Skills

MUST identify high-leverage sub-skills and conduct targeted research.

**Actions:**
1. Analyze master_research_report.md to extract potential sub-skills
2. Use AskUserQuestion tool to present sub-skills with ranking options:
   - Question: "Which sub-skills are most important for $SKILL_TOPIC?"
   - Header: "Sub-Skills"
   - Options: 4-6 identified sub-skills with descriptions
   - multiSelect: true (allow multiple selections)
3. For EACH selected high-leverage sub-skill:
   - Execute `/expert-research [sub-skill topic]`
   - Store results in dedicated sub-directory: `_project/research/$SKILL_NAME/sub-skills/[sub-skill-name]/`
4. Create sub-skill index: `_project/research/$SKILL_NAME/sub-skills-index.md`
   - List all researched sub-skills
   - Rank by importance/leverage (based on user selection order)
   - Reference main research report

**Sub-Skill Identification Criteria:**
- High leverage: Maximum impact on skill effectiveness
- Distinct focus: Each sub-skill covers unique aspect
- Practical: Can be taught/implemented independently
- Referenced: Will be bundled or linked in main skill

**Validation:**
- [ ] Sub-skills identified from research (4-6 candidates)
- [ ] User ranked sub-skills by importance
- [ ] Additional research completed for selected sub-skills
- [ ] Sub-skills index created with rankings
- [ ] All sub-skill research stored in organized structure

**If validation fails:** Re-run sub-skill identification or research.

### Phase 3: Create Skill Prompt

MUST run `/create-prompt` to generate token-optimized skill instructions.

**Actions:**
1. Extract key requirements from master_research_report.md AND sub-skills-index.md
2. Incorporate sub-skill knowledge into prompt objective
3. Formulate prompt objective: "Create $SKILL_NAME skill that covers [main topic] with deep focus on [ranked sub-skills]"
4. Execute `/create-prompt [objective from research + sub-skills]`
5. Verify prompt compliance:
   - [ ] 150-300 words
   - [ ] Iron Laws followed
   - [ ] Testable requirements
   - [ ] Power words used (MUST/ONLY/NEVER/EXACTLY)
   - [ ] Token density 40-70%
   - [ ] References sub-skills appropriately

**Output:** Compliant prompt for SKILL.md content with sub-skill integration.

### Phase 4: Create Skill Structure

MUST use skill-creator skill to implement skill.

**Actions:**
1. Load skill-creator skill if not already loaded
2. Follow skill-creator process:
   - Initialize skill: `.claude/skills/skill-creator/scripts/init_skill.py $SKILL_NAME --path .claude/skills/`
   - Create bundled resources (scripts/references/assets) based on main research AND sub-skills research
   - Include sub-skill references/links in bundled resources
   - Write SKILL.md using prompt from Phase 3
   - Reference sub-skills in SKILL.md content where appropriate
   - Apply prompt-engineering compliance
   - Apply token optimization

**Validation:**
- [ ] Skill directory created: `.claude/skills/$SKILL_NAME/`
- [ ] SKILL.md exists with valid YAML frontmatter
- [ ] SKILL.md references high-leverage sub-skills
- [ ] Bundled resources created (if applicable)
- [ ] Sub-skill research integrated into bundled resources
- [ ] Prompt-engineering compliance ≥ 95%

### Phase 5: Test Skill (Validation Loop)

CRITICAL: MUST achieve 100% confidence before marking complete.

**Test Protocol:**
1. Create test scenarios (MINIMUM 3) from research examples
2. For EACH test scenario:
   - Load skill: use Skill tool with skill name
   - Execute test task
   - Verify output matches expected behavior
   - Document: pass/fail + reasoning

**Confidence Calculation:**
```
confidence = (passed_tests / total_tests) * 100
```

**Validation Criteria:**
- [ ] ALL test scenarios pass
- [ ] Skill triggers on expected keywords
- [ ] Bundled resources load correctly
- [ ] Output format matches specification
- [ ] No errors during execution
- [ ] Confidence = EXACTLY 100%

**If confidence < 100%:**
1. Document failure reasons
2. Update SKILL.md or bundled resources (including sub-skill integration if needed)
3. Re-run Phase 5 tests
4. Repeat until confidence = 100%

**NEVER proceed to completion if confidence < 100%**

### Phase 6: Report Completion

ONLY report complete when ALL validations pass.

**Report Format:**
```markdown
# Skill Training Complete: $SKILL_NAME

## Summary
- Research: ✅ (X tool calls, level Y depth)
- Sub-Skills: ✅ (N sub-skills identified, M researched)
- Prompt: ✅ (Z words, A% density)
- Creation: ✅ (skill at .claude/skills/$SKILL_NAME/)
- Validation: ✅ (100% confidence, X/X tests passed)

## Skill Details
- Name: $SKILL_NAME
- Description: [from SKILL.md frontmatter]
- Triggers: [keywords from description]

## High-Leverage Sub-Skills
1. [Sub-skill 1]: [brief description]
2. [Sub-skill 2]: [brief description]
3. [Sub-skill N]: [brief description]

## Test Results
1. Test Scenario 1: ✅ PASS
2. Test Scenario 2: ✅ PASS
3. Test Scenario 3: ✅ PASS

## Files Created
- .claude/skills/$SKILL_NAME/SKILL.md
- _project/research/$SKILL_NAME/sub-skills-index.md
- _project/research/$SKILL_NAME/sub-skills/[sub-skill-name]/
- [additional bundled resources]

## Usage
Load skill: `use skill-creator skill`
Trigger: [describe when skill activates]
```

## WebSearch Fallback (Firecrawl)

**CRITICAL:** If WebSearch returns 4xx error, MUST retry with Firecrawl.

**Implementation:**
```bash
# On WebSearch 4xx error:
if [[ $websearch_status =~ ^4[0-9]{2}$ ]]; then
  curl -X POST https://api.firecrawl.dev/v1/scrape \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$FAILED_URL\"}"
fi
```

**Retry Logic:**
1. Detect WebSearch 4xx error
2. Extract failed URL
3. Call Firecrawl API with $FIRECRAWL_API_KEY env var
4. Parse Firecrawl response
5. Continue with scraped content

**NEVER fail workflow on 4xx - ALWAYS attempt Firecrawl fallback**

## Anti-Patterns

❌ Report complete before 100% confidence
❌ Skip validation tests
❌ Ignore WebSearch 4xx errors
❌ Accept partial test passes (e.g., 2/3)
❌ Skip research phase
❌ Skip sub-skill identification phase
❌ Ignore user-selected sub-skills
❌ Use non-compliant prompt
❌ Create skill without integrating sub-skill research

✅ Execute ALL phases sequentially
✅ Validate at EACH phase
✅ Identify and research high-leverage sub-skills
✅ Incorporate sub-skill research into main skill
✅ Iterate until 100% confidence
✅ Use Firecrawl fallback on 4xx
✅ Follow prompt-engineering Iron Laws
✅ Test with realistic scenarios

## Constraints

- Confidence threshold: EXACTLY 100% (NEVER less)
- Test scenarios: MINIMUM 3
- Research tool calls: MINIMUM 21
- Sub-skills identified: MINIMUM 4, MAXIMUM 6
- Sub-skills researched: User-selected (multiSelect)
- Prompt length: MINIMUM 150, MAXIMUM 300 words
- Validation phases: EXACTLY 5 (Research, Sub-Skills, Prompt, Create, Test)
- NEVER skip validation loop
- NEVER skip sub-skill identification
- NEVER report completion with failed tests

## Input

- Skill name: $SKILL_NAME
- Topic: $SKILL_TOPIC

## Output

Fully validated skill in `.claude/skills/$SKILL_NAME/` with 100% confidence verification.
