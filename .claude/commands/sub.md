---
description: Spawn single sub-agent for focused task execution
argument-hint: [task description]
---

# Sub-Agent Task Execution

Spawn a single Task tool sub-agent with optimized prompt engineering for focused task execution.

## Purpose

Execute a single well-defined task by spawning a Task tool sub-agent with properly structured prompt following prompt-engineering.md Iron Laws (150-300 word limit, testable requirements, power words, exact constraints).

## Variables

- TASK_DESCRIPTION: $ARGUMENTS (task description - will be optimized into proper sub-agent prompt)

## Instructions

### Step 1: Analyze Task Type

Determine appropriate subagent_type based on task:
- **Exploration/search**: "explore codebase", "find files", "understand implementation" → `Explore`
- **Planning**: "create plan", "design approach" → `Plan`
- **Implementation**: "implement feature", "fix bug", "refactor code" → `general-purpose`
- **Default**: When unclear → `general-purpose`

### Step 2: Extract Task Components

Parse TASK_DESCRIPTION to identify:
- **Objective**: What must be accomplished (one sentence, no AND/OR)
- **Context**: Relevant background (50w max)
- **Requirements**: Testable deliverables (MUST/ONLY/EXACTLY statements)
- **Constraints**: Boundaries and forbidden actions (NEVER/MINIMUM/MAXIMUM)
- **Output Format**: Exactly what agent should return

### Step 3: Build Optimized Prompt

Structure following prompt-engineering.md:

```
CRITICAL: Run /prime FIRST to load complete project context before starting work.

MUST {objective} with {metric}.

Task: {One sentence description}

Context: {50w max background}

Requirements:
1. MUST {testable requirement 1}
2. MUST {testable requirement 2}
3. ONLY {boundary condition}

Constraints:
- Length: MINIMUM X, MAXIMUM Y
- Format: EXACTLY {specification}
- NEVER {forbidden action}

Output:
CRITICAL: MUST return EXACT absolute file paths for ALL files created/modified/deleted
- /absolute/path/to/file.py:10-50 (NOT "created file X")
- /absolute/path/to/other.tsx:5-25 (NOT "modified Y")
- Verification details
- {What NOT to output}
```

Power word priorities:
- MUST (96% compliance)
- ONLY/SOLELY (95% compliance)
- NEVER (93% compliance)
- EXACTLY (88% compliance)

### Step 4: Select Model

ALWAYS use model: sonnet (claude-sonnet-4-5) for all sub-agent tasks.

NEVER use haiku - it produces lower quality results for complex tasks including bug fixes, implementations, and explorations.

### Step 5: Spawn Sub-Agent

Execute single Task tool call with optimized parameters.

ALWAYS include model: "sonnet" parameter in Task tool call.

**BEFORE spawning agent:**
1. Create checklist: `_project/agents/sub/{timestamp}/checklist.md`
2. Document expected deliverables:
```markdown
# Sub-Agent Task: {description}
**Started:** YYYY-MM-DD HH:MM:SS
**Status:** In Progress

## Expected Deliverables
- [ ] File: /expected/path/to/file1.py - {what should be created/modified}
- [ ] File: /expected/path/to/file2.tsx - {what should be created/modified}
- [ ] Verification: {specific check to perform}

## Validation Criteria
- [ ] Agent reported success
- [ ] ALL expected files exist (verified with Read/Glob)
- [ ] Changes match requirements
- [ ] No errors in execution
```

### Step 6: Validate and Report Results

**AFTER agent completes:**
1. **Extract Exact File Paths**: Agent MUST report EXACT absolute file paths (NOT "created file X")
   - Required format: `/absolute/path/to/file.py:10-50`
   - Reject: "created file X", "modified Y", relative paths
2. **Verify with File System**:
   - Agent reported `/path/to/file.py` → Read `/path/to/file.py` → Confirm exists
   - Agent reported line changes → Read specific lines → Verify changes applied
   - Use Glob for file searches if agent was vague
3. **Update Checklist**: Mark items complete in `_project/agents/sub/{timestamp}/checklist.md`
4. **Report Summary**:
   - Files created/modified with EXACT absolute paths
   - Verification results (Read/Glob confirms)
   - Issues or blockers encountered
   - Checklist completion status

## Task Type Examples

**Exploration Tasks:**
```
/sub "Find all authentication middleware files and understand the token validation flow"
```
→ subagent_type: Explore, model: "sonnet"

**Planning Tasks:**
```
/sub "Design architecture for rate limiting system with Redis backend"
```
→ subagent_type: Plan, model: "sonnet"

**Implementation Tasks:**
```
/sub "Implement CSV export functionality for user data with pagination support"
```
→ subagent_type: general-purpose, model: "sonnet"

## Prompt Optimization Examples

**User Input:**
```
/sub "I need you to search through the codebase and find where we're handling errors from the API client"
```

**Optimized Prompt (47 tokens → 21 tokens):**
```
CRITICAL: Run /prime FIRST to load complete project context before starting work. and read @CLAUDE.md

MUST find ALL API client error handlers.

Task: Locate error handling code for API client.

Requirements:
1. MUST search for try-catch blocks around API calls
2. MUST find error handler functions
3. ONLY return file paths with line numbers

Output: List format
- path/to/file.py:123
- path/to/other.py:456
```

**User Input:**
```
/sub "Add a dark mode toggle to the settings page and make sure it persists in local storage"
```

**Optimized Prompt:**
```
CRITICAL: Run /prime FIRST to load complete project context before starting work.

MUST implement dark mode toggle with persistence.

Task: Add dark mode toggle to settings page with local storage.

Requirements:
1. MUST create toggle component in settings UI
2. MUST save preference to localStorage
3. MUST apply theme on page load
4. ONLY use existing theme system

Constraints:
- NEVER create new theme variables
- EXACTLY follow existing toggle pattern

Output:
CRITICAL: EXACT absolute file paths for ALL files
- /absolute/path/to/Settings.tsx:45-67
- /absolute/path/to/theme.ts:12-20
- localStorage key: "theme_preference"
- Verification: toggle persists across page reload
```

## Anti-Patterns

❌ **Verbose prompt with explanations:**
```
"I need you to help me understand how the authentication system works. Can you please look through the codebase and find all the files that are related to authentication? I'm particularly interested in how we validate tokens and check user permissions. Please provide a detailed explanation of the flow."
```

✅ **Optimized prompt:**
```
CRITICAL: Run /prime FIRST to load complete project context before starting work.

MUST document auth flow.

Task: Map authentication and authorization flow.

Requirements:
1. MUST find token validation code
2. MUST find permission checking code
3. ONLY include auth-related files

Output:
- File paths with function names
- Flow diagram: request → validation → permission → response
```

❌ **Spawning sub-agent for trivial task:**
```
/sub "Read the package.json file"
```
→ Just use Read tool directly

✅ **Use sub-agent for appropriate scope:**
```
/sub "Find all package.json files and identify dependency conflicts across microservices"
```

❌ **Multiple independent tasks in one sub-agent:**
```
/sub "Add logging AND implement rate limiting AND fix the auth bug"
```
→ Use /parallel for multiple tasks

✅ **Single focused task:**
```
/sub "Implement rate limiting middleware with Redis backend"
```

## When to Use /sub vs Direct Tools

**Use /sub when:**
- Task requires exploration across multiple files
- Implementation spans 3+ files
- Need systematic search/analysis
- Complex refactoring or architectural changes
- Task benefits from agent autonomy

**Use direct tools when:**
- Reading specific known file (use Read)
- Editing single file (use Edit)
- Simple grep for known pattern (use Grep)
- File path search with known pattern (use Glob)
- Running single command (use Bash)

## Notes

- CRITICAL: Follow prompt-engineering.md Iron Laws for all prompts
- Sub-agent prompts MUST be 150-300 words maximum
- Use power words (MUST/ONLY/NEVER/EXACTLY) for compliance
- ALWAYS use model: "sonnet" for all sub-agent tasks (NEVER use haiku)
- Single task focus - use /parallel for multiple tasks
- No persistent tracking needed (ephemeral single-session task)
- Agent output should include verification details

## Validation

**CRITICAL:** MUST verify deliverables with file system checks BEFORE marking complete

Before declaring task complete:
1. **Exact Paths Required**: Agent MUST provide EXACT absolute file paths
   - ❌ Reject: "created file X", "modified component", relative paths
   - ✅ Accept: `/absolute/path/to/file.py:10-50`
2. **Agent Status**: Reported success (not partial/blocked/error)
3. **File Existence**: Use Read/Glob to verify ALL files agent claims created/modified
   - Agent says `/path/to/file.py` → Read `/path/to/file.py` → Verify content exists
   - Agent says `/path/to/file.py:10-50` → Read lines 10-50 → Verify changes applied
   - Agent says "Deleted /path/to/file.py" → Glob `/path/to/file.py` → Verify returns empty
4. **Changes Match**: Read files and verify changes match requirements
5. **No Errors**: Agent execution completed without errors or exceptions
6. **Deliverables Complete**: ALL items specified in prompt Output section were provided
7. **Checklist Validation**: Update and verify checklist items marked complete

**Anti-Pattern:**
- ❌ Agent reports "created file X" → Mark complete → File doesn't exist
- ❌ Trust agent summary without Read/Glob verification
- ❌ Agent reports relative paths or vague descriptions
- ❌ Skip checklist validation step

**Correct Pattern:**
- ✅ Agent reports `/absolute/path/to/file.py` → Read file → Verify exists → Update checklist → Mark complete
- ✅ Reject agent output without exact paths → Request re-run with explicit path requirements
