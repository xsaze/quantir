---
description: Check changes, create branch, commit, push, and create PR
tags:
  - project
  - git
---

# Commit and Push with PR

Analyze current changes, create a new branch, commit, push, and create a pull request.

## Instructions

0. **Create Commit Checklist**:
   - Create timestamp: `date +"%Y-%m-%d-%H%M%S"`
   - Create workspace: `_project/agents/commit-push/YYYY-MM-DD-HHMMSS/`
   - Create checklist file: `_project/agents/commit-push/YYYY-MM-DD-HHMMSS/commit-checklist.md` with:
     ```markdown
     # Commit-Push Workflow Checklist - [timestamp]

     ## 📋 Pre-Commit Steps
     - [ ] Git status reviewed
     - [ ] Git diff reviewed
     - [ ] Security check completed (no sensitive data)
     - [ ] Quality validation completed (all 4 agents)
     - [ ] Pattern detection completed
     - [ ] Specification updates completed (if needed)
     - [ ] Command updates completed (if needed)
     - [ ] Documentation updates completed (MANDATORY)
       - [ ] prime.md files list read
       - [ ] README.md reviewed and updated
       - [ ] PROJECT-NAVIGATOR.md reviewed and updated
       - [ ] sql/0-all-tables.sql reviewed and updated
       - [ ] workflow-specification.md reviewed and updated
       - [ ] agent-mode-specification.md reviewed and updated
       - [ ] Documentation validation gate passed (Step 4.6)
     - [ ] Branch created

     ## 📋 Commit Steps
     - [ ] Changes staged (git add .)
     - [ ] Commit message created (max 70 chars)
     - [ ] Commit completed

     ## 📋 Post-Commit Steps
     - [ ] Push completed
     - [ ] PR created
     - [ ] PR URL returned

     ## 📋 Final Verification
     - [ ] All checklist items marked complete
     - [ ] Files modified list generated
     - [ ] Documentation updated list generated
     - [ ] Commit SHA recorded
     - [ ] PR URL recorded
     ```

1. **Analyze Changes**:
   - Run `git status` to see all untracked files
   - Run `git diff` to see both staged and unstaged changes
   - Review the changes to understand what was modified
   - Mark checklist items complete: "Git status reviewed" and "Git diff reviewed"

2. **Quality Validation (Using Parallel Sub-Agents)**:

   **CRITICAL**: Before committing, validate code quality, test coverage, and completeness using parallel sub-agents.

   **Step 2.0: Create Quality Validation Workspace**
   - Create folder: `_project/agents/commit-push/YYYY-MM-DD-HHMMSS/quality/`
   - Create checklist: `_project/agents/commit-push/YYYY-MM-DD-HHMMSS/quality/checklist.md`

   **Step 2.1: Spawn Quality Validation Sub-Agents in Parallel**

   Use **ONE** Task tool invocation to spawn 4 quality validation agents in parallel:

   **Agent 1: Test Runner & Validator**
   ```
   Prompt: "Run tests and validate test coverage for changed code.

   Task: Validate test quality and coverage

   Requirements:
   1. MUST identify which tests relate to changed files (check imports, function names)
   2. MUST run those specific tests: pytest path/to/test_file.py -v
   3. MUST check if tests PASS or FAIL
   4. IF tests FAIL:
      - Analyze failure reason
      - Determine if code is wrong OR test expectations are outdated
      - Document which needs fixing
   5. MUST identify missing test coverage:
      - New functions without tests
      - New edge cases not covered
      - New configuration options not tested

   Output format (_project/agents/commit-push/[timestamp]/quality/test-validation.md):
   ## Test Results
   - Tests run: [count]
   - Passed: [count]
   - Failed: [count with details]

   ## Failed Tests Analysis
   ### Test: [name]
   - Reason: [why it failed]
   - Root cause: [code bug OR outdated test expectation]
   - Recommendation: [fix code OR update test]

   ## Missing Test Coverage
   - [Function/feature]: [why test needed]
   - [Edge case]: [scenario description]

   ## Recommendation
   - BLOCK COMMIT: [yes/no with reason]"

   subagent_type: general-purpose
   ```

   **Agent 2: Code Completeness Reviewer**
   ```
   Prompt: "Review code for completeness and detect non-finished work.

   Task: Ensure 100% finished, production-ready code

   Requirements:
   1. MUST detect incomplete implementations:
      - TODO/FIXME comments
      - Placeholder values
      - Commented-out code blocks
      - Functions that return None/empty without reason
   2. MUST detect workarounds:
      - Try/except blocks that mask errors
      - Conditional logic that bypasses main functionality
      - Fallback code that doesn't achieve original goal
   3. MUST verify error handling:
      - All exceptions properly caught and handled
      - Error messages are meaningful
      - No silent failures

   Output format (_project/agents/commit-push/[timestamp]/quality/completeness-review.md):
   ## Incomplete Code Found
   - [File:line]: [issue description]

   ## Workarounds Detected
   - [File:line]: [workaround that doesn't achieve goal]
   - Proper solution: [what should be done instead]

   ## Error Handling Issues
   - [File:line]: [problem with error handling]

   ## Recommendation
   - BLOCK COMMIT: [yes/no with reason]"

   subagent_type: general-purpose
   ```

   **Agent 3: Pattern & Best Practices Checker**
   ```
   Prompt: "Check code follows project patterns and best practices.

   Task: Validate adherence to CLAUDE.md rules

   Requirements:
   1. MUST verify CLAUDE.md compliance:
      - No business logic in SQL migrations
      - No scoring/evaluation in code (should be LLM prompts)
      - Proper file organization (no scattered related files)
      - No nested function definitions
      - No fallback logic masking problems
   2. MUST check Python best practices:
      - Imports at top of file
      - Type hints present
      - Docstrings for public functions
   3. MUST verify test patterns:
      - Tests use proper mocking (not outdated patterns)
      - Test names describe what they test

   Output format (_project/agents/commit-push/[timestamp]/quality/pattern-review.md):
   ## CLAUDE.md Violations
   - [Rule]: [violation found at file:line]

   ## Best Practice Issues
   - [Practice]: [issue at file:line]

   ## Recommendation
   - BLOCK COMMIT: [yes/no with reason]"

   subagent_type: general-purpose
   ```

   **Agent 4: Integration & Dependencies Checker**
   ```
   Prompt: "Verify integration completeness and dependency updates.

   Task: Ensure all affected components are updated consistently

   Requirements:
   1. MUST identify integration points:
      - If backend changed, does frontend need updates?
      - If config added, are all .env files updated?
      - If function signature changed, are all callers updated?
   2. MUST verify environment sync:
      - .env.example matches actual .env structure
      - Docker configs have all env vars
      - README documents new configurations
   3. MUST check breaking changes:
      - API changes documented
      - Migration guide if needed

   Output format (_project/agents/commit-push/[timestamp]/quality/integration-review.md):
   ## Integration Gaps
   - [Component]: [needs update but wasn't changed]

   ## Environment Sync Issues
   - [File]: [missing or inconsistent config]

   ## Breaking Changes
   - [Change]: [impact and documentation needed]

   ## Recommendation
   - BLOCK COMMIT: [yes/no with reason]"

   subagent_type: general-purpose
   ```

   **Step 2.2: Wait and Review Quality Reports**
   - Wait for all 4 agents to complete
   - Read all quality reports
   - If ANY agent recommends BLOCK COMMIT:
     - STOP the commit process
     - Report issues to user
     - Ask user if they want to fix issues or override
   - If all agents approve, continue to next step
   - Mark checklist item complete: "Quality validation completed (all 4 agents)"
   **CRITICAL - Security Check for Sensitive Information**:
   - MUST scan ALL changes (both staged and unstaged) for sensitive information
   - NEVER commit files containing:
     - API keys, tokens, or credentials (e.g., `OPENAI_API_KEY`, `sk-...`, `pk-...`)
     - Private keys, certificates, or secrets (e.g., `.pem`, `.key`, private key blocks)
     - Database passwords or connection strings with credentials
     - SSH keys or authentication tokens
     - OAuth client secrets or refresh tokens
     - AWS/GCP/Azure credentials or service account keys
     - Session tokens or JWTs
     - Encryption keys or salts
     - Email/phone numbers or PII in non-test contexts
   - **NEVER commit project-internal files**:
     - `.gitignore` files (unless explicitly requested by user)
     - `.env` files (only `.env.example` is allowed)
     - Any files listed in `.gitignore`
   - Common patterns to detect:
     - Files: `.gitignore`, `.env` (without `.example` suffix), `credentials.json`, `secrets.*`, `*.pem`, `*.key`
     - Patterns: `password=`, `secret=`, `token=`, `api_key=`, `private_key=`
     - Values: Long base64 strings, hex keys (32+ chars), bearer tokens
   - If sensitive information detected:
     - STOP immediately and BLOCK commit
     - List ALL files/lines with sensitive data
     - Warn user about security risk
     - Recommend: Add to `.gitignore`, use environment variables, use secrets manager
     - Ask user to confirm they want to proceed (only if false positive)
   - Mark checklist item complete: "Security check completed (no sensitive data)"


3. **Pattern Detection & Specification Updates (Using Parallel Sub-Agents)**:

   **CRITICAL**: Use Task tool to spawn parallel general-purpose sub-agents for coordinated analysis and updates.

   **Step 3.1: Create Agent Workspace**
   - Create folder: `_project/agents/commit-push/YYYY-MM-DD-HHMMSS/` (timestamp current execution)
   - Create checklist: `_project/agents/commit-push/YYYY-MM-DD-HHMMSS/checklist.md` with:
     ```markdown
     # Commit-Push Pattern Detection - [timestamp]

     ## 🎯 Mission
     Detect integration patterns in git changes and update specifications/commands using parallel sub-agents

     ## 📋 Sub-Agents Spawned

     ### Phase 1: Pattern Detection
     - [ ] Pattern Detection Agent (writes `patterns-detected.md`)

     ### Phase 2: Specification Updates (up to 6 parallel agents)
     - [ ] Spec Agent 1 (files: [list]) → writes `spec-agent-1-updated.md`
     - [ ] Spec Agent 2 (files: [list]) → writes `spec-agent-2-updated.md`
     - [ ] Spec Agent 3 (files: [list]) → writes `spec-agent-3-updated.md`
     - [ ] Spec Agent 4 (files: [list]) → writes `spec-agent-4-updated.md`
     - [ ] Spec Agent 5 (files: [list]) → writes `spec-agent-5-updated.md`
     - [ ] Spec Agent 6 (files: [list]) → writes `spec-agent-6-updated.md`

     ### Phase 3: Command Updates (up to 6 parallel agents)
     - [ ] Command Agent 1 (files: [list]) → writes `cmd-agent-1-updated.md`
     - [ ] Command Agent 2 (files: [list]) → writes `cmd-agent-2-updated.md`
     - [ ] Command Agent 3 (files: [list]) → writes `cmd-agent-3-updated.md`
     - [ ] Command Agent 4 (files: [list]) → writes `cmd-agent-4-updated.md`
     - [ ] Command Agent 5 (files: [list]) → writes `cmd-agent-5-updated.md`
     - [ ] Command Agent 6 (files: [list]) → writes `cmd-agent-6-updated.md`

     ## ✅ Completion Criteria
     - [ ] All patterns documented
     - [ ] All relevant specs updated (distributed across agents, no conflicts)
     - [ ] All relevant commands updated (distributed across agents, no conflicts)
     - [ ] Each agent updated only assigned files
     - [ ] Changes ready for commit
     ```

   **Step 3.2: Analyze Agent Dependencies**

   **CRITICAL**: Before spawning agents, identify dependencies:
   - **Phase 1** - Pattern Detection Agent → writes `patterns-detected.md` (NO dependencies)
   - **Phase 2** - Specification Update Agents (up to 6) → read `patterns-detected.md` (DEPEND on Phase 1)
     - Each agent updates assigned spec files (can be multiple files per agent)
     - No file overlap between agents (prevents conflicts)
     - All agents in Phase 2 can run in parallel
   - **Phase 3** - Command Update Agents (up to 6) → read `patterns-detected.md` (DEPEND on Phase 1)
     - Each agent updates assigned command files (can be multiple files per agent)
     - No file overlap between agents (prevents conflicts)
     - All agents in Phase 3 can run in parallel

   **Execution Order**:
   1. **Phase 1**: Spawn Pattern Detection Agent FIRST (alone), wait for completion
   2. **Phase 2**: Discover spec files → Distribute work → Spawn up to 6 Spec Update Agents in parallel
   3. **Phase 3**: Discover command files → Distribute work → Spawn up to 6 Command Update Agents in parallel

   **Step 3.3: Spawn Agent 1 (Pattern Detection)**

   Use Task tool to spawn Pattern Detection agent:

   **Agent 1: Pattern Detection Agent**
   ```
   Prompt: "Analyze git changes and detect integration patterns.

   MUST examine git diff output and identify cross-cutting patterns:
   - New required dependencies (function parameters, imports)
   - New context objects or data structures
   - New initialization steps
   - New error handling patterns
   - New validation/security checks
   - New observability/tracing patterns

   Pattern Detection Questions:
   1. Does this introduce something ALL agents/modes/workflows should use?
   2. Are there new parameters every handler function needs?
   3. Is there new shared component requiring consistent imports?
   4. Does this establish a new best practice?

   MUST save findings to: _project/agents/commit-push/[timestamp]/patterns-detected.md
   Format:
   ## Detected Patterns
   - [Pattern name]: [Description]
   - Affected files: [list]
   - Should apply to: [agent-modes/sub-agents/workflows/tools/all]
   - Reasoning: [why this is a pattern]

   ## No Patterns Detected
   [Explain why no patterns found if applicable]"

   subagent_type: general-purpose
   ```

   **Step 3.4: Wait for Agent 1 Completion**

   - Wait for Agent 1 to complete and write `patterns-detected.md`
   - Verify the file exists before proceeding
   - Review patterns detected
   - Mark checklist item complete: "Pattern detection completed"

   **Step 3.5: Analyze and Distribute Specification Updates**

   **CRITICAL**: Read `patterns-detected.md`, discover all specification files, and intelligently distribute work among up to 6 parallel sub-agents.

   Task:
   1. List all specification files: `ls _project/docs/*-specification.md`
   2. Read `patterns-detected.md` to understand which specs need updates
   3. Distribute files across up to 6 sub-agents to maximize parallelism
   4. Ensure NO two agents work on the same file

   **Distribution Strategy**:
   - If 6 or fewer specs need updates → 1 agent per spec file
   - If more than 6 specs need updates → Distribute evenly (e.g., Agent 1 gets files 1-2, Agent 2 gets files 3-4, etc.)

   **Step 3.6: Spawn Specification Update Sub-Agents in Parallel (Pool of 6)**

   Use **ONE** Task tool invocation to spawn up to 6 agents in parallel. For each agent:

   **Specification Update Agent Template**:
   ```
   Prompt: "Update the following specification files based on detected patterns.

   MUST read: _project/agents/commit-push/[timestamp]/patterns-detected.md

   MUST ONLY modify these files (NO other files):
   [LIST OF ASSIGNED FILES - e.g.,
   - _project/docs/agent-mode-specification.md
   - _project/docs/workflow-specification.md
   ]

   Context: [RELEVANT PATTERNS FROM patterns-detected.md FOR THESE FILES]

   Task:
   1. Read patterns-detected.md for full context
   2. For EACH assigned file:
      a. Read the current file content
      b. Identify relevant patterns
      c. Update file with new requirements, examples, and integration instructions
      d. Document changes
   3. Save work log to: _project/agents/commit-push/[timestamp]/spec-agent-[N]-updated.md

   Work log format:
   ## Agent [N] - Specification Updates

   ### File: [filename1].md
   #### Changes Made
   - [change 1]
   - [change 2]

   #### Patterns Applied
   - [pattern name]: [how integrated]

   ### File: [filename2].md
   #### Changes Made
   - [change 1]

   #### No Updates Needed
   [Explain if no updates for specific file]"

   subagent_type: general-purpose
   ```

   **Example Distribution**:
   - 3 specs to update → Spawn 3 agents (1 spec each)
   - 8 specs to update → Spawn 6 agents (Agent 1: specs 1-2, Agent 2: specs 3-4, ..., Agent 6: specs 7-8)

   **Step 3.7: Wait for Specification Update Agents Completion**
   - Wait for all specification update agents to complete
   - Review their outputs: `spec-agent-[N]-updated.md` files
   - Update checklist.md with completion status
   - Mark checklist item complete: "Specification updates completed (if needed)"

   **Step 3.8: Analyze and Distribute Command Updates**

   **CRITICAL**: Read `patterns-detected.md`, discover all command files, and intelligently distribute work among up to 6 parallel sub-agents.

   Task:
   1. List all command files: `ls .claude/commands/create-*.md`
   2. Read `patterns-detected.md` to understand which commands need updates
   3. Distribute files across up to 6 sub-agents to maximize parallelism
   4. Ensure NO two agents work on the same file

   **Distribution Strategy**:
   - If 6 or fewer commands need updates → 1 agent per command file
   - If more than 6 commands need updates → Distribute evenly (e.g., Agent 1 gets files 1-2, Agent 2 gets files 3-4, etc.)

   **Step 3.9: Spawn Command Update Sub-Agents in Parallel (Pool of 6)**

   Use **ONE** Task tool invocation to spawn up to 6 agents in parallel. For each agent:

   **Command Update Agent Template**:
   ```
   Prompt: "Update the following command files based on detected patterns.

   MUST read: _project/agents/commit-push/[timestamp]/patterns-detected.md

   MUST ONLY modify these files (NO other files):
   [LIST OF ASSIGNED FILES - e.g.,
   - .claude/commands/create-agent-mode.md
   - .claude/commands/create-workflow.md
   ]

   Context: [RELEVANT PATTERNS FROM patterns-detected.md FOR THESE FILES]

   Task:
   1. Read patterns-detected.md for full context
   2. For EACH assigned file:
      a. Read the current file content
      b. Identify relevant patterns
      c. Update file with:
         - New requirements in instructions
         - New clarifying questions if needed
         - Updated code templates/examples
         - New validation steps
      d. Document changes
   3. Save work log to: _project/agents/commit-push/[timestamp]/cmd-agent-[N]-updated.md

   Work log format:
   ## Agent [N] - Command Updates

   ### File: [filename1].md
   #### Changes Made
   - [change 1]
   - [change 2]

   #### Patterns Applied
   - [pattern name]: [how integrated]

   ### File: [filename2].md
   #### Changes Made
   - [change 1]

   #### No Updates Needed
   [Explain if no updates for specific file]"

   subagent_type: general-purpose
   ```

   **Example Distribution**:
   - 4 commands to update → Spawn 4 agents (1 command each)
   - 10 commands to update → Spawn 6 agents (Agent 1: commands 1-2, Agent 2: commands 3-4, ..., Agent 6: commands 9-10)

   **Step 3.10: Wait for Command Update Agents Completion**
   - Wait for all command update agents to complete
   - Review their outputs: `cmd-agent-[N]-updated.md` files
   - Update checklist.md with completion status
   - Verify all changes are correct before proceeding
   - Mark checklist item complete: "Command updates completed (if needed)"

4. **Check Documentation Updates (MANDATORY - NEVER SKIP)**:

   **CRITICAL**: This step is MANDATORY for ALL commits. NEVER skip even if changes seem small or internal-only.

   **Step 4.1: Read All Documentation Files Listed in Prime Command**
   - MUST read @.claude/commands/prime.md to get the full list of documentation files
   - Mark checklist item complete: "prime.md files list read"
   - MUST read EACH documentation file using @ prefix to ensure full content is loaded:
     - @README.md
     - @_project/docs/PROJECT-NAVIGATOR.md
     - @sql/0-all-tables.sql
     - @_project/docs/workflow-specification.md
     - @_project/docs/agent-mode-specification.md
     - (Plus any additional files listed in prime.md)

   **Step 4.2: Identify Modified Components**
   - Run `git diff --name-only` to get ALL changed files
   - Categorize changes by component type:
     - Backend API changes (new endpoints, security features, middleware)
     - Database changes (new tables, migrations, RLS policies)
     - Configuration changes (new env vars, docker-compose changes)
     - Monitoring changes (new metrics, alerts, dashboards)
     - Frontend changes (new features, UI components)
     - Security changes (authentication, authorization, guardrails)
     - Testing changes (new test files, test infrastructure)
     - Agent modes/workflows/tools changes

   **Step 4.3: Determine Documentation Impact (Use Decision Trees)**

   **For README.md - Ask these questions for EACH category that has changes:**

   1. **Does this add a new feature users will interact with?**
      - YES → README update REQUIRED (document feature, usage, configuration)
      - NO → Continue to question 2

   2. **Does this change configuration or environment variables?**
      - YES → README update REQUIRED (document new env vars, configuration options)
      - NO → Continue to question 3

   3. **Does this add new security features or protections?**
      - YES → README update REQUIRED (document security features, configuration, impact)
      - NO → Continue to question 4

   4. **Does this add new monitoring/observability capabilities?**
      - YES → README update REQUIRED (document metrics, alerts, dashboards)
      - NO → Continue to question 5

   5. **Does this change how users deploy or run the application?**
      - YES → README update REQUIRED (update deployment instructions)
      - NO → Continue to question 6

   6. **Does this add new dependencies or system requirements?**
      - YES → README update REQUIRED (document new dependencies, requirements)
      - NO → Continue to question 7

   7. **Does this change API endpoints or data structures?**
      - YES → README update REQUIRED (document API changes, migration notes)
      - NO → Continue to question 8

   8. **Does this affect testing or development workflow?**
      - YES → README update REQUIRED (update testing section, dev setup)
      - NO → README update may not be needed, but verify by comparing current content

   **For PROJECT-NAVIGATOR.md - Ask these questions for changed files:**

   1. **Does this add/remove/move files or directories?**
      - YES → Update PROJECT-NAVIGATOR.md "Directory Structure" section
      - NO → Continue to question 2

   2. **Does this add/modify key configuration files?**
      - YES → Update "Configuration Files" or "Key Files Reference" section
      - NO → Continue to question 3

   3. **Does this add/modify agent modes, workflows, or tools?**
      - YES → Update "Agent Mode Structure" or "Functionality Map" section
      - NO → Continue to question 4

   4. **Does this change deployment process or commands?**
      - YES → Update "Deployment Guide" or "Deployment Commands" section
      - NO → Continue to question 5

   5. **Does this add/modify environment variables?**
      - YES → Update "Environment Variables (Key)" section
      - NO → Continue to question 6

   6. **Does this add/modify database tables or schema?**
      - YES → Update "Database Tables (Key)" section
      - NO → Continue to question 7

   7. **Does this add/modify ports or service endpoints?**
      - YES → Update "Port Allocation" section
      - NO → Continue to question 8

   8. **Does this add/modify slash commands or workflows?**
      - YES → Update "Common Workflows" section with slash command references
      - NO → PROJECT-NAVIGATOR.md may not need updates

   **For sql/0-all-tables.sql:**
   - If database schema changes detected → Update to reflect current state

   **For workflow-specification.md and agent-mode-specification.md:**
   - If workflow patterns or agent mode patterns changed → Update specifications

   **Step 4.4: Update Documentation Files if ANY Decision Tree Question Answered YES**
   - Update affected sections with accurate information
   - Add new sections if needed
   - Update configuration examples
   - Update feature lists
   - Update architecture descriptions
   - Update testing instructions if tests changed
   - Update troubleshooting if new issues are possible
   - Update "Last Updated" dates where applicable
   - Mark checklist items complete for each documentation file updated:
     - "README.md reviewed and updated"
     - "PROJECT-NAVIGATOR.md reviewed and updated"
     - "sql/0-all-tables.sql reviewed and updated"
     - "workflow-specification.md reviewed and updated"
     - "agent-mode-specification.md reviewed and updated"

   **Step 4.5: Verify Documentation Accuracy**
   - Re-read updated sections
   - Ensure no contradictions with implementation
   - Verify all code examples are correct
   - Verify all file paths are correct
   - Verify all numbers/metrics match reality
   - Mark checklist item complete: "Documentation updates completed (MANDATORY)"

   **NEVER Skip Because**:
   - ❌ "Changes are internal only" (internal changes often have external impact)
   - ❌ "It's just a small fix" (small fixes can affect configuration or usage)
   - ❌ "Documentation is already accurate" (verify by reading it, don't assume)
   - ❌ "I'll update it later" (later never happens, update NOW)

   **Output**: Document documentation update decision in workspace:
   ```
   _project/agents/commit-push/[timestamp]/documentation-check.md:

   ## Documentation Update Decision

   ### Files Read from @.claude/commands/prime.md
   - [List all documentation files read with @ prefix]

   ### Modified Components
   - [List of changed files categorized by component]

   ### README.md Decision Tree Results
   - Question 1 (New feature): [YES/NO] - [reasoning]
   - Question 2 (Configuration): [YES/NO] - [reasoning]
   - Question 3 (Security): [YES/NO] - [reasoning]
   - Question 4 (Monitoring): [YES/NO] - [reasoning]
   - Question 5 (Deployment): [YES/NO] - [reasoning]
   - Question 6 (Dependencies): [YES/NO] - [reasoning]
   - Question 7 (API changes): [YES/NO] - [reasoning]
   - Question 8 (Testing): [YES/NO] - [reasoning]

   ### PROJECT-NAVIGATOR.md Decision Tree Results
   - Question 1 (Files/dirs): [YES/NO] - [reasoning]
   - Question 2 (Config files): [YES/NO] - [reasoning]
   - Question 3 (Agent modes): [YES/NO] - [reasoning]
   - Question 4 (Deployment): [YES/NO] - [reasoning]
   - Question 5 (Env vars): [YES/NO] - [reasoning]
   - Question 6 (Database): [YES/NO] - [reasoning]
   - Question 7 (Ports): [YES/NO] - [reasoning]
   - Question 8 (Workflows): [YES/NO] - [reasoning]

   ### Other Documentation Files
   - sql/0-all-tables.sql: [updated/no update needed] - [reasoning]
   - workflow-specification.md: [updated/no update needed] - [reasoning]
   - agent-mode-specification.md: [updated/no update needed] - [reasoning]

   ### Documentation Updates Made
   - [List of updates per file] OR "No updates needed (verified all sections accurate)"

   ### Verification
   - [ ] All updated sections re-read for accuracy
   - [ ] No contradictions with implementation
   - [ ] All numbers/metrics match reality
   - [ ] All file paths correct
   ```

   **Step 4.6: MANDATORY DOCUMENTATION COMPLETION GATE (BLOCKING)**

   **CRITICAL**: This is a HARD STOP. NO exceptions. NO token budget excuses. NO "deferred" or "later" allowed.

   Execute the following validation steps IN ORDER:

   **Validation 1: Check for Incomplete Documentation**
   ```bash
   grep -iE "(deferred|pending|TODO|later|follow-up)" _project/agents/commit-push/[timestamp]/documentation-check.md
   ```
   - IF any matches found:
     - **STOP IMMEDIATELY**
     - Report to user: "❌ DOCUMENTATION INCOMPLETE - CANNOT PROCEED"
     - List all incomplete items
     - **DO NOT CONTINUE TO STEP 5**

   **Validation 2: Verify README.md Updated If Required**
   ```bash
   grep -q "README UPDATE REQUIRED: YES" _project/agents/commit-push/[timestamp]/documentation-check.md
   if [ $? -eq 0 ]; then
     git diff --cached --name-only | grep -q "README.md"
     if [ $? -ne 0 ]; then
       echo "❌ ERROR: README.md marked as required but NOT updated"
       exit 1
     fi
   fi
   ```
   - IF README required but not in staged files:
     - **STOP IMMEDIATELY**
     - Report: "❌ README.md UPDATE REQUIRED but file not modified"
     - **DO NOT CONTINUE TO STEP 5**

   **Validation 3: Verify PROJECT-NAVIGATOR.md Updated If New/Removed Files**
   ```bash
   # Count new files (A) and deleted files (D)
   NEW_OR_DELETED=$(git diff --cached --name-status | grep -c "^[AD]")

   if [ $NEW_OR_DELETED -gt 0 ]; then
     git diff --cached --name-only | grep -q "_project/docs/PROJECT-NAVIGATOR.md"
     if [ $? -ne 0 ]; then
       echo "❌ ERROR: $NEW_OR_DELETED files added/removed but PROJECT-NAVIGATOR.md NOT updated"
       git diff --cached --name-status | grep "^[AD]"
       exit 1
     fi
   fi
   ```
   - IF files added/removed but PROJECT-NAVIGATOR.md not staged:
     - **STOP IMMEDIATELY**
     - Report: "❌ [X] files added/removed - PROJECT-NAVIGATOR.md MUST be updated"
     - List all new/removed files
     - **DO NOT CONTINUE TO STEP 5**

   **Validation 4: Verify sql/0-all-tables.sql Updated If Database Changes**
   ```bash
   git diff --cached --name-only | grep -q "^sql/"
   if [ $? -eq 0 ]; then
     git diff --cached --name-only | grep -q "sql/0-all-tables.sql"
     if [ $? -ne 0 ]; then
       echo "❌ ERROR: SQL migrations found but sql/0-all-tables.sql NOT updated"
       git diff --cached --name-only | grep "^sql/"
       exit 1
     fi
   fi
   ```
   - IF SQL files changed but sql/0-all-tables.sql not staged:
     - **STOP IMMEDIATELY**
     - Report: "❌ Database schema changes detected - sql/0-all-tables.sql MUST be synced"
     - **DO NOT CONTINUE TO STEP 5**

   **Validation 5: Final Gate Check**

   Read documentation-check.md and verify:
   - ✅ All "UPDATE REQUIRED: YES" items show "✅ UPDATED" in the updates section
   - ✅ NO items marked "deferred", "pending", "TODO", "later", or "follow-up"
   - ✅ All required documentation files are in `git diff --cached --name-only`

   IF any validation fails:
   - **STOP THE ENTIRE WORKFLOW**
   - Report ALL failures to user
   - Ask: "Update documentation now OR cancel commit?"
   - **DO NOT PROCEED TO STEP 5 UNTIL ALL VALIDATIONS PASS**

   **NO EXCEPTIONS FOR**:
   - ❌ Token budget constraints (you have enough tokens, use them)
   - ❌ "Quick fix" commits (documentation is ALWAYS mandatory)
   - ❌ "Internal only" changes (documentation reflects reality)
   - ❌ "Time pressure" (incomplete docs = broken commit)
   - ❌ "Will update later" (later = never, update NOW)

   **PASS CRITERIA**:
   - ✅ All validation commands return 0 (success)
   - ✅ NO incomplete documentation in documentation-check.md
   - ✅ ALL required doc files staged in git
   - ✅ documentation-check.md shows "✅ UPDATED" for all required items

   **ONLY after ALL validations pass**: Mark checklist item "Documentation validation gate passed" and proceed to Step 5.

5. **Create Branch**:
   - Come up with a descriptive branch name based on the changes
   - Use format: `{type}/{brief-description}` (e.g., `feat/add-user-auth`, `fix/memory-leak`)
   - Create and checkout the new branch
   - Mark checklist item complete: "Branch created"

6. **Stage and Commit**:
   - Stage all changes using `git add .`
   - Mark checklist item complete: "Changes staged (git add .)"
   - Create a commit message where the title is max 70 characters
   - Follow conventional commits format (feat:, fix:, refactor:, docs:, etc.)
   - Focus on WHY rather than WHAT
   - **CRITICAL**: DO NOT add ANY attribution, branding, or signature lines including:
     - ❌ "🤖 Generated with Claude Code"
     - ❌ "Co-Authored-By: Claude"
     - ❌ Any links to Claude or Anthropic
     - ❌ Any AI-generated disclaimers or credits
   - Keep commits professional and attribution-free
   - Mark checklist item complete: "Commit message created (max 70 chars)"
   - Execute commit
   - Mark checklist item complete: "Commit completed"
   - Record commit SHA in checklist

7. **Push and Create PR**:
   - Push the branch to remote with `-u` flag
   - Mark checklist item complete: "Push completed"
   - **Check for Environment Variable Changes**:
     - Run `git diff` and examine changes in:
       - `.env.example` files
       - `docker-compose*.yml` files (look for `environment:` sections)
       - New `os.getenv()`, `os.environ`, or `${ENV_VAR}` usage in code
       - Configuration files that reference environment variables
     - If new or modified environment variables are detected, prepare an Environment Variables section for the PR description
   - Create a PR using `gh pr create` with:
     - Title: same as commit title (max 70 characters)
     - Body format:
       ```
       ## Summary
       [1-3 bullet points describing the changes]

       ## Environment Variables
       **IMPORTANT**: The following environment variables need to be updated on deployment:

       ### New Variables
       - `VARIABLE_NAME`: [description, purpose, default value if any, required/optional]

       ### Modified Variables
       - `VARIABLE_NAME`: [description of what changed and why]

       ### Deprecated Variables
       - `VARIABLE_NAME`: [what replaces it, migration instructions]

       [If no environment variable changes, write: "No environment variable changes required."]

       ## Test Plan
       [Bulleted markdown checklist of TODOs for testing the pull request]
       ```
     - **CRITICAL**: DO NOT add ANY attribution, branding, or signature lines in PR body including:
       - ❌ "🤖 Generated with Claude Code"
       - ❌ "Co-Authored-By: Claude"
       - ❌ Any links to Claude or Anthropic
       - ❌ Any AI-generated disclaimers or credits
   - Mark checklist item complete: "PR created"
   - Record PR URL in checklist
   - Mark checklist item complete: "PR URL returned"

8. **Final Verification and Reporting**:
   - Read the checklist file: `_project/agents/commit-push/YYYY-MM-DD-HHMMSS/commit-checklist.md`
   - Verify ALL checklist items are marked complete with [x]
   - If any items are NOT complete:
     - STOP and report missing items to user
     - Do NOT proceed until all items complete
   - Generate final report with:
     ```markdown
     ## Commit-Push Workflow Complete

     ### Files Modified/Created
     [Run `git diff --name-only HEAD~1` to list all changed files with absolute paths]

     ### Documentation Files Updated
     - README.md: [updated/no changes needed]
     - PROJECT-NAVIGATOR.md: [updated/no changes needed]
     - sql/0-all-tables.sql: [updated/no changes needed]
     - workflow-specification.md: [updated/no changes needed]
     - agent-mode-specification.md: [updated/no changes needed]

     ### Checklist Completion
     ✅ All checklist items verified complete

     ### Commit Information
     - Branch: [branch-name]
     - Commit SHA: [sha]
     - Commit Message: [message]

     ### Pull Request
     - PR URL: [url]

     ### Workspace Location
     - Checklist: _project/agents/commit-push/YYYY-MM-DD-HHMMSS/commit-checklist.md
     - Quality Reports: _project/agents/commit-push/YYYY-MM-DD-HHMMSS/quality/
     - Pattern Detection: _project/agents/commit-push/YYYY-MM-DD-HHMMSS/patterns-detected.md
     - Documentation Check: _project/agents/commit-push/YYYY-MM-DD-HHMMSS/documentation-check.md
     ```
   - Return this final report to the user
