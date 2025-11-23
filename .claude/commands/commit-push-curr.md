---
description: Commit and push to current branch (no PR creation)
tags:
  - project
  - git
---

# Commit and Push to Current Branch

Analyze current changes, commit, and push to the current branch without creating a new branch or PR.

## Instructions

0. **Create Commit Checklist**:
   - Create timestamp: `date +"%Y-%m-%d-%H%M%S"`
   - Create workspace: `_project/agents/commit-push-curr/YYYY-MM-DD-HHMMSS/`
   - Create checklist file: `_project/agents/commit-push-curr/YYYY-MM-DD-HHMMSS/commit-checklist.md` with:
     ```markdown
     # Commit-Push-Curr Workflow Checklist - [timestamp]

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

     ## 📋 Commit Steps
     - [ ] Changes staged (git add .)
     - [ ] Commit message created (max 70 chars)
     - [ ] Commit completed

     ## 📋 Post-Commit Steps
     - [ ] Push completed

     ## 📋 Final Verification
     - [ ] All checklist items marked complete
     - [ ] Files modified list generated
     - [ ] Documentation updated list generated
     - [ ] Commit SHA recorded
     ```

1. **Analyze Changes**:
   - Run `git status` to see all untracked files
   - Run `git diff` to see both staged and unstaged changes
   - Review the changes to understand what was modified
   - Mark checklist items complete: "Git status reviewed" and "Git diff reviewed"

2. **Quality Validation (Using Parallel Sub-Agents)**:

   See @.claude/commands/commit-push.md Step 2 for complete quality validation process.

   **Note**: Update workspace folder path from `commit-push` to `commit-push-curr` when following those instructions.

3. **Pattern Detection & Specification Updates (Using Parallel Sub-Agents)**:

   See @.claude/commands/commit-push.md Step 3 for complete pattern detection and specification update process.

   **Note**: Update workspace folder path from `commit-push` to `commit-push-curr` when following those instructions.

4. **Check Documentation Updates (MANDATORY - NEVER SKIP)**:

   See @.claude/commands/commit-push.md Step 4 for complete documentation update process (covers README, PROJECT-NAVIGATOR, sql/0-all-tables.sql, and specifications).

   **Note**: Update workspace folder path from `commit-push` to `commit-push-curr` when following those instructions.

5. **Stage and Commit**:
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

6. **Push to Current Branch**:
   - Push changes to the current branch using `git push`
   - Mark checklist item complete: "Push completed"
   - Confirm the push was successful

7. **Final Verification and Reporting**:
   - Read the checklist file: `_project/agents/commit-push-curr/YYYY-MM-DD-HHMMSS/commit-checklist.md`
   - Verify ALL checklist items are marked complete with [x]
   - If any items are NOT complete:
     - STOP and report missing items to user
     - Do NOT proceed until all items complete
   - Generate final report with:
     ```markdown
     ## Commit-Push-Curr Workflow Complete

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
     - Branch: [current-branch-name]
     - Commit SHA: [sha]
     - Commit Message: [message]

     ### Workspace Location
     - Checklist: _project/agents/commit-push-curr/YYYY-MM-DD-HHMMSS/commit-checklist.md
     - Quality Reports: _project/agents/commit-push-curr/YYYY-MM-DD-HHMMSS/quality/
     - Pattern Detection: _project/agents/commit-push-curr/YYYY-MM-DD-HHMMSS/patterns-detected.md
     - Documentation Check: _project/agents/commit-push-curr/YYYY-MM-DD-HHMMSS/documentation-check.md
     ```
   - Return this final report to the user
