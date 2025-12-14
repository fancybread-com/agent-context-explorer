# Start Task

## Overview
Begin development on a task with proper setup and pre-flight checks.

## Definitions

- **{TASK_KEY}**: Story/Issue ID from the issue tracker (e.g., `FB-6`, `PROJ-123`, `KAN-42`)
- **Branch Name Format**: Use short format `{type}/{TASK_KEY}` (e.g., `feat/FB-6`, `fix/PROJ-123`)
  - Short format is recommended: `feat/FB-6` (not `feat/FB-6-file-watching-workspace-commands`)
  - **Important**: Be consistent within a project - use the same format for all branches

## Steps
1. **Pre-flight checks**
   - **MCP Status Validation**: Perform MCP server status checks (see `mcp-status.md` for detailed steps)
     - Test each configured MCP server connection
     - Verify all required integrations are authorized and operational
     - **If any MCP server fails validation, STOP and report the failure. Do not proceed.**
   - Read plan from `.plans/{TASK_KEY}-*.plan.md`
     - **Plan File Selection**: If multiple files match the pattern `.plans/{TASK_KEY}-*.plan.md`:
       - Use the most recently modified file (check file modification time)
       - If modification time cannot be determined, use the first file found alphabetically
       - Report which file was selected: "Using plan file: {filename}"
     - **If no files match, STOP and report error**: "Plan file not found for {TASK_KEY}. Please run `/create-plan {TASK_KEY}` first to generate the implementation plan."
   - Verify story is in "In Progress"
     - Fetch story status using `mcp_Atlassian-MCP-Server_getJiraIssue`
     - **If status is NOT "In Progress":**
       1. Get available transitions using `mcp_Atlassian-MCP-Server_getTransitionsForJiraIssue`
       2. Find transition to "In Progress" status
       3. Transition using `mcp_Atlassian-MCP-Server_transitionJiraIssue`
       4. Verify transition succeeded
     - **If transition fails or "In Progress" status not available:**
       - STOP and report: "Story {TASK_KEY} cannot be moved to 'In Progress'. Current status: {status}. Available transitions: {list}"
   - Confirm story is assigned to current user

2. **Set up development environment**
   - Determine branch type prefix based on task type:
     - Story → `feat/{TASK_KEY}`
     - Bug → `fix/{TASK_KEY}`
     - Task/Chore → `chore/{TASK_KEY}`
     - Refactor → `refactor/{TASK_KEY}`
     - Default to `feat/{TASK_KEY}` if task type is unclear
   - **First, check if branch already exists:**
     - Use `mcp_github_list_branches` to list existing branches
     - Or use `run_terminal_cmd`: `git branch -a | grep {type}/{TASK_KEY}`
     - **If branch exists:**
       - Ask user: "Branch {type}/{TASK_KEY} already exists. Use existing branch or create new one?"
       - If "use existing": Checkout existing branch
       - If "create new": Use different name or delete old branch first
   - **If branch doesn't exist:**
     - Create locally: `git checkout -b {type}/{TASK_KEY}`
     - Or create on remote first: `mcp_github_create_branch` (if remote-first workflow)
   - **Add work checklist comment to issue (include the actual branch name created):**
     - **Timing**: Post immediately after branch creation, before starting implementation
     - This provides visibility that work has begun
     - Include the actual branch name created (e.g., `feat/FB-6`)

3. **Implement according to plan**
   - **Read and understand plan:**
     - Read plan file completely
     - Identify all files to create/modify
     - Understand dependencies and order
   - **Analyze existing codebase:**
     - Use `codebase_search` to find related code
     - Review similar implementations for patterns
     - Understand existing test structure
   - **Implement changes:**
     - Create new files as specified in plan
     - Modify existing files per plan
     - Follow existing code patterns and conventions
   - **Write tests alongside code:**
     - Create test files for new code
     - Update existing tests for modified code
     - Ensure tests follow existing test patterns
   - **Commit logical units of work:**
     - Commit each complete, testable change
     - Use conventional commit format: `{type}: {description} ({TASK_KEY})`
     - Don't wait until the end to commit

## Tools

### MCP Tools (Atlassian)
- `mcp_Atlassian-MCP-Server_atlassianUserInfo` - Verify Atlassian MCP connection
- **Obtaining CloudId for Atlassian Tools:**
  - **Method 1 (Recommended)**: Use `mcp_Atlassian-MCP-Server_getAccessibleAtlassianResources`
    - Returns list of accessible resources with `cloudId` values
    - Use the first result or match by site name
    - Only call if cloudId is not already known or has expired
  - **Method 2**: Extract from Atlassian URLs
    - Jira URL format: `https://{site}.atlassian.net/...`
    - CloudId can be extracted from the URL or obtained via API
  - **Error Handling**: If cloudId cannot be determined, STOP and report: "Unable to determine Atlassian cloudId. Please verify MCP configuration."
- `mcp_Atlassian-MCP-Server_getJiraIssue` - Fetch story details by {TASK_KEY}
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}
- `mcp_Atlassian-MCP-Server_getTransitionsForJiraIssue` - Get available status transitions
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}
- `mcp_Atlassian-MCP-Server_transitionJiraIssue` - Transition issue to "In Progress" (if needed)
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}, `transition` = {id: "transition-id"}
- `mcp_Atlassian-MCP-Server_addCommentToJiraIssue` - Add work checklist comment to issue
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}, `commentBody` = markdown checklist

### MCP Tools (GitHub)
- `mcp_github_get_me` - Verify GitHub MCP connection
- `mcp_github_list_branches` - List existing branches (check if branch already exists)
- `mcp_github_create_branch` - Create new branch on remote
  - Parameters: `owner`, `repo`, `branch` = `{type}/{TASK_KEY}`, `from_branch` = `main` (or default branch)

### Filesystem Tools
- `glob_file_search` - Find plan files matching `.plans/{TASK_KEY}-*.plan.md`
  - Pattern: `**/.plans/{TASK_KEY}-*.plan.md`
- `read_file` - Read plan file content
  - Parameters: `target_file` = `.plans/{TASK_KEY}-{description}.plan.md`
- `read_file` - Read existing code files for context
- `write` - Create new files
- `search_replace` - Modify existing files
- `list_dir` - Explore directory structure

### Codebase Tools
- `codebase_search` - Search for similar implementations, patterns, or related code
  - Query: "How is [similar feature] implemented?"
  - Query: "Where is [component] used?"
- `grep` - Find specific patterns, functions, or classes
  - Pattern: function names, class names, imports, etc.

### Terminal Tools
- `run_terminal_cmd` - Execute git commands
  - `git status` - Check current branch and status
  - `git checkout -b {type}/{TASK_KEY}` - Create and checkout new branch locally
  - `git branch` - List branches
  - `git add <files>` - Stage changes
  - `git commit -m "{type}: {description} ({TASK_KEY})"` - Commit changes
  - `git log --oneline` - View commit history

## Pre-flight Checklist
- [ ] MCP status validation performed (see `mcp-status.md`)
- [ ] All MCP servers connected and authorized
- [ ] Plan file exists and is readable
- [ ] Story status is "In Progress"
- [ ] Story assigned to current user
- [ ] Feature branch created
- [ ] Branch checked out locally
- [ ] Work checklist posted to issue

## Implementation Checklist
- [ ] Requirements understood
- [ ] Codebase context reviewed
- [ ] Implementation in progress
- [ ] Code changes made
- [ ] Tests written
- [ ] Documentation updated

## Guidance

### Role
Act as a **software engineer** responsible for beginning development work on a task. You are methodical, thorough, and follow established development workflows and standards.

### Instruction
Execute the start-task workflow to begin development on a specified task. This includes:
1. Performing pre-flight validation checks
2. Setting up the development environment (branch creation, issue updates)
3. Implementing work according to the plan
4. Following all established conventions and standards

### Context
- The task is tracked in an issue management system (Jira, Azure DevOps, etc.)
- A plan document exists at `.plans/{TASK_KEY}-*.plan.md` with implementation details
- The task should already be in "In Progress" status and assigned to the current user
- MCP integrations provide access to issue trackers and version control
- The codebase may have existing patterns, conventions, and architectural decisions that should be respected

### Examples

**Example Branch Names:**
- `feat/PROJ-123` (story/feature)
- `fix/PROJ-456` (bug fix)
- `chore/PROJ-789` (maintenance task)
- `refactor/PROJ-321` (refactoring)

**Example Commit Messages (for reference during implementation):**
- `feat: add user authentication (PROJ-123)`
- `fix: resolve login timeout error (PROJ-456)`
- `refactor: simplify auth service (PROJ-321)`
- `test: add unit tests for auth module (PROJ-123)`
- `docs: update API documentation (PROJ-123)`

**Example Issue Comment (Work Checklist):**
```
## Work Checklist

- [ ] Plan reviewed
- [ ] Branch created: `feat/PROJ-123`
- [ ] Implementation in progress
- [ ] Code changes in progress
- [ ] Tests being written
- [ ] Documentation updated
```

Note: The branch name in the comment must match the actual branch name created (including the type prefix).

### Constraints

**Rules (Must Follow):**
1. **Unit Tests Required**: All new code must have corresponding unit tests. Update existing tests or create new test files as needed.
2. **Conventional Commits**: All commits must follow the format: `{type}: {description} ({TASK_KEY})`
   - Valid types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
   - Description should be clear and concise
   - Task key must be included in parentheses
3. **Branch Naming**: Use short format: `{type}/{TASK_KEY}` (e.g., `feat/FB-6`, `fix/PROJ-123`)
   - Determine type prefix from task type:
     - Story → `feat/`
     - Bug → `fix/`
     - Task/Chore → `chore/`
     - Refactor → `refactor/`
     - Default to `feat/` if task type is unclear
   - Example: Story FB-6 → `feat/FB-6` (short format, not descriptive format)
   - **Important**: Be consistent - use short format for all branches
4. **Commit Strategy**: Commit logical units of work as you progress, not all at once at the end. Each commit should be a complete, testable change following conventional commit format.
5. **Pre-flight Validation**: Do not proceed if:
   - **MCP status validation fails** (see `mcp-status.md` for validation steps - if any MCP server is not connected or authorized, STOP immediately)
   - Plan file does not exist or is unreadable
   - Story is not in "In Progress" status
   - Story is not assigned to current user
6. **Code Quality**:
   - Fix any linting errors before committing
   - Follow existing code patterns and conventions
   - Maintain or improve test coverage
7. **Documentation**: Update relevant documentation when adding features or changing behavior
8. **Plan File Handling**:
   - **Plan File Selection**: If multiple files match the pattern `.plans/{TASK_KEY}-*.plan.md`:
     - Use the most recently modified file (check file modification time)
     - If modification time cannot be determined, use the first file found alphabetically
     - Report which file was selected: "Using plan file: {filename}"
   - If no files match, STOP and report: "Plan file not found for {TASK_KEY}. Please run `/create-plan {TASK_KEY}` first."

**Existing Standards (Reference):**
- MCP status validation: See `mcp-status.md` for detailed MCP server connection checks
- Commit message format from `complete-task.md`: `{type}: {description} ({TASK_KEY})`
- Branch naming: Type prefix format (`{type}/{task-key}`) as shown in current workflow
- Test requirements: Tests written alongside code (per Implementation Checklist)
- Issue workflow: Tasks transition through "To Do" → "In Progress" → "Code Review" → "Done"

### Output
1. **Development Work**: Implement the work specified in the plan:
   - Code changes implemented according to plan
   - Unit tests created or updated alongside code
   - Documentation updated as needed
   - Changes committed as logical units (following conventional commit format)
   - Each commit is a complete, testable change
