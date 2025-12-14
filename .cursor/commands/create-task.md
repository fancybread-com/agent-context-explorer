# Create Task

## Overview
Create a task in the issue tracker with a specified type (epic, story, bug, task, etc.). The command adapts its workflow based on the task type.

## Usage

The command supports two syntax styles:

### Natural Language Style
```
/create-task [type] [description or source]
```

### Explicit Flag Style
```
/create-task --type=[type] [description or source]
```

**Examples:**

**Natural Language:**
- `/create-task story for user authentication`
- `/create-task epic from phase-one.md`
- `/create-task bug: login fails with OAuth`
- `/create-task task: refactor auth service`

**Explicit Flag:**
- `/create-task --type=story for user authentication`
- `/create-task --type=epic from phase-one.md`
- `/create-task --type=bug login fails with OAuth`
- `/create-task --type=task refactor auth service`

## Task Types

### Epic
High-level initiative or phase plan that contains multiple stories.

**Usage:**
- `/create-task --type=epic from [plan-file.md]`
- `/create-task epic from [plan-file.md]`
- `/create-task --type=epic [description]`
- `/create-task epic: [description]`

**Workflow:**
1. **Read the epic plan** (if from file)
   - Review plan document (e.g., `.plans/phase-one.md`)
   - Understand goals and scope
   - Identify major tasks and milestones

2. **Create the epic**
   - Generate epic title and description
   - Set priority and labels
   - Create epic in issue tracker

3. **Break down into stories** (optional, if plan contains tasks)
   - Identify individual work items
   - Create child stories for each task
   - Link stories to parent epic
   - Set priorities for each story

**Epic Validation (Before Creation):**
- [ ] Clear goals and objectives defined
- [ ] Scope boundaries identified
- [ ] Success criteria or key metrics specified
- [ ] Major milestones or phases outlined
- [ ] Business context or motivation provided

**Epic Checklist:**
- [ ] Epic plan reviewed and understood (if from file)
- [ ] Task information validated (sufficient detail)
- [ ] Missing information requested from user (if needed)
- [ ] Epic created with clear description
- [ ] Goals and scope documented
- [ ] Child stories identified (if applicable)
- [ ] All stories created and linked to epic (if applicable)
- [ ] Priorities set for epic and stories
- [ ] Stories ready for team pickup (if applicable)

---

### Story
User story or feature request that represents a single piece of functionality.

**Usage:**
- `/create-task --type=story for [feature]`
- `/create-task story for [feature]`
- `/create-task --type=story [description]`
- `/create-task story: [description]`

**Workflow:**
1. **Analyze the request**
   - Understand the feature scope and goals
   - Identify acceptance criteria
   - Determine priority level

2. **Generate story details**
   - Write clear, descriptive title
   - Create comprehensive description
   - Define acceptance criteria
   - Add relevant labels and tags

3. **Create in issue tracker**
   - Create story with generated content
   - Set appropriate priority
   - Link to parent epic if applicable
   - Leave unassigned in "To Do" status

**Story Validation (Before Creation):**
- [ ] User persona or user type identified
- [ ] Clear value proposition ("so that...")
- [ ] Acceptance criteria defined (3-5 criteria)
- [ ] Feature scope is clear
- [ ] Business context or motivation provided

**Story Checklist:**
- [ ] Task information validated (sufficient detail)
- [ ] Missing information requested from user (if needed)
- [ ] Title is clear and descriptive
- [ ] Description includes context and motivation
- [ ] Acceptance criteria are well-defined
- [ ] Priority is set appropriately
- [ ] Labels/tags are added
- [ ] Linked to epic if applicable
- [ ] Status is "To Do" (unassigned)

---

### Bug
Defect or issue that needs to be fixed.

**Usage:**
- `/create-task --type=bug [description]`
- `/create-task bug: [description]`
- `/create-task --type=bug for [description]`
- `/create-task bug for [description]`

**Workflow:**
1. **Analyze the bug report**
   - Understand the problem and symptoms
   - Identify reproduction steps
   - Determine severity and priority
   - Identify affected components/systems

2. **Generate bug details**
   - Write clear, descriptive title
   - Create detailed description
   - Document reproduction steps
   - Add expected vs actual behavior
   - Include environment details if available

3. **Create in issue tracker**
   - Create bug with generated content
   - Set appropriate severity and priority
   - Add relevant labels (e.g., "bug", component tags)
   - Link to related stories/epics if applicable
   - Leave unassigned in "To Do" status

**Bug Validation (Before Creation):**
- [ ] Problem clearly described (not just "it's broken")
- [ ] Reproduction steps provided (or "cannot reproduce" noted)
- [ ] Expected behavior specified
- [ ] Actual behavior specified
- [ ] Environment/context provided (browser, OS, version, etc.)
- [ ] Impact or severity indicated

**Bug Checklist:**
- [ ] Task information validated (sufficient detail)
- [ ] Missing information requested from user (if needed)
- [ ] Title clearly describes the problem
- [ ] Description includes symptoms and impact
- [ ] Reproduction steps are documented
- [ ] Expected vs actual behavior is clear
- [ ] Severity and priority are set appropriately
- [ ] Labels/tags are added (bug, component, etc.)
- [ ] Linked to related tasks if applicable
- [ ] Status is "To Do" (unassigned)

---

### Task
Technical work item or chore that doesn't fit into story/bug categories.

**Usage:**
- `/create-task --type=task [description]`
- `/create-task task: [description]`
- `/create-task --type=task for [description]`
- `/create-task task for [description]`

**Workflow:**
1. **Analyze the task**
   - Understand the work to be done
   - Identify technical requirements
   - Determine priority and effort

2. **Generate task details**
   - Write clear, descriptive title
   - Create detailed description
   - Document technical requirements
   - Add relevant labels and tags

3. **Create in issue tracker**
   - Create task with generated content
   - Set appropriate priority
   - Link to parent epic if applicable
   - Leave unassigned in "To Do" status

**Task Validation (Before Creation):**
- [ ] Technical work clearly defined
- [ ] Scope boundaries identified
- [ ] Technical requirements or constraints specified
- [ ] Success criteria or definition of done provided
- [ ] Dependencies or prerequisites identified (if any)

**Task Checklist:**
- [ ] Task information validated (sufficient detail)
- [ ] Missing information requested from user (if needed)
- [ ] Title is clear and descriptive
- [ ] Description includes technical context
- [ ] Requirements are well-defined
- [ ] Priority is set appropriately
- [ ] Labels/tags are added
- [ ] Linked to epic if applicable
- [ ] Status is "To Do" (unassigned)

---

### Other Types
For any other task type (e.g., "subtask", "improvement", "spike", etc.), the command will:

1. **Analyze the request**
   - Understand the work scope
   - Identify requirements
   - Determine priority

2. **Generate task details**
   - Write clear, descriptive title
   - Create comprehensive description
   - Add relevant labels and tags

3. **Create in issue tracker**
   - Create task with generated content
   - Set appropriate priority
   - Link to parent task if applicable
   - Leave unassigned in "To Do" status

## General Steps

1. **Parse command arguments**
   - Extract task type from command
   - Extract description or source file
   - Validate task type is supported

2. **Gather context** (if applicable)
   - Read source file if provided
   - Check for related tasks/epics
   - Review project conventions for task creation

3. **Validate task information (Intelligent Analysis)**
   - **Analyze provided information intelligently:**
     - Parse description/source for completeness
     - Detect vague language patterns (type-specific)
     - Assess information density
     - Identify missing critical elements
   - **Type-specific validation requirements:**
     - **Epic:** Goals, scope, success criteria, major milestones
     - **Story:** User persona, acceptance criteria, value proposition
     - **Bug:** Reproduction steps, expected vs actual, environment
     - **Task:** Technical requirements, scope, constraints
   - **Decision logic:**
     - If information is insufficient: STOP and ask specific questions
     - If information is sufficient: Proceed to creation
     - If marginal: Proceed but note assumptions
   - **If information is insufficient:**
     - Generate 3-5 type-specific, actionable questions
     - Present questions with context
     - Wait for user response before proceeding
     - Do NOT create task with incomplete information

4. **Execute type-specific workflow**
   - Follow the workflow for the specified task type
   - Generate appropriate content based on type
   - Create task in tracker

5. **Verify creation**
   - Confirm task was created successfully
   - Display task key/ID
   - Provide link to created task

## Type Detection

The command supports multiple ways to specify the task type:

**Explicit Flag Style (Recommended for clarity):**
- `/create-task --type=story for ...`
- `/create-task --type=bug ...`
- `/create-task --type=epic from ...`

**Natural Language Style:**
- `/create-task story for ...`
- `/create-task bug: ...` (colon syntax)
- `/create-task epic from ...`

**Type Parsing Priority:**
1. Check for `--type=` flag first (most explicit)
2. Look for type as first word before "for", "from", or colon
3. If no type specified, prompt user or default to "story"

**Type Validation:**
- Validate type against supported task types for the tracker
- Suggest similar types if typo detected (e.g., "stroy" → "story")
- Case-insensitive matching (e.g., `--type=BUG` = `--type=bug`)

## Common Task Types

- **epic** - High-level initiative
- **story** - User story or feature
- **bug** - Defect or issue
- **task** - Technical work item
- **subtask** - Child of another task
- **improvement** - Enhancement request
- **spike** - Research or investigation
- **technical-debt** - Code quality improvement

*Note: Available types may vary by issue tracker. The command should adapt to the tracker's supported types.*

## Intelligent Information Validation

The command uses intelligent analysis to validate task information before creation:

### Type-Specific Validation Patterns

**Epic Validation:**
- Detects vague goals: "improve system", "add features" without specifics
- Requires: Clear objectives, defined scope, success criteria
- Questions if missing: "What are the specific goals?", "What's in/out of scope?", "How will we measure success?"

**Story Validation:**
- Detects missing user context: No persona, no "so that" value
- Requires: User persona, acceptance criteria, value proposition
- Questions if missing: "Which user persona?", "What's the acceptance criteria?", "What value does this deliver?"

**Bug Validation:**
- Detects incomplete reports: "broken", "doesn't work" without details
- Requires: Reproduction steps, expected vs actual, environment
- Questions if missing: "What are the reproduction steps?", "What was expected vs actual?", "What environment?"

**Task Validation:**
- Detects vague technical work: "refactor", "improve" without specifics
- Requires: Technical requirements, scope, success criteria
- Questions if missing: "What technical requirements?", "What's the scope?", "What's the definition of done?"

### Information Density Scoring

**Minimum viable information (type-specific):**
- Epic: 3+ of: goals, scope, criteria, milestones, context
- Story: 3+ of: persona, criteria, value, scope, context
- Bug: 3+ of: problem, steps, expected, actual, environment
- Task: 3+ of: work, requirements, scope, criteria, constraints

**Scoring logic:**
- 0-2 elements present: INSUFFICIENT (must ask)
- 3-4 elements present: MARGINAL (proceed with caution, note assumptions)
- 5+ elements present: SUFFICIENT (proceed confidently)

### Example Intelligent Interactions

**Example 1: Vague Story**

```
You: /create-task story for better UX

AI:
✓ Parsing command: story type detected
✓ Analyzing provided information...

Analysis:
- Description: "better UX" (vague, undefined)
- Missing: user persona, acceptance criteria, value proposition, scope
- Information density: 0/5 elements

⚠ Insufficient information. To create a proper story, I need:

1. Which user persona is this for? (e.g., new users, power users, mobile users)
2. What specific UX problems are we solving? (e.g., confusing navigation, slow load times)
3. What are the acceptance criteria? (e.g., user can complete task in < 30 seconds)
4. What value does this deliver? (e.g., reduce user frustration, increase conversions)

Please provide this information so I can create a well-defined story.
```

**Example 2: Incomplete Bug**

```
You: /create-task bug: login broken

AI:
✓ Parsing command: bug type detected
✓ Analyzing provided information...

Analysis:
- Description: "login broken" (too vague)
- Missing: reproduction steps, expected vs actual, environment
- Information density: 1/5 elements

⚠ Insufficient information. To create a proper bug report, I need:

1. What are the reproduction steps? (e.g., go to /login, enter credentials, click submit)
2. What was the expected behavior? (e.g., user should be logged in and redirected)
3. What actually happened? (e.g., error message appears, no redirect)
4. What environment? (e.g., Chrome 120, macOS, production)

Please provide this information so I can create a complete bug report.
```

**Example 3: Well-Defined Story**

```
You: /create-task story: As a mobile user, I want to save articles offline so that I can read them without internet

AI:
✓ Parsing command: story type detected
✓ Analyzing provided information...

Analysis:
- Contains: user persona (mobile user), value (read offline), clear goal
- Information density: 4/5 elements

✓ Sufficient information. Proceeding with story creation...
```

