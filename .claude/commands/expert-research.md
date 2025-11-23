# RESEARCH MISSION: [TOPIC NAME]

## OBJECTIVE
Achieve expert-level understanding of [TOPIC] through exhaustive research using minimum 18-20 tool calls across parallel and sequential research agents.

---

## RESEARCH COORDINATOR (Main Agent)

You are the Research Coordinator. Your role:
1. Spawn specialized research agents in correct dependency order
2. Validate each agent's work using checklists before proceeding
3. Synthesize findings into comprehensive knowledge base
4. Ensure minimum tool call requirements are met

---

## RESEARCH AGENT ARCHITECTURE

### AGENT 1: Foundation Research (SEQUENTIAL - Must Complete First)
**Purpose**: Establish core concepts, terminology, and historical context

**Tasks**:
- [ ] Official documentation (fetch complete sections, not snippets)
- [ ] Academic papers/whitepapers (if applicable)
- [ ] Historical evolution and timeline
- [ ] Core terminology definitions
- [ ] Foundational architecture/design principles

**Minimum Tool Calls**: 5-6
**Deliverable**: `01_foundation_research.md`

**Validation Checklist (Coordinator)**:
- [ ] Core concepts clearly defined with sources
- [ ] Key terminology documented
- [ ] Historical context established
- [ ] Minimum 5 tool calls executed
- [ ] All major documentation sources fetched (not just searched)

---

### AGENT 2: Implementation Patterns (SEQUENTIAL - Depends on Agent 1)
**Purpose**: Deep dive into practical implementations and design patterns

**Tasks**:
- [ ] Find 3-5 real-world implementation examples
- [ ] Analyze production-grade code repositories
- [ ] Document common design patterns
- [ ] Identify best practices from implementations
- [ ] Extract architectural decisions and rationale

**Minimum Tool Calls**: 5-6
**Deliverable**: `02_implementation_patterns.md`

**Validation Checklist (Coordinator)**:
- [ ] At least 3 real implementations documented
- [ ] Code examples analyzed (not just linked)
- [ ] Design patterns extracted and explained
- [ ] Best practices documented with reasoning
- [ ] Minimum 5 tool calls executed

---

### AGENT 3: Edge Cases & Limitations (PARALLEL - Can start after Agent 1)
**Purpose**: Identify failure modes, limitations, and known issues

**Tasks**:
- [ ] Search GitHub issues for common problems
- [ ] Community forums (Stack Overflow, Reddit, Discord)
- [ ] Known bugs and limitations
- [ ] Performance bottlenecks
- [ ] Edge cases and failure scenarios

**Minimum Tool Calls**: 4-5
**Deliverable**: `03_edge_cases_limitations.md`

**Validation Checklist (Coordinator)**:
- [ ] Known issues documented with sources
- [ ] Edge cases identified
- [ ] Community pain points captured
- [ ] Performance limitations noted
- [ ] Minimum 4 tool calls executed

---

### AGENT 4: Competing Approaches (PARALLEL - Can start after Agent 1)
**Purpose**: Map alternative solutions and comparative analysis

**Tasks**:
- [ ] Identify 2-3 competing/alternative approaches
- [ ] Document pros/cons of each approach
- [ ] Benchmark data (if available)
- [ ] Use case recommendations
- [ ] Migration considerations between approaches

**Minimum Tool Calls**: 4-5
**Deliverable**: `04_competing_approaches.md`

**Validation Checklist (Coordinator)**:
- [ ] At least 2 alternatives documented
- [ ] Objective comparison matrix created
- [ ] Use cases for each approach defined
- [ ] Tradeoffs clearly articulated
- [ ] Minimum 4 tool calls executed

---

### AGENT 5: Security & Production Hardening (SEQUENTIAL - Depends on Agent 2)
**Purpose**: Security considerations and production deployment

**Tasks**:
- [ ] Security best practices and attack vectors
- [ ] Production deployment patterns
- [ ] Monitoring and observability strategies
- [ ] Scaling considerations
- [ ] Disaster recovery and fault tolerance

**Minimum Tool Calls**: 3-4
**Deliverable**: `05_security_production.md`

**Validation Checklist (Coordinator)**:
- [ ] Security threats identified
- [ ] Mitigation strategies documented
- [ ] Production deployment checklist created
- [ ] Scaling patterns documented
- [ ] Minimum 3 tool calls executed

---

## EXECUTION PLAN (For Coordinator)

### Phase 1: Foundation (Sequential)
```
START Agent 1 (Foundation Research)
  ↓
VALIDATE Agent 1 Output (Use checklist)
  ↓
IF VALID: Proceed to Phase 2
IF INVALID: Re-run Agent 1 with corrections
```

### Phase 2: Parallel Analysis (Agent 1 must be complete)
```
START Agent 3 (Edge Cases) || START Agent 4 (Competing Approaches)
  ↓                              ↓
VALIDATE Agent 3        VALIDATE Agent 4
  ↓                              ↓
  └──────────── WAIT FOR BOTH ──────────┘
                        ↓
              Proceed to Phase 3
```

### Phase 3: Implementation Deep Dive (Sequential)
```
START Agent 2 (Implementation Patterns)
  ↓
VALIDATE Agent 2 Output
  ↓
IF VALID: Proceed to Phase 4
```

### Phase 4: Production Readiness (Sequential)
```
START Agent 5 (Security & Production)
  ↓
VALIDATE Agent 5 Output
  ↓
Proceed to Synthesis
```

### Phase 5: Synthesis
```
COORDINATOR: Synthesize all agent outputs into:
- master_research_report.md (comprehensive)
- quick_reference.md (TL;DR version)
- implementation_checklist.md (actionable steps)
```

---

## TOOL CALL REQUIREMENTS

**Minimum Total**: 21-26 tool calls across all agents

**Quality Standards**:
- Use `web_fetch` to get COMPLETE documentation pages, not snippets
- Use `web_search` to discover sources, then fetch them
- Cross-reference minimum 2 sources per major claim
- Fetch actual code repositories, don't just link them
- Include dates on all sources (prioritize recent content)

---

## OUTPUT VALIDATION MATRIX

After all agents complete, verify:

| Criterion | Target | Actual | Status |
|-----------|--------|--------|--------|
| Total tool calls | ≥21 | __ | ☐ |
| Foundation docs fetched | ≥2 | __ | ☐ |
| Implementation examples | ≥3 | __ | ☐ |
| GitHub issues reviewed | ≥5 | __ | ☐ |
| Alternative approaches | ≥2 | __ | ☐ |
| Security considerations | ≥3 | __ | ☐ |
| Community sources | ≥4 | __ | ☐ |
| Academic/research papers | ≥1 | __ | ☐ |

---

## FINAL DELIVERABLES

1. **master_research_report.md** (3000-5000 words)
   - Executive summary
   - All agent findings synthesized
   - Decision-making framework
   - Implementation roadmap

2. **quick_reference.md** (500-1000 words)
   - Core concepts
   - Key takeaways
   - Common pitfalls
   - Quick decision tree

3. **implementation_checklist.md**
   - Step-by-step implementation guide
   - Validation points
   - Testing strategy
   - Deployment checklist

4. **sources_bibliography.md**
   - All sources with dates
   - Quality rating for each source
   - Direct links to documentation

---

## EXAMPLE COORDINATOR EXECUTION SCRIPT

```
# COORDINATOR INSTRUCTIONS

## Step 1: Initialize Research
"I am starting Level 5 exhaustive research on [TOPIC]. I will coordinate 5 specialized research agents with proper dependency management."

## Step 2: Execute Foundation Agent
"Spawning Agent 1: Foundation Research
Task: Execute foundation research with minimum 5 tool calls.
[Execute Agent 1 tasks]"

## Step 3: Validate Agent 1
"Validation Checklist for Agent 1:
✓ Core concepts defined: [YES/NO]
✓ Documentation fetched: [YES/NO]
✓ Historical context: [YES/NO]
✓ Tool calls: [X/5]
Result: [PASS/FAIL]"

## Step 4: Spawn Parallel Agents
"Agent 1 PASSED. Spawning parallel agents:
- Agent 3: Edge Cases & Limitations
- Agent 4: Competing Approaches
[Execute both agents simultaneously]"

## Step 5: Validate Parallel Agents
"Validation Checklist for Agent 3: [...]
Validation Checklist for Agent 4: [...]
Both agents PASSED."

## Step 6: Execute Sequential Agent 2
"Spawning Agent 2: Implementation Patterns (depends on Agent 1)
[Execute Agent 2 tasks]
Validation: [PASS/FAIL]"

## Step 7: Execute Sequential Agent 5
"Spawning Agent 5: Security & Production (depends on Agent 2)
[Execute Agent 5 tasks]
Validation: [PASS/FAIL]"

## Step 8: Synthesize
"All agents complete. Synthesizing findings into deliverables:
- master_research_report.md
- quick_reference.md
- implementation_checklist.md
- sources_bibliography.md"

## Step 9: Final Validation
"Executing final validation matrix:
[Fill out validation table]
Total tool calls: [X/21]
Research depth achieved: Level [X]"
```

---

## USAGE INSTRUCTIONS

1. Copy this entire protocol
2. Replace [TOPIC] with your research subject
3. Paste into Claude Code agent conversation
4. Say: "Execute this Level 5 Research Protocol using the coordinator pattern"
5. Monitor agent execution and validation checkpoints

---

## ANTI-PATTERNS TO AVOID

❌ Starting Agent 2 before Agent 1 validates
❌ Skipping validation checklists
❌ Using web_search without following up with web_fetch
❌ Stopping at 10-12 tool calls (that's only Level 3-4)
❌ Accepting shallow documentation snippets
❌ Ignoring community sources (GitHub issues, forums)
❌ Missing competing alternatives analysis
❌ No security/production considerations

✅ Strict dependency enforcement
✅ Parallel execution where possible
✅ Comprehensive validation at each stage
✅ Minimum 21 tool calls across all agents
✅ Deep fetches of complete documentation
✅ Multi-perspective analysis
✅ Production-ready insights
