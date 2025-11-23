---
description: Create chore/refactor implementation plan
argument-hint: [chore description]
---

# Chore Planning

Create a new plan in specs/*.md to resolve the `Chore` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Instructions

- CRITICAL: Run /prime FIRST to load complete project context
- IMPORTANT: Use `command-templates` skill to understand the TAC pattern
- IMPORTANT: You're writing a plan to resolve a chore based on the `Chore` that will add value to the application
- IMPORTANT: The `Chore` describes the chore that will be resolved but remember we're not resolving the chore, we're creating the plan that will be used to resolve the chore based on the `Plan Format` below
- You're writing a plan to resolve a chore, it should be simple but we need to be thorough and precise so we don't miss anything or waste time with any second round of changes
- Create the plan in the `specs/*.md` file. Name it appropriately based on the `Chore`
- Use the plan format below to create the plan
- Research the codebase and put together a plan to accomplish the chore
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to accomplish the chore
- Use your reasoning model: THINK HARD about the plan and the steps to accomplish the chore
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

Ignore all other files not relevant to the chore.

## Plan Format

```md
# Chore: <chore name>

## Chore Description
<describe the chore in detail, including its purpose and value>

## Problem Statement
<clearly define what needs to be improved or refactored>

## Solution Statement
<describe the proposed approach to accomplish the chore>

## Skills Required
<list skills from PROJECT-NAVIGATOR.md needed for this chore>

**General Skills**:
- `<general-skill>` - <why needed for this chore>

**Specific Skills**:
- `<framework-skill>` - <why needed for this chore>

**Domain Skills**:
- `<domain-expert>` - <why needed for this chore>

## Relevant Files
Use these files to resolve the chore:

<find and list the files that are relevant to the chore describe why they are relevant in bullet points. If there are new files that need to be created to accomplish the chore, list them in an h3 'New Files' section.>

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers plus bullet points. use as many h3 headers as needed to accomplish the chore. Order matters, start with the foundational shared changes required to fix the chore then move on to the specific changes required to fix the chore. Your last step should be running the `Validation Commands` to validate the chore is complete with zero regressions.>

## Testing Strategy
### Regression Tests
<describe tests to ensure no existing functionality breaks>

### Validation Tests
<describe tests to validate the chore accomplished its goal>

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

<list commands you'll use to validate with 100% confidence the chore is complete with zero regressions. every command must execute without errors so be specific about what you want to run to validate the chore is complete with zero regressions.>

## Notes
<optionally list any additional notes or context that are relevant to the chore that will be helpful to the developer>
```

## Chore
$ARGUMENTS

## Report
- Summarize the work you've just done in a concise bullet point list
- Include a path to the plan you created in the `specs/*.md` file
- List skills that will be used during implementation
