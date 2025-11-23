---
description: Train multiple Claude Code skills in parallel (max 6 concurrent)
argument-hint: [skill1-name:topic] [skill2-name:topic] [...]
model: sonnet
---

# Parallel Skill Training Workflow

MUST train multiple skills concurrently with MAXIMUM 6 parallel agents, EXACTLY 100% confidence per skill.

## Objective

Orchestrate parallel skill training using Task tool for concurrent research → prompt → create → validate cycles.

## Variables

- SKILL_DEFINITIONS: $ARGUMENTS (format: "skill-name:topic description" per skill)

## Instructions

### Step 1: Parse and Validate Input

**Actions:**
1. Parse $ARGUMENTS into individual skill definitions
2. Split each definition on `:` separator
   - Left side: skill-name (kebab-case)
   - Right side: skill-topic (description for research)
3. Count total skills requested
4. Validate count ≤ 6

**Validation:**
- [ ] ALL definitions have format: `skill-name:topic`
- [ ] Skill names valid (kebab-case, unique)
- [ ] Total skills: MINIMUM 1, MAXIMUM 6
- [ ] Topics non-empty

**If count > 6:**
```
Error: Maximum 6 skills allowed in parallel.
Requested: X skills
Action: Split into batches of 6 or reduce count.
```

### Step 2: Create Master Checklist

Create `_project/checklists/parallel-skill-training-{timestamp}.md`:

```markdown
# Parallel Skill Training - {timestamp}

**Status:** In Progress
**Started:** YYYY-MM-DD HH:MM:SS
**Total Skills:** X

## Skills Training Status

### Skill 1: {skill-name}
- [ ] Research phase complete (21+ tool calls)
- [ ] Prompt created (150-300w, compliant)
- [ ] Skill structure created
- [ ] Validation tests passed (100% confidence)
- [ ] Final report received

### Skill 2: {skill-name}
- [ ] Research phase complete
- [ ] Prompt created
- [ ] Skill structure created
- [ ] Validation tests passed
- [ ] Final report received

[...repeat for all skills...]

## Agent Status

| Skill Name | Agent ID | Status | Confidence | Files |
|------------|----------|--------|------------|-------|
| {skill-1}  | TBD      | ⏳     | 0%         | -     |
| {skill-2}  | TBD      | ⏳     | 0%         | -     |

## Validation Criteria

- [ ] ALL agents spawned successfully
- [ ] ALL agents completed without errors
- [ ] ALL skills achieved 100% confidence
- [ ] ALL skill directories created
- [ ] No WebSearch 4xx failures (Firecrawl fallback used)
```

Initialize TodoWrite with matching items.

### Step 3: Spawn Parallel Agents

CRITICAL: MUST use Task tool to spawn agents, NOT bash or other methods.

**For EACH skill (spawn in rapid succession):**

```
Use Task tool:
- subagent_type: "general-purpose"
- description: "Train {skill-name} skill"
- model: "sonnet"
- prompt: "
CRITICAL: Execute /train-skill workflow for {skill-name} skill.

Topic: {skill-topic}

Requirements:
1. MUST run /train-skill {skill-name} {skill-topic}
2. MUST achieve EXACTLY 100% confidence before completion
3. MUST use Firecrawl fallback on WebSearch 4xx errors
4. MUST return detailed completion report

Output:
MUST include:
- Final confidence score (MUST be 100%)
- Skill directory path: .claude/skills/{skill-name}/
- Test results (all passed)
- Files created (exact paths)

NEVER report completion if confidence < 100%
"
```

**Spawning Protocol:**
1. Spawn agent 1 → Continue immediately (don't wait)
2. Spawn agent 2 → Continue immediately
3. Spawn agent N → Continue immediately
4. After ALL agents spawned → Wait for ALL completions

**NEVER:**
- ❌ Wait for agent N before spawning agent N+1
- ❌ Spawn agents sequentially with blocking
- ❌ Use bash commands instead of Task tool

**ALWAYS:**
- ✅ Spawn all agents in rapid succession
- ✅ Use Task tool for each agent
- ✅ Set model: "sonnet" (NEVER haiku for complex workflows)
- ✅ Wait for ALL after ALL spawned

### Step 4: Monitor Agent Progress

**While agents running:**
1. Track agent IDs in checklist
2. Update TodoWrite as agents complete phases
3. NEVER intervene unless agent reports blocker

**Agent Communication:**
- Agents report progress via Task tool output
- ONLY final report matters for validation
- Intermediate updates informational only

### Step 5: Validate Agent Outputs

CRITICAL: MUST validate EVERY agent output before marking complete.

**For EACH completed agent:**

1. **Read Agent Report**
   - Extract confidence score
   - Extract skill directory path
   - Extract test results

2. **Verify Confidence**
   ```
   if confidence != 100:
       mark_as_failed("Agent reported {confidence}%, required 100%")
       request_user_guidance()
   ```

3. **Verify Skill Files**
   ```bash
   # Read actual files to verify
   Read .claude/skills/{skill-name}/SKILL.md
   ```
   - [ ] SKILL.md exists
   - [ ] Valid YAML frontmatter
   - [ ] Prompt-engineering compliant
   - [ ] Bundled resources (if claimed)

4. **Verify Test Results**
   - [ ] ALL test scenarios passed
   - [ ] No failures reported
   - [ ] Agent reported success

5. **Update Checklist**
   - Mark all phase checkboxes: ✅
   - Update agent status table
   - Record file paths

**Validation Requirements:**
- NEVER trust agent report without file verification
- NEVER accept confidence < 100%
- NEVER skip file existence checks
- NEVER proceed with failed validations

**If validation fails:**
1. Mark skill as failed in checklist
2. Document failure reason
3. Report to user
4. Ask: retry failed skill or abort workflow

### Step 6: Final Report

ONLY report complete when ALL skills validated at 100%.

**Report Format:**
```markdown
# Parallel Skill Training Complete

## Summary
- Total skills: X
- Successful: X (100%)
- Failed: 0
- Total time: Y minutes
- Average time per skill: Z minutes

## Skills Created

### 1. {skill-name}
- Location: .claude/skills/{skill-name}/
- Confidence: 100%
- Tests: X/X passed
- Description: [from SKILL.md]

### 2. {skill-name}
- Location: .claude/skills/{skill-name}/
- Confidence: 100%
- Tests: X/X passed
- Description: [from SKILL.md]

[...repeat for all skills...]

## Files Created
- .claude/skills/{skill-1}/SKILL.md
- .claude/skills/{skill-1}/[bundled resources]
- .claude/skills/{skill-2}/SKILL.md
- .claude/skills/{skill-2}/[bundled resources]
[...all files...]

## Validation Status
✅ ALL skills achieved 100% confidence
✅ ALL skill files verified
✅ ALL tests passed
✅ NO 4xx errors (Firecrawl fallback used if needed)

## Usage
Load any skill: `use {skill-name} skill`
```

## WebSearch Fallback (Firecrawl)

**Inherited from /train-skill:**

Each spawned agent MUST use Firecrawl fallback on WebSearch 4xx errors.

**Verification:**
- Check agent reports for 4xx mentions
- Verify Firecrawl was attempted
- Confirm no workflow failures due to 4xx

**Environment:**
- FIRECRAWL_API_KEY MUST be set
- Validate before spawning agents:
  ```bash
  if [ -z "$FIRECRAWL_API_KEY" ]; then
    echo "Error: FIRECRAWL_API_KEY not set"
    exit 1
  fi
  ```

## Error Handling

### Scenario 1: Agent Fails (confidence < 100%)
```
Action:
1. Mark skill as failed in checklist
2. Document: agent ID, skill name, confidence achieved
3. Report to user with failure details
4. Ask: retry this skill or continue with others?
```

### Scenario 2: Agent Reports Error
```
Action:
1. Read agent error message
2. Categorize: blocker vs recoverable
3. If blocker: halt dependent work, report to user
4. If recoverable: document, continue monitoring
```

### Scenario 3: File Verification Fails
```
Action:
1. Identify missing/invalid files
2. Compare agent report vs file system
3. Mark skill as failed
4. Report discrepancy to user
5. Request guidance: re-run or manual fix?
```

### Scenario 4: Timeout (agent unresponsive)
```
Action:
1. Wait MAXIMUM 30 minutes per agent
2. If no response: mark as timeout
3. Report to user
4. Ask: retry or abort?
```

## Anti-Patterns

❌ Spawn > 6 agents
❌ Wait for agent N before spawning N+1
❌ Trust agent report without file verification
❌ Accept confidence < 100%
❌ Use bash instead of Task tool
❌ Skip checklist creation
❌ Report complete with failed agents
❌ Ignore WebSearch 4xx errors

✅ Spawn MAXIMUM 6 agents in rapid succession
✅ Use Task tool for ALL agents
✅ Verify files after EVERY agent completion
✅ Require EXACTLY 100% confidence
✅ Maintain persistent checklist
✅ Use Firecrawl fallback on 4xx
✅ Block completion on ANY failure

## Constraints

- Parallel agents: MAXIMUM 6 (NEVER exceed)
- Confidence per skill: EXACTLY 100% (NEVER less)
- Timeout per agent: MAXIMUM 30 minutes
- Checklist: MUST persist in `_project/checklists/`
- Tool: ONLY Task tool for agents (NEVER bash/other)
- Model: EXACTLY "sonnet" for ALL agents
- Validation: MUST verify files (NEVER trust reports alone)
- NEVER report complete with failures

## Input Format

**Single skill:**
```
/train-skills-parallel "api-design:REST API design patterns and best practices"
```

**Multiple skills (space-separated):**
```
/train-skills-parallel "api-design:REST API patterns" "testing-best-practices:TDD and test patterns" "docker-ops:Docker and containerization"
```

**Maximum (6 skills):**
```
/train-skills-parallel "skill1:topic1" "skill2:topic2" "skill3:topic3" "skill4:topic4" "skill5:topic5" "skill6:topic6"
```

## Output

- Checklist: `_project/checklists/parallel-skill-training-{timestamp}.md`
- Skills: `.claude/skills/{skill-name}/` (one per skill)
- Report: Final completion summary with ALL validation results
