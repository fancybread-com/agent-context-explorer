# Breakdown Tasks

## Overview
Break down a large task (epic or large story) into well-defined, actionable tasks. This is a critical Scrum planning activity that ensures large work items are properly decomposed into sprint-sized tasks.

## Usage

```
/breakdown-tasks TASK-123
```

**Examples:**
- `/breakdown-tasks PROJ-100` (epic)
- `/breakdown-tasks STORY-50` (large story)

## Steps

1. **Read the task**
   - Retrieve task from issue tracker
   - Understand task goals and objectives
   - Review task description and acceptance criteria
   - Identify scope boundaries
   - Review any attached documents or links

2. **Validate task information (Intelligent Analysis)**
   - **Analyze task content intelligently:**
     - Parse task description for completeness
     - Detect vague language patterns:
       - Generic terms: "improve", "enhance", "fix", "add feature" without specifics
       - Missing context: No user personas, no use cases, no success metrics
       - Ambiguous scope: No boundaries, no "in scope" vs "out of scope"
       - Missing criteria: No acceptance criteria, no definition of done
     - Assess information density:
       - Very short descriptions (< 50 words) likely insufficient
       - No examples or scenarios provided
       - No technical requirements mentioned
       - No dependencies or constraints identified
   - **Intelligent gap detection:**
     - Identify specific missing information categories
     - Determine which gaps are critical vs nice-to-have
     - Generate contextually appropriate questions based on:
       - Task type (epic, story, technical task)
       - Domain/context clues in existing description
       - Common patterns for similar tasks
   - **Decision logic:**
     - **If task has < 3 of these elements: STOP and ask**
       - Clear, specific goals (not vague)
       - Defined scope or boundaries
       - User context (personas, use cases) OR technical context
       - Success criteria or acceptance criteria
       - Any constraints or dependencies
     - **If task description is < 50 words and vague: STOP and ask**
     - **If key terms are undefined: STOP and ask**
       - "User experience" - which users? what experience?
       - "Performance" - what metrics? what targets?
       - "Feature" - what exactly? for whom?
   - **If information is insufficient:**
     - Generate 3-5 specific, actionable questions
     - Questions should be:
       - Contextual to the task domain
       - Focused on critical gaps
       - Actionable (user can answer clearly)
       - Prioritized (most important first)
     - Present questions clearly with context
     - Wait for user response before proceeding
     - Do NOT make assumptions or proceed with incomplete information
   - **If information is sufficient:**
     - Proceed to breakdown analysis
     - Note any assumptions made (document in breakdown)

3. **Analyze task scope**
   - Break down task into logical work areas
   - Identify user personas and use cases (if applicable)
   - Determine technical components involved
   - Identify dependencies between work areas
   - Consider implementation phases or milestones

3. **Generate subtasks**
   - Create tasks following "As a [user], I want [goal], so that [benefit]" format (for user stories)
   - For technical tasks, use clear action-oriented descriptions
   - Ensure each task is:
     - Independent and can be developed in any order
     - Well-defined with clear acceptance criteria
     - Appropriately sized (completable in 1-2 days typically)
     - Delivers user or technical value
   - Write clear, descriptive titles
   - Define comprehensive acceptance criteria for each task
   - Identify task dependencies and sequence

4. **Validate breakdown quality**
   - Review generated tasks for completeness
   - Ensure all major work areas are covered
   - Verify tasks are appropriately sized
   - Check for missing dependencies
   - **If breakdown seems incomplete or unclear:**
     - Ask user for additional context
     - Request clarification on ambiguous areas
     - Do NOT proceed with incomplete breakdown

5. **Prioritize tasks**
   - Determine task priority based on:
     - User value and business impact
     - Technical dependencies
     - Risk and complexity
     - Implementation sequence
   - Set task order/sequence
   - Identify which tasks are MVP vs nice-to-have

6. **Create tasks in tracker**
   - Create each task with:
     - Clear title
     - Detailed description
     - Acceptance criteria
     - Priority/rank
   - Link all tasks to parent task/epic
   - Set initial task status to "To Do"
   - Leave tasks unassigned

7. **Document breakdown**
   - Add breakdown summary comment to parent task
   - Include task count and overview
   - Note any assumptions or decisions made
   - Document task dependencies if applicable

## Task Quality Checklist

For each generated task, verify:
- [ ] Follows appropriate format (user story or technical task)
- [ ] Has clear acceptance criteria (3-5 criteria)
- [ ] Is appropriately sized (1-2 sprint points typically)
- [ ] Is independent and can be developed standalone
- [ ] Delivers value (user or technical)
- [ ] Has clear definition of done
- [ ] Is testable and verifiable

## Information Validation

Before proceeding with breakdown, verify the task has:

**Required Information:**
- [ ] Clear goals and objectives
- [ ] Defined scope or boundaries
- [ ] Success criteria or acceptance criteria

**Recommended Information:**
- [ ] User personas or use cases (for user-facing tasks)
- [ ] Technical requirements or constraints
- [ ] Business context or motivation
- [ ] Dependencies or prerequisites

**If Information is Missing:**
- **STOP** and ask user for clarification
- Provide specific questions about what's needed
- Examples of good questions:
  - "What user personas should this support?"
  - "What are the success criteria for this epic?"
  - "Are there any technical constraints I should consider?"
  - "What's the priority order for these features?"
- **DO NOT** proceed with assumptions
- **DO NOT** create tasks based on incomplete information

## Task Breakdown Checklist

- [ ] Parent task read and understood
- [ ] Task information validated (sufficient detail)
- [ ] Missing information requested from user (if needed)
- [ ] Task scope analyzed
- [ ] Work areas identified
- [ ] Breakdown quality validated
- [ ] Subtasks generated (minimum 3-5 tasks per parent)
- [ ] Tasks are well-defined and appropriately sized
- [ ] Acceptance criteria defined for each task
- [ ] Tasks prioritized and sequenced
- [ ] All tasks created in tracker
- [ ] Tasks linked to parent task/epic
- [ ] Breakdown documented in parent task comments
- [ ] Tasks ready for team estimation

## Best Practices

- **Validate first** - Always check if task has sufficient information before proceeding
- **Ask, don't assume** - If information is missing, ask specific questions rather than guessing
- **Start with user value** - Focus on what users need, not technical implementation
- **Keep tasks small** - Aim for tasks that can be completed in 1-2 days
- **Be specific** - Vague tasks lead to confusion during development
- **Consider dependencies** - Identify and sequence dependent tasks
- **Think in slices** - Create vertical slices (full feature) not horizontal layers (just backend)
- **Review with team** - Use this as input for team refinement sessions

## Intelligent Analysis Patterns

The command uses pattern recognition to detect insufficient information:

### Vague Language Detection

**Red flags that trigger clarification:**
- Generic action verbs without objects: "improve", "enhance", "fix", "add"
- Abstract concepts without definition: "user experience", "performance", "quality"
- Missing specificity: "some users", "better", "faster", "easier"
- No concrete examples or scenarios

**Example analysis:**
```
Task: "Improve user experience"
Analysis:
- "Improve" is vague (what exactly?)
- "User experience" is undefined (which aspects?)
- No success criteria
→ INSUFFICIENT: Ask for specifics
```

### Information Density Scoring

**Minimum viable information:**
- Task description > 50 words (unless very technical/clear)
- Contains at least 3 of: goals, scope, users, criteria, constraints
- Has concrete examples or scenarios
- Defines key terms used

**Scoring logic:**
- 0-2 elements present: INSUFFICIENT (must ask)
- 3-4 elements present: MARGINAL (proceed with caution, note assumptions)
- 5+ elements present: SUFFICIENT (proceed confidently)

### Context-Aware Question Generation

**Question generation based on task type:**

**For user-facing tasks:**
- "Which user personas are affected?"
- "What user problems are we solving?"
- "What does success look like for users?"

**For technical tasks:**
- "What are the technical constraints?"
- "What are the integration points?"
- "What are the performance requirements?"

**For feature requests:**
- "What specific functionality is needed?"
- "Who will use this feature?"
- "What are the acceptance criteria?"

**For improvements:**
- "What specific problems are we solving?"
- "What are the current pain points?"
- "How will we measure improvement?"

### Example Intelligent Interactions

**Example 1: Vague Epic**

```
You: /breakdown-tasks EPIC-100

AI:
✓ Reading EPIC-100: Improve User Experience

Analysis:
- Description: 8 words (insufficient length)
- Vague terms detected: "improve", "user experience" (undefined)
- Missing: scope, personas, success criteria, constraints
- Information density: 1/5 elements

⚠ Insufficient information detected. To create a proper breakdown, I need:

1. What specific user experience problems are we solving? (e.g., slow load times, confusing navigation, mobile usability)
2. Which user personas are affected? (e.g., new users, power users, mobile users)
3. What are the success criteria? (e.g., reduce bounce rate by 20%, increase task completion by 30%)
4. What's in scope vs out of scope? (e.g., only mobile app, or also web?)

Please provide this information so I can generate well-defined tasks.
```

**Example 2: Partially Defined Epic**

```
You: /breakdown-tasks EPIC-200

AI:
✓ Reading EPIC-200: Add payment processing for subscription plans

Analysis:
- Description: Clear action and object
- Missing: user context, success criteria, technical constraints
- Information density: 2/5 elements

⚠ Some information is missing. To ensure a complete breakdown:

1. Which user personas need this? (e.g., new subscribers, existing customers upgrading)
2. What are the acceptance criteria? (e.g., support credit cards, handle refunds, PCI compliance)
3. Are there technical constraints? (e.g., must use Stripe, integrate with existing billing system)

Proceeding with breakdown, but will note assumptions made.
```

**Example 3: Well-Defined Epic**

```
You: /breakdown-tasks EPIC-300

AI:
✓ Reading EPIC-300: Implement OAuth 2.0 authentication for mobile app users

Analysis:
- Description: Specific technology and scope
- Contains: technical approach (OAuth 2.0), scope (mobile app), users (mobile users)
- Information density: 4/5 elements

✓ Sufficient information. Proceeding with breakdown...
```

## Common Patterns

**Feature-based breakdown:**
- Break large task into major features
- Each feature becomes a task or task group

**User journey-based breakdown:**
- Identify user journeys within task
- Create tasks for each journey step

**Technical component breakdown:**
- Identify technical components
- Create tasks for each component (but ensure value)

**MVP vs Enhancement:**
- Identify core MVP tasks
- Separate enhancement tasks for later sprints

