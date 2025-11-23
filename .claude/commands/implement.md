---
description: Implement feature/bug/chore plan
argument-hint: @specs/plan-name.md
---

# Implement Plan

Follow the `Instructions` to implement the `Plan` then `Report` the completed work.

## Instructions

- CRITICAL: Run /prime FIRST to load complete project context
- IMPORTANT: Use `command-templates` skill to understand execution workflow
- Read the plan thoroughly before starting implementation
- THINK HARD about the plan and implementation approach
- Use the skills identified in the plan from CLAUDE.md:
  - General skills: database-management, api-design, security, testing
  - Specific skills: framework-specific skills
  - Domain skills: architecture-expert, security-expert, etc.
- Follow the step-by-step tasks in the exact order specified in the plan
- Execute all validation commands from the plan to verify completion
- Ensure all tests pass with zero regressions
- Update CLAUDE.md if new skills or commands were created

## Plan

$ARGUMENTS

## Report

- Summarize the work you've just done in a concise bullet point list
- Report the files and total lines changed with `git diff --stat`
- List validation commands executed and their results
- Confirm all tests passing with zero regressions
- List skills that were used during implementation
