# Complete Task

## Overview
Commit changes, push to remote, create pull request, and transition issue to "Code Review" status.

## Definitions

- **{TASK_KEY}**: Story/Issue ID from the issue tracker (e.g., `FB-6`, `PROJ-123`, `KAN-42`)
- **Branch Name Format**: Use short format `{type}/{TASK_KEY}` (e.g., `feat/FB-6`, `fix/PROJ-123`)
  - Short format is recommended: `feat/FB-6` (not `feat/FB-6-file-watching-workspace-commands`)
  - **Important**: Be consistent within a project - use the same format for all branches
- **Plan Summary**: Content from the plan file located at `.plans/{TASK_KEY}-*.plan.md`
  - **Plan File Selection**: If multiple files match the pattern `.plans/{TASK_KEY}-*.plan.md`:
    - Use the most recently modified file (check file modification time)
    - If modification time cannot be determined, use the first file found alphabetically
    - Report which file was selected: "Using plan file: {filename}"
  - Contains implementation details, requirements, and acceptance criteria
- **Completed Checklist**: Markdown checklist posted as a comment to the issue showing what work was completed
- **Current Branch**: Should match the expected format `{type}/{TASK_KEY}` (e.g., `feat/FB-6`, `fix/PROJ-123`)

## Prerequisites

Before proceeding, verify:

1. **MCP Status Validation**: Perform MCP server status checks (see `mcp-status.md` for detailed steps)
   - Test each configured MCP server connection (Atlassian, GitHub, etc.)
   - Verify all required integrations are authorized and operational
   - **If any MCP server fails validation, STOP and report the failure. Do not proceed.**

2. **Branch Verification**:
   - Verify current branch matches expected format: `{type}/{TASK_KEY}`
   - Confirm branch exists on remote (if not, this will be created on push)
   - **If branch doesn't match expected format, STOP and report the mismatch.**

3. **Test Verification**:
   - Run all tests locally and verify they pass
   - **If any tests fail, STOP and fix them before proceeding. Do not commit failing tests.**

4. **Plan File**:
   - Verify plan file exists at `.plans/{TASK_KEY}-*.plan.md`
   - **Plan File Selection**: If multiple files match the pattern `.plans/{TASK_KEY}-*.plan.md`:
     - Use the most recently modified file (check file modification time)
     - If modification time cannot be determined, use the first file found alphabetically
     - Report which file was selected: "Using plan file: {filename}"
   - **If no plan file found, STOP and report error**: "Plan file not found for {TASK_KEY}. Please run `/create-plan {TASK_KEY}` first to generate the implementation plan."

## Steps

1. **Prepare commit**
   - Check for linting errors and fix them
     - **If linting errors cannot be fixed automatically, STOP and report the issue. Ask user for guidance.**
   - Run all tests locally to ensure they pass
     - **If tests fail, STOP and fix them before committing.**
   - Stage all changes
   - Create conventional commit message
     - Format: `{type}: {description} ({TASK_KEY})`
     - Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
     - Description should be clear and concise
     - Example: `feat: add user authentication (PROJ-123)`

2. **Commit and push changes**
   - Commit staged changes with the conventional commit message
   - Push to remote branch
     - **If push fails (e.g., authentication, network, conflicts), STOP and report the error.**
     - **If branch doesn't exist on remote, it will be created on first push.**

3. **Create pull request (CI/CD runs as gate after PR creation)**
   - **Note**: CI/CD is a PR gate. Local tests passing is the prerequisite to PR creation. CI/CD will run automatically after PR is created.
   - Create PR first (see Step 4), then CI/CD will run as a gate on the PR

4. **Create pull request**
   - **After pushing, get the latest commit SHA:**
     - Use `run_terminal_cmd`: `git rev-parse HEAD` to get current commit SHA
     - Or use `mcp_github_list_commits` with `sha` = branch name to get latest commit
   - **Read plan summary from `.plans/{TASK_KEY}-*.plan.md`:**
     - Extract the following sections for PR body:
       - **Story**: User story or description
       - **Context**: Background and motivation (1-2 paragraphs)
       - **Scope**: In Scope and Out of Scope items (bullet list)
       - **Acceptance Criteria**: Numbered list
       - **Implementation Steps**: Summary of key steps (3-5 bullets)
     - Format as markdown in PR body
   - **Check if PR already exists:**
     - Use `mcp_github_pull_request_read` with `method="get"` to check for existing PRs
     - If PR exists, update it instead of creating new one
   - Create completed checklist comment for the issue:
     ```
     ## Completed Checklist

     - [x] Plan reviewed and implemented
     - [x] Code changes completed
     - [x] Unit tests written and passing
     - [x] Documentation updated
     - [x] Linting errors fixed
     - [x] All tests passing locally
     - [x] Changes committed and pushed
     - [x] PR created
     ```
   - Create PR with:
     - Title: `{type}: {description} ({TASK_KEY})` (matching commit message)
     - Body should include:
       - Plan summary (extracted sections from `.plans/{TASK_KEY}-*.plan.md`)
       - Note: "CI/CD checks will run automatically on this PR"
       - Link to the issue
     - Set base branch (typically `main` or `develop`)
     - **Common failure scenarios:**
       - Branch doesn't exist on remote: Ensure branch was pushed successfully
       - PR already exists: Check using `mcp_github_pull_request_read` before creating
       - Permission errors: Verify GitHub MCP authentication
       - Invalid base branch: Verify base branch exists
     - **If PR creation fails, STOP and report the specific error with context.**
   - Link PR to the issue (using issue tracker's linking mechanism)
   - **After PR creation, monitor CI/CD status:**
     - Use `mcp_github_pull_request_read` with `method="get_status"` to check CI/CD status
     - CI/CD will run automatically as a gate on the PR
     - Note status in PR body or comments as needed

5. **Update issue**
   - Add PR link as a comment to the issue
     - Format: `Pull Request: {PR_URL}`
   - **Transition issue to "Code Review" status:**
     - First, get available transitions using `mcp_Atlassian-MCP-Server_getTransitionsForJiraIssue`
     - Find transition to "Code Review" status
     - Transition using `mcp_Atlassian-MCP-Server_transitionJiraIssue`
     - Verify issue status is now "Code Review"
     - **If transition fails (permissions, workflow rules), STOP and report the error.**

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
- `mcp_Atlassian-MCP-Server_transitionJiraIssue` - Transition issue to "Code Review" status
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}, `transition` = {id: "transition-id"}
- `mcp_Atlassian-MCP-Server_addCommentToJiraIssue` - Add completed checklist and PR link comments
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}, `commentBody` = markdown content

### MCP Tools (GitHub)
- `mcp_github_get_me` - Verify GitHub MCP connection
- `mcp_github_list_branches` - List branches (verify current branch exists)
  - Parameters: `owner`, `repo`
- `mcp_github_list_commits` - Get latest commit SHA from branch
  - Parameters: `owner`, `repo`, `sha` = branch name
- `mcp_github_get_commit` - Get commit details
  - Parameters: `owner`, `repo`, `sha` = commit SHA, `include_diff` = false
- `mcp_github_pull_request_read` - Get PR details (check if PR already exists)
  - Parameters: `owner`, `repo`, `pullNumber`, `method` = "get"
- `mcp_github_create_pull_request` - Create new pull request
  - Parameters: `owner`, `repo`, `title`, `head` = `{type}/{TASK_KEY}`, `base` = `main` (or default), `body` = PR description
- `mcp_github_pull_request_read` - Get PR status and CI/CD checks
  - Parameters: `owner`, `repo`, `pullNumber`, `method` = "get_status"

### Filesystem Tools
- `glob_file_search` - Find plan files matching `.plans/{TASK_KEY}-*.plan.md`
  - Pattern: `**/.plans/{TASK_KEY}-*.plan.md`
- `read_file` - Read plan file content for PR body
  - Parameters: `target_file` = `.plans/{TASK_KEY}-{description}.plan.md`
- `read_lints` - Check for linting errors
  - Parameters: `paths` = array of file paths or directories

### Terminal Tools
- `run_terminal_cmd` - Execute git and test commands
  - `git status` - Check current branch and uncommitted changes
  - `git branch --show-current` - Get current branch name
  - `git rev-parse HEAD` - Get current commit SHA
  - `git add .` or `git add <files>` - Stage changes
  - `git commit -m "{type}: {description} ({TASK_KEY})"` - Commit with conventional format
  - `git push origin {type}/{TASK_KEY}` - Push branch to remote
  - `npm test` or `pytest` or project-specific test command - Run tests locally
  - `npm run lint` or project-specific lint command - Check linting

## Completion Checklist
- [ ] MCP status validation performed
- [ ] Current branch verified (matches `{type}/{TASK_KEY}` format)
- [ ] All tests passing locally
- [ ] Plan file found and readable
- [ ] Linting errors fixed
- [ ] Changes staged
- [ ] Commit message follows convention
- [ ] Changes committed
- [ ] Pushed to remote
- [ ] PR created
- [ ] CI/CD checks running (as PR gate)
- [ ] Completed checklist added to issue
- [ ] PR created with plan summary
- [ ] PR linked to issue
- [ ] PR link added to issue comment
- [ ] Issue transitioned to "Code Review"

## Guidance

### Role
Act as a **software engineer** responsible for completing development work on a task and preparing it for code review. You are methodical, thorough, and follow established development workflows and standards.

### Instruction
Execute the complete-task workflow to finalize development work on a specified task. This includes:
1. Performing prerequisite validation checks
2. Preparing and committing changes following conventions
3. Pushing changes and verifying automated checks
4. Creating a pull request with proper documentation
5. Updating the issue tracker with completion status

### Context
- The task is tracked in an issue management system (Jira, Azure DevOps, etc.)
- A plan document exists at `.plans/{TASK_KEY}-*.plan.md` with implementation details
- Development work has been completed on a branch following the `{type}/{TASK_KEY}` format
- MCP integrations provide access to issue trackers and version control
- Automated CI/CD pipelines run checks on pushed branches
- The codebase follows conventional commit standards and branch naming conventions

### Examples

**Example Branch Names:**
- `feat/PROJ-123` (story/feature)
- `fix/FB-6` (bug fix)
- `chore/KAN-42` (maintenance task)
- `refactor/PROJ-321` (refactoring)

**Example Commit Messages:**
- `feat: add user authentication (PROJ-123)`
- `fix: resolve login timeout error (FB-6)`
- `refactor: simplify auth service (PROJ-321)`
- `test: add unit tests for auth module (PROJ-123)`
- `docs: update API documentation (PROJ-123)`

**Example PR Title:**
- `feat: add user authentication (PROJ-123)`

**Example PR Body:**
```markdown
## Summary
Implements user authentication feature as specified in PROJ-123.

## Plan Summary
[Content from .plans/PROJ-123-*.plan.md]

## Verification Status
- ✅ Build: Passing
- ✅ Tests: All passing (95% coverage)
- ✅ Linting: No errors
- ⏳ Security scan: Pending

## Related Issue
Closes PROJ-123
```

**Example Completed Checklist Comment:**
```
## Completed Checklist

- [x] Plan reviewed and implemented
- [x] Code changes completed
- [x] Unit tests written and passing
- [x] Documentation updated
- [x] Linting errors fixed
- [x] All tests passing locally
- [x] Changes committed and pushed
- [x] Automated checks passing

Pull Request: https://github.com/owner/repo/pull/42
```

### Constraints

**Rules (Must Follow):**
1. **Prerequisites Must Pass**: Do not proceed if MCP validation, branch verification, or test verification fails. STOP and report the issue.
2. **Conventional Commits**: All commits must follow the format: `{type}: {description} ({TASK_KEY})`
   - Valid types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
   - Description should be clear and concise
   - Task key must be included in parentheses
3. **Branch Naming**: Current branch must match short format `{type}/{TASK_KEY}` (e.g., `feat/FB-6`, `fix/PROJ-123`)
   - Use short format: `feat/FB-6` (not descriptive format)
   - **Important**: Be consistent - use short format for all branches
4. **Test Requirements**: All tests must pass locally before committing. Do not commit failing tests.
5. **Linting**: All linting errors must be fixed before committing. If errors cannot be fixed automatically, STOP and ask for guidance.
6. **CI/CD as PR Gate**: CI/CD runs automatically after PR creation as a gate. Local tests passing is the prerequisite to PR creation. Monitor CI/CD status after PR is created.
7. **Plan Summary**: PR body must include extracted sections from `.plans/{TASK_KEY}-*.plan.md` (Story, Context, Scope, Acceptance Criteria, Implementation Steps summary). If plan file doesn't exist, note this in PR body.
8. **Plan File Selection**: If multiple files match the pattern `.plans/{TASK_KEY}-*.plan.md`, use the most recently modified file. Report which file was selected.
9. **Error Handling**: If any step fails (push, PR creation, issue transition), STOP and report the specific error. Do not proceed with remaining steps.

**Existing Standards (Reference):**
- MCP status validation: See `mcp-status.md` for detailed MCP server connection checks
- Branch naming: Type prefix format (`{type}/{TASK_KEY}`) as established in `start-task.md`
- Commit message format: `{type}: {description} ({TASK_KEY})` (consistent across commands)
- Plan file location: `.plans/{TASK_KEY}-*.plan.md` (same as `start-task.md`)
- Issue workflow: Tasks transition through "To Do" → "In Progress" → "Code Review" → "Done"

### Output
1. **Committed Changes**: All changes committed with conventional commit format
2. **Pushed Branch**: Branch pushed to remote repository
3. **Verified Status**: Automated checks verified (passing or non-blocking)
4. **Pull Request**: PR created with plan summary, verification status, and issue link
5. **Updated Issue**: Issue updated with completed checklist, PR link, and transitioned to "Code Review" status

All outputs should be verified and any failures should be reported immediately with specific error details.
