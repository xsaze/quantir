---
description: Security review, then create branch, commit, push, and create PR
tags:
  - project
  - git
  - security
---

# Security Check, Commit and Push with PR

Run security review, then analyze changes, create a new branch, commit, push, and create a pull request.

## Instructions

0. **Create Commit Checklist**:
   - Create timestamp: `date +"%Y-%m-%d-%H%M%S"`
   - Create workspace: `_project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/`
   - Create checklist file: `_project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/commit-checklist.md` with:
     ```markdown
     # Sec-Check-Commit-Push Workflow Checklist - [timestamp]

     ## 📋 Pre-Commit Steps
     - [ ] Security review completed (/security-review)
     - [ ] Security review output saved (security-review.md)
     - [ ] Security decision: [NO_ISSUES | LOW_MEDIUM_ONLY | HIGH_CRITICAL_BLOCKED]
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
     - [ ] Branch created

     ## 📋 Commit Steps
     - [ ] Changes staged (git add .)
     - [ ] Commit message created (max 70 chars)
     - [ ] Commit completed

     ## 📋 Post-Commit Steps
     - [ ] Push completed
     - [ ] PR created (if gh available)
     - [ ] PR URL returned

     ## 📋 Final Verification
     - [ ] All checklist items marked complete
     - [ ] Files modified list generated
     - [ ] Documentation updated list generated
     - [ ] Commit SHA recorded
     - [ ] PR URL recorded (if applicable)
     ```

1. **Security Review**:
   - Execute the `/security-review` command first
   - Save security review output to: `_project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/security-review.md`
   - **Decision Tree (MUST follow EXACTLY):**
     - IF security review shows "No exploitable vulnerabilities" OR "0 findings" → **AUTOMATICALLY PROCEED to Step 2** (mark checklist complete)
     - IF security review shows ONLY LOW/MEDIUM severity → **AUTOMATICALLY PROCEED to Step 2** (document findings in workspace, mark checklist complete)
     - IF security review shows HIGH/CRITICAL severity with concrete exploit paths → **STOP, report to user, ask how to proceed**
   - Mark checklist item complete: "Security review completed (/security-review)"
   - **NEVER stop workflow if no HIGH/CRITICAL issues found**

2. **Analyze Changes**:
   - Run `git status` to see all untracked files
   - Run `git diff` to see both staged and unstaged changes
   - Review the changes to understand what was modified
   - Mark checklist items complete: "Git status reviewed" and "Git diff reviewed"

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
     - `CLAUDE.md` (internal AI instructions - MUST be in .gitignore)
     - `.gitignore` files (unless explicitly requested by user)
     - `.env` files (only `.env.example` is allowed)
     - Any files listed in `.gitignore`
   - Common patterns to detect:
     - Files: `CLAUDE.md`, `.gitignore`, `.env` (without `.example` suffix), `credentials.json`, `secrets.*`, `*.pem`, `*.key`
     - Patterns: `password=`, `secret=`, `token=`, `api_key=`, `private_key=`
     - Values: Long base64 strings, hex keys (32+ chars), bearer tokens
   - If sensitive information detected:
     - STOP immediately and BLOCK commit
     - List ALL files/lines with sensitive data
     - Warn user about security risk
     - Recommend: Add to `.gitignore`, use environment variables, use secrets manager
     - Ask user to confirm they want to proceed (only if false positive)
   - Mark checklist item complete: "Security check completed (no sensitive data)"

3. **Quality Validation (Using Parallel Sub-Agents)**:

   See @.claude/commands/commit-push.md Step 2 for complete quality validation process.

   **Note**: Update workspace folder path from `commit-push` to `sec-check-commit-push` when following those instructions.

4. **Pattern Detection & Specification Updates (Using Parallel Sub-Agents)**:

   See @.claude/commands/commit-push.md Step 3 for complete pattern detection and specification update process.

   **Note**: Update workspace folder path from `commit-push` to `sec-check-commit-push` when following those instructions.

5. **Check Documentation Updates (MANDATORY - NEVER SKIP)**:

   See @.claude/commands/commit-push.md Step 4 for complete documentation update process (covers README, PROJECT-NAVIGATOR, sql/0-all-tables.sql, and specifications).

   **Note**: Update workspace folder path from `commit-push` to `sec-check-commit-push` when following those instructions.

6. **Create Branch**:
   - Come up with a descriptive branch name based on the changes
   - Use format: `{type}/{brief-description}` (e.g., `feat/add-user-auth`, `fix/memory-leak`)
   - Create and checkout the new branch
   - Mark checklist item complete: "Branch created"

7. **Stage and Commit**:
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

8. **Push and Create PR**:
   - Push the branch to remote with `-u` flag
   - Mark checklist item complete: "Push completed"
   - **Check for Environment Variable Changes**:
     - Run `git diff` and examine changes in:
       - `.env.example` files
       - `docker-compose*.yml` files (look for `environment:` sections)
       - New `os.getenv()`, `os.environ`, or `${ENV_VAR}` usage in code
       - Configuration files that reference environment variables
     - If new or modified environment variables are detected, prepare an Environment Variables section for the PR description
   - Check if `gh` CLI is available by running `which gh`
   - If `gh` is available:
     - Create a PR using `gh pr create` with:
       - Title: same as commit title (max 70 chars)
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
     - Mark checklist item complete: "PR created (if gh available)"
     - Record PR URL in checklist
     - Mark checklist item complete: "PR URL returned"
     - Return the PR URL to the user
   - If `gh` is NOT available:
     - Inform user that GitHub CLI is not installed
     - Provide installation instructions: `brew install gh` (macOS) or visit https://cli.github.com/
     - Open the PR creation URL in browser: `https://github.com/{owner}/{repo}/pull/new/{branch}`
     - Provide the PR title and body text for user to paste manually
     - Mark checklist items: "PR created (if gh available)" and "PR URL returned" with note "(gh not available - manual PR creation)"

9. **Final Verification and Reporting**:
   - Read the checklist file: `_project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/commit-checklist.md`
   - Verify ALL checklist items are marked complete with [x]
   - If any items are NOT complete:
     - STOP and report missing items to user
     - Do NOT proceed until all items complete
   - Generate final report with:
     ```markdown
     ## Sec-Check-Commit-Push Workflow Complete

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
     - PR URL: [url] (or "Manual PR creation required - gh not available")

     ### Workspace Location
     - Checklist: _project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/commit-checklist.md
     - Security Review: _project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/security-review.md
     - Quality Reports: _project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/quality/
     - Pattern Detection: _project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/patterns-detected.md
     - Documentation Check: _project/agents/sec-check-commit-push/YYYY-MM-DD-HHMMSS/documentation-check.md
     ```
   - Return this final report to the user
