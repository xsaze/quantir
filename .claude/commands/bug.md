---
description: Create bug fix implementation plan
argument-hint: [bug description]
---

# Bug Planning

Create a new plan in specs/*.md to resolve the `Bug` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Instructions

- CRITICAL: Run /prime FIRST to load complete project context
- IMPORTANT: Use `command-templates` skill to understand the TAC pattern
- IMPORTANT: You're writing a plan to resolve a bug based on the `Bug` that will add value to the application
- IMPORTANT: The `Bug` describes the bug that will be resolved but remember we're not resolving the bug, we're creating the plan that will be used to resolve the bug based on the `Plan Format` below
- You're writing a plan to resolve a bug, it should be thorough and precise so we fix the root cause and prevent regressions
- Create the plan in the `specs/*.md` file. Name it appropriately based on the `Bug`
- Use the plan format below to create the plan
- Research the codebase to understand the bug, reproduce it, and put together a plan to fix it
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to fix the bug
- Use your reasoning model: THINK HARD about the bug, its root cause, and the steps to fix it properly
- IMPORTANT: Be surgical with your bug fix, solve the bug at hand and don't fall off track
- IMPORTANT: We want the minimal number of changes that will fix and address the bug
- Identify which skills are needed from PROJECT-NAVIGATOR.md:
  - General skills: database-management, api-design, security, testing
  - Specific skills: framework-specific skills
  - Domain skills: architecture-expert, security-expert, etc.
- Reference PROJECT-NAVIGATOR.md for file structure
- Reference architecture-plan.md for system design

## Relevant Files

Focus on the following files:
- `PROJECT-NAVIGATOR.md` - Contains project structure, skills, and commands
- `_project/docs/architecture-plan.md` - Contains architecture design
- `README.md` - Contains project overview and setup instructions
- Review codebase structure from PROJECT-NAVIGATOR.md to identify relevant directories

Ignore all other files not relevant to the bug.

## Plan Format

```md
# Bug: <bug name>

## Bug Description
<describe the bug in detail, including symptoms and expected vs actual behavior>

## Problem Statement
<clearly define the specific problem that needs to be solved>

## Solution Statement
<describe the proposed solution approach to fix the bug>

## Steps to Reproduce
<list exact steps to reproduce the bug>

## Root Cause Analysis
<analyze and explain the root cause of the bug>

## Skills Required
<list skills from CLAUDE.md and do execute `ls .claude/skills` to list all skills, and use only the needed for this bug fix>

**General Skills**:
- `database-management` - <why needed for this bug>
- `api-design` - <why needed for this bug>
- `testing` - <why needed for this bug>

**Specific Skills**:
- `<framework-skill>` - <why needed for this bug>

**Domain Skills**:
- `<domain-expert>` - <why needed for this bug>

## Relevant Files
Use these files to fix the bug:

<find and list the files that are relevant to the bug describe why they are relevant in bullet points. If there are new files that need to be created to fix the bug, list them in an h3 'New Files' section.>

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers plus bullet points. use as many h3 headers as needed to fix the bug. Order matters, start with the foundational shared changes required to fix the bug then move on to the specific changes required to fix the bug. Include tests that will validate the bug is fixed with zero regressions. Your last step should be running the `Validation Commands` to validate the bug is fixed with zero regressions.>

## Testing Strategy
### Reproduction Test
<describe test that reproduces the bug (should FAIL before fix, PASS after fix)>

### Regression Tests
<describe tests to ensure no existing functionality breaks>

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

<list commands you'll use to validate with 100% confidence the bug is fixed with zero regressions. every command must execute without errors so be specific about what you want to run to validate the bug is fixed with zero regressions. Include commands to reproduce the bug before and after the fix.>

## Notes
<optionally list any additional notes or context that are relevant to the bug that will be helpful to the developer>
```

## Bug
$ARGUMENTS

## Report
- Summarize the work you've just done in a concise bullet point list
- Include a path to the plan you created in the `specs/*.md` file
- List skills that will be used during implementation
