---
description: Orchestrate multiple agents with dependency management and validation
argument-hint: [task descriptions with optional AFTER:taskname dependencies]
---

# Parallel Agent Orchestration

Orchestrate multiple Task tool agents with intelligent dependency management, parallel execution, and checklist-based validation.

## Purpose

Coordinate complex multi-agent workflows by analyzing task dependencies, spawning independent agents in parallel, and sequentially executing dependent agents with validation checkpoints between phases.

## Variables

- TASK_DESCRIPTIONS: $ARGUMENTS (task descriptions with optional dependency markers like "AFTER:task1")

## Instructions

### Step 1: Parse and Analyze Dependencies

- Extract all task descriptions from $ARGUMENTS
- Identify dependency markers (AFTER:taskN, REQUIRES:taskM)
- Build dependency graph: independent tasks vs dependent chains
- Validate no circular dependencies exist
- Group tasks into execution phases:
  - Phase 1: All independent tasks (parallel)
  - Phase 2: Tasks depending on Phase 1 (parallel within phase)
  - Phase N: Continue until all tasks covered

### Step 2: Create Master Checklist

Create `_project/in-progress/parallel-workflow-{timestamp}-checklist.md`:

```markdown
# Parallel Agent Orchestration - {timestamp}

**Status:** In Progress
**Started:** YYYY-MM-DD HH:MM:SS

## Expected Deliverables
### Phase 1: Independent Tasks
- [ ] Task A: {description}
  - Expected files: /path/to/file1.py, /path/to/file2.tsx
  - Verification: {specific checks}
- [ ] Task B: {description}
  - Expected files: /path/to/file3.py
  - Verification: {specific checks}

### Phase 2: Dependent Tasks (AFTER Phase 1)
- [ ] Task C (AFTER: Task A): {description}
  - Expected files: /path/to/file4.py
  - Dependencies: Task A files must exist
  - Verification: {specific checks}

## Phase 1: Independent Tasks [⏳]
- [ ] Task A: {description} - Agent spawned
- [ ] Task A: Received exact file paths from agent
- [ ] Task A: Verified files exist with Read/Glob
- [ ] Task A: Validation complete

## Phase 2: Dependent Tasks [⏳]
- [ ] Task B (AFTER: Task A): {description} - Waiting for Phase 1
- [ ] Task B: Agent spawned
- [ ] Task B: Received exact file paths from agent
- [ ] Task B: Verified files exist with Read/Glob
- [ ] Task B: Validation complete

## Validation Criteria
- [ ] ALL Phase 1 agents reported EXACT absolute file paths
- [ ] ALL Phase 1 agents completed successfully
- [ ] ALL Phase 1 outputs validated with Read/Glob
- [ ] ALL Phase 2 agents reported EXACT absolute file paths
- [ ] ALL Phase 2 agents completed successfully
- [ ] No errors in any agent execution
- [ ] Dependencies satisfied before spawning dependent agents
```

- Initialize TodoWrite with matching checklist items

### Step 3: Execute Phase 1 (Parallel Independent Tasks)

- Mark Phase 1 as in_progress in checklist
- MUST spawn ALL independent agents in rapid succession (one agent per message)
- Each agent spawned WITHOUT waiting for previous agent completion
- Agents run in parallel in backend (effective parallelism)
- Each Task tool call gets own subagent_type, description, and detailed prompt
- CRITICAL: Each agent prompt MUST start with instruction to run /prime:
  ```
  CRITICAL: Run /prime FIRST to load complete project context before starting work.
  ```
- CRITICAL: Each agent prompt MUST include in Output section:
  ```
  Output:
  CRITICAL: MUST return EXACT absolute file paths for ALL files created/modified/deleted
  - /absolute/path/to/file.py:10-50 (NOT "created file X")
  - /absolute/path/to/other.tsx:5-25 (NOT "modified Y")
  ```
- After ALL agents spawned, wait for ALL to complete before proceeding

### Step 4: Validate Phase 1 Results

For EACH completed Phase 1 agent:
- Read agent output report
- CRITICAL: Verify agent provided EXACT absolute file paths (reject vague descriptions)
- Verify files modified exist and contain expected changes
- Check for errors or incomplete implementation
- Mark validation checklist items as complete (received paths + verified files)
- If validation fails: Report blocker, DO NOT proceed to Phase 2

**Required validation checks (use Read/Glob tools):**
1. **Exact Paths Required**: Agent MUST provide EXACT absolute file paths
   - ❌ Reject: "created file X", "modified component", relative paths, "created 3 files"
   - ✅ Accept: `/absolute/path/to/file.py:10-50`
   - If agent output lacks exact paths → Mark as failed → Request re-run
2. **File Existence**: Read/Glob to verify ALL files agent claims created/modified
   - Agent says `/path/to/file.py` → Read `/path/to/file.py` → Verify content exists
   - Agent says `/path/to/file.py:10-50` → Read lines 10-50 → Verify changes applied
3. **Code Quality**: Changes match task requirements, no syntax errors
4. **Agent Status**: Reported success (not partial completion or errors)
5. **Deliverables**: ALL Output items from prompt were provided with exact paths
6. **Checklist Update**: Mark both "received exact paths" AND "verified files" items

**Anti-Pattern:**
- ❌ Agent reports "created 3 files" → Assume true → Spawn Phase 2
- ❌ Trust agent summary without file system verification
- ❌ Accept vague descriptions like "modified component X"
- ❌ Skip "received exact paths" checklist validation

**Correct Pattern:**
- ✅ Agent reports `/path/to/file.py` → Read file → Verify exists + correct → Update checklist → Then Phase 2
- ✅ Agent reports vague paths → Mark failed → Request re-run with explicit path requirements

**ONLY proceed to Phase 2 if ALL Phase 1 validations pass.**

### Step 5: Execute Phase 2 (Sequential Dependent Tasks)

- Mark Phase 2 as in_progress in checklist
- Spawn agents for tasks depending on Phase 1
- If multiple tasks in Phase 2 have same dependencies: spawn in rapid succession (one per message)
- If tasks have different dependencies: spawn sequentially after dependencies met
- CRITICAL: Each agent prompt MUST start with instruction to run /prime:
  ```
  CRITICAL: Run /prime FIRST to load complete project context before starting work.
  ```
- CRITICAL: Each agent prompt MUST include in Output section:
  ```
  Output:
  CRITICAL: MUST return EXACT absolute file paths for ALL files created/modified/deleted
  - /absolute/path/to/file.py:10-50 (NOT "created file X")
  ```
- After ALL Phase 2 agents spawned, wait for ALL to complete

### Step 6: Validate Phase 2 Results

Repeat validation process from Step 4 for Phase 2 agents:
- CRITICAL: Verify EXACT absolute file paths provided (reject vague descriptions)
- Read/Glob to verify ALL files exist
- Mark both "received exact paths" AND "verified files" checklist items
- Proceed to next phase ONLY if ALL validations pass

### Step 7: Continue for Remaining Phases

Repeat Steps 5-6 for each remaining phase until all tasks complete.

### Step 8: Final Verification

- Mark all checklist items as completed
- Update checklist Status to "Complete"
- Verify no blockers or partial completions
- Report summary: total agents spawned, phases executed, files modified

## Dependency Syntax

**Independent Tasks (Parallel):**
```
"Implement user authentication"
"Add logging system"
"Create API documentation"
```

**Dependent Tasks (Sequential):**
```
"Implement user authentication"
"AFTER:auth Add authorization middleware"
"AFTER:auth,middleware Create protected routes"
```

**Parsing Rules:**
- No marker = independent task (Phase 1)
- `AFTER:taskname` = depends on completion of taskname
- `AFTER:task1,task2` = depends on both task1 AND task2
- Task names extracted from first 2-3 words of description

## Examples

**Example 1: Simple Parallel Tasks**
```
/parallel "Add dark mode toggle" "Implement CSV export" "Create user profile page"
```
Result: All 3 agents spawn in parallel (Phase 1 only)

**Example 2: Sequential Dependencies**
```
/parallel "Create database schema" "AFTER:schema Add migration script" "AFTER:migration Seed initial data"
```
Result:
- Phase 1: schema agent
- Phase 2: migration agent (after schema validation)
- Phase 3: seed agent (after migration validation)

**Example 3: Mixed Parallel and Sequential**
```
/parallel "Add user auth" "Add logging" "AFTER:auth Create protected endpoints" "AFTER:auth Add role-based access"
```
Result:
- Phase 1: auth + logging agents (parallel)
- Phase 2: endpoints + access agents (parallel, both wait for auth)

## Validation Requirements

**Agent Output Must Include:**
- CRITICAL: EXACT absolute file paths for ALL files created/modified/deleted
  - Required format: `/absolute/path/to/file.py:10-50`
  - ❌ Reject: "created file X", "modified component", relative paths
- Verification that changes were applied successfully
- No errors or exceptions during implementation
- Explicit success confirmation

**Coordinator Must Verify:**
- CRITICAL: Agent provided exact absolute paths (NOT vague descriptions)
- Files exist using Read/Glob verification (NOT spot checks - verify ALL claimed files)
- Agent reported success (not "partially complete" or "blocked")
- Output format matches expected structure with exact paths
- No dependency violations (Phase N agents don't start before Phase N-1 complete)
- Checklist updated with "received exact paths" + "verified files" items marked

## Error Handling

**If Phase 1 agent fails:**
- Mark as failed in checklist
- DO NOT spawn dependent Phase 2 agents
- Report blocker to user
- Ask if should retry failed agent or abort workflow

**If validation fails:**
- Report specific validation failure
- Show expected vs actual state
- DO NOT proceed to next phase
- Ask user for guidance

**If dependency marker invalid:**
- Report parsing error
- Show unrecognized task reference
- Ask user to clarify dependency

## Notes

- CRITICAL: NEVER spawn Phase 2 agents before Phase 1 validation complete
- Spawn agents in rapid succession (one per message) for effective parallelism
- API limitation: Cannot invoke same tool multiple times in single request
- Each validation must Read actual files (not just trust agent report)
- Each agent prompt MUST require exact absolute file paths in Output section
- Reject agent output without exact paths - request re-run with explicit requirements
- Checklist provides synchronization point between phases
- Use general-purpose subagent_type unless specific type needed
- ALWAYS use model: sonnet for all Task calls (NEVER use haiku for parallel workflows)

## Anti-Patterns

❌ Spawn Phase 2 before Phase 1 complete
❌ Skip validation "because agent reported success"
❌ Wait for agent completion before spawning next independent agent
❌ Assume files exist without Read verification
❌ Continue workflow after validation failure
❌ Create TodoWrite without persistent checklist file
❌ Accept agent output without exact absolute file paths
❌ Trust "created 3 files" without specific paths
❌ Skip "received exact paths" checklist validation item

✅ Spawn independent agents in rapid succession (one per message)
✅ Validate EVERY phase completion before next phase
✅ Read files to verify changes actually applied
✅ Block on validation failure, report to user
✅ Maintain checklist file for cross-session tracking
✅ Require exact absolute paths in agent prompts
✅ Reject vague agent output, request re-run with explicit path requirements
✅ Mark "received exact paths" + "verified files" checklist items separately
