# Commands Reference

**Natural language instructions that AI agents execute with context.**

## What Are Commands?

Commands are **not scripts**. They're markdown files containing instructions that tell AI agents:

- **What** to achieve (the goal)
- **What context** to gather (story, codebase, plans)
- **What decisions** to make (or ask you about)
- **What artifacts** to create (branches, commits, PRs)

The AI reads these instructions and executes them contextually based on your specific project.

### Example: How `/start-task` Works

**The command file says:**
> "Read the story from issue tracker, create a branch following project conventions, read the implementation plan, implement the code matching the project style."

**For a Python Flask project, AI might:**
- Create branch `feature/auth-123`
- Add code to `app/routes/auth.py`
- Write tests in `tests/test_auth.py` using pytest
- Update `requirements.txt`

**For a React TypeScript project, AI might:**
- Create branch `feature/auth-123`
- Add component in `src/components/Auth.tsx`
- Write tests in `src/components/Auth.test.tsx` using Jest
- Update `package.json`

**Same command. Different execution. Context drives behavior.**

---

## How to Use Commands

### 1. Type `/command-name` in Cursor Chat

```
/start-task PROJ-123
```

### 2. AI Reads the Command File

Cursor loads `start-task.md` and understands the workflow.

### 3. AI Gathers Context

- Reads story from Jira
- Checks your codebase structure
- Reviews implementation plan
- Understands your coding patterns

### 4. AI Executes Contextually

Implements the feature using your frameworks, style, and conventions.

### 5. You Review and Approve

At key decision points, AI asks for your approval (plans, major changes).

---

## Available Commands

### 📦 Product (2 commands)

Define and create work items.

| Command | What It Does | Example |
|---------|--------------|---------|
| `/create-task` | Creates task in tracker with specified type (epic, story, bug, task, etc.) | `/create-task --type=story for OAuth login`<br>`/create-task --type=epic from phase-one.md`<br>`/create-task --type=bug login fails`<br><br>*Also supports natural language: `/create-task story for ...`* |
| `/breakdown-tasks` | Breaks down large task into well-defined subtasks | `/breakdown-tasks TASK-123`<br><br>*Critical Scrum planning activity - ensures proper task decomposition* |

---

### 📋 Planning (6 commands)

Estimate, prioritize, and plan work.

**Product Planning** (Scrum & Kanban)

| Command | What It Does | Example |
|---------|--------------|---------|
| `/estimate-stories` | Analyzes and estimates effort | `/estimate-stories in EPIC-1` |
| `/prioritize-backlog` | Ranks stories by value/urgency | `/prioritize-backlog` |
| `/plan-sprint` | Selects stories for sprint (Scrum) | `/plan-sprint 23` |
| `/refine-backlog` | Continuous grooming (Kanban) | `/refine-backlog` |

**Technical Planning** (Developer activity)

| Command | What It Does | Example |
|---------|--------------|---------|
| `/create-plan` | Creates detailed technical design | `/create-plan for AUTH-10` |
| `/refine-plan` | Updates existing plan | `/refine-plan for AUTH-10` |

---

### 🛠️ Development (4 commands)

Implement and ship features.

| Command | What It Does | Example |
|---------|--------------|---------|
| `/start-task` | Begins development (branch, context) | `/start-task AUTH-123` |
| `/complete-task` | Commits, pushes, creates PR | `/complete-task AUTH-123` |

---

### ✅ Quality (9 commands)

Test and review code.

**Testing**

| Command | What It Does | Example |
|---------|--------------|---------|
| `/create-test` | Generates unit tests (adapts for backend/frontend) | `/create-test --type=unit for AuthService` |
| `/run-tests` | Executes test suite | `/run-tests` |
| `/watch-tests` | Continuous test execution | `/watch-tests` |
| `/fix-failing-tests` | Diagnoses and fixes failures | `/fix-failing-tests` |
| `/check-coverage` | Analyzes code coverage | `/check-coverage` |

**Code Quality**

| Command | What It Does | Example |
|---------|--------------|---------|
| `/review-code` | AI code review | `/review-code for PR #42` |
| `/fix-linting` | Fixes linter errors | `/fix-linting` |

---

### 🔧 Utilities (1 command)

System and integration management.

| Command | What It Does | Example |
|---------|--------------|---------|
| `/mcp-status` | Check MCP server authentication status | `/mcp-status` |

---

## Installation

Choose where you want commands available:

```bash
# Option 1: Global (all projects)
cp -r implementations/cursor/commands/* ~/.cursor/commands/

# Option 2: Per-project
mkdir -p .cursor/commands
cp -r implementations/cursor/commands/* .cursor/commands/

# Option 3: Team (Cursor Enterprise)
# Use Cursor Dashboard → Team Content → Commands
```

**Restart Cursor after installing.**

[Detailed setup guide →](../mcp-setup.md)

## Complete Workflows

### Scrum Cycle

```bash
# Sprint Planning
/estimate-stories in EPIC-1
/prioritize-backlog
/plan-sprint 23

# Development (per story)
/create-plan for AUTH-10
/start-task AUTH-10
/run-tests
/complete-task AUTH-10

```

### Kanban Flow

```bash
# Continuous
/refine-backlog
/estimate-stories (as needed)
/prioritize-backlog

# Development (per story)
/create-plan for AUTH-10
/start-task AUTH-10
/run-tests
/complete-task AUTH-10

```

**Key difference:** Scrum plans sprints upfront. Kanban refines continuously.

## Key Concepts

### Two Types of Planning

| Product Planning | Dev Planning |
|------------------|--------------|
| **What**: Estimate & prioritize | **What**: Technical design |
| **Who**: Team activity | **Who**: Individual developer |
| **When**: Sprint/refinement | **When**: Before coding |
| **Output**: Prioritized backlog | **Output**: `.plans/` file |
| **Commands**: `/estimate-stories`, `/plan-sprint` | **Commands**: `/create-plan` |

### Scrum vs Kanban

| Aspect | Scrum | Kanban |
|--------|-------|--------|
| **Cadence** | Fixed sprints | Continuous flow |
| **Planning** | Upfront (`/plan-sprint`) | Ongoing (`/refine-backlog`) |
| **Commitment** | Sprint scope | WIP limits |
| **Metrics** | Velocity | Lead/cycle time |

**Same commands work for both.** Choose based on your process.

## How Commands Work: An Example

You type: `/estimate-stories in EPIC-1`

**What happens:**

1. **AI reads command file** - Understands what "estimate stories" means
2. **Gathers context** - Fetches stories from Jira, analyzes codebase
3. **Applies intelligence** - Compares to similar past work, identifies complexity
4. **Presents findings** - Shows estimates with reasoning
5. **Executes decision** - Updates Jira after your approval

**Output:**
```
Found 5 stories in EPIC-1:
- AUTH-10: 5 points (similar to past OAuth work)
- AUTH-11: 3 points (straightforward)
- AUTH-12: 8 points (new integration, unknown API)

Approve these estimates?
```

**This is context-aware automation, not scripted automation.**

## What Commands Need to Work

Commands connect to your tools via **adapters**:

| Adapter Type | Tools | What It Does |
|--------------|-------|--------------|
| **Issue Management** | Jira, Azure DevOps | Read/create stories, update status |
| **Version Control** | GitHub, GitLab | Create branches, PRs |
| **Plan Storage** | Filesystem | Store plans in `.plans/` |

**Configuration:** Set up via MCP servers. [Setup guide →](../mcp-setup.md)

---

## Customizing Commands

Commands are markdown files. Edit them to match your workflow.

**Example:** Modify `/complete-task` to require specific commit format

```markdown
# Complete Task

## Steps
1. Verify tests pass
2. Create commit with format: `type(scope): message`
   - Types: feat, fix, docs, test, refactor
3. Push and create PR
...
```

Save in `.cursor/commands/complete-task.md`

**Keep it declarative** - Describe *what* to achieve, not *how*.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **Command not found** | Restart Cursor. Check `.cursor/commands/` or `~/.cursor/commands/` |
| **Command fails** | Verify MCP servers connected (Settings → MCP) |
| **Jira errors** | Check story exists, you have permissions |
| **GitHub errors** | Verify token has `repo` scope, check write access |
| **Plan not found** | Run `/create-plan` first |

[Detailed troubleshooting →](../README.md#troubleshooting)

---

## Quick Reference

**Most Common Commands:**

```bash
# Create work
/create-task --type=story for [feature]
/create-task --type=bug [description]

# Plan
/create-plan for [TASK-123]

# Develop
/start-task [TASK-123]
/run-tests
/complete-task [TASK-123]
```

**Scrum Planning:** `/estimate-stories` → `/plan-sprint`
**Kanban Planning:** `/refine-backlog` → `/prioritize-backlog`

---

## Learn More

- [Setup Guide](../mcp-setup.md) - Configure MCP servers
- [Implementation Guide](../README.md) - Cursor-specific details
- [Core Methodology](../../../core/index.md) - Understand the approach
- [Workflows](../../../core/workflows/) - Detailed workflow guides
- [Cursor Commands Docs](https://cursor.com/docs/agent/chat/commands) - Official Cursor documentation
